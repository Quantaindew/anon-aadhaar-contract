import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const ABI = [
  {
    "inputs": [
      {"internalType": "uint256", "name": "nullifierSeed", "type": "uint256"},
      {"internalType": "uint256", "name": "nullifier", "type": "uint256"},
      {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
      {"internalType": "uint256", "name": "signal", "type": "uint256"},
      {"internalType": "uint256[4]", "name": "revealArray", "type": "uint256[4]"},
      {"internalType": "uint256[8]", "name": "groth16Proof", "type": "uint256[8]"}
    ],
    "name": "addUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

async function testAnonAadhaarIdentity() {
  // Connect to the Sepolia network
  const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.API_KEY_SEPOLIA}`);
  
  const privateKey = process.env.PRIVATE_KEY_SEPOLIA;
  if (!privateKey) {
    throw new Error("Private key not found in .env file");
  }
  
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log("Wallet address:", wallet.address);

  // AnonAadhaarIdentity contract address (replace with your deployed contract address)
  const contractAddress = '0xf5fE77ced0ee4161eEF33FE6ddc74845bbe2E3E5';

  const contract = new ethers.Contract(contractAddress, ABI, wallet);

  // Prepare function arguments from the proof
  const nullifierSeed = BigInt("2222129237572311700266988754174342439370752");
  const nullifier = BigInt("18921122615118886607460005819614190464319277142753282276813893310418044689932");
  const timestamp = BigInt("1720960200");
  const signal = BigInt(wallet.address); // Using wallet address as signal

  const revealArray = [
    BigInt("1"),    // ageAbove18
    BigInt("77"),   // gender (M)
    BigInt("403802"), // pincode
    BigInt("6385479") // state (Goa)
  ];

  const groth16Proof = [
    BigInt("4126157394648940230493934268069712303246460382886873032853611323752945188787"),
    BigInt("13791245721215052360676975874833577539363929649356374319076883795584639270491"),
    BigInt("4264506334716494234928827564852988656658234472324284333364106092082156316444"),
    BigInt("20756272696566420949542213976337549891625945809171929223262618276412845468206"),
    BigInt("215470804902566690693726755215612104402405291955783774192452879090580213539"),
    BigInt("11476332557213337140549130911964168899118048460715642600279536304665002315506"),
    BigInt("10437878242642680437908628720735207239660895246741430327971959814894782321248"),
    BigInt("1017985245463004469735446730648386659700397259245103984811902186796916491962")
  ];

  try {
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
    const receipt = await tx.wait();
    console.log('Transaction confirmed in block:', receipt.blockNumber);
  } catch (error) {
    console.error('Error:', error);
  }
}

testAnonAadhaarIdentity().catch(console.error);