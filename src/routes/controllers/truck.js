const express = require('express');
const router = express.Router();
const truckService = require('../../services/truck');
const positionService = require('../../services/position');
const { checkSchema, validationResult } = require('express-validator');
const { truckCreate, truckModify } = require('../schemas/truck');
const authService = require('../../services/auth');
const auth = require('../middlewares/authenticate');

router.post('/create', checkSchema(truckCreate), async (req, res) => {
  let response = null;
  try {
    validationResult(req).throw();
    response = await truckService.createTruck(req.body.placa);
  } catch (error) {
    return res.status(400).json(error);
  }
  return res.status(200).json(response);
});

router.get('/get', async (req, res) => {
  let response = null;
  try {
    response = await truckService.getAllTruck();
  } catch (error) {
    return res.status(400).json(error);
  }
  return res.status(200).json(response);
});

router.put('/modify', checkSchema(truckModify), async (req, res) => {
  let response = null;
  try {
    validationResult(req).throw();
    response = await truckService.modifyTruck(req);
  } catch (error) {
    return res.status(400).json(error);
  }
  return res.status(200).json(response);
});

router.delete('/delete', checkSchema(truckCreate), async (req, res) => {
  let response = null;
  try {
    validationResult(req).throw();
    response = await truckService.deleteTruck(req.body.placa);
  } catch (error) {
    return res.status(400).json(error);
  }
  return res.status(200).json(response);
});

router.post('/', auth(), async (req, res) => {
  try {
    const trucks = await truckService.getAllTruck();
    const token = authService.getToken(req.user);
    const positions = await positionService.getByTruck(req.body.truck);
    res.cookie('token', token, { maxAge: 60000, httpOnly: true }).render('truck.html', { name: req.user.name, adm: req.user.adm, trucks: trucks, truck: req.body.truck });
  } catch (err) {
    res.cookie('token', '', { maxAge: 60000, httpOnly: true }).render('login.html', { validacao: [{ msg: 'Ocorreu algum problema, tente novamente mais tarde!' }] });
  }
});

router.post('/home', auth(), async (req, res) => {
  try {
    const truck = await truckService.getAllTruck();
    const token = authService.getToken(req.user);
    res.cookie('token', token, { maxAge: 60000, httpOnly: true }).render('home.html', { name: req.user.name, adm: req.user.adm, truck: truck });
  } catch (err) {
    res.render('login.html', { validacao: [{ msg: 'Ocorreu algum problema, tente novamente mais tarde!' }] });
  }
});

router.post('/monitor', auth(), async (req, res) => {
  try {
    const token = authService.getToken(req.user);
    res.cookie('token', token, { maxAge: 60000, httpOnly: true }).render('monitor.html', { name: req.user.name, truck: req.body.truck });
  } catch (err) {
    res.render('login.html', { validacao: [{ msg: 'Ocorreu algum problema, tente novamente mais tarde!' }] });
  }
});

module.exports = router;