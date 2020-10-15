const Sequelize = require('sequelize');
const dbConfig = require('../config/database');
const dbConfigCloud = require('../config/database-cloud');

const User = require('../models/User');
const Position = require('../models/Position');
const Truck = require('../models/Truck');

const UserCloud = require('../models-cloud/User');
const PositionCloud = require('../models-cloud/Position');
const TruckCloud = require('../models-cloud/Truck');

const connection = new Sequelize(dbConfig);
const connectionCloud = new Sequelize(dbConfigCloud);

User.init(connection);
Position.init(connection);
Truck.init(connection);

UserCloud.init(connectionCloud);
PositionCloud.init(connectionCloud);
TruckCloud.init(connectionCloud);

Position.associate(connection.models);
PositionCloud.associate(connectionCloud.models);

(async () => {
  try {
    await connection.authenticate();
    // eslint-disable-next-line no-console
    console.log('Database connection has been established successfully.');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`Unable to connect to the database: ${err}`);
  }
})();

(async () => {
  try {
    await connectionCloud.authenticate();
    // eslint-disable-next-line no-console
    console.log('Database connection Cloud has been established successfully.');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`Unable to connect to the database: ${err}`);
  }
})();

module.exports = {connection,connectionCloud};