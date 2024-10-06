const fs = require('fs');
const path = require('path');

function getZeronautAddress(networkId) {
  try {
    const rootPath = path.join(__dirname, '..', '..', '..');
    const deploymentPath = path.join(
      rootPath,
      'packages',
      'zeronaut-contracts',
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
};
