const express = require('express');
const router = express.Router();
const Position = require('../../models/Position');
const { checkSchema, validationResult } = require('express-validator');
const positionCreate = require('../schemas/positions');

router.post('/create', checkSchema(positionCreate),async (req,res)=>{
  try {
    
    validationResult(req).throw();
    const { placa, truck_id , latitude, longitude  } = req.body;
    const position = await Position.create({
      placa: placa,
      truck_id: truck_id,
      latitude: latitude,
      longitude: longitude,
    });
    return res.json(position);    
  } catch (err) {
    return res.status(400).json(err);
  }
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