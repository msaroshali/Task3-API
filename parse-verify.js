

import axios from 'axios';
import xml2js from 'xml2js';
import { validateTransform, compareAgainstTestCases } from './validate.js';

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
      console.log("********************Transform Start***************************");
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



async function main() {
  const apps = await getTransformApplications(SEED_URL);
  await fetchTransformsFromApps(apps);
}

main();
