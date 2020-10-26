const Position = require('../models/Position');
const PositionCloud = require('../models-cloud/Position');
const Truck = require('../models/Truck');

class PositionService {
  static async getAll() {
    try {
      const position = await Position.findAll({ raw: true, where: { "cloud": false } });
      return position;
    } catch (error) {
      return error;
    }
  }

  static async getByTruck(placa) {
    try {
      const position = await Position.findAll({ raw: true, where: { "placa": placa } });
      return position;
    } catch (error) {
      return error;
    }
  }

  static async create(body) {
    try {
      const truck = await Truck.findOne({ where: { "placa": body.placa } });
      if (truck) {
        const { placa, latitude, longitude } = body;
        const position = await Position.create({
          placa: placa,
          truck_id: truck.id,
          latitude: latitude,
          longitude: longitude,
          cloud: false,
        });
        return position;
      } else {
        return { 'msg': 'Este caminhão não existe!' };
      }
    } catch (error) {
      return error;
    }

  }

  static async send(positions) {
    try {
      const position = await PositionCloud.bulkCreate(positions);
      return position;
    } catch (error) {
      return error;
    }
  }

  static async modify(positions) {
    try {
      for (let i = 0; i < positions.length; i++) {
        await Position.update({ cloud: true }, { where: { "id": positions[i].id } });
      }
    } catch (error) {
      return error;
    }
  }

}

module.exports = PositionService;