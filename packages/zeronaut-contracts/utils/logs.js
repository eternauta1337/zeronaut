const { getZeronautContract } = require('./contract');

async function getCampaignCreatedLogs(hre, chainId) {
  const zeronaut = await getZeronautContract(hre, chainId);
  const filter = zeronaut.filters.CampaignCreated;
  const latestBlock = await hre.ethers.provider.getBlockNumber();
  return await zeronaut.queryFilter(filter, 0, latestBlock);
}

module.exports = {
  getCampaignCreatedLogs,
};
