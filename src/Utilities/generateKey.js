const jwt = require('jsonwebtoken');

const secret_key = process.env.SECRET_KEY;
const jwt_headers = {
                        algorithm : 'HS256',
                        expiresIn : 123459876
                    }

module.exports = function(email) {
    return jwt.sign(
        { email : email },
        secret_key,
        jwt_headers
    );
}