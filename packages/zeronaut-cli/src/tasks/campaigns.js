const { getZeronautContract } = require('zeronaut-contracts/utils/contract');

require('../scopes/play')
  .task('campaigns', 'List all campaigns')
  .setAction(async ({}, hre) => {
    const chainId = (await hre.ethers.provider.getNetwork()).chainId;
    console.log('chainId', chainId);
    const zeronaut = await getZeronautContract(hre, chainId);
    console.log('zeronaut', zeronaut);
  });
