const testCases = [
    {
      transformName: "ssl.certToIssuer",
      expectedInput: "maltego.X509Certificate",
      expectedOutputs: ["maltego.Phrase"]
    },
    {
      transformName: "ssl.DomainToCert",
      expectedInput: "maltego.Domain",
      expectedOutputs: ["maltego.X509Certificate"]
    },
    // Add more cases as needed
  ];


const axios = require('axios');
const xml2js = require('xml2js');

const SEED_URL = 'https://zed.txs.maltego.com/proxy/ssl-v1/seed';
const parser = new xml2js.Parser({ explicitArray: false });

// Fetch and parse XML from a given URL
async function fetchXML(url) {
  try {
    const response = await axios.get(url);
    return await parser.parseStringPromise(response.data);
  } catch (err) {
    console.error(`❌ Failed to fetch or parse XML from ${url}:`, err.message);
    return null;
  }
}

// Get all transform application URLs from the seed
async function getTransformApplications(seedUrl) {
  const seedXML = await fetchXML(seedUrl);
  const apps = seedXML.MaltegoMessage.MaltegoTransformDiscoveryMessage.TransformApplications.TransformApplication;
  

  if (!apps) {
    console.error("❌ No Transform Applications found in seed.");
    return [];
  }

  return Array.isArray(apps) ? apps : [apps];
}

// Fetch transforms from each application URL
async function fetchTransformsFromApps(apps) {
  for (const app of apps) {
    const appUrl = app.$.URL;
    const name = app.$.name;
    const fullUrl = `${appUrl}?Command=_TRANSFORMS`;

    const parsedXML = await fetchXML(fullUrl);
    const transforms = parsedXML?.MaltegoMessage?.MaltegoTransformListMessage?.Transforms?.Transform;

    if (!transforms) {
      console.warn(`⚠️ No transforms found for: ${name}`);
      continue;
    }

    const transformList = Array.isArray(transforms) ? transforms : [transforms];

    //console.log(transformList);
    let counter = 1;
    console.log(`\n🔹 Transform Application: ${name}`);
    transformList.forEach(transform => {
      const t = transform.$;
      const outputEntities = transform.OutputEntities?.OutputEntity || [];
      const inputs = transform.UIInputRequirements?.Input || [];

      console.log(`- Transform : ${counter}`);
      console.log(`  Transform Name: ${t.TransformName}`);
      console.log(`  Description: ${t.Description}`);
      console.log(`  Input Entity: ${transform.InputEntity}`);
      console.log(`  Output Entities: ${Array.isArray(outputEntities) ? outputEntities.join(', ') : outputEntities}`);
      console.log(`  Input Requirements: ${Array.isArray(inputs) ? inputs.map(i => i.$.Display).join(', ') : inputs?.$.Display || 'None'}`);
        counter++;
        validateTransform(transform);
compareAgainstTestCases(transform);
    });
  }
}

function validateTransform(transform) {
    const t = transform.$;
    const name = t?.TransformName || '(Unnamed)';
    const inputEntity = transform.InputEntity;
    const outputEntities = transform.OutputEntities?.OutputEntity;
    const inputs = transform.UIInputRequirements?.Input;
  
    let issues = [];
  
    if (!t?.TransformName) issues.push('Missing TransformName');
    if (!inputEntity) issues.push('Missing InputEntity');
    if (!outputEntities) issues.push('Missing OutputEntities');
    if (transform.UIInputRequirements && !inputs) {
        issues.push('Malformed UIInputRequirements');
      }  if (!inputs && transform.UIInputRequirements) issues.push('Missing Input Requirements');

    if (issues.length > 0) {
        console.log("********************Start***************************");
        console.warn(`⚠️ Issues in transform "${name}": ${issues.join(', ')}`);
        console.log("*********************END***************************");

    }
}
function compareAgainstTestCases(transform) {
  const t = transform.$;
  const transformName = t?.TransformName;
  const inputEntity = transform.InputEntity;
  const outputEntities = transform.OutputEntities?.OutputEntity;
  const actualOutputs = Array.isArray(outputEntities) ? outputEntities : outputEntities ? [outputEntities] : [];

  const testCase = testCases.find(tc => tc.transformName === transformName);
  if (!testCase) {
    console.warn(`⚠️ No test case found for transform "${transformName}"`);
    return;
  }

  const inputMatch = inputEntity === testCase.expectedInput;
  const outputsMatch = actualOutputs.length === testCase.expectedOutputs.length &&
    actualOutputs.every(o => testCase.expectedOutputs.includes(o));

  if (!inputMatch || !outputsMatch) {
    console.log(`❌ Mismatch for transform "${transformName}"`);
    if (!inputMatch) {
      console.log(`  - Expected Input: ${testCase.expectedInput}, Actual: ${inputEntity}`);
    }
    if (!outputsMatch) {
      console.log(`  - Expected Outputs: ${testCase.expectedOutputs.join(', ')}`);
      console.log(`  - Actual Outputs: ${actualOutputs.join(', ')}`);
    }
  } else {
    console.log(`✅ Transform "${transformName}" passed entity type validation.`);
  }
}

async function main() {
  const apps = await getTransformApplications(SEED_URL);
  await fetchTransformsFromApps(apps);
}

main();
