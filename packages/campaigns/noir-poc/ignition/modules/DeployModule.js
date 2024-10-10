const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');
const levelData = require('../levels.json');

module.exports = buildModule('DeployModule', (m) => {
  const levels = {};

  for (const level of levelData) {
    levels[level.name] = m.contract(level.contract);
  }

  return { levels };
});
