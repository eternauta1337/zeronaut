const { deployZeronaut } = require('./Zeronaut.test');
const { createCampaign } = require('./Campaign.test');
const { useFixture } = require('./helpers/fixture');

describe('Level', function () {
  useFixture('basic-level');

  let zeronaut;
  let campaignId;

  before('bootstrap', async function () {
    zeronaut = await deployZeronaut(hre);
    campaignId = hre.ethers.encodeBytes32String('dummy-campaign');
    await createCampaign(zeronaut, campaignId);
  });

  describe('when a level is created', function () {
    let level;

    let levelId;

    before('deploy and register level', async function () {
      levelId = hre.ethers.encodeBytes32String('dummy-level');
      level = await createLevel(hre, zeronaut, campaignId, levelId);
    });

    it('should display the level address', async function () {
      const levelData = await zeronaut.getLevel(levelId);

      expect(levelData.addr).to.equal(level.target);
    });

    it('should display the level circuit', async function () {
      const circuit = await level.circuit();

      expect(circuit).to.include('abi');
    });

    it('should display the level instructions', async function () {
      const instructions = await level.instructions();

      expect(instructions).to.equal('Dummy level instructions');
    });

    describe('when a level is updated', () => {
      before('set level', async function () {
        level = await createLevel(hre, zeronaut, campaignId, levelId);
      });

      it('should display the new level address', async function () {
        const levelData = await zeronaut.getLevel(levelId);

        expect(levelData.addr).to.equal(level.target);
      });
    });

    describe('when more levels are created', function () {
      let levelId2;
      let levelId3;

      before('create more levels', async function () {
        levelId2 = hre.ethers.encodeBytes32String('dummy-level-2');
        levelId3 = hre.ethers.encodeBytes32String('dummy-level-3');
        await createLevel(hre, zeronaut, campaignId, levelId2);
        await createLevel(hre, zeronaut, campaignId, levelId3);
      });

      describe('when querying the campaign', function () {
        let campaign;

        before('query campaign', async function () {
          campaign = await zeronaut.getCampaign(campaignId);
        });

        it('should display all levels', async function () {
          expect(campaign.levels).to.have.length(3);
          expect(campaign.levels).to.include(levelId);
          expect(campaign.levels).to.include(levelId2);
          expect(campaign.levels).to.include(levelId3);
        });
      });
    });
  });
});

async function createLevel(hre, zeronaut, campaignId, levelId) {
  // Deploy the verifier contract
  const Verifier = await hre.ethers.getContractFactory('UltraVerifier');
  const verifier = await Verifier.deploy();

  // Deploy the level contract
  const Level = await hre.ethers.getContractFactory('DummyLevel');
  const level = await Level.deploy(verifier.target);

  // Set the level in the zeronaut contract
  const levelAddress = level.target;
  await zeronaut.setLevel(campaignId, levelId, levelAddress);

  return level;
}

module.exports = {
  createLevel,
};
