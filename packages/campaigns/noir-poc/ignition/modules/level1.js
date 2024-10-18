const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');
const { getCircuit } = require('./utils/circuits');

module.exports = buildModule('Level1Module', (m) => {
  // Deploy the level contract
  const Level1 = m.contract('Level', [], {
    id: 'Level1',
  });

  // Deploy the level's accessory contract
  const Safu = m.contract('Safu');

  // Deploy and set the level's verifier
  const Level1Verifier = m.contract('Level1Verifier');
  m.call(Level1, 'setVerifier', [Level1Verifier]);

  // Set the level's instructions
  const instructions = `"What is the password required by ${Safu.target}?"`;
  m.call(Level1, 'setInstructions', [instructions]);

  // Set the level's circuit
  const circuit = getCircuit('level1');
  m.call(Level1, 'setCircuit', [circuit]);

  return { name: 'one', contract: Level1 };
});
