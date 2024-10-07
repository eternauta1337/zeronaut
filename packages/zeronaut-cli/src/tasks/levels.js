const { listLevels } = require('../internal/list-levels');
const storage = require('../internal/storage');

require('../scopes/play')
  .task('levels', 'List all levels on the current campaign')
  .setAction(async ({}, hre) => {
    // Identify the network
    const network = await hre.ethers.provider.getNetwork();
    const chainId = network.chainId;

    // Get the active campaign
    const data = storage.read();
    const campaign = data.chains[chainId].campaign;
    if (!campaign) {
      console.log(`Please select a campaign first`);
      return;
    }

    // Identify the player
    const signers = await hre.ethers.getSigners();
    const playerAddress = signers[0].address;

    // List the levels of the campaign
    await listLevels(hre, chainId, campaign, playerAddress);
  });
