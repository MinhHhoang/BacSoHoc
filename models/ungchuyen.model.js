const { DataTypes } = require('sequelize');
const sequelize = require('./connection');

const UngChuyens = sequelize.define('UngChuyens', {
    name: {
        type: DataTypes.STRING 
    },
    tongtien: {
        type: DataTypes.INTEGER 
    },
    tienung: {
        type: DataTypes.INTEGER 
    },
    history: {
        type: DataTypes.STRING 
    },
}); 
module.exports = UngChuyens;
