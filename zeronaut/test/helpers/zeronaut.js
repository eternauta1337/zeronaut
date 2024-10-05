async function deployZeronaut(hre) {
  const factory = await hre.ethers.getContractFactory('Zeronaut');
  return await factory.deploy();
}

module.exports = {
  deployZeronaut,
};
