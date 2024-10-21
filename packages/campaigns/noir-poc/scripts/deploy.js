const { getZeronautContract } = require('zeronaut-contracts/utils/contract');
const { deploy: deployLevel1 } = require('./level1');
const { deploy: deployLevel2 } = require('./level2');
const { deploy: deployLevel3 } = require('./level3');

let chainId;
let campaignId;
let zeronaut;

async function main() {
  console.log('Deploying noir-poc campaign...');

  chainId = hre.network.config.chainId;
  campaignId = hre.ethers.encodeBytes32String('noir-poc');
  zeronaut = await getZeronautContract(hre, chainId);

  console.log('\nDeploying levels...');
  const levels = [];
  levels.push(await deployLevel1(hre));
  levels.push(await deployLevel2(hre));
  levels.push(await deployLevel3(hre));

  console.log('\nCreating campaign...');
  await createCampaignIfNeeded();

  console.log('\nRegistering levels');
  await registerLevels(levels);
}

async function createCampaignIfNeeded() {
  const campaignData = await zeronaut.getCampaign(campaignId);
  const campaignExists = campaignData.owner !== ethers.ZeroAddress;
  if (!campaignExists) {
    console.log(`Creating campaign "${campaignId}"`);
    await (await zeronaut.createCampaign(campaignId)).wait();
  } else {
    console.log(`(Campaign already exists)`);
  }
}

async function registerLevels(levels) {
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
      console.log(`Setting level "${level.name}" to ${level.target}`);
      tx = await zeronaut.setLevel(campaignId, levelId, level.target);
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
