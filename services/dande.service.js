const DanDeModel = require('../models/dande.model');
const SettingModel = require('../models/setting.model');
const UngChuyenModel = require('../models/ungchuyen.model');
const cacheUtil = require('../utils/cache.util');
const moment = require("moment");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.create = (object) => {
  return DanDeModel.create(object);
}

exports.createUngTien = (object) => {
  return UngChuyenModel.create(object);
}

exports.update = (object, id) => {
  return DanDeModel.update(object, {
    where: { id: id },
  });
};



exports.updateUngTien = (object, id) => {
  return UngChuyenModel.update(object, {
    where: { id: id },
  });
};

exports.findByIdSetting = () => {
  return SettingModel.findByPk(1);
}


exports.updateSetting = (object) => {
  return SettingModel.update(object, {
    where: { id: 1 },
  });
};

exports.reset = () => {
  return DanDeModel.update(
    {
      money: 0
    },
    {
      where: {
        id: {
          [Op.gt]: 0  // this will update all the records 
        }                           // with an id from the list
      }
    }
  )
};


exports.resetUngChuyen = () => {
  return UngChuyenModel.update(
    {
      tienung: 0
    },
    {
      where: {
        id: {
          [Op.gt]: 0  // this will update all the records 
        }                           // with an id from the list
      }
    }
  )
};


exports.findById = (id) => {
  return DanDeModel.findByPk(id);
}

exports.findByIdValue = (value) => {
  return DanDeModel.findOne({
    where: {
      value: value
    }
  });
}

exports.findAll = () => {
  return DanDeModel.findAll({
    where: {
      [Op.and]: [
        { name: { [Op.ne]: null } }, // Exclude null
        { name: { [Op.ne]: '' } },   // Exclude empty string
        { name: { [Op.ne]: '_' } }   // Exclude "_"
      ]
    }
  });
};

exports.findAlls = () => {
  return DanDeModel.findAll();
};


exports.findAllUngChuyen = () => {
  return UngChuyenModel.findAll();
};


exports.delete = (id) => {
  return DanDeModel.destroy({ where: { id: id } });
};

exports.getTotal = () => {
  return DanDeModel.count();
};



