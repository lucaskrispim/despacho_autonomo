const express = require('express');
const router = express.Router();
const userService = require('../../services/user');
const truckservice = require('../../services/truck');
const auth = require('../middlewares/authenticate');

router.get('/', async (req, res) => {
  res.render('login.html', { validacao: [] });
});

router.post('/logar', async (req, res) => {
  try {
    const verify = await userService.verifyUser(req);
    if (verify.flag) {
      const truck = await truckservice.getAllTruck();
      res.cookie('token',verify.token,{maxAge: 60000, httpOnly: true }).render('home.html', { name: verify.name, adm: verify.adm, truck: truck });
    } else {
      res.render('login.html', { validacao: [{ msg: verify.msg }] });
    }
  } catch (err) {
    res.cookie('token', '', {maxAge: 60000, httpOnly: true }).render('login.html', { validacao: [{ msg: 'Tente novamente mais tarde!' }] });
  }
});

router.post('/logout', auth(), async (req, res) => {
  try {
    res.cookie('token', '', {maxAge: 60000, httpOnly: true }).render('login.html', { validacao: [] });
  } catch (err) {
    res.cookie('token', '', {maxAge: 60000, httpOnly: true }).render('login.html', { validacao: [{ msg: 'Ocorreu algum problema, tente novamente mais tarde!' }] });
  }
});

module.exports = router;