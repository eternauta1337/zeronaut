const { getZeronautContract } = require('zeronaut-contracts/utils/contract');
const { buildProof } = require('zeronaut-contracts/utils/build-proof');

let zeronaut;
const levels = [];
const campaignName = 'noir-poc';
const campaignId = hre.ethers.encodeBytes32String(campaignName);

async function main() {
  console.log('Setting levels on network:', hre.network.name);

  await connect();
  await createCampaignIfNeeded();

  levels.push({
    name: 'codebreaker',
    address: await deployCodeBreaker(),
  });
  levels.push({
    name: 'txx',
    address: await deployTxx(),
  });
  levels.push({
    name: 'zxx',
    address: await deployZxx(),
  });

  await registerLevels();
}

async function deployZxx() {
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

async function deployTxx() {
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

async function deployCodeBreaker() {
  console.log('\nDeploying level: codebreaker');

  console.log('Deploying Safu');
  const Safu = await hre.ethers.getContractFactory('Safu');
  const safu = await Safu.deploy();

  console.log('Verifying Safu');
  if (hre.network.name !== 'localhost') {
    // TODO: Verify on etherscan
  }

  console.log('Deploying CodeBreaker');
  const CodeBreaker = await hre.ethers.getContractFactory('CodeBreaker');
  const instructions = `"What is the password required by ${safu.target}?"`;
  console.log('Instructions:', instructions);
  const level = await CodeBreaker.deploy(instructions);

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
