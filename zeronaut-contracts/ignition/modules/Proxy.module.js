const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

module.exports = buildModule('ProxyModule', (m) => {
  const owner = m.getAccount(0);

  const implementation = m.contract('Zeronaut', [], {
    id: 'FirstImplementation',
  });

  const proxy = m.contract('UUPSProxy', [implementation, owner]);

  const wrappedProxy = m.contractAt('Zeronaut', proxy, {
    id: 'WrappedProxy',
  });

  return { wrappedProxy };
});
