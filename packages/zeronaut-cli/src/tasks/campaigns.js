const { getCampaignCreatedLogs } = require('zeronaut-contracts/utils/logs');

require('../scopes/play')
  .task('campaigns', 'List all campaigns')
  .setAction(async ({}, hre) => {
    // Identify the network
    const network = await hre.ethers.provider.getNetwork();
    const networkName = network.name;
    const chainId = network.chainId;
    console.log(`Listing campaigns on network ${networkName} (${chainId})`);

    // Get CampaignCreated logs
    const events = await getCampaignCreatedLogs(hre, chainId);

    // If no campaigns found, exit
    if (events.length === 0) {
      console.log(`No campaigns found on ${networkName} (${chainId})`);
      return;
    }

    // For each CampaignCreated log, fetch the campaign details
    for (let i = 0; i < events.length; i++) {
      const { id } = events[i].args;
      console.log(`${i + 1}. "${hre.ethers.decodeBytes32String(id)}"`);
    }
  });
