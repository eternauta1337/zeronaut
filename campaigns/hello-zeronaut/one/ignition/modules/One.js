const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

module.exports = buildModule('One', (m) => {
  const verifier = m.contract('UltraVerifier');
  const one = m.contract('One', [verifier]);

  return { one };
});
