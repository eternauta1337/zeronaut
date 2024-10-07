const storage = require('../internal/storage');
const { getZeronautContract } = require('zeronaut-contracts/utils/contract');

require('../scopes/play')
  .task('list-levels', 'List all levels of the current campaign')
  .setAction(async ({}, hre) => {
    // Identify the network
    const network = await hre.ethers.provider.getNetwork();
    const chainId = network.chainId;

    // Get the active campaign
    const data = storage.read();
    const campaignName = data.chains[chainId].campaign;
    if (!campaignName) {
      console.log(`Please select a campaign first`);
      return;
    }
    console.log(`Active campaign: "${campaignName}"`);

    // Identify the player
    const signers = await hre.ethers.getSigners();
    const playerAddress = signers[0].address;

    // Retrieve the campaign data
    const zeronaut = await getZeronautContract(hre, chainId);
    const campaignId = hre.ethers.encodeBytes32String(campaignName);
    const campaignData = await zeronaut.getCampaign(campaignId);

    // List the levels of the campaign
    console.log('Levels:');
    for (let i = 0; i < campaignData.levels.length; i++) {
      const levelId = campaignData.levels[i];
      const levelName = hre.ethers.decodeBytes32String(levelId);
      const solved = await zeronaut.isLevelSolved(levelId, playerAddress);
      console.log(
        `${i + 1}. ${levelName} ${solved ? '(solved)' : '(not solved)'}`
      );
    }
  });
