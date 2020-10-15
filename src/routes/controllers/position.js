const express = require('express');
const router = express.Router();
const { checkSchema, validationResult } = require('express-validator');
const PositionService = require('../../services/position');
const positionCreate = require('../schemas/positions');

router.post('/create', checkSchema(positionCreate),async (req,res)=>{
  let response = null;
  try {
    validationResult(req).throw();
    response = await PositionService.create(req.body);
  } catch (err) {
    return res.status(400).json(err);
  }
  return res.status(200).json(response);
});

/*
router.put('/modify', async (req,res)=>{
  try {
    
  } catch (err) {
    
  }
});

router.delete('/delete', async (req,res)=>{
  try {
    
  } catch (err) {
    
  }
});

router.get('/list', async (req,res)=>{
  try {
    
  } catch (err) {
    
  }
});
*/

module.exports = router;