const DanDeService = require('../services/dande.service');
const jwtConfig = require('../config/jwt.config');
const bcryptUtil = require('../utils/bcrypt.util');
const jwtUtil = require('../utils/jwt.util');


exports.create = async (req, res) => {

    const object = {
        name : req.body.name,
        value: req.body.value,
        money: req.body.money,
    }

    let dan = await DanDeService.findByIdValue(object.value);

    if (dan) {
        const dande = await DanDeService.update({ ...dan, money: money + object.money }, dan.id);
        return res.json({
            data: dande,
            message: 'dàn đề đã có sẵn nên cập nhật số tiền thành công'
        });
    } else {
        const dande = await DanDeService.create(object);
        return res.json({
            data: dande,
            message: 'Tạo dàn đề thành công'
        });
    }



}



exports.getDanDes = async (req, res) => {

    var dandes = await DanDeService.findAll();

    return res.status(200).json({
        results: dandes.length,
        data: dandes,
        status: true
    });
}


exports.getStatic = async (req, res) => {

    var objects = await DanDeService.findAll();

    // Khởi tạo số tiền cho các số từ 00 đến 99
    const moneyDict = {};
    for (let i = 0; i < 100; i++) {
        const key = i.toString().padStart(2, '0');
        moneyDict[key] = 0;
    }

    // Cập nhật số tiền cho các số
    objects.forEach(obj => {
        const numbers = obj.value.split(', ').map(num => num.trim());
        const money = obj.money;
        numbers.forEach(number => {
            if (moneyDict[number] !== undefined) {
                moneyDict[number] += money;
            }
        });
    });

    // Thêm trường "bất thường" hoặc "bình thường"
    const result = {};
    for (const [number, totalMoney] of Object.entries(moneyDict)) {
        result[number] = {
            totalMoney,
            status: totalMoney > 3000 ? 'Vượt quá hạn mước' : 'Bình Thường'
        };
    }

    // Chuyển đổi đối tượng kết quả thành mảng để sắp xếp
    const sortedResult = Object.entries(result)
        .sort((a, b) => b[1].totalMoney - a[1].totalMoney) // Sắp xếp giảm dần theo totalMoney
        .reduce((acc, [number, value]) => {
            acc[number] = value;
            return acc;
        }, {});

    return res.status(200).json({
        data: sortedResult,
        status: true
    });
}



exports.update = async (req, res) => {

    const object = {
        money: req.body.money,
    }

    await DanDeService.update(object, req.params.id);

    dande = await DanDeService.findById(req.params.id);

    return res.json({
        data: dande,
        message: 'Cập nhật giá tiền thành công.',
        status: true
    });
}


exports.delete = async (req, res) => {
    await DanDeService.delete(req.params.id);
    return res.json({
        message: 'Xóa data thành công',
        status: true
    });
};

