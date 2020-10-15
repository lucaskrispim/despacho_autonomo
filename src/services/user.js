const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserCloud = require('../models-cloud/User');
const authService = require('./auth');

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

const sessionVerify = (req) => {
  const cookie = parseCookies(req);
  try {
    const verify = jwt.verify(cookie.token, privateKey, { algorithms: ['RS256'] });
    const token = authService.getToken({ 'name': verify.name, 'username': verify.username, 'id': verify.id });
    return { 'flag': true, 'name': verify.name, 'msg': 'OK!', 'token': token };
  } catch (error) {
    return { 'flag': false, 'name': 'ninguém', 'msg': 'A sessão foi encerrada! Token expirou 0!', 'token': ' ' };
  }
}


class UserService {
  static async verifyUser(req) {
    if (req.body.username && req.body.password) {
      try {
        const user = await User.findOne({ where: { "username": req.body.username } });
        if (user == null) {
          return { 'flag': false, 'name': 'ninguém', 'msg': 'Usuário inexistente!' }
        } else {
          if (bcrypt.hashSync(req.body.password, user.salt) === user.password) {
            const token = authService.getToken(user);
            return { 'flag': true, 'name': user.name, 'adm': user.adm, 'msg': 'OK!', 'token': token }
          } else {
            return { 'flag': false, 'name': 'ninguém', 'msg': 'Senha incorreta!' }
          }
        }
      } catch (err) {
        return { 'flag': false, 'name': 'ninguém', 'msg': 'Tente novamente mais tarde!' }
      }
    } else if (!req.body.username && req.body.password) {
      return { 'flag': false, 'name': 'ninguém', 'msg': 'O campo usuário deve ser preenchido!' }
    } else if (!req.body.password && req.body.username) {
      return { 'flag': false, 'name': 'ninguém', 'msg': 'O campo senha deve ser preenchido!' }
    } else if (!req.body.password && !req.body.username) {
      return { 'flag': false, 'name': 'ninguém', 'msg': 'O campo usuário e senha devem ser preenchidos!' }
    } else {
      if (sessionVerify(req).flag) {
        return sessionVerify(req);
      } else {
        return { 'flag': false, 'name': 'ninguém', 'msg': 'A sessão foi encerrada! Token expirou 1!', 'token': ' ' };
      }
    }
  }

  static async createUser(body) {
    try {
      const actor = await User.findOne({ where: { "username": body.username } });
      if (actor) {
        return { 'msg': 'Este username já está em uso na base de dados local!' };
      } else {
        const { name, username, password, email, adm } = body;
        const salt = bcrypt.genSaltSync(15);
        const pass = bcrypt.hashSync(password, salt)
        const user = await User.create({
          name: name,
          username: username,
          password: pass,
          salt: salt,
          email: email,
          adm: adm,
          cloud: false
        });
        return user;
      }

    } catch (err) {
      return err;
    }
  }

  static async modifyUser(body) {
    try {
      const actor = await User.findOne({ where: { "id": body.id } });
      if (actor) {
        const { name, username, password, email, adm } = body;
        const salt = bcrypt.genSaltSync(15);
        const pass = bcrypt.hashSync(password, salt)
        await User.update({
          name: name,
          username: username,
          password: pass,
          salt: salt,
          email: email,
          adm: adm === 'true' ? true : false,
        }, { where: { "id": body.id } });
        const user = await User.findOne({ where: { "id": body.id } });
        return user;
      } else {
        return { 'msg': 'Este usuário não existe!' };
      }
    } catch (err) {
      return err;
    }
  }

  static async getAll() {
    try {
      const user = await User.findAll({ raw: true, where: { "cloud": false } });
      return user;
    } catch (error) {
      return error;
    }
  }

  static async send(users) {
    try {
      const user = await UserCloud.bulkCreate(users);
      return user;
    } catch (error) {
      return error;
    }
  }

  static async modify(users) {
    try {
      for (let i = 0; i < users.length; i++) {
        await User.update({ cloud: true }, { where: { "id": users[i].id } });
      }
    } catch (error) {
      return error;
    }
  }

}

module.exports = UserService;