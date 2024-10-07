const { extendEnvironment } = require('hardhat/config');
const requireAll = require('ethernaut-common/src/io/require-all');

requireAll(__dirname, 'tasks');

extendEnvironment((hre) => {});
