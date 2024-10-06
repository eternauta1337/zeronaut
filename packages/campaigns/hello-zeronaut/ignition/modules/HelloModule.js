const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');
const fs = require('fs');
const path = require('path');

// Disabled, see below
// const ZeronautModule = require('zeronaut-contracts/ignition/modules/ZeronautModule');
// const { getZeronautAddress } = require('zeronaut-contracts/utils/get-address');

module.exports = buildModule('HelloModule', (m) => {
  // Identify all levels
  const contractsDir = path.join(__dirname, '..', '..', 'contracts');
  const folders = fs
    .readdirSync(contractsDir)
    .filter((file) => fs.statSync(path.join(contractsDir, file)).isDirectory());

  // Deploy all levels
  const levels = {};
  for (const folder of folders) {
    const levelName = folder.charAt(0).toUpperCase() + folder.slice(1);
    const contract = m.contract(levelName);
    levels[folder] = contract;
  }

  // Register all levels
  // Having trouble because m.useModule(ZeronautModule) doesnt work,
  // and can't get the chain id to use getZeronautAddress
  // TODO

  return { levels };
});
