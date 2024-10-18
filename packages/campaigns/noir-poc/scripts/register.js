const { getZeronautContract } = require('zeronaut-contracts/utils/contract');
const { buildProof } = require('zeronaut-contracts/utils/build-proof');

let zeronaut;
let chainId;
const campaignName = 'noir-poc';
const campaignId = hre.ethers.encodeBytes32String(campaignName);

async function main() {
  console.log('Registering levels on network:', hre.network.name);
  chainId = (await hre.ethers.provider.getNetwork()).chainId;
  await connect();
  await createCampaignIfNeeded();
  await configureLevels();
  // await registerLevels();
}

async function configureLevels() {
  await configureLevel1();
  // await configureLevel2();
  // await configureLevel3();
}

async function configureLevel1() {
  console.log('\nConfiguring level 1');

  // Id level
  const levelAddress = getDeployedAddressFromIgnitionDeployment('Level1');

  // Set instructions
  const safuAddress = getDeployedAddressFromIgnitionDeployment('Safu');
  const instructions = `"What is the password required by ${safuAddress}?"`;
  console.log('Instructions:', instructions);
  await (await safu.setInstructions(instructions)).wait();

  // Set verifier
  const verifierAddress =
    getDeployedAddressFromIgnitionDeployment('Level1Verifier');
  await (await safu.setVerifier(verifierAddress)).wait();

  return safu.target;
}

async function configureLevel2() {
  console.log('\nDeploying level: txx');

  console.log('Deploying Safuer');
  const Safuer = await hre.ethers.getContractFactory('Safuer');
  const safuer = await Safuer.deploy();

  // Reveal the password in a transaction
  await (await safuer.solve('zeronaut')).wait();
  await (await safuer.solve('zerpnaut')).wait();
  await (await safuer.solve('zer0naut')).wait();
  await (await safuer.solve('zerznaut')).wait();

  console.log('Verifying Safuer');
  if (hre.network.name !== 'localhost') {
    // TODO: Verify on etherscan
  }

  console.log('Deploying Txx');
  const Txx = await hre.ethers.getContractFactory('Txx');
  const instructions = `"What is the password required by ${safuer.target}?"`;
  console.log('Instructions:', instructions);
  const level = await Txx.deploy(instructions);

  return level.target;
}

async function configureLevel3() {
  console.log('\nDeploying level: zxx');

  console.log('Deploying Safuest');
  const Safuest = await hre.ethers.getContractFactory('Safuest');
  const safuest = await Safuest.deploy();

  console.log('Verifying Safuest');
  if (hre.network.name !== 'localhost') {
    // TODO: Verify on etherscan
  }

  console.log('Deploying Zxx');
  const Zxx = await hre.ethers.getContractFactory('Zxx');
  const instructions = `"This time, the contract at ${safuest.target} requires a zero knowledge proof of the password. Can you find it?"`;
  console.log('Instructions:', instructions);
  const level = await Zxx.deploy(instructions);

  // Submit a proof to safuest
  const signer = (await hre.ethers.getSigners())[0];
  const circuit = JSON.parse(await level.circuit());
  const { proof, publicInputs } = await buildProof(signer, circuit, {
    password: 'no',
  });
  const checks = await safuest.checkProof(proof, publicInputs);
  console.log('Proof checks:', checks);
  await safuest.solve(proof, publicInputs);

  return level.target;
}

async function registerLevels() {
  console.log('\nRegistering levels');

  let tx;

  for (const level of levels) {
    // Check if the level is already registered
    const levelId = hre.ethers.encodeBytes32String(level.name);
    const levelData = await zeronaut.getLevel(levelId);

    // If address differs
    if (levelData.addr === level.address) {
      console.log(
        `Level ${level.name} is already registered at ${levelData.addr}`
      );
      continue;
    } else {
      console.log(`Setting level ${level.name} to ${level.address}`);
      tx = await zeronaut.setLevel(campaignId, levelId, level.address);
      await tx.wait();
    }
  }
}

function getDeployedAddressFromIgnitionDeployment(contractName) {
  const addresses = JSON.parse(
    fs.readFileSync(
      `../ignition/deployments/${chainId}/deployed_addresses.json`
    )
  );
  return addresses[`DeployModule#${contractName}`];
}

async function createCampaignIfNeeded() {
  const campaignData = await zeronaut.getCampaign(campaignId);
  if (campaignData.id === campaignId) {
    console.log(`Campaign ${campaignName} already exists`);
  } else {
    console.log(`Creating campaign "${campaignName}"`);
    tx = await zeronaut.createCampaign(campaignId);
    await tx.wait();
  }
}

async function connect() {
  const chainId = (await hre.ethers.provider.getNetwork()).chainId;
  zeronaut = await getZeronautContract(hre, chainId);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
