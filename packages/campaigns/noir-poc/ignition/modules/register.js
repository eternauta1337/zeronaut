const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');
const { getZeronautContract } = require('./utils/zeronaut');

const LevelsModule = require('./levels');

module.exports = buildModule('RegisterModule', (m) => {
  console.log('Building RegisterModule');

  const campaignId = hre.ethers.encodeBytes32String('noir-poc');

  // Create campaign if needed
  // TODO: This doesnt work because the conditional doesnt make sense with futures
  const Zeronaut = getZeronautContract(hre, m);
  // const campaignData = m.staticCall(Zeronaut, 'getCampaign', [campaignId]);
  // if (campaignData.owner == ethers.ZeroAddress) {
  // m.call(Zeronaut, 'createCampaign', [campaignId]);
  // }

  // Register levels
  const levels = m.useModule(LevelsModule);
  console.log('levels', levels);
  for (const level of levels) {
    console.log('level', level);
    const levelId = hre.ethers.encodeBytes32String(level.name);
    m.call(Zeronaut, 'setLevel', [campaignId, levelId, level.contract], {
      id: `register_level_${level.name}`,
    });
  }

  return {};
});
