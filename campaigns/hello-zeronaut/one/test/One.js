const hre = require('hardhat');
const { expect } = require('chai');

describe('One', function () {
  let level, verifier;

  function loadProof() {
    const fs = require('fs');
    const path = require('path');

    const proofPath = path.join(__dirname, '..', 'circuits', 'target', 'proof');

    try {
      const proofData = fs.readFileSync(proofPath);

      // Number of public inputs (including return values)
      const NUM_PUBLIC_INPUTS = 0;
      const PUBLIC_INPUT_BYTES = 32 * NUM_PUBLIC_INPUTS;

      // Extract and format public inputs
      const publicInputs = [];
      for (let i = 0; i < NUM_PUBLIC_INPUTS; i++) {
        const start = i * 32;
        const end = start + 32;
        const input = '0x' + proofData.subarray(start, end).toString('hex');
        publicInputs.push(input);
      }

      // Extract and format proof
      const proof =
        '0x' + proofData.subarray(PUBLIC_INPUT_BYTES).toString('hex');

      return { publicInputs, proof };
    } catch (error) {
      console.error('Error loading proof:', error);
      throw error;
    }
  }

  before('setup', async function () {
    verifier = await hre.ethers.deployContract('UltraVerifier');
    level = await hre.ethers.deployContract('One', [verifier.target]);
  });

  describe('submitting a valid proof', function () {
    it('should return true', async function () {
      const { publicInputs, proof } = loadProof();
      const result = await level.check(proof, publicInputs);
      expect(result).to.be.true;
    });
  });

  describe('submitting an invalid proof', function () {
    it('should revert with an invalid proof', async function () {
      const { publicInputs, proof } = loadProof();
      const invalidProof = proof.slice(0, -1) + '2'; // Change last character to '2'
      await expect(
        level.check(invalidProof, publicInputs)
      ).to.be.revertedWithCustomError(verifier, 'POINT_NOT_ON_CURVE');
    });
  });
});
