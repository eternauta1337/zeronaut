const fs = require('fs');
const path = require('path');

function getZeronautContract(hre, m) {
  const chainId = hre.network.config.chainId;
  const zeronautAddress = getZeronautAddress(chainId);
  const zeronautArtifact = getZeronautArtifact(chainId);
  return m.contractAt('Zeronaut', zeronautArtifact, zeronautAddress);
}

function getZeronautAddress(chainId) {
  const addressesFilePath = path.join(
    getDeploymentPath(chainId),
    'deployed_addresses.json'
  );

  const addresses = JSON.parse(fs.readFileSync(addressesFilePath, 'utf8'));

  return addresses['ZeronautModule#Zeronaut'];
}

function getZeronautArtifact(chainId) {
  const artifactPath = path.join(
    getDeploymentPath(chainId),
    `artifacts/ZeronautModule#Zeronaut.json`
  );

  return JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
}

function getDeploymentPath(chainId) {
  return path.join(getZeronautPath(), `ignition/deployments/chain-${chainId}`);
}

function getZeronautPath() {
  return path.join(__dirname, '../../../../../zeronaut-contracts/');
}

module.exports = {
  getZeronautContract,
};
