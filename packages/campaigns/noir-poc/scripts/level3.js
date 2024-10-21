const { getCircuit } = require('./utils/circuits');
const { buildProof } = require('zeronaut-contracts/utils/build-proof');

async function deploy(hre) {
  console.log('Deploying level 3...');

  // Deploy the level contract
  const Level = await hre.ethers.getContractFactory('Level');
  const level = await Level.deploy();

  // Deploy the level's accessory contract
  const Safuest = await hre.ethers.getContractFactory('Safuest');
  const safuest = await Safuest.deploy();

  // Deploy and set the level's verifier
  const Level3Verifier = await hre.ethers.getContractFactory('Level3Verifier');
  const level3Verifier = await Level3Verifier.deploy();
  await (await level.setVerifier(level3Verifier)).wait();

  // Set the level's instructions
  const instructions = `"Oh no, the password required by ${safuest.target} is protected by a zero knowledge proof. Can you find it?"`;
  await (await level.setInstructions(instructions)).wait();

  // Set the level's circuit
  let circuit = getCircuit('level3');
  await (await level.setCircuit(circuit)).wait();

  // Submit the zk proof
  // Submit a proof to safuest
  const signer = (await hre.ethers.getSigners())[0];
  circuit = JSON.parse(circuit);
  const { proof, publicInputs } = await buildProof(signer, circuit, {
    password: 'no',
  });
  const checks = await safuest.checkProof(proof, publicInputs);
  console.log('Proof checks:', checks);
  await safuest.solve(proof, publicInputs);

  level.name = 'three';

  return level;
}

module.exports = {
  deploy,
};
