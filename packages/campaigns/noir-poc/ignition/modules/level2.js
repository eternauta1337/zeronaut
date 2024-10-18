const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');
const { getCircuit } = require('./utils/circuits');

module.exports = buildModule('Level2Module', (m) => {
  // Deploy the level contract
  const Level2 = m.contract('Level', [], {
    id: 'Level2',
  });

  // Deploy the level's accessory contract
  const Safuer = m.contract('Safuer');

  // Deploy and set the level's verifier
  const Level2Verifier = m.contract('Level2Verifier');
  m.call(Level2, 'setVerifier', [Level2Verifier]);

  // Set the level's instructions
  const instructions = `"What is the password required by ${Safuer.target}?"`;
  m.call(Level2, 'setInstructions', [instructions]);

  // Conceal the password in a transaction
  m.call(Safuer, 'solve', ['zeronaut'], { id: 'level2_solve_1' });
  m.call(Safuer, 'solve', ['zerpnaut'], { id: 'level2_solve_2' });
  m.call(Safuer, 'solve', ['zer0naut'], { id: 'level2_solve_3' });
  m.call(Safuer, 'solve', ['zerznaut'], { id: 'level2_solve_4' });

  // Set the level's circuit
  const circuit = getCircuit('level2');
  m.call(Level2, 'setCircuit', [circuit]);

  return { name: 'two', contract: Level2 };
});
