const hre = require('hardhat');
const { expect } = require('chai');
const fs = require('fs');

let noirFrontend, noirBackend;

describe('One', function () {
  let level, verifier;

  before('load Noir module', async function () {
    const { Noir } = await import('@noir-lang/noir_js');
    const { BarretenbergBackend } = await import(
      '@noir-lang/backend_barretenberg'
    );

    const circuit = JSON.parse(
      fs.readFileSync('./circuits/export/main.json', 'utf8')
    );
    noirFrontend = new Noir(circuit);
    noirBackend = new BarretenbergBackend(circuit);
  });

  before('setup', async function () {
    verifier = await hre.ethers.deployContract('UltraVerifier');
    level = await hre.ethers.deployContract('One', [verifier.target]);
  });

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

  async function generateProof(password) {
    // Generate a witness for the circuit
    const { witness } = await noirFrontend.execute({ password });
    // console.log('Witness:', witness);

    // Generate a proof for the witness
    const proofData = await noirBackend.generateProof(witness);
    // console.log('Proof:', proofData);

    // Verify the proof
    const verification = await noirBackend.verifyProof(proofData);
    if (!verification) {
      throw new Error('Proof verification failed');
    }
    // console.log('Verification:', verification);

    return {
      proof: '0x' + Buffer.from(proofData.proof).toString('hex'),
      publicInputs: [],
    };
  }

  describe('submitting a valid proof', function () {
    it('should return true', async function () {
      // Retrieve or build a proof
      // const { proof, publicInputs } = loadProof();
      const { proof, publicInputs } = await generateProof('zeronaut');
      // console.log('proof:', proof);

      // Submit the proof to the level contract
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
