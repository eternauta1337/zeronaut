const types = require('ethernaut-common/src/validation/types');
const { getZeronautContract } = require('zeronaut-contracts/utils/contract');
const storage = require('../internal/storage');
const { listLevels } = require('../internal/list-levels');

require('../scopes/play')
  .task('campaign', 'Selects a campaign')
  .addPositionalParam(
    'name',
    'The name of the campaign',
    undefined,
    types.string
  )
  .setAction(async ({ name }, hre) => {
    // Identify the network
    const network = await hre.ethers.provider.getNetwork();
    const networkName = network.name;
    const chainId = network.chainId;
    console.log(
      `Connecting to campaign "${name}" on network ${networkName} (${chainId})`
    );

    // Verify that the campaign exists
    const zeronaut = await getZeronautContract(hre, chainId);
    const campaignId = hre.ethers.encodeBytes32String(name);
    const campaignData = await zeronaut.getCampaign(campaignId);
    if (campaignData.owner === hre.ethers.ZeroAddress) {
      throw new Error(`Campaign "${name}" not found`);
    }

    // Identify the player
    const signers = await hre.ethers.getSigners();
    const playerAddress = signers[0].address;

    // List the levels of the campaign
    await listLevels(hre, chainId, name, playerAddress);

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
    console.log(
      `Locked on campaign "${name}" on network ${networkName} (${chainId})`
    );
  });
