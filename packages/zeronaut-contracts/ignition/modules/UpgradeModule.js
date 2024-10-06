const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');
const ZeronautModule = require('./ZeronautModule');

module.exports = buildModule('UpgradeModule', (m) => {
  const owner = m.getAccount(0);

  const { zeronaut } = m.useModule(ZeronautModule);

  const implementation = m.contract('Zeronaut', [], {
    id: 'NewImplementation',
  });

  m.call(zeronaut, 'upgradeTo', [implementation], { from: owner });

  return { zeronaut, implementation };
});
