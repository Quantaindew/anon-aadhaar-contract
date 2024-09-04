import { HardhatUserConfig,vars } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import "@nomicfoundation/hardhat-verify";
import "hardhat-gas-reporter";
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config('./.env')

const ETHERSCAN_API_KEY = vars.get("ETHERSCAN_API_KEY");
const POLYGONSCAN_API_KEY = vars.get("POLYGONSCAN_API_KEY");
const LINEASCAN_API_KEY = vars.get("LINEASCAN_API_KEY");

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      // This is date at which the test Aadhaar data was signed
      initialDate: '2019-03-08T05:13:20.000Z',
    },
    // sepolia: {
    //   url: `https://sepolia.infura.io/v3/${process.env.API_KEY_SEPOLIA}`,	
    //   accounts: [process.env.PRIVATE_KEY_SEPOLIA || ''],
    // },
    // amoy:{
    //   url: `https://polygon-amoy.infura.io/v3/${process.env.API_KEY_AMOY}`,
    //   accounts: [process.env.PRIVATE_KEY_AMOY || ''],
    // },
    // cardona: {
    //   url: `https://rpc.ankr.com/polygon_zkevm_cardona`,
    //   accounts: [process.env.PRIVATE_KEY_CARDONA || ''],
   
    // },
    // scrollSepolia: {
    //   url: `https://sepolia-rpc.scroll.io/`,
    //   accounts: [process.env.PRIVATE_KEY_SCROLL_SEPOLIA || ''],
    // },
    linea_sepolia: {
      url: `https://linea-sepolia.infura.io/v3/${process.env.API_KEY_LINEA_SEPOLIA}`,
      accounts: [process.env.PRIVATE_KEY_LINEA_SEPOLIA || ''],
    },
  },
  
  solidity: '0.8.20',
  paths: {
    sources: './src',
  },
  etherscan: {
    apiKey: { 
    //  amoy:POLYGONSCAN_API_KEY,
    linea_sepolia: LINEASCAN_API_KEY
  },
    customChains: [
      // {
      //   network: "amoy",
      //   chainId: 80002,
      //   urls: {
      //     apiURL: "https://api-amoy.polygonscan.com/api",
      //     browserURL: "https://amoy.polygonscan.com/"
      //   }
      // },
      {
        network: "linea_sepolia",
        chainId: 59141,
        urls: {
          apiURL: "https://api-sepolia.lineascan.build/api",
          browserURL: "https://sepolia.lineascan.build/address"
        }
      }
      
    ]
  },
  gasReporter: {
    enabled: (process.env.REPORT_GAS) ? true : false
  }
}


export default config
