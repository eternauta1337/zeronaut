async function deployZeronaut(hre) {
  const signers = await hre.ethers.getSigners();
  const owner = signers[0];

  const Zeronaut = await hre.ethers.getContractFactory('Zeronaut');
  const implementation = await Zeronaut.deploy();

  const UUPSProxy = await hre.ethers.getContractFactory('UUPSProxy');
  const proxy = await UUPSProxy.deploy(implementation.target, owner.address);

  return await hre.ethers.getContractAt('Zeronaut', proxy.target);
}

module.exports = {
  deployZeronaut,
};
