const types = require('ethernaut-common/src/validation/types');
const { getZeronautContract } = require('zeronaut-contracts/utils/contract');
const storage = require('../internal/storage');
const output = require('ethernaut-common/src/ui/output');

require('../scopes/play')
  .task('set-campaign', 'Selects the current campaign')
  .addPositionalParam(
    'name',
    'The name of the campaign',
    undefined,
    types.string
  )
  .setAction(async ({ name }, hre) => {
    try {
      // Identify the network
      const network = await hre.ethers.provider.getNetwork();
      const chainId = network.chainId;

      // Verify that the campaign exists
      const zeronaut = await getZeronautContract(hre, chainId);
      const campaignId = hre.ethers.encodeBytes32String(name);
      const campaignData = await zeronaut.getCampaign(campaignId);
      if (campaignData.owner === hre.ethers.ZeroAddress) {
        throw new Error(`Campaign "${name}" not found`);
      }

      // Lock on campaign
      const data = storage.read();
      if (!data.chains) {
        data.chains = {};
      }
      if (!data.chains[chainId]) {
        data.chains[chainId] = {};
      }
      data.chains[chainId].campaign = name;
      storage.write(data);

      return output.resultBox(`"${name}" is now the active campaign`);
    } catch (err) {
      return output.errorBox(err);
    }
  });
