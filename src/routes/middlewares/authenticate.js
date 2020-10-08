const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const privateKey = fs.readFileSync(path.resolve(__dirname, '../../../secret.key.pem'));

const parseCookies = (req) => {
  var list = {},
    rc = req.headers.cookie;

  rc && rc.split(';').forEach(function (cookie) {
    var parts = cookie.split('=');
    list[parts.shift().trim()] = decodeURI(parts.join('='));
  });

  return list;
}

const auth = () => (req, res, next) => {
  const cookie = parseCookies(req);
  try {
    const verify = jwt.verify(cookie.token, privateKey, { algorithms: ['RS256'] });
    req.user = { 
      name: verify.name,
      username: verify.username,
      adm: verify.adm,
      sub: verify.sub
    }
    return next();
  } catch (error) {
    res.render('login.html', { validacao: [{ msg: 'O usuário não está logado no sistema!' }] });
  }
}

module.exports = auth;