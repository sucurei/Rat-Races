const jwt = require('jsonwebtoken');

const JWT_SECRET = 'MY_LITTLE_JWT_SECRET'
const JWT_ALGORITHM = 'HS256'
const JWT_EXPIRES_IN = 60 * 60 * 10 // 10h

class JWTController {
    
    static getTokenWithPayload = (payload, expireDuration = JWT_EXPIRES_IN) => {
        return jwt.sign(payload, JWT_SECRET, {expiresIn: expireDuration, algorithm : JWT_ALGORITHM})
    }
   
    static validToken = (token, secret = JWT_SECRET) => {
        try {
            jwt.verify(token, secret);
            return true;
        }
        catch (err) {
            if (err) return false;
        }
    }
    static extractPayloadFromToken = (token, secret = JWT_SECRET) => {
        if (false === JWTController.validToken(token, secret))
            return null;
        return jwt.verify(token, secret)
    }


    static authTokenValid(req, res) {
        let token = req.headers['x-auth-token'] || req.headers['cookie'].split("=")[1];
        if (!token) {
            res.end('logheazate saracu-le')
            return false
        }
        if (false === JWTController.validToken(token)) {
            res.end('Token invalid')
            return false
        }
        return true
    }
    static getAuthToken(req) {
        let token = req.headers['x-auth-token'];
        return JWTController.extractPayloadFromToken(token);
    }
}

module.exports = JWTController