const { ethers } = require('ethers');

async function buildProof(signer, circuit, inputs) {
  // Build the signature, and inject it into the inputs
  const { signature, pubKeyX, pubKeyY, hashedMsg } = await _buildSignature(
    signer
  );
  inputs.signature = signature;
  inputs.pubKeyX = pubKeyX;
  inputs.pubKeyY = pubKeyY;
  inputs.hashedMsg = hashedMsg;

  // Initialize Noir
  const { Noir } = await import('@noir-lang/noir_js');
  const { BarretenbergBackend } = await import(
    '@noir-lang/backend_barretenberg'
  );
  const noirFrontend = new Noir(circuit);
  const noirBackend = new BarretenbergBackend(circuit);

  // Generate a witness for the circuit
  const { witness } = await noirFrontend.execute(inputs);
  // console.log('Witness:', witness);

  // Generate a proof for the witness
  const proofData = await noirBackend.generateProof(witness);
  // console.log('Proof:', proofData);

  // Verify the proof
  const verification = await noirBackend.verifyProof(proofData);
  if (!verification) {
    throw new Error('Proof verification failed');
  }

  // Construct the public inputs
  const publicInputs = [...pubKeyX, ...pubKeyY];

  // Return the proof and public inputs
  return {
    proof: '0x' + Buffer.from(proofData.proof).toString('hex'),
    publicInputs,
  };
}

async function _buildSignature(signer) {
  // Generate a signature of any message
  const msg = 'This is my proof';
  const signature = await signer.signMessage(msg);

  // Sanity check: compare the recovered address to the signer's address
  // const recoveredAddress = ethers.recoverAddress(digest, signature);
  const recoveredAddress = ethers.verifyMessage(msg, signature);
  if (recoveredAddress !== signer.address) {
    throw new Error('Signature does not match signer');
  }

  // Extract the public key from the signature
  // TODO: This is the problem here; this signature is incompatible with the recoverPublicKey function
  const digest = ethers.hashMessage(msg);
  const pubKeyRaw = ethers.SigningKey.recoverPublicKey(digest, signature);
  const pubKey = pubKeyRaw.slice(4);
  const pubKeyX = '0x' + pubKey.substring(0, 64);
  const pubKeyY = '0x' + pubKey.substring(64);

  // Sanity check: reconstruct the address from the public key and compare it to the signer's address
  const pubKeyCombined = '0x' + pubKeyX.slice(2) + pubKeyY.slice(2);
  const pubKeyHash = ethers.keccak256(pubKeyCombined);
  const computedAddress = ethers.getAddress('0x' + pubKeyHash.slice(26));
  if (computedAddress !== signer.address) {
    throw new Error('Signature does not match signer');
  }

  return {
    signature: _hexToBytes32Array(signature).slice(0, -1), // Remove last byte
    pubKeyX: _hexToBytes32Array(pubKeyX),
    pubKeyY: _hexToBytes32Array(pubKeyY),
    hashedMsg: _hexToBytes32Array(digest),
  };
}

function _hexToBytes32Array(value) {
  // Remove '0x' prefix if present
  const hexString = value.startsWith('0x') ? value.slice(2) : value;

  // Read the hex string byte by byte
  const result = [];
  for (let i = 0; i < hexString.length; i += 2) {
    const chunk = hexString.slice(i, i + 2);
    const paddedChunk = ethers.zeroPadValue('0x' + chunk, 32);
    result.push(paddedChunk);
  }

  return result;
}

module.exports = {
  buildProof,
};
