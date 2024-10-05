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
};
