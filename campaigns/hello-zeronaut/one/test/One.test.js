const hre = require('hardhat');
const { expect } = require('chai');
const fs = require('fs');
const { buildProof, buildSignature } = require('zeronaut/utils/build-proof');

describe('One', function () {
  let level;
  let verifier;
  let circuit;
  let signer;

  before('get signer', async function () {
    [signer] = await hre.ethers.getSigners();
  });

  before('get circuit', async function () {
    circuit = JSON.parse(
      fs.readFileSync('./circuits/target/circuits.json', 'utf8')
    );
  });

  before('deploy contracts', async function () {
    verifier = await hre.ethers.deployContract('UltraVerifier');
    level = await hre.ethers.deployContract('One', [verifier.target]);
  });

  describe('submitting a valid proof', function () {
    it('should return true', async function () {
      // Prepare the user's signature
      const { signature, pubKeyX, pubKeyY, hashedMsg } = await buildSignature(
        signer
      );

      // Retrieve or build a proof
      const proof = await buildProof(circuit, {
        password: 'zeronaut',
        signature,
        pubKeyX,
        pubKeyY,
        hashedMsg,
      });

      // Construct public inputs
      const publicInputs = [...pubKeyX, ...pubKeyY];

      // Submit the proof to the level contract
      const result = await level.check(proof, publicInputs);

      expect(result).to.be.true;
    });
  });

  // describe('submitting an invalid proof', function () {
  //   it('should revert with an invalid proof', async function () {
  //     const proof = await buildProof(circuit, {
  //       password: 'zeronaut',
  //       signature: await signer.signMessage('Hello, Zeronaut!'),
  //     });
  //     const invalidProof =
  //       proof.slice(0, -1) + (parseInt(proof.slice(-1), 16) ^ 1).toString(16);
  //     await expect(level.check(invalidProof, [])).to.be.revertedWithCustomError(
  //       verifier,
  //       'POINT_NOT_ON_CURVE'
  //     );
  //   });
  // });
});
