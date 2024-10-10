const { getZeronautContract } = require('zeronaut-contracts/utils/contract');
const path = require('path');
const fs = require('fs');

let zeronaut;
const levels = [];
const campaignName = 'noir-poc';
const campaignId = hre.ethers.encodeBytes32String(campaignName);

async function main() {
  console.log('Setting levels on network:', hre.network.name);

  await connect();
  await createCampaignIfNeeded();

  levels.push({
    name: 'codebreaker',
    address: await deployCodeBreaker(),
  });

  await registerLevels();
}

async function deployCodeBreaker() {
  console.log('Deploying Safu');
  const Safu = await hre.ethers.getContractFactory('Safu');
  const safu = await Safu.deploy();

  console.log('Verifying Safu');
  console.log('Network:', hre.network.name);
  if (hre.network.name !== 'localhost') {
    // TODO: Verify on etherscan
  }

  console.log('Deploying level "codebreaker"');
  const CodeBreaker = await hre.ethers.getContractFactory('CodeBreaker');
  const instructions = `"What is the password required by ${safu.target}?"`;
  console.log('Instructions:', instructions);
  const level = await CodeBreaker.deploy(instructions);

  return level.target;
}

async function registerLevels() {
  console.log('Registering levels');

  let tx;

  for (const level of levels) {
    // Check if the level is already registered
    const levelId = hre.ethers.encodeBytes32String(level.name);
    const levelData = await zeronaut.getLevel(levelId);

    // If address differs
    if (levelData.addr === level.address) {
      console.log(
        `Level ${level.name} is already registered at ${levelData.addr}`
      );
      continue;
    } else {
      console.log(`Setting level ${level.name} to ${level.address}`);
      tx = await zeronaut.setLevel(campaignId, levelId, level.address);
      await tx.wait();
    }
  }
}

async function createCampaignIfNeeded() {
  const campaignData = await zeronaut.getCampaign(campaignId);
  if (campaignData.id === campaignId) {
    console.log(`Campaign ${campaignName} already exists`);
  } else {
    console.log(`Creating campaign "${campaignName}"`);
    tx = await zeronaut.createCampaign(campaignId);
    await tx.wait();
  }
}

async function connect() {
  const chainId = (await hre.ethers.provider.getNetwork()).chainId;
  zeronaut = await getZeronautContract(hre, chainId);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
