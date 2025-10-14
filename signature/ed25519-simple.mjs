// ed25519-simple.mjs
import crypto from "crypto";
import { pathToFileURL } from "url";

/**
 * Generate an Ed25519 public/private key pair (in-memory)
 * @returns {{ publicKey: string, privateKey: string }}
 */
export function generateKeys() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519", {
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
  return { publicKey, privateKey };
}

/**
 * Sign a JSON payload using Ed25519
 * @param {object} payload - JSON payload to sign
 * @param {string} privateKey - PEM-encoded private key
 * @returns {string} base64 signature
 */
export function sign(payload, privateKey) {
  const json = JSON.stringify(payload);
  const signature = crypto.sign(null, Buffer.from(json, "utf8"), privateKey);
  return signature.toString("base64");
}

/**
 * Verify a JSON payload and its signature
 * @param {object} payload - JSON payload
 * @param {string} signature - base64 signature
 * @param {string} publicKey - PEM-encoded public key
 * @returns {boolean}
 */
export function verify(payload, signature, publicKey) {
  const json = JSON.stringify(payload);
  return crypto.verify(
    null,
    Buffer.from(json, "utf8"),
    publicKey,
    Buffer.from(signature, "base64")
  );
}

/* ---------- Example usage ---------- */
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { publicKey, privateKey } = generateKeys();

  const payload = { user: "alice", role: "admin" };

  console.log("Payload:", payload);

  const signature = sign(payload, privateKey);
  console.log("\nSignature (base64):", signature);

  const valid = verify(payload, signature, publicKey);
  console.log("\nVerification result:", valid ? "VALID ✅" : "INVALID ❌");

  // Example of tampered data
  const tampered = { user: "Alice", role: "admin" };
  const validTampered = verify(tampered, signature, publicKey);
  console.log(
    "Tampered verification:",
    validTampered ? "VALID ❌" : "INVALID ✅"
  );
}
