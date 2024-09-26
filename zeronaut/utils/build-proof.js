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

module.exports = {
  buildProof,
};
