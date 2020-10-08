const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const privateKey = fs.readFileSync(path.resolve(__dirname, '../../secret.key.pem'));

class token{
  static getToken(user){
    const payload = {
      name: user.name,
      username:user.username,
      adm: user.adm,
      sub: user.id,
      exp: Math.floor(Date.now() / 1000) + 60,
      iat: Math.floor(Date.now() / 1000),
    };
    return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
  }

  static decodeToken(cookie){
    try {

      const verify = jwt.verify(cookie.token, privateKey, { algorithms: ['RS256'] });
      return verify;
    } catch (error) {
      return false;
    }
  }
}

module.exports = token;


