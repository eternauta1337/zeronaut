const { task } = require('hardhat/config');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

task('generate:acir', 'Embeds ACIR code into a level contract')
  .addPositionalParam('packagePath', 'Path to the package', 'circuits')
  .setAction(async ({ packagePath }, hre) => {
    try {
      // Compile the circuit
      console.log('Compiling the circuit');
      const rootDir = process.cwd();
      execSync(`cd ${packagePath} && nargo compile && cd ${rootDir}`, {
        stdio: 'inherit',
      });

      // Define input and output file paths
      const inputFile = path.join(packagePath, 'target', 'circuits.json');
      const outputFile = path.join(packagePath, 'target', 'circuits.txt');

      // Read and process the circuits.json file
      console.log('Processing circuits.json');
      const circuitsData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
      const extractedData = {
        abi: circuitsData.abi,
        bytecode: circuitsData.bytecode,
      };

      // Convert to a string and escape quotes
      const jsonString = JSON.stringify(extractedData)
        .replace(/^"|"$/g, '') // Remove leading and trailing quotes if present
        .replace(/"/g, '\\"'); // Escape any remaining quotes within the JSON

      // Write to the output file
      fs.writeFileSync(outputFile, jsonString);

      console.log(`Generated ACIR in ${outputFile}`);
      console.log(
        'Please inject its content into the circuit() function of your level contract.'
      );
    } catch (error) {
      console.error('Error generating ACIR:', error.message);
      process.exit(1);
    }
  });
