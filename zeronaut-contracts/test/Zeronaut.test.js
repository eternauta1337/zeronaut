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

    it('can retrieve a campaign', async function () {
      const campaign = await zeronaut.getCampaign(
        hre.ethers.encodeBytes32String('dummy-campaign')
      );
      expect(campaign.owner).to.equal(hre.ethers.ZeroAddress);
    });

    it('should have the correct owner', async function () {
      const signers = await hre.ethers.getSigners();
      const owner = await zeronaut.getOwner();
      expect(owner).to.equal(signers[0].address);
    });
  });
});
