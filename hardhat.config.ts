import { HardhatUserConfig,vars } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import "@nomicfoundation/hardhat-verify";
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config('./.env')

const ETHERSCAN_API_KEY = vars.get("ETHERSCAN_API_KEY");

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      // This is date at which the test Aadhaar data was signed
      initialDate: '2019-03-08T05:13:20.000Z',
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.API_KEY_SEPOLIA}`,	
      accounts: [process.env.PRIVATE_KEY_SEPOLIA || ''],
    },
    // scrollSepolia: {
    //   url: `https://sepolia-rpc.scroll.io/`,
    //   accounts: [process.env.PRIVATE_KEY_SCROLL_SEPOLIA || ''],
    // },
  },
  solidity: '0.8.20',
  paths: {
    sources: './src',
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
}

export default config
