async function deployZeronaut(hre) {
  const signers = await hre.ethers.getSigners();
  const owner = signers[0];

  const Zeronaut = await hre.ethers.getContractFactory('Zeronaut');
  const implementation = await Zeronaut.deploy();

  const UUPSProxyOwned = await hre.ethers.getContractFactory('UUPSProxyOwned');
  const proxy = await UUPSProxyOwned.deploy(
    implementation.target,
    owner.address
  );

  return await hre.ethers.getContractAt('Zeronaut', proxy.target);
}

module.exports = {
  deployZeronaut,
};
