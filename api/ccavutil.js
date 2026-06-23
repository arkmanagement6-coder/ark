const crypto = require('crypto');

/**
 * Encrypts cleartext parameters before sending them to CCAvenue.
 * Supports both standard AES-128-CBC and modern AES-256-GCM.
 */
exports.encrypt = function (plainText, workingKey, algorithm = 'aes-128-cbc') {
    if (!workingKey) {
        throw new Error('Working key is required for encryption');
    }

    if (algorithm === 'aes-256-gcm') {
        // AES-256-GCM Encryption
        const iv = crypto.randomBytes(12);
        // Ensure workingKey is standard buffer
        const keyBuffer = Buffer.isBuffer(workingKey) ? workingKey : Buffer.from(workingKey, 'utf8');
        const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, iv);

        const encrypted = Buffer.concat([
            cipher.update(plainText, 'utf8'),
            cipher.final()
        ]);

        const authTag = cipher.getAuthTag();
        return iv.toString('hex') + Buffer.concat([encrypted, authTag]).toString('hex');
    } else {
        // Standard CCAvenue AES-128-CBC Encryption
        const m = crypto.createHash('md5');
        m.update(workingKey);
        const key = m.digest('binary');
        const iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
        
        const cipher = crypto.createCipheriv(
            'aes-128-cbc', 
            Buffer.from(key, 'binary'), 
            Buffer.from(iv, 'binary')
        );
        let encoded = cipher.update(plainText, 'utf8', 'hex');
        encoded += cipher.final('hex');
        return encoded;
    }
};

/**
 * Decrypts encrypted text returned by CCAvenue.
 * Supports both standard AES-128-CBC and modern AES-256-GCM.
 */
exports.decrypt = function (encText, workingKey, algorithm = 'aes-128-cbc') {
    if (!workingKey) {
        throw new Error('Working key is required for decryption');
    }

    if (algorithm === 'aes-256-gcm') {
        // AES-256-GCM Decryption
        const encryptedBuffer = Buffer.from(encText, 'hex');
        const iv = encryptedBuffer.slice(0, 12);
        const authTag = encryptedBuffer.slice(-16);
        const ciphertext = encryptedBuffer.slice(12, -16);

        const keyBuffer = Buffer.isBuffer(workingKey) ? workingKey : Buffer.from(workingKey, 'utf8');
        const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv);
        decipher.setAuthTag(authTag);

        const decrypted = Buffer.concat([
            decipher.update(ciphertext),
            decipher.final()
        ]);
        return decrypted.toString('utf8');
    } else {
        // Standard CCAvenue AES-128-CBC Decryption
        const m = crypto.createHash('md5');
        m.update(workingKey);
        const key = m.digest('binary');
        const iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
        
        const decipher = crypto.createDecipheriv(
            'aes-128-cbc', 
            Buffer.from(key, 'binary'), 
            Buffer.from(iv, 'binary')
        );
        let decoded = decipher.update(encText, 'hex', 'utf8');
        decoded += decipher.final('utf8');
        return decoded;
    }
};
