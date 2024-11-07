import crypto from 'crypto'

// take this from ENV

let algorithm = 'aes256' // or any other algorithm supported by OpenSSL
let key = 'THISISSOMEsupperstrongkey1234567' // or any key from .env
let iv = '3777e06a5ac2bec9'

export const encrypt = (text) => {
    let cipher = crypto.createCipheriv(algorithm, key, iv)
    let encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
    return encrypted
}

export const decrypt = (encrypted) => {
    if (encrypted) {
        let decipher = crypto.createDecipheriv(algorithm, key, iv)
        let decrypted =
            decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8')
        return decrypted
    }
}

export const encryptData = (obj) => {
    let keysToEncrypt = ['dob', 'gender', 'address', 'relationship']
    keysToEncrypt.forEach((element) => {
        if (obj[element]) {
            obj[element] = encrypt(obj[element])
        }
    })
    return obj
}

export const decryptData = (obj) => {
    let keysToEncrypt = ['dob', 'gender', 'address', 'relationship']
    keysToEncrypt.forEach((element) => {
        if (obj[element]) {
            obj[element] = decrypt(obj[element])
        }
    })
    return obj
}
