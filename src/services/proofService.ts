import { generateProof } from '../utils/anonAadhaar.js';

export async function generateProofService(qrCode: string, signal: string) {
  return await generateProof(qrCode, signal);
}