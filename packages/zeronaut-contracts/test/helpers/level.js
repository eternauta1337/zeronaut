const fs = require('fs');
const path = require('path');

async function createLevel(hre, zeronaut, campaignId, levelId) {
  // Deploy the verifier contract
  const Verifier = await hre.ethers.getContractFactory('UltraVerifier');
  const verifier = await Verifier.deploy();

  // Deploy and configure the level contract
  const Level = await hre.ethers.getContractFactory('Level');
  const level = await Level.deploy();
  await (await level.setInstructions('Dummy level instructions')).wait();
  await (await level.setVerifier(verifier.target)).wait();
  await (await level.setCircuit(loadCircuit())).wait();

  // Set the level in the zeronaut contract
  await zeronaut.setLevel(campaignId, levelId, level.target);

  return level;
}

function loadCircuit() {
  const circuitPath = path.join(
    __dirname,
    '..',
    'fixture-projects',
    'basic-level',
    'circuits',
    'target',
    'circuits.json'
  );

  return fs.readFileSync(circuitPath, 'utf8');
}

module.exports = {
  createLevel,
};
