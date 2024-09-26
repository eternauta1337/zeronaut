const hre = require('hardhat');
const { expect } = require('chai');
const fs = require('fs');
const { buildProof } = require('zeronaut/utils/build-proof');

let noirFrontend, noirBackend;

describe('One', function () {
  let level, verifier;
  let circuit;

  before('load Noir module', async function () {
    circuit = JSON.parse(
      fs.readFileSync('./circuits/export/main.json', 'utf8')
    );
  });

  before('setup', async function () {
    verifier = await hre.ethers.deployContract('UltraVerifier');
    level = await hre.ethers.deployContract('One', [verifier.target]);
  });

  describe('submitting a valid proof', function () {
    it('should return true', async function () {
      // Retrieve or build a proof
      const proof = await buildProof(circuit, {
        password: 'zeronaut',
      });

      // Submit the proof to the level contract
      const result = await level.check(proof, []);

      expect(result).to.be.true;
    });
  });

  describe('submitting an invalid proof', function () {
    it('should revert with an invalid proof', async function () {
      const proof = await buildProof(circuit, {
        password: 'zeronaut',
      });
      const invalidProof =
        proof.slice(0, -1) + (parseInt(proof.slice(-1), 16) ^ 1).toString(16);
      await expect(level.check(invalidProof, [])).to.be.revertedWithCustomError(
        verifier,
        'POINT_NOT_ON_CURVE'
      );
    });
  });
});
