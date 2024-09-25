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
      const name = await zeronaut.getLevelName(level.target);

      expect(name).to.equal(ethers.encodeBytes32String('Dummy Level'));
    });

    it('should display the level circuit', async () => {
      const circuit = await zeronaut.getLevelCircuit(level.target);

      expect(circuit).to.equal('{}');
    });

    it('should display the level instructions', async () => {
      const instructions = await zeronaut.getLevelInstructions(level.target);

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
