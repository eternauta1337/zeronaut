const { useFixture } = require('./helpers/fixture');
const { deployZeronaut } = require('./helpers/zeronaut');

describe.only('Upgrades', function () {
  useFixture('upgrades');

  let zeronaut;

  before('deploy main contract', async function () {
    zeronaut = await deployZeronaut(hre);
  });

  describe('when trying to upgrade to the zero address', function () {
    it('should fail', async function () {
      await expect(
        zeronaut.upgradeTo('0x0000000000000000000000000000000000000000')
      ).to.be.revertedWith('UUPSImplementation: Zero address');
    });
  });

  describe('when trying to upgrade to an EOA', function () {
    it('should fail', async function () {
      const signers = await hre.ethers.getSigners();
      const eoa = signers[2];
      await expect(zeronaut.upgradeTo(eoa.address)).to.be.revertedWith(
        'UUPSImplementation: Not a contract'
      );
    });
  });

  describe('when trying to upgrade by a non-owner', function () {
    it('should fail', async function () {
      const signers = await hre.ethers.getSigners();
      const otherGuy = signers[1];
      await expect(
        zeronaut.connect(otherGuy).upgradeTo(otherGuy.address)
      ).to.be.revertedWith('OwnableStorage: Caller is not the owner');
    });
  });

  describe('when the contract is upgraded', function () {
    let ownerAddress;
    let proxyAddress;
    let zeronaut1;

    before('cache proxy address', async function () {
      proxyAddress = zeronaut.target;
      ownerAddress = await zeronaut.getOwner();
    });

    before('deploy and upgrade', async function () {
      const Zeronaut1 = await hre.ethers.getContractFactory('Zeronaut1');
      zeronaut1 = await Zeronaut1.deploy();
      await zeronaut.upgradeTo(zeronaut1.target);
      zeronaut = await hre.ethers.getContractAt('Zeronaut1', proxyAddress);
    });

    it('should have the new implementation', async function () {
      const implementation = await zeronaut.getImplementation();
      expect(implementation).to.equal(zeronaut1.target);
    });

    it('should have the same owner', async function () {
      const owner = await zeronaut.getOwner();
      expect(owner).to.equal(ownerAddress);
    });

    it('should say something', async function () {
      const something = await zeronaut.saySomething();
      expect(something).to.equal('something');
    });

    describe('when upgrading again (to a bricked implementation)', function () {
      before('upgrade again', async function () {
        const Zeronaut2 = await hre.ethers.getContractFactory('Zeronaut2');
        const zeronaut2 = await Zeronaut2.deploy();
        await zeronaut.upgradeTo(zeronaut2.target);
        zeronaut = await hre.ethers.getContractAt('Zeronaut2', proxyAddress);
      });

      it('should have the same owner', async function () {
        const owner = await zeronaut.getOwner();
        expect(owner).to.equal(ownerAddress);
      });

      it('should say something else', async function () {
        const something = await zeronaut.saySomethingElse();
        expect(something).to.equal('something else');
      });

      it('should not say something', async function () {
        try {
          await zeronaut.saySomething();
        } catch (error) {
          expect(error.message).to.equal(
            'zeronaut.saySomething is not a function'
          );
        }
      });

      describe('when trying to upgrade again', function () {
        it('should fail', async function () {
          try {
            const Zeronaut = await hre.ethers.getContractFactory('Zeronaut');
            const original = await Zeronaut.deploy();
            await zeronaut.upgradeTo(original.target);
          } catch (error) {
            expect(error.message).to.equal(
              'zeronaut.upgradeTo is not a function'
            );
          }
        });
      });
    });
  });
});
