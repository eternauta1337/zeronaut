const { deployZeronaut } = require('./Zeronaut.test');
const { createCampaign } = require('./Campaign.test');
const { createLevel } = require('./Level.test');
const { buildProof } = require('../utils/build-proof');
const { useFixture } = require('./helpers/fixture');

describe('Play', function () {
  useFixture('basic-level');

  let zeronaut;
  let circuit;
  let player, otherPlayer;

  let campaignId;
  let levelId;

  before('bootstrap', async function () {
    [player, otherPlayer] = await hre.ethers.getSigners();
    zeronaut = await deployZeronaut(hre);
    campaignId = hre.ethers.encodeBytes32String('dummy-campaign');
    levelId = hre.ethers.encodeBytes32String('dummy-level');
    await createCampaign(zeronaut, campaignId);
    level = await createLevel(hre, zeronaut, campaignId, levelId);
    circuit = JSON.parse(await level.circuit());
  });

  describe('before the level is solved', function () {
    it('shows that the level is not solved', async function () {
      const isSolved = await zeronaut.isLevelSolved(levelId, player.address);
      expect(isSolved).to.be.false;
    });
  });

  describe('when a valid proof is generated', function () {
    let proof, publicInputs;

    before('build proof', async function () {
      ({ proof, publicInputs } = await buildProof(player, circuit, {
        secret: 42,
      }));
    });

    describe('and submitted by the signer that generated it', function () {
      before('submit the proof', async function () {
        await (await zeronaut.solveLevel(levelId, proof, publicInputs)).wait();
      });

      it('shows that the level is solved for that player', async function () {
        const isSolved = await zeronaut.isLevelSolved(levelId, player.address);
        expect(isSolved).to.be.true;
      });

      it('shows that the level is not solved for other players', async function () {
        const isSolved = await zeronaut.isLevelSolved(
          levelId,
          otherPlayer.address
        );
        expect(isSolved).to.be.false;
      });
    });

    describe('and submitted by a different signer', function () {
      it('reverts', async function () {
        const otherSigner = (await hre.ethers.getSigners())[1];
        expect(
          zeronaut.connect(otherSigner).solveLevel(levelId, proof, publicInputs)
        ).to.be.revertedWith('Proof must be generated by player');
      });
    });
  });
});
