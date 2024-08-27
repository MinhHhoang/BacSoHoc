const { DataTypes } = require('sequelize');
const sequelize = require('./connection');

const DanDes = sequelize.define('DanDes', {
    value: {
        type: DataTypes.STRING 
    },
    money: {
        type: DataTypes.INTEGER
    },
}); 
module.exports = DanDes;
