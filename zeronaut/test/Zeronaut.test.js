const { expect } = require('chai');

describe('Zeronaut', function () {
  describe('when the main contract is deployed', () => {
    let zeronaut;

    before('deploy main contract', async () => {
      const factory = await ethers.getContractFactory('Zeronaut');
      zeronaut = await factory.deploy();
    });

    it('should have deployed the contract', async () => {
      expect(zeronaut.target).to.not.be.null;
    });

    describe('when a campaign is created', () => {
      const campaignId = ethers.encodeBytes32String('dummy-campaign');
      let owner, notOwner;

      before('create campaign', async () => {
        [owner, notOwner] = await ethers.getSigners();

        await zeronaut.createCampaign(campaignId);
      });

      it('should display the campaign with the appropriate owner', async () => {
        const campaign = await zeronaut.getCampaign(campaignId);

        expect(campaign.owner).to.equal(owner.address);
      });

      describe('when a non owner tries to create a level', () => {
        it('reverts', async () => {
          await expect(
            zeronaut.connect(notOwner).createLevel(campaignId, notOwner.address)
          ).to.be.revertedWith('Only campaign owner allowed');
        });
      });

      describe('when a level is created', () => {
        let level;

        before('deploy and register level', async () => {
          const factory = await ethers.getContractFactory('DummyLevel');
          level = await factory.deploy();

          await zeronaut.createLevel(campaignId, level.target);
        });

        it('should display the level', async () => {
          const campaign = await zeronaut.getCampaign(campaignId);

          expect(campaign.levels).to.contain(level.target);
        });

        describe('when playing the level', () => {
          describe('and the proof is incorrect', () => {
            it('returns false', async () => {
              const proof = ethers.encodeBytes32String('poop');
              const result = await zeronaut.checkLevel(level.target, proof, []);

              expect(result).to.be.false;
            });
          });

          describe('and the proof is correct', () => {
            it('returns true', async () => {
              const proof = ethers.encodeBytes32String('dummy');
              const result = await zeronaut.checkLevel(level.target, proof, []);

              expect(result).to.be.true;
            });
          });
        });
      });
    });
  });
});
