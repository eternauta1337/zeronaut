const path = require('path');

function useFixture(fixtureName) {
  let currentPath;
  let fixturePath;

  before(() => {
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
  });

  after(() => {
    process.chdir(currentPath);
  });
}

module.exports = {
  useFixture,
};
