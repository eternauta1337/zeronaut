const { getZeronautAddress } = require('zeronaut-contracts/utils/get-address');
const path = require('path');
const fs = require('fs');

async function main() {
  let tx;

  console.log('Setting levels on network:', hre.network.name);

  // TODO: Rename to "register"?
  // TODO: Check if the campaign has already been created

  // Connect to the Zeronaut contract
  const chainId = (await hre.ethers.provider.getNetwork()).chainId;
  const zeronaut = await hre.ethers.getContractAt(
    'Zeronaut',
    getZeronautAddress(chainId)
  );

  // Check if the campaign has already been created
  const campaignName = 'hello-zeronaut';
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
  const contractsDir = path.join(__dirname, '..', 'contracts');
  const folders = fs
    .readdirSync(contractsDir)
    .filter((file) => fs.statSync(path.join(contractsDir, file)).isDirectory());

  // Load ignition addresses
  const ignitionAddresses = require(`../ignition/deployments/chain-${chainId}/deployed_addresses.json`);

  // Register all levels
  for (const folder of folders) {
    // Identify the level name and address
    const levelName = folder.charAt(0).toUpperCase() + folder.slice(1);
    const levelAddress = ignitionAddresses[`HelloModule#${levelName}`];

    // Check if the level is already registered
    const levelId = hre.ethers.encodeBytes32String(levelName);
    const levelData = await zeronaut.getLevel(levelId);

    // If address differs
    if (levelData.addr === levelAddress) {
      console.log(
        `Level ${levelName} is already registered at ${levelData.addr}`
      );
      continue;
    } else {
      console.log(`Setting level ${levelName} to ${levelAddress}`);
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
