const { useFixture } = require('./helpers/fixture');
const { deployZeronaut } = require('./helpers/zeronaut');
const { createCampaign } = require('./helpers/campaign');

describe('Campaign', function () {
  useFixture('basic-level');

  let zeronaut;

  before('deploy main contract', async function () {
    zeronaut = await deployZeronaut(hre);
  });

  describe('when a campaign is created', function () {
    let campaignId;
    let owner, notOwner;

    before('identify signers', async function () {
      campaignId = hre.ethers.encodeBytes32String('dummy-campaign');
      [owner, notOwner] = await hre.ethers.getSigners();
    });

    before('create campaign', async function () {
      await createCampaign(zeronaut, campaignId);
    });

    describe('when the campaign is queried', function () {
      let campaign;

      before('query campaign', async function () {
        campaign = await zeronaut.getCampaign(campaignId);
      });

      it('should display the campaign owner', async function () {
        expect(campaign.owner).to.equal(owner.address);
      });

      it('should display the campaign id', async function () {
        expect(campaign.id).to.equal(campaignId);
      });

      it('should display the campaign levels (empty)', async function () {
        expect(campaign.levels).to.have.length(0);
      });
    });

    describe('when a campaign with the same id is created', function () {
      it('reverts', async function () {
        await expect(zeronaut.createCampaign(campaignId)).to.be.revertedWith(
          'Campaign id already taken'
        );
      });
    });

    describe('when a non owner tries to create a level', function () {
      it('reverts', async function () {
        await expect(
          zeronaut
            .connect(notOwner)
            .setLevel(
              campaignId,
              hre.ethers.encodeBytes32String('rogue-level'),
              notOwner.address
            )
        ).to.be.revertedWith('Only campaign owner allowed');
      });
    });
  });
});
