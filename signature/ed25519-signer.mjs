// ed25519-signer.mjs
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

/**
 * Ed25519 JSON signer/verifier module
 *
 * Exports:
 *  - generateKeys(options)
 *  - sign(payload, options)
 *  - verify(payload, signature, options)
 *  - setKeyPaths({ privateKeyPath, publicKeyPath })
 *
 * Notes:
 *  - payload: object or JSON string (if string, must be valid JSON).
 *  - signature: base64 string as produced by sign().
 *  - Keys are expected in PEM format.
 */

// Default key file paths (next to this module file)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let PRIVATE_KEY_PATH = path.resolve(__dirname, 'private_key.pem');
let PUBLIC_KEY_PATH = path.resolve(__dirname, 'public_key.pem');

// Cached key contents to avoid repeated fs reads
let _cachedPrivateKey = null;
let _cachedPublicKey = null;

/**
 * Change key file paths used by sign/verify/generateKeys.
 * @param {{privateKeyPath?: string, publicKeyPath?: string}} paths
 */
export function setKeyPaths({ privateKeyPath, publicKeyPath } = {}) {
  if (privateKeyPath) PRIVATE_KEY_PATH = path.resolve(privateKeyPath);
  if (publicKeyPath) PUBLIC_KEY_PATH = path.resolve(publicKeyPath);
  _cachedPrivateKey = null;
  _cachedPublicKey = null;
}

/**
 * Deterministically canonicalize a JSON value by sorting object keys recursively.
 * Ensures consistent signing across runs.
 * @param {any} value
 * @returns {string} canonical JSON string
 */
function canonicalizeToString(value) {
  function canonicalize(v) {
    if (v === null) return null;
    if (Array.isArray(v)) return v.map(canonicalize);
    if (typeof v === 'object') {
      const keys = Object.keys(v).sort();
      const out = {};
      for (const k of keys) out[k] = canonicalize(v[k]);
      return out;
    }
    return v; // primitives
  }
  const canonical = canonicalize(value);
  return JSON.stringify(canonical);
}

/**
 * Load private key PEM from file (cached).
 * @returns {string} PEM private key
 */
function loadPrivateKey() {
  if (_cachedPrivateKey) return _cachedPrivateKey;
  const pem = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');
  _cachedPrivateKey = pem;
  return pem;
}

/**
 * Load public key PEM from file (cached).
 * @returns {string} PEM public key
 */
function loadPublicKey() {
  if (_cachedPublicKey) return _cachedPublicKey;
  const pem = fs.readFileSync(PUBLIC_KEY_PATH, 'utf8');
  _cachedPublicKey = pem;
  return pem;
}

/**
 * Generate Ed25519 key pair and save to files.
 *
 * @param {{ privateKeyPath?: string, publicKeyPath?: string, overwrite?: boolean }} options
 * @returns {{ privateKeyPath: string, publicKeyPath: string }}
 */
export function generateKeys(options = {}) {
  const { privateKeyPath = PRIVATE_KEY_PATH, publicKeyPath = PUBLIC_KEY_PATH, overwrite = false } = options;
  const privPath = path.resolve(privateKeyPath);
  const pubPath = path.resolve(publicKeyPath);

  if (!overwrite) {
    if (fs.existsSync(privPath) || fs.existsSync(pubPath)) {
      throw new Error(`Key files already exist. Use { overwrite: true } to replace them.`);
    }
  }

  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });

  fs.mkdirSync(path.dirname(privPath), { recursive: true });
  fs.mkdirSync(path.dirname(pubPath), { recursive: true });

  fs.writeFileSync(privPath, privateKey, { mode: 0o600 });
  fs.writeFileSync(pubPath, publicKey, { mode: 0o644 });

  PRIVATE_KEY_PATH = privPath;
  PUBLIC_KEY_PATH = pubPath;
  _cachedPrivateKey = null;
  _cachedPublicKey = null;

  return { privateKeyPath: privPath, publicKeyPath: pubPath };
}

/**
 * Sign a JSON payload (object or JSON string).
 * Returns base64-encoded signature.
 *
 * @param {object|string} payload
 * @param {{ privateKeyPath?: string }} options
 * @returns {string} base64 signature
 */
export function sign(payload, options = {}) {
  const { privateKeyPath } = options;
  if (privateKeyPath) setKeyPaths({ privateKeyPath });

  let jsonValue;
  if (typeof payload === 'string') {
    jsonValue = JSON.parse(payload);
  } else if (typeof payload === 'object' && payload !== null) {
    jsonValue = payload;
  } else {
    throw new TypeError('Payload must be an object or valid JSON string.');
  }

  const serialized = canonicalizeToString(jsonValue);
  const privateKeyPem = loadPrivateKey();

  const signature = crypto.sign(null, Buffer.from(serialized, 'utf8'), privateKeyPem);
  return signature.toString('base64');
}

/**
 * Verify a JSON payload and a base64 signature using the public key.
 *
 * @param {object|string} payload
 * @param {string} signatureBase64
 * @param {{ publicKeyPath?: string }} options
 * @returns {boolean}
 */
export function verify(payload, signatureBase64, options = {}) {
  const { publicKeyPath } = options;
  if (publicKeyPath) setKeyPaths({ publicKeyPath });

  let jsonValue;
  if (typeof payload === 'string') {
    jsonValue = JSON.parse(payload);
  } else if (typeof payload === 'object' && payload !== null) {
    jsonValue = payload;
  } else {
    throw new TypeError('Payload must be an object or valid JSON string.');
  }

  const serialized = canonicalizeToString(jsonValue);
  const publicKeyPem = loadPublicKey();
  const signature = Buffer.from(signatureBase64, 'base64');

  try {
    return crypto.verify(null, Buffer.from(serialized, 'utf8'), publicKeyPem, signature);
  } catch {
    return false;
  }
}

/* ======================
   Example usage (bottom)
   ====================== */
if (import.meta.url === pathToFileURL(process.argv[1]).href || process.env.ED25519_EXAMPLE === 'true') {
  (async () => {
    try {
      console.log('--- Ed25519 JSON Signer Example ---');

      // Generate keys if missing
      if (!fs.existsSync(PRIVATE_KEY_PATH) || !fs.existsSync(PUBLIC_KEY_PATH)) {
        console.log('Generating keypair...');
        const { privateKeyPath, publicKeyPath } = generateKeys({ overwrite: false });
        console.log(`Private key saved to: ${privateKeyPath}`);
        console.log(`Public key saved to:  ${publicKeyPath}`);
      } else {
        console.log(`Using existing keys:\n  private: ${PRIVATE_KEY_PATH}\n  public:  ${PUBLIC_KEY_PATH}`);
      }

      const payload = {
        user: 'alice',
        roles: ['admin', 'editor'],
        meta: {
          createdAt: new Date().toISOString(),
          nested: { a: 1, b: 2 }
        }
      };

      console.log('\nPayload:', payload);

      const signature = sign(payload);
      console.log('\nSignature (base64):', signature);

      const ok = verify(payload, signature);
      console.log('\nVerification result:', ok ? 'VALID ✅' : 'INVALID ❌');

      const tampered = { ...payload, user: 'bob' };
      const okTampered = verify(tampered, signature);
      console.log('\nVerification on tampered payload:', okTampered ? 'VALID ❌' : 'INVALID ✅');

      console.log('\n--- Example complete ---');
    } catch (err) {
      console.error('Example error:', err);
      process.exitCode = 1;
    }
  })();
}
