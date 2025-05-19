const axios = require('axios');
const xml2js = require('xml2js');

const SEED_URL = 'https://zed.txs.maltego.com/proxy/ssl-v1/seed';
const parser = new xml2js.Parser({ explicitArray: false });


// Fetch transform application URLs by parsing SEED URL response
async function fetchFromSeed(url ) {
    try {
        // Fetch all XML from seed URL 
        const response = await axios.get(url);

        // Parse the XML response
        const parsedXML = await parser.parseStringPromise(response.data);

        // Access the transform applications list
        const apps = parsedXML?.MaltegoMessage?.MaltegoTransformDiscoveryMessage?.TransformApplications?.TransformApplication;

        // Is the result empty?
        if (!apps) {
            console.error("❌ No Transform Applications found in seed.");
            return;
        }

        // wrap to array if it’s a single object
        const appList = Array.isArray(apps) ? apps : [apps];

        // Extract the URLs (links) from the transform applications list (apps)
        const links = [];
        appList.forEach(app =>{
        links.push(app.$.URL);
        });

        // Log the transform application URLs
        console.log("✅ Found Transform Applications:");
        appList.forEach(app => {
            console.log(`- ${app.$.name}: ${app.$.URL}`);
        });

        return links;

    } catch (err) {
        console.error("❌ Error fetching or parsing seed URL:", err.message);
    }
}


// Fetch transforms from application URL
async function fetchFromApplicationURL(seedUrl) {

    //array with transform application URLs
    const appUrls = await fetchFromSeed(seedUrl);

    appUrls.forEach( async appUrl => {
        const response = await axios.get(appUrl+"?Command=_TRANSFORMS");
        const parsedXML = await parser.parseStringPromise(response.data);

        // Access the transform applications list
        const apps = parsedXML?.MaltegoMessage?.MaltegoTransformListMessage?.Transforms?.TransformApplication;

    });

    // const response = await axios.get(appUrl[0]);
    // const parsedXML = await parser.parseStringPromise(response.data);
    return appUrls;

}





async function main() {

    console.log(await fetchFromApplicationURL(SEED_URL));
}

main();