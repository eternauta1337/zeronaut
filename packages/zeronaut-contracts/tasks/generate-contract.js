const { task } = require('hardhat/config');
const { execSync } = require('child_process');

task('generate:contract', 'Generates the verifier contract for a level')
  .addPositionalParam('packagePath', 'Path to the package', 'circuits')
  .setAction(async ({ packagePath }, hre) => {
    try {
      // Generate the Solidity verifier contract
      console.log('Generating Solidity verifier contract...');
      const rootDir = process.cwd();
      execSync(
        `cd ${packagePath} && nargo compile && bb write_vk -b ./target/circuits.json && bb contract && cd ${rootDir}`,
        { stdio: 'inherit' }
      );

      console.log(`Generated verifier contract`);
      console.log(
        `Replace the content of the corresponding Verifier.sol contract`
      );
    } catch (error) {
      console.error('Error generating verifier contract:', error.message);
      process.exit(1);
    }
  });
