// Contains code for verifying transforms 
// and validating them with test cases
import { testCases } from './test-config.js';

export function validateTransform(transform) {
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
        console.log("**************Issue Start*********************");
        console.warn(`⚠️ Issues in transform "${name}": ${issues.join(', ')}`);
        console.log("**************Issue End***********************");

    }
}
export function compareAgainstTestCases(transform) {
  const t = transform.$;
  const transformName = t.TransformName;
  const transformDescription = t.Description;
  const inputEntity = transform.InputEntity;
  const outputEntities = transform.OutputEntities?.OutputEntity;
  const actualOutputs = Array.isArray(outputEntities) ? outputEntities : outputEntities ? [outputEntities] : [];

  console.log("************Test Result************");

  const testCase = testCases.find(tc => tc.transformName === transformName);
  if (!testCase) {
    console.warn(`⚠️ No test case found for transform "${transformName}"`);
    return;
  }

  const descriptionMatch = transformDescription === testCase.transformDescription;
  const inputMatch = inputEntity === testCase.expectedInput;
  const outputsMatch = actualOutputs.length === testCase.expectedOutputs.length &&
    actualOutputs.every(o => testCase.expectedOutputs.includes(o));
    if (!descriptionMatch) {
      console.warn(`⚠️ Description mismatch for transform "${transformName}": Expected "${testCase.transformDescription}", Actual "${transformDescription}"`);
    }

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
  console.log("************Test Result************");

}