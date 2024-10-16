const { expect } = require('chai');
const { buildProof } = require('zeronaut-contracts/utils/build-proof');
const { registerLevel } = require('./helpers/register-level');

describe('One', function () {
  let zeronaut;
  let circuit;
  let signer;
  let levelId;

  before('bootstrap', async function () {
    ({ zeronaut, signer, circuit, levelId } = await registerLevel({
      levelName: 'one',
      circuitName: 'one',
      verifierName: 'OneVerifier',
    }));
  });

  it('solves the level', async function () {
    // Build the proof
    const { proof, publicInputs } = await buildProof(signer, circuit, {
      password: 'zeronaut',
    });

    // Submit the proof
    await (await zeronaut.solveLevel(levelId, proof, publicInputs)).wait();

    // Check if the level is solved
    const isSolved = await zeronaut.isLevelSolved(levelId, signer.address);
    expect(isSolved).to.be.true;
  });
});
