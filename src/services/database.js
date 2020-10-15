const { connection, connectionCloud } = require('../database/index');
const userService = require('./user');
const truckService = require('./truck');
const positionService = require('./position');

class Cloud {
  static async getLocal() {
    try {
      await connection.authenticate();

      console.log('Database connection has been established successfully local.');

      const user = await userService.getAll();
      const truck = await truckService.getAll();
      const position = await positionService.getAll();
      return { user, truck, position };
    } catch (err) {
      console.log(`Unable to connect to the database: ${err}`);
    }
  }
  static async sendGlobal(user, truck, position) {
    try {
      await connectionCloud.authenticate();
      console.log('Database connection Cloud has been established successfully global. Enviar global');

      if (user) {
        const sendUser = await userService.send(user);
        await userService.modify(sendUser);
      }

      if (truck) {
        const truckUser = await truckService.send(truck);
        await truckService.modify(truckUser);
      }

      if (position) {
        const sendPosition = await positionService.send(position);
        await positionService.modify(sendPosition);
      }
    } catch (err) {
      console.log(`Unable to connect to the database: ${err}`);
    }
  }
}

module.exports = Cloud;