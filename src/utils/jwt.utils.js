const jwt = require('jsonwebtoken')
const config = require('config')

const privateKey = config.get('privateKey')
const publicKey = config.get('publicKey')

exports.signJWT = (object, options) => {
    return jwt.sign(object, privateKey, {
        ...(options && options),
        algorithm: "RS256"
    })
}

exports.verifyJWT = (token) => {
    try {
        const decoded = jwt.verify(token, publicKey);
        return {
            valid: true,
            expired: false,
            decoded
        }
    } catch (err) {
        return {
            valid: false,
            expired: err.message === 'jwt expired',
            decoded: null
        }
    }
}