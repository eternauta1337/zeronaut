const fs = require('fs');
const path = require('path');

async function registerLevel({ levelName, circuitName, verifierName }) {
  let signer;

  // Define campaign and level ids
  let campaignId = ethers.encodeBytes32String('hello');
  let levelId = ethers.encodeBytes32String(levelName);

  // Id signers
  [signer] = await hre.ethers.getSigners();

  // Retrieve the circuit
  const circuit = loadCircuit(circuitName);

  // Deploy contracts
  const zeronaut = await hre.ethers.deployContract('Zeronaut', []);
  const level = await hre.ethers.deployContract('Level', []);
  const verifier = await hre.ethers.deployContract(
    `contracts/${verifierName}.sol:UltraVerifier`,
    []
  );
  await (await level.setVerifier(verifier.target)).wait();
  await (await level.setCircuit(JSON.stringify(circuit))).wait();

  // Create campaign and set level
  await (await zeronaut.createCampaign(campaignId)).wait();
  await (await zeronaut.setLevel(campaignId, levelId, level.target)).wait();

  return {
    zeronaut,
    level,
    signer,
    circuit,
    campaignId,
    levelId,
  };
}

function loadCircuit(circuitName) {
  const circuitPath = path.join(
    __dirname,
    '..',
    '..',
    'circuits',
    circuitName,
    'target',
    'circuits.json'
  );
  // console.log('Loading circuit from', circuitPath);

  const data = fs.readFileSync(circuitPath, 'utf8');
  // console.log('data', data);

  return JSON.parse(data);
}

module.exports = {
  registerLevel,
};
