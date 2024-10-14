require('dotenv').config({ path: '../../.env' });
require('@nomicfoundation/hardhat-toolbox');
require('./index');

module.exports = {
  solidity: {
    version: '0.8.27',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: 'localhost',
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
    op_sepolia: {
      url: 'https://sepolia.optimism.io',
      accounts: [process.env.PRIVATE_KEY],
      ignition: {
        maxFeePerGasLimit: 50_000_000_000n, // 50 gwei
        maxPriorityFeePerGas: 2_000_000_000n, // 2 gwei
        gasPrice: 50_000_000_000n, // 50 gwei
        disableFeeBumping: false,
      },
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
