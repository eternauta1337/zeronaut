const hre = require('hardhat');
const { expect } = require('chai');
const { buildProof } = require('zeronaut-contracts/utils/build-proof');

describe.only('Two', function () {
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
    let { proof, publicInputs } = await buildProof(signer, circuit, {
      number: 1337,
      factor_1: 7,
      factor_2: 191,
    });
    const numberHex = ethers.zeroPadValue(ethers.toBeHex(1337), 32);
    publicInputs = [...publicInputs, numberHex];
    console.log('Public inputs:', publicInputs);

    // Submit the proof
    await (await zeronaut.solveLevel(levelId, proof, publicInputs)).wait();

    // Check if the level is solved
    const isSolved = await zeronaut.isLevelSolved(levelId, signer.address);
    expect(isSolved).to.be.true;
  });
});
