const { getZeronautContract } = require('zeronaut-contracts/utils/contract');

async function listLevels(hre, chainId, campaignName, playerAddress) {
  const zeronaut = await getZeronautContract(hre, chainId);
  const campaignId = hre.ethers.encodeBytes32String(campaignName);
  const campaignData = await zeronaut.getCampaign(campaignId);

  console.log('Levels:');
  for (let i = 0; i < campaignData.levels.length; i++) {
    const levelId = campaignData.levels[i];
    const levelName = hre.ethers.decodeBytes32String(levelId);
    const solved = await zeronaut.isLevelSolved(levelId, playerAddress);
    console.log(
      `${i + 1}. ${levelName} ${solved ? '(solved)' : '(not solved)'}`
    );
  }
}

module.exports = {
  listLevels,
};
