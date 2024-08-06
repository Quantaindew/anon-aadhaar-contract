import '@nomiclabs/hardhat-ethers'
import { ethers } from 'hardhat'
import { productionPublicKeyHash, testPublicKeyHash } from "@anon-aadhaar/core"
import * as dotenv from "dotenv";
dotenv.config();

// ... rest of your Hardhat config

let publicKeyHash = testPublicKeyHash
// To deploy contract with production UIDAI public key, will verify real Aadhaar
if (process.env.PRODUCTION_KEY === 'true') {
  console.log('Using production key...')
  publicKeyHash = productionPublicKeyHash
}

async function main() {
  const verifier = await ethers.deployContract('Verifier')
  await verifier.waitForDeployment()

  const _verifierAddress = await verifier.getAddress()

  console.log(`Verifier contract deployed to ${_verifierAddress}`)

  const anonAadhaar = await ethers.deployContract('AnonAadhaar', [
    _verifierAddress,
    publicKeyHash,
  ])

  await anonAadhaar.waitForDeployment()
  const _anonAadhaarAddress = await anonAadhaar.getAddress()

  console.log(`AnonAadhaar contract deployed to ${_anonAadhaarAddress}`)

  const anonAadhaarCrud = await ethers.deployContract('AnonAadhaarCrud',[
    _anonAadhaarAddress
])

  await anonAadhaarCrud.waitForDeployment()

  console.log(
    `AnonAadhaarCrud contract deployed to ${await anonAadhaarCrud.getAddress()}`,
  )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
