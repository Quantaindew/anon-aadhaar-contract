import { ethers } from "hardhat";

async function main() {
  const contractAddress = "0x238e5Fa0B3bE9f851AddbC6A3f92ac0566aB041a"; // Replace with your deployed contract address
  const relayerAddress = "0xdd459ecb07d084D86895019FC49A6DA9591F95c9"; // Your relayer address

  const GaslessAnonAadhaarCrud = await ethers.getContractFactory("GaslessAnonAadhaarCrud");
  const contract = GaslessAnonAadhaarCrud.attach(contractAddress);

  console.log("Adding relayer...");
  const tx = await contract.addRelayer(relayerAddress);
  await tx.wait();
  console.log(`Relayer ${relayerAddress} added successfully.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});