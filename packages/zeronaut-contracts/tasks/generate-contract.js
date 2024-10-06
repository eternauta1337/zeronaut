const { task } = require('hardhat/config');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

task(
  'generate:contract',
  'Generates the verifier contract for a level'
).setAction(async ({}, hre) => {
  try {
    // Generate the Solidity verifier contract
    console.log('Generating Solidity verifier contract...');
    execSync(
      'cd circuits && nargo compile && bb write_vk -b ./target/circuits.json && bb contract && mv -f ./target/contract.sol ../contracts/Verifier.sol && cd ..',
      { stdio: 'inherit' }
    );

    console.log(`Generated verifier contract`);
  } catch (error) {
    console.error('Error generating verifier contract:', error.message);
    process.exit(1);
  }
});
