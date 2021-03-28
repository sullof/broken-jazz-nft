const { expect } = require("chai");

describe("BrokenJazz", function() {

  let BrokenJazz;
  let brokenJazz;

  beforeEach(async function () {
    BrokenJazz = await ethers.getContractFactory("BrokenJazz");
    brokenJazz = await BrokenJazz.deploy("BrokenJazz", "BJ");
    await brokenJazz.deployed();
  });

  it("should return the brokenJazz name and symbol", async function() {
    expect(await brokenJazz.name()).to.equal("BrokenJazz");
    expect(await brokenJazz.symbol()).to.equal("BJ");
  });

  it("should award addr1 with a new token", async function() {

    const [owner, addr1] = await ethers.getSigners();

    const tokenId = 2;
    const tokenUri = `ipfs://sadadadsaddasdas/${tokenId}`;

    await brokenJazz.awardItem(addr1.address, tokenId, tokenUri);

    expect(await brokenJazz.balanceOf(addr1.address)).to.equal(1);
    expect(await brokenJazz.ownerOf(tokenId)).to.equal(addr1.address);
  });

  it("should award addr1 with a new token and transfer the token to addr2", async function() {

    const [owner, addr1, addr2] = await ethers.getSigners();

    const tokenId = 4;
    const tokenUri = `ipfs://sadadadsaddasdas/${tokenId}`;

    await brokenJazz.awardItem(addr1.address, tokenId, tokenUri);

    expect(await brokenJazz.balanceOf(addr1.address)).to.equal(1);
    expect(await brokenJazz.ownerOf(tokenId)).to.equal(addr1.address);

    await brokenJazz.connect(addr1).transferFrom(addr1.address, addr2.address, tokenId);

    expect(await brokenJazz.balanceOf(addr1.address)).to.equal(0);
    expect(await brokenJazz.ownerOf(tokenId)).to.equal(addr2.address);

  });

});
