const { DataTypes } = require('sequelize');
const sequelize = require('./connection');

const DanDes = sequelize.define('DanDes', {
    name: {
        type: DataTypes.STRING 
    },
    value: {
        type: DataTypes.STRING 
    },
    money: {
        type: DataTypes.INTEGER
    },
}); 
module.exports = DanDes;
