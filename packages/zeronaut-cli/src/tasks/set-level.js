const types = require('ethernaut-common/src/validation/types');
const { getZeronautContract } = require('zeronaut-contracts/utils/contract');
const storage = require('../internal/storage');

require('../scopes/play')
  .task('set-level', 'Selects the current level')
  .addPositionalParam('name', 'The name of the level', undefined, types.string)
  .setAction(async ({ name }, hre) => {
    // Identify the network
    const network = await hre.ethers.provider.getNetwork();
    const networkName = network.name;
    const chainId = network.chainId;
    console.log(
      `Connecting to level "${name}" on network ${networkName} (${chainId})`
    );

    // Verify that the campaign exists
    const zeronaut = await getZeronautContract(hre, chainId);
    const levelId = hre.ethers.encodeBytes32String(name);
    const levelData = await zeronaut.getLevel(levelId);
    if (levelData.addr === hre.ethers.ZeroAddress) {
      throw new Error(`Level "${name}" not found`);
    }

    // Lock on level
    const data = storage.read();
    if (!data.chains) {
      data.chains = {};
    }
    if (!data.chains[chainId]) {
      data.chains[chainId] = {};
    }
    data.chains[chainId].level = name;
    storage.write(data);
    console.log(
      `Locked on level "${name}" on network ${networkName} (${chainId})`
    );
  });
