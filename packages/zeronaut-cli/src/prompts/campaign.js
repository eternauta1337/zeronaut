const { prompt } = require('ethernaut-common/src/ui/prompt');
const { getCampaignCreatedLogs } = require('zeronaut-contracts/utils/logs');

module.exports = async function campaignPrompt({ hre, name }) {
  // Identify the network
  const network = await hre.ethers.provider.getNetwork();
  const chainId = network.chainId;

  // Get CampaignCreated logs
  const events = await getCampaignCreatedLogs(hre, chainId);

  // If no campaigns found, exit
  if (events.length === 0) {
    return name;
  }

  // List the campaigns
  const campaigns = events.map((event) => {
    const { id } = event.args;
    return hre.ethers.decodeBytes32String(id);
  });

  return await prompt({
    type: 'select',
    message: 'Please select a campaign',
    choices: campaigns,
  });
};
