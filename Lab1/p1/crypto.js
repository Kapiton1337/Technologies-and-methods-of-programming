const crypto = require("crypto");

const decrypt = (algorithm, key, iv, encryptedData) => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decryptedData = decipher.update(encryptedData, "hex", "utf-8");
    decryptedData += decipher.final("utf8");

    console.log("Decrypted message: " + decryptedData);
}

const algorithm = "aes-256-cbc";
const message = "verystrongpassword";


const key = Buffer.from('xNRxA48aNYd33PXaODSutRNFyCu4cAe/InKT/Rx+bw0=', 'base64');
const iv = Buffer.from('81dFxOpX7BPG1UpZQPcS6w==', 'base64');

const cipher = crypto.createCipheriv(algorithm, key, iv);
let encryptedData = cipher.update(message, "utf-8", "hex");
encryptedData += cipher.final("hex");

console.log("Encrypted message: " + encryptedData);

decrypt(algorithm, key, iv, "102fa5045eca86b46c2f511195af467ba64341535f69115a869867d2de15c1c4378919d9cb4e00267e0978c426cd2c4e1ead680ee0a48cb1f81e5a5b973b81cffdc3bde5fc206d8dc1509ae887ad481f9de40260b0ed63acfa95faf6c6a2fba3a1a0ba622539c6160236131ca893f491f6e5cd4eb07454b69c5418b976581713daa73591d20541ca140048b9788bd76282c9542ec744e84c83787607e047bb5f04c9090c65274a926514b7e8ca10d6ee");





