const { getCircuit } = require('./utils/circuits');

async function deploy(hre) {
  console.log('Deploying level 1...');

  // Deploy the level contract
  const Level = await hre.ethers.getContractFactory('Level');
  const level = await Level.deploy();

  // Deploy the level's accessory contract
  const Safu = await hre.ethers.getContractFactory('Safu');
  const safu = await Safu.deploy();

  // Deploy and set the level's verifier
  const Level1Verifier = await hre.ethers.getContractFactory('Level1Verifier');
  const level1Verifier = await Level1Verifier.deploy();
  await (await level.setVerifier(level1Verifier)).wait();

  // Set the level's instructions
  const instructions = `"What is the password required by ${safu.target}?"`;
  await (await level.setInstructions(instructions)).wait();

  // Set the level's circuit
  const circuit = getCircuit('level1');
  await (await level.setCircuit(circuit)).wait();

  level.name = 'one';

  return level;
}

module.exports = {
  deploy,
};
