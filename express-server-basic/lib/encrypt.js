const crypto = require("crypto");

// 32-byte key (256 bits)
const key = crypto.randomBytes(32);

const iv = crypto.randomBytes(12); // GCM requires 12 bytes
const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

const plaintext = JSON.stringify({ name: "appu" });

const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final()
]);

const authTag = cipher.getAuthTag();

console.log({
    iv: iv.toString("hex"),
    key: key.toString("hex"),
    encrypted: encrypted.toString("hex"),
    tag: authTag.toString("hex"),
});

const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
decipher.setAuthTag(authTag)
const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final()
]);
console.log({
    decrypted: JSON.parse(decrypted.toString("utf8"))
})