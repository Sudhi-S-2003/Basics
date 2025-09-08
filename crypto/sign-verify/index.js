const rsaKeys = require("./keys");
const sign = require("./signData");
const verify = require("./verifyData");

class SignNVerify {
    constructor() {
        const { privateKey, publicKey } = rsaKeys();
        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }

    // Recursively sort object keys for deterministic JSON
    stableStringify(obj) {
        if (obj === null || typeof obj !== "object") {
            return JSON.stringify(obj);
        }

        if (Array.isArray(obj)) {
            return `[${obj.map(v => this.stableStringify(v)).join(",")}]`;
        }

        const keys = Object.keys(obj).sort();
        const keyValuePairs = keys.map(
            k => `${JSON.stringify(k)}:${this.stableStringify(obj[k])}`
        );
        return `{${keyValuePairs.join(",")}}`;
    }

    stringify(data) {
        if (typeof data === "string") return data;
        return this.stableStringify(data);
    }

    signData(data) {
        const normalized = this.stringify(data);
        return sign({ data: normalized, privateKey: this.privateKey });
    }

    verifyData(data, signature) {
        const normalized = this.stringify(data);
        return verify({ data: normalized, signature, publicKey: this.publicKey });
    }
}

// Example usage:
const signer = new SignNVerify();

const message1 = { message: "signing the data", nested: { b: 2, a: 1 } };
const message2 = { message: "signing the data", nested: { a: 2, b: 1 } };

const signature = signer.signData(message1);
console.log("Signature:", signature);

const isValid = signer.verifyData(message2, signature);
console.log("Is signature valid?", isValid);
