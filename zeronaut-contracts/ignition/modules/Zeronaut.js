const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

module.exports = buildModule('Zeronaut', (m) => {
  const zeronaut = m.contract('Zeronaut');

  return { zeronaut };
});
