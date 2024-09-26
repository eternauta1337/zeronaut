const { expect } = require('chai');
const { deployZeronaut } = require('./Zeronaut.test');
const { createCampaign } = require('./Campaign.test');
const { createLevel } = require('./Level.test');

describe('Play', () => {
  let zeronaut;
  let level;
  let player;

  const campaignId = ethers.encodeBytes32String('dummy-campaign');
  const levelId = ethers.encodeBytes32String('dummy-level');

  before('bootstrap', async () => {
    zeronaut = await deployZeronaut();
    await createCampaign(zeronaut, campaignId);
    level = await createLevel(zeronaut, campaignId, levelId);
    [player] = await ethers.getSigners();
  });

  describe('before the level is solved', () => {
    it('shows that the level is not solved', async () => {
      const isSolved = await zeronaut.isLevelSolved(levelId, player.address);
      expect(isSolved).to.be.false;
    });
  });

  describe('when checking a proof with the level directly', () => {
    it('returns true with a correct proof', async () => {
      const proof = ethers.encodeBytes32String('dummy');
      const result = await level.check(proof, []);

      expect(result).to.be.true;
    });

    it('returns false with an incorrect proof', async () => {
      const proof = ethers.encodeBytes32String('poop');
      const result = await level.check(proof, []);

      expect(result).to.be.false;
    });
  });

  describe('when solving the level', () => {
    before('solve level', async () => {
      const proof = ethers.encodeBytes32String('dummy');
      const tx = await zeronaut.solveLevel(levelId, proof, []);
      await tx.wait();
    });

    it('marks the level as solved', async () => {
      const isSolved = await zeronaut.isLevelSolved(levelId, player);
      expect(isSolved).to.be.true;
    });
  });
});
