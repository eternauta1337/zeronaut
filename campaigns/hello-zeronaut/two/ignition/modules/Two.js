const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

module.exports = buildModule('Two', (m) => {
  const verifier = m.contract('UltraVerifier');
  const two = m.contract('Two', [verifier]);

  return { two };
});
