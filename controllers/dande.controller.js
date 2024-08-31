const DanDeService = require('../services/dande.service');


exports.create = async (req, res) => {

    const object = {
        name : req.body.name,
        value: req.body.value,
        money: Number(req.body.money),
    }


    let dan = await DanDeService.findByIdValue(object.value);

    if (dan) {

        const totalMoney = Number(req.body.money) + dan.money;

        const dande = await DanDeService.update({...object,money : totalMoney }, dan.id);
        return res.json({
            data: dande,
            message: 'Bổ sung tiền dàn đề thành công'
        });
    } 

    const dande = await DanDeService.create(object);
    return res.json({
        data: dande,
        message: 'Tạo dàn đề thành công'
    });



}


// exports.createChuyen = async (req, res) => {

    

//     for (let i = 0; i < 100; i++) {
//         const key = i.toString().padStart(2, '0');
//         await DanDeService.createUngTien({name : key, tienung: 0})
//     }



// }



exports.getDanDes = async (req, res) => {

    var dandes = await DanDeService.findAll();

    return res.status(200).json({
        results: dandes.length,
        data: dandes,
        status: true
    });
}


exports.reset = async (req, res) => {
    try {
        // Execute both asynchronous operations concurrently
        await Promise.all([
            DanDeService.reset(),
            DanDeService.resetUngChuyen()
        ]);

        // Fetch the data after the resets are complete
        const dandes = await DanDeService.findAll();

        // Send the successful response
        return res.status(200).json({
            results: dandes.length,
            data: dandes,
            status: true
        });
    } catch (error) {
        // Handle any errors that occur during the async operations
        console.error('Error occurred during reset:', error);
        return res.status(500).json({
            status: false,
            message: 'An error occurred during the reset operation'
        });
    }
}


exports.getStatic = async (req, res) => {
    try {
        // Fetch data from DanDeService
        const [objects, limitSetting, ungchuyens] = await Promise.all([
            DanDeService.findAll(),
            DanDeService.findByIdSetting(),
            DanDeService.findAllUngChuyen()
        ]);

        
        
        // Initialize the money dictionary for numbers from 00 to 99
        const moneyDict = Array.from({ length: 100 }, (_, i) => ({
            key: i.toString().padStart(2, '0'),
            totalMoney: 0,
            tienung: 0,
            idtienung: 0
        }));
        
        // Update moneyDict with tienung values from ungchuyens
        ungchuyens.forEach(({ name, tienung, id }) => {
            const index = moneyDict.findIndex(item => item.key === name);
            if (index !== -1) {
                moneyDict[index].tienung = tienung;
                moneyDict[index].idtienung = id;
            }
        });
        

        // Update the money dictionary based on the fetched objects
        objects.forEach(obj => {
            const numbers = obj.value.split(',').map(num => num.trim());
            const money = obj.money;
            numbers.forEach(number => {
                const dictEntry = moneyDict.find(entry => entry.key === number);
                if (dictEntry) {
                    dictEntry.totalMoney += money;
                }
            });
        });

        // Convert the moneyDict array to an object and process status
        const result = moneyDict.reduce((acc, { key, totalMoney, tienung, idtienung }) => {
            const status = totalMoney - tienung > limitSetting.limit ? 'Vượt quá hạn mước' : 'Bình Thường';
            const total = totalMoney - tienung;
            acc[key] = {
                idtienung,
                totalMoney,
                tienung,
                total,
                status
            };
            return acc;
        }, {});

        // Convert result object to array and sort by totalMoney in descending order
        const sortedResult = Object.entries(result)
            .sort(([, a], [, b]) => b.totalMoney - a.totalMoney)
            .reduce((acc, [number, value]) => {
                acc[number] = value;
                return acc;
            }, {});

        // Calculate sumTotalMoney
        const sumTotalMoney = Object.values(result)
            .reduce((sum, { totalMoney }) => sum + totalMoney, 0);

            // Calculate sumTotalMoney
        const sumTotalAfterUng = Object.values(result)
        .reduce((sum, { total }) => sum + total, 0);

        // Return the response with sorted results and sumTotalMoney
        return res.status(200).json({
            limitSetting,
            data: sortedResult,
            sumTotalMoney,
            sumTotalAfterUng,
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


exports.updateUngTien = async (req, res) => {

    const object = {
        tienung: req.params.tienung,
    }

    console.log(object)

    await DanDeService.updateUngTien(object, req.params.id);

    try {
        // Fetch data from DanDeService
        const [objects, limitSetting, ungchuyens] = await Promise.all([
            DanDeService.findAll(),
            DanDeService.findByIdSetting(),
            DanDeService.findAllUngChuyen()
        ]);

        
        
        // Initialize the money dictionary for numbers from 00 to 99
        const moneyDict = Array.from({ length: 100 }, (_, i) => ({
            key: i.toString().padStart(2, '0'),
            totalMoney: 0,
            tienung: 0,
            idtienung: 0
        }));
        
        // Update moneyDict with tienung values from ungchuyens
        ungchuyens.forEach(({ name, tienung, id }) => {
            const index = moneyDict.findIndex(item => item.key === name);
            if (index !== -1) {
                moneyDict[index].tienung = tienung;
                moneyDict[index].idtienung = id;
            }
        });
        

        // Update the money dictionary based on the fetched objects
        objects.forEach(obj => {
            const numbers = obj.value.split(',').map(num => num.trim());
            const money = obj.money;
            numbers.forEach(number => {
                const dictEntry = moneyDict.find(entry => entry.key === number);
                if (dictEntry) {
                    dictEntry.totalMoney += money;
                }
            });
        });

        // Convert the moneyDict array to an object and process status
        const result = moneyDict.reduce((acc, { key, totalMoney, tienung, idtienung }) => {
            const status = totalMoney - tienung > limitSetting.limit ? 'Vượt quá hạn mước' : 'Bình Thường';
            const total = totalMoney - tienung;
            acc[key] = {
                idtienung,
                totalMoney,
                tienung,
                total,
                status
            };
            return acc;
        }, {});

        // Convert result object to array and sort by totalMoney in descending order
        const sortedResult = Object.entries(result)
            .sort(([, a], [, b]) => b.totalMoney - a.totalMoney)
            .reduce((acc, [number, value]) => {
                acc[number] = value;
                return acc;
            }, {});

        // Calculate sumTotalMoney
        const sumTotalMoney = Object.values(result)
            .reduce((sum, { totalMoney }) => sum + totalMoney, 0);

            // Calculate sumTotalMoney
        const sumTotalAfterUng = Object.values(result)
        .reduce((sum, { total }) => sum + total, 0);

        // Return the response with sorted results and sumTotalMoney
        return res.status(200).json({
            limitSetting,
            data: sortedResult,
            sumTotalMoney,
            sumTotalAfterUng,
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

