const crypto = require("crypto");

const encrypt = ({ data, publicKey }) => {
    const bufferData = Buffer.from(
        typeof data === "string" ? data : JSON.stringify(data),
        "utf8"
    );

    const encrypted = crypto.publicEncrypt(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256"
        },
        bufferData
    );

    return encrypted.toString("base64");
};

module.exports = encrypt;
