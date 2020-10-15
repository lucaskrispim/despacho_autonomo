const Truck = require('../models/Truck');
const TruckCloud = require('../models-cloud/Truck');

class TruckService {
  static async getAllTruck() {
    try {
      const truck = await Truck.findAll({ order: [['placa', 'ASC']] });
      return truck;
    } catch (error) {
      return error;
    }
  }
  static async createTruck(placa) {
    try {
      const truck = await Truck.findOne({ where: { "placa": placa } });
      if (!truck) {
        const truck = await Truck.create({ placa: placa, cloud: false });
        return truck;
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
        const truck = await Truck.findOne({ where: { "id": req.body.id } });
        return truck;
      } else {
        return { 'msg': 'Este caminhão não existe!' };
      }
    } catch (error) {
      return error;
    }
  }

  static async deleteTruck(placa) {
    try {
      const truck = await Truck.findOne({ where: { "placa": placa } });
      if (truck) {
        await Truck.destroy({ where: { "placa": placa } });
        const retorno = await Truck.findOne({ where: { "placa": placa } });
        if (!retorno) {
          return { 'msg': 'Caminhão removido!' };
        } else {
          return { 'msg': 'Caminhão não removido!' };
        }
      } else {
        return { 'msg': 'Este caminhão não existe!' };
      }
    } catch (error) {
      return error;
    }
  }


  static async getAll() {
    try {
      const truck = await Truck.findAll({ raw: true, where: { "cloud": false } });
      return truck;
    } catch (error) {
      return error;
    }
  }

  static async send(trucks) {
    try {
      const truck = await TruckCloud.bulkCreate(trucks);
      return truck;
    } catch (error) {
      return error;
    }
  }

  static async modify(trucks) {
    try {
      for (let i = 0; i < trucks.length; i++) {
        await Truck.update({ cloud: true }, { where: { "id": trucks[i].id } });
      }
    } catch (error) {
      return error;
    }
  }
}

module.exports = TruckService;