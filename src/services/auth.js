const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const privateKey = fs.readFileSync(path.resolve(__dirname, '../../secret.key.pem'));

const parseCookies = (req) => {
  var list = {},
    rc = req.headers.cookie;
  rc && rc.split(';').forEach(function (cookie) {
    var parts = cookie.split('=');
    list[parts.shift().trim()] = decodeURI(parts.join('='));
  });
  return list;
}

class token{
  static getToken(user){
    const payload = {
      name: user.name,
      username:user.username,
      adm: user.adm,
      id: user.id,
      flag:true,
      exp: Math.floor(Date.now() / 1000) + 60,
      iat: Math.floor(Date.now() / 1000),
    };
    return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
  }

  static decodeToken(req){
    try {
      const cookie = parseCookies(req);
      const verify = jwt.verify(cookie.token, privateKey, { algorithms: ['RS256'] });
      return verify;
    } catch (error) {
      return false;
    }
  }
}

module.exports = token;


