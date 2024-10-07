const { prompt } = require('ethernaut-common/src/ui/prompt');
const storage = require('../internal/storage');
const { getZeronautContract } = require('zeronaut-contracts/utils/contract');

module.exports = async function levelPrompt({ hre, name }) {
  // Identify the network
  const network = await hre.ethers.provider.getNetwork();
  const chainId = network.chainId;

  // Identify the active campaign
  const data = storage.read();
  const campaignName = data.chains[chainId].campaign;
  if (!campaignName) {
    return name;
  }

  // Retrieve the campaign data
  const zeronaut = await getZeronautContract(hre, chainId);
  const campaignId = hre.ethers.encodeBytes32String(campaignName);
  const campaignData = await zeronaut.getCampaign(campaignId);

  // List the levels of the campaign
  const levels = campaignData.levels.map((levelId) =>
    hre.ethers.decodeBytes32String(levelId)
  );

  return await prompt({
    type: 'select',
    message: 'Please select a level',
    choices: levels,
  });
};
