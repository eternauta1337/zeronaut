const { expect } = require('chai');
const { deployZeronaut } = require('./Zeronaut.test');

describe('Campaign', function () {
  let zeronaut;

  before('deploy main contract', async () => {
    zeronaut = await deployZeronaut();
  });

  describe('when a campaign is created', () => {
    const campaignId = ethers.encodeBytes32String('dummy-campaign');
    let owner, notOwner;

    before('identify signers', async () => {
      [owner, notOwner] = await ethers.getSigners();
    });

    before('create campaign', async () => {
      await createCampaign(zeronaut, campaignId);
    });

    it('should display the campaign with the appropriate owner', async () => {
      const campaign = await zeronaut.getCampaign(campaignId);

      expect(campaign.owner).to.equal(owner.address);
    });

    describe('when a campaign with the same id is created', () => {
      it('reverts', async () => {
        await expect(zeronaut.createCampaign(campaignId)).to.be.revertedWith(
          'Campaign id already taken'
        );
      });
    });

    describe('when a non owner tries to create a level', () => {
      it('reverts', async () => {
        await expect(
          zeronaut
            .connect(notOwner)
            .setLevel(
              campaignId,
              ethers.encodeBytes32String('rogue-level'),
              notOwner.address
            )
        ).to.be.revertedWith('Only campaign owner allowed');
      });
    });
  });
});

async function createCampaign(zeronaut, campaignId) {
  await zeronaut.createCampaign(campaignId);
}

module.exports = {
  createCampaign,
};
