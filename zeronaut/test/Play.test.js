const { expect } = require('chai');
const { deployZeronaut } = require('./Zeronaut.test');
const { createCampaign } = require('./Campaign.test');
const { createLevel } = require('./Level.test');

describe('Play', () => {
  let zeronaut;
  let level;

  before('bootstrap', async () => {
    zeronaut = await deployZeronaut();
    const campaignId = ethers.encodeBytes32String('dummy-campaign');
    await createCampaign(zeronaut, campaignId);
    level = await createLevel(
      zeronaut,
      campaignId,
      ethers.encodeBytes32String('dummy-level')
    );
  });

  describe('when submitting a proof', () => {
    it('returns true with a correct proof', async () => {
      const proof = ethers.encodeBytes32String('dummy');
      const result = await zeronaut.checkLevel(level.target, proof, []);

      expect(result).to.be.true;
    });

    it('returns false with an incorrect proof', async () => {
      const proof = ethers.encodeBytes32String('poop');
      const result = await zeronaut.checkLevel(level.target, proof, []);

      expect(result).to.be.false;
    });
  });
});
