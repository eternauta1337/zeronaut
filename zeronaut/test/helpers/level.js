async function createLevel(hre, zeronaut, campaignId, levelId) {
  // Deploy the verifier contract
  const Verifier = await hre.ethers.getContractFactory('UltraVerifier');
  const verifier = await Verifier.deploy();

  // Deploy the level contract
  const Level = await hre.ethers.getContractFactory('DummyLevel');
  const level = await Level.deploy(verifier.target);

  // Set the level in the zeronaut contract
  const levelAddress = level.target;
  await zeronaut.setLevel(campaignId, levelId, levelAddress);

  return level;
}

module.exports = {
  createLevel,
};
