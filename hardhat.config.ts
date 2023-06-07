import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-waffle"
import "@openzeppelin/hardhat-upgrades"
import "@typechain/hardhat"
import "dotenv/config"
import "hardhat-contract-sizer"
import "hardhat-dependency-compiler"
import "hardhat-deploy"
import "hardhat-gas-reporter"
import "solidity-coverage";
import "@nomiclabs/hardhat-etherscan"


const config: any = {
  solidity: {
    compilers: [
      {
        version: '0.8.7',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1,
          },
          // for smock to mock contracts
            outputSelection: {
                "*": {
                    "*": ["storageLayout"],
                },
            },
        },
      },
       {
        version: '0.8.12',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1,
          },
          // for smock to mock contracts
            outputSelection: {
                "*": {
                    "*": ["storageLayout"],
                },
            },
        },
      },
      {
        version: "0.6.12",
        settings: {
            optimizer: { enabled: true, runs: 1 },
            // for smock to mock contracts
            outputSelection: {
                "*": {
                    "*": ["storageLayout"],
                },
            },
        }
      }
    ]
  },
    networks: {
        ftm_testnet: {
            url: "https://xapi.testnet.fantom.network/lachesis",
            chainId: 4002,
            accounts: [process.env.PRIVATE_KEY],
            saveDeployments: true,
            gasPrice: 20 * 1e9,
            gas: 31000000,
            allowUnlimitedContractSize: true
        },
        avax_testnet: {
            url: "https://api.avax-test.network/ext/bc/C/rpc",
            chainId: 43113,
            accounts: [process.env.PRIVATE_KEY],
            saveDeployments: true,
            gasPrice: 30 * 1e9,
            gas: 31000000,
            allowUnlimitedContractSize: true
        },
         fuse_testnet: {
            url: "https://rpc.fusespark.io",
            chainId: 123,
            accounts: [process.env.PRIVATE_KEY],
            saveDeployments: true,
            gasPrice: 30 * 1e9,
            gas: 31000000,
            allowUnlimitedContractSize: true
        },
        base_testnet: {
            url: "https://goerli.base.org",
            chainId: 84531,
            accounts: [process.env.PRIVATE_KEY],
            saveDeployments: true,
            gasPrice: 1.500009 * 1e8,
            gas: 310000,
            allowUnlimitedContractSize: true
        },
    },
    namedAccounts: {
        deployer: 0,
    }, 
    contractSizer: {
        alphaSort: true,
        runOnCompile: true,
        disambiguatePaths: false,
    },
    gasReporter: {
        currency: "USD",
        gasPrice: 200,
    },
    etherscan: {
      apiKey: process.env['ETHERSCAN_API_KEY']
   },
     
}

export default config
