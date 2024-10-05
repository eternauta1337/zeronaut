const { useFixture } = require('./helpers/fixture');

describe('Zeronaut', function () {
  useFixture('basic-level');

  describe('when the main contract is deployed', () => {
    let zeronaut;

    before('deploy main contract', async function () {
      zeronaut = await deployZeronaut(hre);
    });

    it('should have deployed the contract', async function () {
      expect(zeronaut.target).to.not.be.null;
    });
  });
});

async function deployZeronaut(hre) {
  const factory = await hre.ethers.getContractFactory('Zeronaut');
  return await factory.deploy();
}

module.exports = {
  deployZeronaut,
};
