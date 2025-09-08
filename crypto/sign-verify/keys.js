const { generateKeyPairSync } = require("crypto");



const rsaKeys = () => {
    const result = generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'pkcs1', format: "pem"
        },
        privateKeyEncoding: {
            type: 'pkcs1', format: "pem"
        }
    })

    return {
        ...result
    }//{ publicKey:"",privateKey:""}
}

module.exports = rsaKeys;

