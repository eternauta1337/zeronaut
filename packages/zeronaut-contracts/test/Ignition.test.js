const { expect } = require('chai');
const { useFixture } = require('./helpers/fixture');

const ZeronautModule = require('../ignition/modules/ZeronautModule');
const UpgradeModule = require('../ignition/modules/UpgradeModule');

describe('Ignition', function () {
  useFixture('basic-level');

  let owner;
  let zeronaut, implementation;

  before('identify signers', async function () {
    [owner] = await hre.ethers.getSigners();
  });

  describe('when running the ProxyModule', function () {
    before('deploy', async function () {
      ({ zeronaut, implementation } = await hre.ignition.deploy(
        ZeronautModule
      ));
    });

    it('should have valid addresses', async function () {
      expect(zeronaut.address).to.not.be.null;
      expect(implementation.address).to.not.be.null;
    });

    it('should have the right owner', async function () {
      expect(await zeronaut.getOwner()).to.equal(owner.address);
    });

    it('should have the right implementation', async function () {
      expect(await zeronaut.getImplementation()).to.equal(
        implementation.target
      );
    });

    describe('when running the UpgradeModule', function () {
      let prevImplementation;
      before('upgrade', async function () {
        prevImplementation = implementation;
        ({ zeronaut, implementation } = await hre.ignition.deploy(
          UpgradeModule
        ));
      });

      it('should have the right implementation', async function () {
        expect(prevImplementation.target).to.not.equal(implementation.target);
        expect(await zeronaut.getImplementation()).to.equal(
          implementation.target
        );
      });
    });
  });
});
