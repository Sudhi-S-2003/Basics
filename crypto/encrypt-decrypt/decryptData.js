const crypto = require("crypto");

const decrypt = ({ encryptedData, privateKey }) => {
    const decrypted = crypto.privateDecrypt(
        {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256"
        },
        Buffer.from(encryptedData, "base64")
    );

    return decrypted.toString("utf8");
};

module.exports = decrypt;
