const { getCircuit } = require('./utils/circuits');

async function deploy(hre) {
  console.log('Deploying level 2...');

  // Deploy the level contract
  const Level = await hre.ethers.getContractFactory('Level');
  const level = await Level.deploy();

  // Deploy the level's accessory contract
  const Safuer = await hre.ethers.getContractFactory('Safuer');
  const safuer = await Safuer.deploy();

  // Deploy and set the level's verifier
  const Level2Verifier = await hre.ethers.getContractFactory('Level2Verifier');
  const level2Verifier = await Level2Verifier.deploy();
  await (await level.setVerifier(level2Verifier)).wait();

  // Set the level's instructions
  const instructions = `"What is the password required by ${safuer.target}?"`;
  await (await level.setInstructions(instructions)).wait();

  // Set the level's circuit
  const circuit = getCircuit('level2');
  await (await level.setCircuit(circuit)).wait();

  // Reveal the password in txs to the level's accessory contract
  await (await safuer.solve('password')).wait();
  await (await safuer.solve('admin')).wait();
  await (await safuer.solve('zeronaut')).wait();
  await (await safuer.solve('zer0naut')).wait();

  level.name = 'two';

  return level;
}

module.exports = {
  deploy,
};
