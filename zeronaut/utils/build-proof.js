const { ethers } = require('ethers');

async function buildProof(circuit, inputs) {
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
  // console.log('Verification:', verification)

  return '0x' + Buffer.from(proofData.proof).toString('hex');
}

async function buildSignature(signer) {
  const msg = 'This is my proof';
  // Remove last byte for raw ECDSA secp256k1 sig
  const signature = (await signer.signMessage(msg)).slice(0, -2);
  const hashedMsg = ethers.id(msg);
  const pubKeyRaw = ethers.SigningKey.recoverPublicKey(hashedMsg, signature);
  const pubKey = pubKeyRaw.slice(4);
  const pubKeyX = '0x' + pubKey.substring(0, 64);
  const pubKeyY = '0x' + pubKey.substring(64);

  return {
    signature: _hexToBytes32Array(signature),
    pubKeyX: _hexToBytes32Array(pubKeyX),
    pubKeyY: _hexToBytes32Array(pubKeyY),
    hashedMsg: _hexToBytes32Array(hashedMsg),
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
  buildSignature,
};
