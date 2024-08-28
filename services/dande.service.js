const DanDeModel = require('../models/dande.model');
const cacheUtil = require('../utils/cache.util');
const moment = require("moment");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.create = (object) => {
  return DanDeModel.create(object);
}

exports.update = (object, id) => {
  return DanDeModel.update(object, {
    where: { id: id },
  });
};


exports.findById = (id) => {
  return DanDeModel.findByPk(id);
}

exports.findByIdValue = (value) => {
  return DanDeModel.findOne({
    where : {
      value : value
    }
  });
}


exports.findAll = () => {
  const startOfDay = moment().startOf('day').toDate(); // Start of today
  const endOfDay = moment().endOf('day').toDate(); // End of today
  return DanDeModel.findAll({
    where: {
      createdAt: {
        [Op.between]: [startOfDay, endOfDay]
      }
    }
  });
};


exports.delete = (id) => {
  return DanDeModel.destroy({ where: { id: id } });
};

exports.getTotal = () => {
  return DanDeModel.count();
};



