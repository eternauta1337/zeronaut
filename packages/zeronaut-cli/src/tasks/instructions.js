const {
  getZeronautContract,
  getLevelContract,
} = require('zeronaut-contracts/utils/contract');
const storage = require('../internal/storage');

require('../scopes/play')
  .task('instructions', 'Get the instructions for the current level')
  .setAction(async ({}, hre) => {
    // Identify the network
    const network = await hre.ethers.provider.getNetwork();
    const chainId = network.chainId;

    // Identify the active level
    const data = storage.read();
    const levelName = data.chains[chainId].level;
    if (!levelName) {
      console.log(`Please select a level first`);
      return;
    }

    // Connect to the Zeronaut contract
    const zeronaut = await getZeronautContract(hre, chainId);

    // Retrieve the level address
    const levelId = hre.ethers.encodeBytes32String(levelName);
    const levelData = await zeronaut.getLevel(levelId);
    const levelAddress = levelData.addr;

    // Connect to the level contract
    const level = await getLevelContract(hre, levelAddress);

    // Retrieve the instructions
    const instructions = await level.instructions();
    console.log(instructions);
  });
