const {
  getZeronautContract,
  getLevelContract,
} = require('zeronaut-contracts/utils/contract');
const storage = require('../internal/storage');
const { prompt } = require('ethernaut-common/src/ui/prompt');
const { buildProof } = require('zeronaut-contracts/utils/build-proof');
const output = require('ethernaut-common/src/ui/output');

require('../scopes/play')
  .task('play-level', 'Play the current level')
  .setAction(async ({}, hre) => {
    try {
      // Identify the network
      const network = await hre.ethers.provider.getNetwork();
      const chainId = network.chainId;

      // Identify the active level
      const data = storage.read();
      const levelName = data.chains[chainId].level;
      if (!levelName) {
        throw new Error(`Please select a level first`);
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
      output.infoBox(instructions, 'Instructions');

      // Retrieve the circuit
      const circuitData = await level.circuit();
      const circuit = JSON.parse(circuitData);

      // Build the circuit and collect the parameters
      const { inputs, publicInputs } = await _collectInputs(circuit.abi);

      // Identify the signer
      const signer = (await hre.ethers.getSigners())[0];

      // Build the proof
      console.log('Building proof...');
      const { proof, publicInputs: morePublicInputs } = await buildProof(
        signer,
        circuit,
        inputs
      );
      publicInputs.push(...morePublicInputs);

      // Check the proof
      console.log('Checking proof...');
      await level.check(proof, publicInputs);

      // Submit the proof
      console.log('Submitting proof...');
      const tx = await zeronaut.solveLevel(levelId, proof, publicInputs);
      await tx.wait();

      return output.resultBox('Level solved!');
    } catch (err) {
      return output.errorBox(err);
    }
  });

async function _collectInputs(abi) {
  // console.log(JSON.stringify(abi, null, 2))

  const inputs = {};
  const publicInputs = [];

  for (const param of abi.parameters) {
    // Do not collect signature stuff
    if (
      param.name === 'signature' ||
      param.name === 'pubKeyX' ||
      param.name === 'pubKeyY' ||
      param.name === 'hashedMsg'
    ) {
      continue;
    }

    // Collect value with prompt
    const value = await prompt({
      type: 'input',
      name: param.name,
      message: `Enter the value for ${param.name}`,
    });

    // Parse and store value
    if (param.type.kind === 'integer') {
      inputs[param.name] = hre.ethers.zeroPadValue(
        hre.ethers.toBeHex(value),
        32
      );
    } else {
      inputs[param.name] = value;
    }

    // Identify public inputs
    if (param.visibility !== 'private') {
      publicInputs.push(inputs[param.name]);
    }
  }

  return { inputs, publicInputs };
}
