const { expect } = require('chai');
const { deployZeronaut } = require('./Zeronaut.test');
const { createCampaign } = require('./Campaign.test');

describe('Level', function () {
  let zeronaut;
  const campaignId = ethers.encodeBytes32String('dummy-campaign');

  before('bootstrap', async () => {
    zeronaut = await deployZeronaut();
    await createCampaign(zeronaut, campaignId);
  });

  describe('when a level is created', () => {
    let level;
    const levelId = ethers.encodeBytes32String('dummy-level');

    before('deploy and register level', async () => {
      level = await createLevel(zeronaut, campaignId, levelId);
    });

    it('should display the level address', async () => {
      const levelData = await zeronaut.getLevel(levelId);

      expect(levelData.addr).to.equal(level.target);
    });

    it('should display the level name', async () => {
      const name = await level.name();

      expect(name).to.equal(ethers.encodeBytes32String('Dummy Level'));
    });

    it('should display the level circuit', async () => {
      const circuit = await level.circuit();

      expect(circuit).to.equal('{}');
    });

    it('should display the level instructions', async () => {
      const instructions = await level.instructions();

      expect(instructions).to.equal('Dummy level instructions');
    });

    describe('when a level is updated', () => {
      before('set level', async () => {
        level = await createLevel(zeronaut, campaignId, levelId);
      });

      it('should display the new level address', async () => {
        const levelData = await zeronaut.getLevel(levelId);

        expect(levelData.addr).to.equal(level.target);
      });
    });

    describe('when more levels are created', () => {
      const levelId2 = ethers.encodeBytes32String('dummy-level-2');
      const levelId3 = ethers.encodeBytes32String('dummy-level-3');

      before('create more levels', async () => {
        await createLevel(zeronaut, campaignId, levelId2);
        await createLevel(zeronaut, campaignId, levelId3);
      });

      describe('when querying the campaign', () => {
        let campaign;

        before('query campaign', async () => {
          campaign = await zeronaut.getCampaign(campaignId);
        });

        it('should display all levels', async () => {
          expect(campaign.levels).to.have.length(3);
          expect(campaign.levels).to.include(levelId);
          expect(campaign.levels).to.include(levelId2);
          expect(campaign.levels).to.include(levelId3);
        });
      });
    });
  });
});

async function createLevel(zeronaut, campaignId, levelId) {
  // Deploy the level contract
  const factory = await ethers.getContractFactory('DummyLevel');
  const level = await factory.deploy();

  // Set the level in the zeronaut contract
  const levelAddress = level.target;
  await zeronaut.setLevel(campaignId, levelId, levelAddress);

  return level;
}

module.exports = {
  createLevel,
};
