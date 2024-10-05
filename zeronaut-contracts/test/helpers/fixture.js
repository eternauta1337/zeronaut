const path = require('path');
const { resetHardhatContext } = require('hardhat/plugins-testing');

function useFixture(fixtureName) {
  let currentPath;
  let fixturePath;

  before(function () {
    currentPath = process.cwd();

    fixturePath = path.join(
      process.cwd(),
      'test/fixture-projects',
      fixtureName
    );

    if (currentPath !== fixturePath) {
      process.chdir(fixturePath);
    }

    global.hre = require('hardhat');

    require('@nomicfoundation/hardhat-chai-matchers');
    global.expect = require('chai').expect;
  });

  after(function () {
    process.chdir(currentPath);
    resetHardhatContext();
  });
}

module.exports = {
  useFixture,
};
