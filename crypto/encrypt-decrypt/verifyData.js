const crypto = require("crypto");

const verify = ({ data, signature, publicKey }) => {
    const verifyData = crypto.createVerify("SHA256");
    verifyData.update(data);
    verifyData.end();
    return verifyData.verify(publicKey, signature, "base64");
};

module.exports = verify;
