const jwt = require('jsonwebtoken');

const JWT_SECRET = 'MY_LITTLE_JWT_SECRET'
const JWT_ALGORITHM = 'HS256'
const JWT_EXPIRES_IN = 60 * 60 * 10 // 10h

class JWTHelper {
    /**
     * (works - tested)
     * @param {String} payload the stringifyed object to be attached as payload to the JWT token
     * @param {Number} expireDuration expirationDuration in seconds
     * @returns {Object} the JWT token
     */
    static GetTokenFromPayload = (payload, expireDuration = JWT_EXPIRES_IN) => {
        return jwt.sign(payload, JWT_SECRET, {expiresIn: expireDuration, algorithm : JWT_ALGORITHM})
    }
    /**
     * (works - tested)
     * Returns true/false whether the token is valid or not
     * @param token
     * @param secret the secret used to verify the token
     * @returns {Boolean} true if token is valid, false otherwise
     */
    static IsValidToken = (token, secret = JWT_SECRET) => {
        try {
            jwt.verify(token, secret);
            return true;
        }
        catch (err) {
            if (err) return false;
        }
    }
    static GetPayloadFromToken = (token, secret = JWT_SECRET) => {
        if (false === JWTHelper.IsValidToken(token, secret))
            return null;
        return jwt.verify(token, secret)
    }

    /**
     * Middleware for validating the JWT Auth Token
     * @param {IncomingMessage} req server incoming request
     * @param {ServerResponse} res server response for given request
     * @return {boolean} True if JWT Auth Token is present and valid, false otherwise
     */
    static MiddlewareAuthTokenValidation(req, res) {
        let token = req.headers['x-auth-token'] || req.headers['cookie'].split("=")[1];
        if (!token) {
            res.end('logheazate saracu-le')
            return false
        }
        if (false === JWTHelper.IsValidToken(token)) {
            res.end('Token invalid')
            return false
        }
        return true
    }
    static GetAuthTokenPayload(req) {
        let token = req.headers['x-auth-token'];
        return JWTHelper.GetPayloadFromToken(token);
    }
}

module.exports = JWTHelper