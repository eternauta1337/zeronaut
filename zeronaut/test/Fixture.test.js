const { expect } = require('chai');
const { useFixture } = require('./helpers/fixture');

describe.only('Fixture', function () {
  useFixture('basic-level');

  it('should be able to deploy', async () => {
    console.log(hre);
  });
});
