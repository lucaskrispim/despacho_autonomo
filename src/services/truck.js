const Truck = require('../models/Truck');

class TruckService {
  static async getAllTruck() {
    try {
      const truck = await Truck.findAll({order: [['placa', 'ASC']]});
      return truck;
    } catch (error) {
      return error;
    }
  }
  static async createTruck(placa) {
    try {
      const truck = await Truck.findOne({ where: { "placa": placa } });
      if (!truck) {
        const newTruck = await Truck.create({ placa: placa });
        return newTruck;
      }
      return { 'msg': 'Este caminhão já existe!' };
    } catch (error) {
      return error;
    }
  }

  static async modifyTruck(req) {
    try {
      const truck = await Truck.findOne({ where: { "id": req.body.id } });
      if (truck) {
        await Truck.update({ placa: req.body.placa }, { where: { "id": req.body.id } });
        const retorno = await Truck.findOne({ where: { "id": req.body.id } });
        return retorno;
      }
    } catch (error) {
      return error;
    }
  }

  static async deleteTruck(placa) {
    try {
      const truck = await Truck.destroy({ where: { "placa": placa } });
      const retorno = await Truck.findOne({ where: { "placa": placa } });
      if (!retorno) {
        return { "deletado": true };
      }
      return { "deletado": false };
    } catch (error) {
      return error;
    }
  }
}

module.exports = TruckService;