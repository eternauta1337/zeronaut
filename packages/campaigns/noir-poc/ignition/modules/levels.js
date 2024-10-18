const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

module.exports = buildModule('LevelsModule', (m) => {
  const levels = [];

  // Deploy all levels
  levels.push(m.useModule(require('./level1')));
  levels.push(m.useModule(require('./level2')));

  return levels;
});
