// Test case definitions

// This file contains test cases for the transforms
// from both transform applications i.e Cert Spotter and Live Certs. 

const testCases = [
    
// Test cases for Live Certs transforms
  {
      transformName: "ssl.certToIssuer",
      transformDescription: "Retrieves the the issuer of a certificate",
      expectedInput: "maltego.X509Certificate",
      expectedOutputs: ["maltego.Phrase"],
  },
  {
      transformName: "ssl.certToCountry",
      transformDescription: "Retrieves the country of a certificate",
      expectedInput: "maltego.X509Certificate",
      expectedOutputs: ["maltego.Country"],
  },
  {
      transformName: "ssl.certToValidFrom",
      transformDescription: "Derives the date from which the certificate is valid",
      expectedInput: "maltego.X509Certificate",
      expectedOutputs: ["maltego.DateTime"],
  },
  {
      transformName: "ssl.certToOrganization",
      transformDescription: "Retrieves the organisation of the certificate",
      expectedInput: "maltego.X509Certificate",
      expectedOutputs: ["maltego.Organization"],
  },
  {
      transformName: "ssl.DomainToCert",
      transformDescription: "Fetch the certificate from the given TLS server",
      expectedInput: "maltego.Domain",
      expectedOutputs: ["maltego.X509Certificate"],
      expectedInputRequirements: ["TCP port"] 
  },
  {
      transformName: "ssl.certToDomains",
      transformDescription: "Retrieves all the domains that are identified by the certificate",
      expectedInput: "maltego.X509Certificate",
      expectedOutputs: ["maltego.DNSName"],
  },
  {
      transformName: "ssl.DNSNameToCert",
      transformDescription: "Fetch the certificate from the given TLS server",
      expectedInput: "maltego.DNSName",
      expectedOutputs: ["maltego.X509Certificate"],
      expectedInputRequirements: ["TCP port"] 
  },
  {
      transformName: "ssl.DomainToCerts",
      transformDescription: "Fetch the certificate chain from the given TLS server",
      expectedInput: "maltego.Domain",
      expectedOutputs: ["maltego.X509Certificate"],
      expectedInputRequirements: ["TCP port"] 
  },
  {
      transformName: "ssl.DNSNameToCerts",
      transformDescription: "Fetch the certificate chain from the given TLS server",
      expectedInput: "maltego.DNSName",
      expectedOutputs: ["maltego.X509Certificate"],
      expectedInputRequirements: ["TCP port"] 
  },
  {
      transformName: "ssl.certToValidTo",
      transformDescription: "Derives the date until which the certificate is valid",
      expectedInput: "maltego.X509Certificate",
      expectedOutputs: ["maltego.DateTime"],
  },

  // Test cases for Cert Spotter transforms
  {
      transformName: "certspotter.DomainToCerts",
      transformDescription: "Returns current certificates issued for the given Domain",
      expectedInput: "maltego.Domain",
      expectedOutputs: ["maltego.X509Certificate"],
      expectedInputRequirements: ["Cert Spotter API Key", "Match Wildcards", "Include Subdomains"]
  },
  {
      transformName: "certspotter.DNSNameToCerts",
      transformDescription: "Returns current certificates issued to the given DNSName",
      expectedInput: "maltego.DNSName",
      expectedOutputs: ["maltego.X509Certificate"],
      expectedInputRequirements: ["Certspotter API Key"]
  },
];

module.exports = { testCases };
