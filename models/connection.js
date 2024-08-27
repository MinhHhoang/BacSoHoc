const { Sequelize } = require('sequelize');
const config = require('../config/database.config'); 

const sequelize = new Sequelize(config.uri)

module.exports = sequelize