
const crypto = require("crypto");


const sign = ({ data, privateKey }) => {
    const signData = crypto.createSign("SHA256");
    signData.update(data)
    signData.end();
    const signature = signData.sign(privateKey, "base64")
    return signature
}
module.exports = sign