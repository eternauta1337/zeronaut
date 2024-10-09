const hre = require('hardhat');
const { expect } = require('chai');
const { buildProof } = require('zeronaut-contracts/utils/build-proof');

describe('Two', function () {
  let zeronaut, level;
  let circuit;
  let signer;
  let campaignId = ethers.encodeBytes32String('hello');
  let levelId = ethers.encodeBytes32String('two');

  before('bootstrap', async function () {
    // Id signers
    [signer] = await hre.ethers.getSigners();
    // Deploy contracts
    zeronaut = await hre.ethers.deployContract('Zeronaut', []);
    level = await hre.ethers.deployContract('Two');
    // Create campaign and set level
    await (await zeronaut.createCampaign(campaignId)).wait();
    await (await zeronaut.setLevel(campaignId, levelId, level.target)).wait();
    // Retrieve the level's circuit
    circuit = JSON.parse(await level.circuit());
  });

  it('solves the level', async function () {
    // Build the proof
    const { proof, publicInputs } = await buildProof(signer, circuit, {
      factor_1: ethers.zeroPadValue(ethers.toBeHex(7), 32),
      factor_2: ethers.zeroPadValue(ethers.toBeHex(191), 32),
    });

    // Submit the proof
    await (await zeronaut.solveLevel(levelId, proof, publicInputs)).wait();

    // Check if the level is solved
    const isSolved = await zeronaut.isLevelSolved(levelId, signer.address);
    expect(isSolved).to.be.true;
  });
});
