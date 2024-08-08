//@ts-nocheck
import type { Request, Response } from "express";
import { generateProofService } from '../services/proofService.js';
import { ABI } from "../utils/contractABI.js";
import { ethers } from 'ethers';
import { data } from '../../sampledata.js'
import { writeFile } from 'fs/promises';
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export async function userController(req: Request, res: Response) {
    let { address, nullifierSeed, nullifier, timestamp, signal, revealArray, groth16Proof, nonce, signature, messageHash } = req.body;
    
    writeFile(
        join(__dirname, "./data.json"),
        JSON.stringify(req.body),
    );
    signal = BigInt(signal)
    nonce = BigInt(nonce)
    try {
        const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/e3200dad6bf545df8cd796f1d2dc1875`);
        
        const relayerPrivateKey = "53f5958e120b121e1b77591ae1276ca5f3d3922d250a5c4af85b94c2ec5da54f";
        if (!relayerPrivateKey) {
            throw new Error("Private keys not found in .env file");
        }
        console.log("A")
        const relayerWallet = new ethers.Wallet(relayerPrivateKey, provider);
        console.log("Relayer wallet address:", relayerWallet.address);

        const contractAddress = '0x238e5Fa0B3bE9f851AddbC6A3f92ac0566aB041a';
        const contract = new ethers.Contract(contractAddress, ABI, relayerWallet);

        console.log('Adding user gasless...');
        console.log({
            address,
          nullifierSeed,
          nullifier,
          timestamp,
          signal,
          revealArray,
          groth16Proof,
          nonce,
          signature,
          messageHash
        })
        const tx = await contract.addUserGasless(
          address,
          nullifierSeed,
          nullifier,
          timestamp,
          signal,
          revealArray,
          groth16Proof,
          nonce,
          signature
        );
        console.log('Transaction sent:', tx.hash);
        const receipt = await tx.wait();
        console.log('Transaction confirmed in block:', receipt.blockNumber);
  
        // Fetch and log user data
        const userData = await contract.getUserByAddress(address);
        res.json({user})
    } catch (error) {
        res.json({error})
    }
}