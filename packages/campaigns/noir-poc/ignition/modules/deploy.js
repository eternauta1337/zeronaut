const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

module.exports = buildModule('DeployModule', (m) => {
  // Deploy levels
  m.useModule(require('./levels'));

  // Register levels
  m.useModule(require('./register'));

  return {};
});
