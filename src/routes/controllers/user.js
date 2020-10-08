const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authenticate');
const userService = require('../../services/user');
const { checkSchema, validationResult } = require('express-validator');
const { userCreate } = require('../schemas/user');

router.post('/create', checkSchema(userCreate), async (req, res) => {
  let response = null;
  try {
    validationResult(req).throw();
    response = await userService.createUser(req.body);
  } catch (error) {
    res.status(400).json(error);
  }
  
  return res.status(200).json(response);
});

router.put('/modify', async (req, res) => {
  let response = null;
  try {
    response = await userService.modifyUser(req.body);
  } catch (error) {
    res.status(400).json(error);
  }
  return res.status(200).json(response);
});

module.exports = router;