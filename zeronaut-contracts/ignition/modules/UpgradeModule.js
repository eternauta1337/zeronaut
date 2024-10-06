const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');
const proxyModule = require('./ProxyModule');

module.exports = buildModule('UpgradeModule', (m) => {
  const owner = m.getAccount(0);

  const { zeronaut } = m.useModule(proxyModule);

  const implementation = m.contract('Zeronaut', [], {
    id: 'NewImplementation',
  });

  m.call(zeronaut, 'upgradeTo', [implementation], { from: owner });

  return { zeronaut, implementation };
});
