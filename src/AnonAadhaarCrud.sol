import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

// ABI for the AnonAadhaarCrud contract
const abi = [
  {
    "inputs": [
      {"internalType": "uint256","name": "nullifierSeed","type": "uint256"},
      {"internalType": "uint256","name": "nullifier","type": "uint256"},
      {"internalType": "uint256","name": "timestamp","type": "uint256"},
      {"internalType": "uint256","name": "signal","type": "uint256"},
      {"internalType": "uint256[4]","name": "revealArray","type": "uint256[4]"},
      {"internalType": "uint256[8]","name": "groth16Proof","type": "uint256[8]"}
    ],
    "name": "addUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address","name": "userAddress","type": "address"}
    ],
    "name": "getUser",
    "outputs": [
      {"internalType": "uint256","name": "nullifierSeed","type": "uint256"},
      {"internalType": "uint256","name": "nullifier","type": "uint256"},
      {"internalType": "uint256[4]","name": "revealedData","type": "uint256[4]"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

async function testAnonAadhaarCrud() {
  // Connect to the Sepolia network
  const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.API_KEY_SEPOLIA}`);
  
  // Use PRIVATE_KEY for the user adding operation
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("Private key not found in .env file");
  }
  
  const wallet = new ethers.Wallet(privateKey, provider);

  // Contract address
  const contractAddress = '0x16D257023bbf2143c685f7d3f7B93cf41F095e81';

  // Create contract instance
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  // Prepare function arguments
  const nullifierSeed = BigInt("2222129237572311700266988754174342439370752");
  const nullifier = BigInt("18921122615118886607460005819614190464319277142753282276813893310418044689932");
  const timestamp = BigInt("1720960200");
  
  // Convert wallet address to uint256
  const signal = BigInt(wallet.address);
  
  const revealArray = [
    BigInt("1"),
    BigInt("77"),
    BigInt("6385479"),
    BigInt("403802")
  ];
  const groth16Proof = [
    BigInt("5685740272241148077772843343760220458247762156602772723680761549787802526960"),
    BigInt("15330450115754031753034294039109243478246883123647381999065567213238775150049"),
    BigInt("1658822895756746037953443445236719793738461984853701394686345798949958723352"),
    BigInt("12924897239434431346023841807467029115709423074550881654374735402874771112471"),
    BigInt("3764365561449097092855532434250005082427282317633687803620362591563685438043"),
    BigInt("15603316453399762370259183437960965411939990376582010749955338427419801867409"),
    BigInt("3526722885012300092463366167718264821777666653524431047254939239696091508247"),
    BigInt("4137642798681289084551788599687219313422535965807409228229202214745029867133")
  ];

  try {
    // Call the addUser function
    console.log('Adding user...');
    const tx = await contract.addUser(
      nullifierSeed,
      nullifier,
      timestamp,
      signal,
      revealArray,
      groth16Proof
    );

    console.log('Transaction sent:', tx.hash);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log('Transaction confirmed in block:', receipt.blockNumber);

    // Get user information
    console.log('Getting user information...');
    const userInfo = await contract.getUser(wallet.address);
    
    console.log('User Information:');
    console.log('Nullifier Seed:', userInfo[0].toString());
    console.log('Nullifier:', userInfo[1].toString());
    console.log('Revealed Data:', userInfo[2].map(x => x.toString()));

  } catch (error) {
    console.error('Error:', error);
  }
}

testAnonAadhaarCrud().catch(console.error);