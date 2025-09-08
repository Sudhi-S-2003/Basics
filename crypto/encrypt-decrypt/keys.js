const { generateKeyPairSync } = require("crypto");

const rsaKeys = () => {
    const { publicKey, privateKey } = generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "pkcs1", format: "pem" },
        privateKeyEncoding: { type: "pkcs1", format: "pem" }
    });

    return { publicKey, privateKey };
};

module.exports = rsaKeys;
