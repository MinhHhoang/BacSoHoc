const { DataTypes } = require('sequelize');
const sequelize = require('./connection');

const Settings = sequelize.define('Settings', {
    limit: {
        type: DataTypes.INTEGER 
    },
}); 
module.exports = Settings;
