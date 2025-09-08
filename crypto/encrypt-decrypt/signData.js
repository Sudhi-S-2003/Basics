const crypto = require("crypto");

const sign = ({ data, privateKey }) => {
    const signData = crypto.createSign("SHA256");
    signData.update(data);
    signData.end();
    return signData.sign(privateKey, "base64");
};

module.exports = sign;
