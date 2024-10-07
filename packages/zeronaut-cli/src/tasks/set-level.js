const types = require('ethernaut-common/src/validation/types');
const { getZeronautContract } = require('zeronaut-contracts/utils/contract');
const storage = require('../internal/storage');
const output = require('ethernaut-common/src/ui/output');

const task = require('../scopes/play')
  .task('set-level', 'Selects the current level')
  .addPositionalParam('name', 'The name of the level', undefined, types.string)
  .setAction(async ({ name }, hre) => {
    try {
      // Identify the network
      const network = await hre.ethers.provider.getNetwork();
      const chainId = network.chainId;

      // Verify that the level exists
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

      return output.resultBox(`"${name}" is now the active level`);
    } catch (err) {
      return output.errorBox(err);
    }
  });

// Ui extensions
const name = task.positionalParamDefinitions.find((p) => p.name === 'name');
name.prompt = require('../prompts/level');
