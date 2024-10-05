const { useFixture } = require('./helpers/fixture');
const { deployZeronaut } = require('./helpers/zeronaut');

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
