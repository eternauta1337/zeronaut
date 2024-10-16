const { expect } = require('chai');
const { buildProof } = require('zeronaut-contracts/utils/build-proof');
const { registerLevel } = require('./helpers/register-level');

describe('Two', function () {
  let zeronaut;
  let circuit;
  let signer;
  let campaignId, levelId;

  before('bootstrap', async function () {
    ({ zeronaut, signer, circuit, levelId } = await registerLevel({
      levelName: 'two',
      circuitName: 'two',
      verifierName: 'TwoVerifier',
    }));
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
