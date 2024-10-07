const fs = require('fs');
const path = require('path');

function getZeronautContract(hre, networkId) {
  const address = getZeronautAddress(networkId);
  const abi = getZeronautABI();
  return hre.ethers.getContractAt(abi, address);
}

function getLevelContract(hre, address) {
  const abi = getLevelABI();
  return hre.ethers.getContractAt(abi, address);
}

function getLevelABI() {
  const packagePath = getPackagePath();
  const abiPath = path.join(
    packagePath,
    'artifacts',
    'contracts',
    'interfaces',
    'ILevel.sol',
    'ILevel.json'
  );
  return JSON.parse(fs.readFileSync(abiPath, 'utf8')).abi;
}

function getZeronautABI() {
  const packagePath = getPackagePath();
  const abiPath = path.join(
    packagePath,
    'artifacts',
    'contracts',
    'Zeronaut.sol',
    'Zeronaut.json'
  );
  return JSON.parse(fs.readFileSync(abiPath, 'utf8')).abi;
}

function getPackagePath() {
  const rootPath = path.join(__dirname, '..', '..', '..');
  return path.join(rootPath, 'packages', 'zeronaut-contracts');
}

function getZeronautAddress(networkId) {
  try {
    const packagePath = getPackagePath();
    const deploymentPath = path.join(
      packagePath,
      'ignition',
      'deployments',
      `chain-${networkId}`,
      'deployed_addresses.json'
    );

    if (!fs.existsSync(deploymentPath)) {
      console.error(`Deployment file not found for chain-${networkId}`);
      return null;
    }

    const deployedAddresses = JSON.parse(
      fs.readFileSync(deploymentPath, 'utf8')
    );

    const contractName = 'ZeronautModule#Zeronaut';
    if (deployedAddresses[contractName]) {
      return deployedAddresses[contractName];
    } else {
      console.error(
        `Contract ${contractName} not found in deployed addresses for network ${networkId}`
      );
      return null;
    }
  } catch (error) {
    console.error(`Error retrieving contract address: ${error.message}`);
    return null;
  }
}

module.exports = {
  getZeronautAddress,
  getZeronautContract,
  getLevelContract,
};
