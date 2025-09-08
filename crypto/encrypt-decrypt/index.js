const rsaKeys = require("./keys");
const sign = require("./signData");
const verify = require("./verifyData");
const encrypt = require("./encryptData");
const decrypt = require("./decryptData");

class SignEncryptUtil {
    constructor() {
        const { privateKey, publicKey } = rsaKeys();
        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }

    // Signing
    signData(data) {
        const normalized = typeof data === "string" ? data : JSON.stringify(data);
        return sign({ data: normalized, privateKey: this.privateKey });
    }

    verifyData(data, signature) {
        const normalized = typeof data === "string" ? data : JSON.stringify(data);
        return verify({ data: normalized, signature, publicKey: this.publicKey });
    }

    // Encryption
    encryptData(data) {
        return encrypt({ data, publicKey: this.publicKey });
    }

    decryptData(encryptedData) {
        return decrypt({ encryptedData, privateKey: this.privateKey });
    }
}

// Example usage
const util = new SignEncryptUtil();

const message = { msg: "secret message" };

// --- SIGNATURE ---
const signature = util.signData(message);
console.log("Signature:", signature);
console.log("Valid signature?", util.verifyData(message, signature));

// --- ENCRYPTION ---
const encrypted = util.encryptData(message);
console.log("Encrypted:", encrypted);

const decrypted = util.decryptData(encrypted);
console.log("Decrypted:", decrypted);
