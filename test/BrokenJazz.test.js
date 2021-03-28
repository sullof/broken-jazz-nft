const { expect, assert } = require("chai");

describe("BrokenJazz", function() {

  let BrokenJazz;
  let brokenJazz;

  beforeEach(async function () {
    BrokenJazz = await ethers.getContractFactory("BrokenJazz");
    brokenJazz = await BrokenJazz.deploy("BrokenJazz", "BKJ");
    await brokenJazz.deployed();
  });

  it("should return the brokenJazz name and symbol", async function() {
    expect(await brokenJazz.name()).to.equal("BrokenJazz");
    expect(await brokenJazz.symbol()).to.equal("BKJ");
  });

  it("should approve addr1 for item #23", async function() {

    const [owner, addr1] = await ethers.getSigners();

    const tokenId = 23;
    const tokenUri = `ipfs://QmZ5bK81zLneKyV6KUYVGc9WAfVzBeCGTbRTGFQwHLXCfz/metadata.json`;

    await brokenJazz.approveClaimer(addr1.address, tokenId, tokenUri);
    expect((await brokenJazz.approvedClaimers(tokenId))[0]).to.equal(addr1.address);
  });

  it("should allow addr1 to claim token #23", async function() {

    const [owner, addr1] = await ethers.getSigners();

    const tokenId = 23;
    const tokenUri = `ipfs://QmZ5bK81zLneKyV6KUYVGc9WAfVzBeCGTbRTGFQwHLXCfz/metadata.json`;

    await brokenJazz.approveClaimer(addr1.address, tokenId, tokenUri);

    expect(await brokenJazz.balanceOf(addr1.address)).to.equal(0);

    await brokenJazz.connect(addr1).claimToken(tokenId);

    expect(await brokenJazz.balanceOf(addr1.address)).to.equal(1);
    expect(await brokenJazz.ownerOf(tokenId)).to.equal(addr1.address);

  });

  it("should throw if addr1 claims a token without being approved", async function() {

    const [owner, addr1] = await ethers.getSigners();

    const tokenId = 23;
    const tokenUri = `ipfs://QmZ5bK81zLneKyV6KUYVGc9WAfVzBeCGTbRTGFQwHLXCfz/metadata.json`;

    try {
      await brokenJazz.connect(addr1).claimToken(tokenId);
      assert.isTrue(false);
    } catch(e) {
      assert.isTrue(e.message.includes('BrokenJazz: not approved'));
    }

  });

  it("should throw if addr1 tries to approve itself", async function() {

    const [owner, addr1] = await ethers.getSigners();

    const tokenId = 23;
    const tokenUri = `ipfs://QmZ5bK81zLneKyV6KUYVGc9WAfVzBeCGTbRTGFQwHLXCfz/metadata.json`;

    try {
      await brokenJazz.connect(addr1).approveClaimer(addr1.address, tokenId, tokenUri);
      assert.isTrue(false);
    } catch(e) {
      assert.isTrue(e.message.includes('Ownable: caller is not the owner'));
    }

  });

});
