const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const User = require('../models/User');
const Position = require('../models/Position');
const Truck = require('../models/Truck');

const connection = new Sequelize(dbConfig);

User.init(connection);
Position.init(connection);
Truck.init(connection);

Position.associate(connection.models);

module.exports = connection;