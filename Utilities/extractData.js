const jwt = require('jsonwebtoken');

module.exports = function (token) {
    try{
        const secret_key = process.env.SECRET_KEY || "custom secret key";
        var Data = jwt.verify(token, secret_key);
        return Data.email;
    }
    catch(err) {
        console.log(`Error : ${err.message}`);
    }
}