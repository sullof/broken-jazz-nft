require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

let env = require('./env.json');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: '0.8.0',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      blockGasLimit: 10000000,
    },
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${env.goerliAlchemyKey}`,
      accounts: [env.privateKey]
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${env.mainnetAlchemyKey}`,
      accounts: [env.privateKey]
    }
  },
  etherscan: {
    apiKey: env.etherscanKey
  }
};

