const { getZeronautContract } = require('zeronaut-contracts/utils/contract');
const path = require('path');
const fs = require('fs');

async function main() {
  let tx;

  console.log('Setting levels on network:', hre.network.name);

  // Connect to the Zeronaut contract
  const chainId = (await hre.ethers.provider.getNetwork()).chainId;
  const zeronaut = await getZeronautContract(hre, chainId);

  // Check if the campaign has already been created
  const campaignName = 'noir-poc';
  const campaignId = hre.ethers.encodeBytes32String(campaignName);
  const campaignData = await zeronaut.getCampaign(campaignId);
  if (campaignData.id === campaignId) {
    console.log(`Campaign ${campaignName} already exists`);
  } else {
    console.log(`Creating campaign "${campaignName}"`);
    tx = await zeronaut.createCampaign(campaignId);
    await tx.wait();
  }

  // Identify all levels
  const levelsData = require('../levels.json');

  // Load ignition addresses
  const ignitionAddresses = require(`../ignition/deployments/chain-${chainId}/deployed_addresses.json`);

  // Register all levels
  for (const level of levelsData) {
    // Identify the level name and address
    const levelAddress = ignitionAddresses[`DeployModule#${level.contract}`];

    // Check if the level is already registered
    const levelId = hre.ethers.encodeBytes32String(level.name);
    const levelData = await zeronaut.getLevel(levelId);

    // If address differs
    if (levelData.addr === levelAddress) {
      console.log(
        `Level ${level.name} is already registered at ${levelData.addr}`
      );
      continue;
    } else {
      console.log(`Setting level ${level.name} to ${levelAddress}`);
      tx = await zeronaut.setLevel(campaignId, levelId, levelAddress);
      await tx.wait();
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
