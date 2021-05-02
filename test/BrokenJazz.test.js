const { expect, assert } = require("chai")

describe("BrokenJazz", function() {

  let BrokenJazz
  let brokenJazz

  let addr0 = '0x0000000000000000000000000000000000000000'
  let owner, oracle, bob, alice

  async function getSignature(address, tokenId, tokenURI) {
    const hash = await brokenJazz.encodeForSignature(address, tokenId, tokenURI)
    const signingKey = new ethers.utils.SigningKey('0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d')
    const signedDigest = signingKey.signDigest(hash)
    return ethers.utils.joinSignature(signedDigest)
  }

  async function assertThrowsMessage(promise, message, showError) {
    try {
      await promise
      assert.isTrue(false)
      console.error('This did not throw: ', message)
    } catch (e) {
      if (showError) {
        console.error('Expected: ', message)
        console.error(e.message)
      }
      assert.isTrue(e.message.indexOf(message) > -1)
    }
  }

  before(async function () {
    const signers = await ethers.getSigners()
    owner = signers[0]
    oracle = signers[1]
    bob = signers[2]
    alice = signers[3]
  })

  beforeEach(async function () {
    BrokenJazz = await ethers.getContractFactory("BrokenJazz")
    brokenJazz = await BrokenJazz.deploy(oracle.address)
    await brokenJazz.deployed()
  })

  it("should return the brokenJazz name and symbol", async function() {
    expect(await brokenJazz.name()).to.equal("BrokenJazz")
    expect(await brokenJazz.symbol()).to.equal("BKJZ")
    expect(await brokenJazz.oracle()).to.equal(oracle.address)
  })

  it("should mint token #23", async function() {

    const tokenId = 23
    const tokenUri = 'ipfs://QmZ5bK81zLneKyV6KUYVGc9WAfVzBeCGTbRTGFQwHLXCfz'

    let signature = await getSignature(bob.address, tokenId, tokenUri)

    await expect(brokenJazz.connect(bob).claimToken(tokenId, tokenUri, signature))
        .to.emit(brokenJazz, 'Transfer')
        .withArgs(addr0, bob.address, tokenId);

  })


  it("should throw if signature is wrong", async function() {

    const tokenId = 23
    const tokenUri = 'ipfs://QmZ5bK81zLneKyV6KUYVGc9WAfVzBeCGTbRTGFQwHLXCfz'

    let signature = await getSignature(bob.address, tokenId, tokenUri)

    await assertThrowsMessage(
        brokenJazz.connect(bob).claimToken(24, tokenUri, signature),
        'Invalid signature')

    await assertThrowsMessage(
        brokenJazz.connect(alice).claimToken(tokenId, tokenUri, signature),
        'Invalid signature')

    const hash = await brokenJazz.encodeForSignature(bob.address, tokenId, tokenUri)
    const signingKey = new ethers.utils.SigningKey(
        // bob private key
        '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a')
    const signedDigest = signingKey.signDigest(hash)
    signature = ethers.utils.joinSignature(signedDigest)

    await assertThrowsMessage(
        brokenJazz.connect(bob).claimToken(tokenId, tokenUri, signature),
        'Invalid signature')

  })

})
