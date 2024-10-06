const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');
const proxyModule = require('./Proxy.module');

module.exports = buildModule('UpgradeModule', (m) => {
  const owner = m.getAccount(0);

  const { wrappedProxy } = m.useModule(proxyModule);

  const newImplementation = m.contract('Zeronaut', [], {
    id: 'NewImplementation',
  });

  m.call(wrappedProxy, 'upgradeTo', [newImplementation], { from: owner });

  return { wrappedProxy };
});
