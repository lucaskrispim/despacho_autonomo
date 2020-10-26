const authService = require('../../services/auth');

const auth = () => (req, res, next) => {
  try {
    const verify = authService.decodeToken(req);
    if (verify) {
      req.user = {
        name: verify.name,
        username: verify.username,
        adm: verify.adm,
        id: verify.id
      }
      return next();
    } else {
      res.cookie('token', '', { maxAge: 1, httpOnly: true }).render('login.html', { validacao: [{ msg: 'O usuário não está logado no sistema!' }] });
    }
  } catch (error) {
    res.cookie('token', '', { maxAge: 1, httpOnly: true }).render('login.html', { validacao: [{ msg: 'O usuário não está logado no sistema!' }] });
  }
}

module.exports = auth;