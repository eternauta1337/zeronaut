const { getCampaignCreatedLogs } = require('zeronaut-contracts/utils/logs');
const output = require('ethernaut-common/src/ui/output');

require('../scopes/play')
  .task('list-campaigns', 'List all available campaigns')
  .setAction(async ({}, hre) => {
    try {
      // Identify the network
      const network = await hre.ethers.provider.getNetwork();
      const networkName = network.name;
      const chainId = network.chainId;

      // Get CampaignCreated logs
      const events = await getCampaignCreatedLogs(hre, chainId);

      // If no campaigns found, exit
      if (events.length === 0) {
        console.log(`No campaigns found on ${networkName} (${chainId})`);
        return;
      }

      // For each CampaignCreated log, print the campaign details
      let str = '';
      for (let i = 0; i < events.length; i++) {
        const { id } = events[i].args;
        str += `${i + 1}. "${hre.ethers.decodeBytes32String(id)}"`;
        if (i < events.length - 1) {
          str += '\n';
        }
      }

      return output.resultBox(str, 'Campaigns');
    } catch (err) {
      return output.errorBox(err);
    }
  });
