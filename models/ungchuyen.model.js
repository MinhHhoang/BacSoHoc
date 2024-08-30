const { DataTypes } = require('sequelize');
const sequelize = require('./connection');

const UngChuyens = sequelize.define('UngChuyens', {
    name: {
        type: DataTypes.STRING 
    },
    tienung: {
        type: DataTypes.INTEGER 
    }
}); 
module.exports = UngChuyens;
