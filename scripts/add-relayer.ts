import { ethers } from "hardhat";

async function main() {
  const contractAddress = "0xf74b84a12742235e6A3b312A0DFeFF7fba5955ce"; // Your deployed contract address
  const relayerAddress = "0xdd459ecb07d084D86895019FC49A6DA9591F95c9"; // Your relayer address

  const GaslessAnonAadhaarCrud = await ethers.getContractFactory("GaslessAnonAadhaarCrud");
  const contract = GaslessAnonAadhaarCrud.attach(contractAddress);

  console.log("Checking if relayer is already authorized...");
  let isAuthorized = await contract.authorizedRelayers(relayerAddress);
  console.log(`Is relayer currently authorized? ${isAuthorized}`);

  if (!isAuthorized) {
    console.log("Adding relayer...");
    const tx = await contract.addRelayer(relayerAddress);
    await tx.wait();
    console.log(`Transaction hash: ${tx.hash}`);
    console.log("Relayer addition transaction completed.");

    // Check again if the relayer is now authorized
    isAuthorized = await contract.authorizedRelayers(relayerAddress);
    console.log(`Is relayer now authorized? ${isAuthorized}`);

    if (isAuthorized) {
      console.log(`Relayer ${relayerAddress} successfully added and authorized.`);
    } else {
      console.log(`Failed to authorize relayer ${relayerAddress}. Please check the contract's addRelayer function.`);
    }
  } else {
    console.log(`Relayer ${relayerAddress} is already authorized.`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});