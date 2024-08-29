const DanDeService = require('../services/dande.service');
const jwtConfig = require('../config/jwt.config');
const bcryptUtil = require('../utils/bcrypt.util');
const jwtUtil = require('../utils/jwt.util');


exports.create = async (req, res) => {

    

    const object = {
        name : req.body.name,
        value: req.body.value,
        money: Number(req.body.money),
    }

    console.log(object)

    let dan = await DanDeService.findByIdValue(object.value);

    if (dan) {
        const dande = await DanDeService.update({ ...dan, money: dan.money + object.money }, dan.id);
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


exports.reset = async (req, res) => {

    await DanDeService.reset();

    var dandes = await DanDeService.findAll();

    return res.status(200).json({
        results: dandes.length,
        data: dandes,
        status: true
    });
}


exports.getStatic = async (req, res) => {
    try {
        // Fetch data from DanDeService
        const objects = await DanDeService.findAll();

        const limitSetting = await DanDeService.findByIdSetting()

        // Initialize the money dictionary for numbers from 00 to 99
        const moneyDict = {};
        for (let i = 0; i < 100; i++) {
            const key = i.toString().padStart(2, '0');
            moneyDict[key] = 0;
        }

        // Update the money dictionary based on the fetched objects
        objects.forEach(obj => {
            const numbers = obj.value.split(', ').map(num => num.trim());
            const money = obj.money;
            numbers.forEach(number => {
                if (moneyDict[number] !== undefined) {
                    moneyDict[number] += money;
                }
            });
        });

        // Add "bất thường" or "bình thường" status
        const result = {};
        let sumTotalMoney = 0; // Initialize sumTotalMoney

        for (const [number, totalMoney] of Object.entries(moneyDict)) {
            const status = totalMoney > limitSetting.limit ? 'Vượt quá hạn mước' : 'Bình Thường';
            result[number] = {
                totalMoney,
                status
            };
            sumTotalMoney += totalMoney; // Accumulate total money
        }

        // Convert result object to array and sort by totalMoney in descending order
        const sortedResult = Object.entries(result)
            .sort((a, b) => b[1].totalMoney - a[1].totalMoney)
            .reduce((acc, [number, value]) => {
                acc[number] = value;
                return acc;
            }, {});

        // Return the response with sorted results and sumTotalMoney
        return res.status(200).json({
            limitSetting,
            data: sortedResult,
            sumTotalMoney, // Include sumTotalMoney in the response
            status: true
        });
    } catch (error) {
        // Handle errors and respond with appropriate status
        console.error('Error fetching or processing data:', error);
        return res.status(500).json({
            message: 'Internal Server Error',
            status: false
        });
    }
};




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


exports.updateSetting = async (req, res) => {
    const limitSetting = await DanDeService.findByIdSetting()

    await DanDeService.updateSetting({...limitSetting,limit : req.body.limit});

    return res.json({
        message: 'Cập nhật hạn mức thành công.',
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

