import {
  init,
  prove,
  artifactUrls,
  ArtifactsOrigin,
  generateArgs,
} from "@anon-aadhaar/core";
import type { InitArgs } from "@anon-aadhaar/core";
import { certificate } from "./utils/certificate.js";
import { qrCode } from "./utils/qr-code.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { promises as fs } from "fs"; // Import fs module

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const artifactsDirName = join(__dirname, "../public");

const anonAadhaarInitArgs: InitArgs = {
  wasmURL: join(artifactsDirName, "aadhaar-verifier.wasm"),
  zkeyURL: join(artifactsDirName, "circuit_final.zkey"),
  vkeyURL: join(artifactsDirName, "vkey.json"),
  artifactsOrigin: ArtifactsOrigin.local,
};

async function joe() {
  try {
    console.log(
      "Initializing the core package with arguments:",
      anonAadhaarInitArgs,
    );
    await init(anonAadhaarInitArgs);
    console.log("Initialization successful");

    const nullifierSeed = 1234;
    console.log("Using nullifier seed:", nullifierSeed);

    // QR code data as a string from qr png named download.png
    const qrData = qrCode;
    console.log("QR code data:", qrData);

    // certificate: x509 certificate containing the public key
    // it can be downloaded from: https://www.uidai.gov.in/en/916-developer-section/data-and-downloads-section/11349-uidai-certificate-details.html
    console.log("Using certificate file:", certificate);

    const args = await generateArgs({
      qrData,
      certificateFile: certificate,
      signal: "1234532454678",
      nullifierSeed,
      fieldsToRevealArray: [
        "revealAgeAbove18",
        "revealGender",
        "revealPinCode",
        "revealState",
      ],
    });
    console.log("Arguments generated for proof:", args);

    const anonAadhaarCore = await prove(args);
    console.log("Proof generated successfully:", anonAadhaarCore);

   // Write the anonAadhaarCore to a JSON file
   await fs.writeFile("anonaadhaar.json", JSON.stringify(anonAadhaarCore, null, 2));
  console.log("anonAadhaarCore written to anonaadhaar.json");

    return anonAadhaarCore;
  } catch (error) {
    console.error("An error occurred:", error);
    return error;
  }
}

joe();