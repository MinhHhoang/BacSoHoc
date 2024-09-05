const DanDeService = require('../services/dande.service');


exports.create = async (req, res) => {

    const object = {
        name: req.body.name,
        value: req.body.value,
        money: Number(req.body.money),
    }


    let dan = await DanDeService.findByIdValue(object.value);

    if (dan) {

        const totalMoney = Number(req.body.money) + Number(dan.money);

        const dande = await DanDeService.update({ ...object, name: dan.name, money: totalMoney }, dan.id);

        // Tách chuỗi thành mảng các số
        const numbersArray = object.value.split(', ');

        // Tạo mảng các promises
        const updatePromises = numbersArray.map(async (number) => {
            try {
                const objectt = await DanDeService.findByUngChuyenNameId(number);
                await DanDeService.updateUngTienByName(
                    { ...objectt, tongtien: Number(req.body.money) + Number(objectt.tongtien) },
                    number
                );
            } catch (error) {
                console.error(`Error processing number ${number}:`, error);
            }
        });

        // Chờ tất cả promises hoàn thành
        await Promise.all(updatePromises);

        return res.json({
            data: dande,
            message: 'Bổ sung tiền dàn đề thành công'
        });
    }

    const dande = await DanDeService.create(object);

    // Tách chuỗi thành mảng các số
    const numbersArray = object.value.split(', ');

    // Tạo mảng các promises
    const updatePromises = numbersArray.map(async (number) => {
        try {
            const objectt = await DanDeService.findByUngChuyenNameId(number);
            await DanDeService.updateUngTienByName(
                { ...objectt, tongtien: Number(req.body.money) + Number(objectt.tongtien) },
                number
            );
        } catch (error) {
            console.error(`Error processing number ${number}:`, error);
        }
    });

    // Chờ tất cả promises hoàn thành
    await Promise.all(updatePromises);

    return res.json({
        data: dande,
        message: 'Tạo dàn đề thành công'
    });



}

exports.ungCopy = async (req, res) => {
    try {
        // Fetch data from DanDeService
        const [objects, limitSetting, ungchuyens] = await Promise.all([
            DanDeService.findAlls(),
            DanDeService.findByIdSetting(),
            DanDeService.findAllUngChuyen()
        ]);

        // Initialize the money dictionary using a map for quick lookups
        const moneyDict = new Map(
            Array.from({ length: 100 }, (_, i) => [
                i.toString().padStart(2, '0'),
                { totalMoney: 0, tienung: 0, idtienung: 0, history: "" }
            ])
        );

        // Update moneyDict with tienung values from ungchuyens
        ungchuyens.forEach(({ name, tienung, id, history }) => {
            const entry = moneyDict.get(name);
            if (entry) {
                entry.tienung = tienung;
                entry.idtienung = id;
                entry.history = history;
            }
        });

        // Update the money dictionary based on the fetched objects
        objects.forEach(obj => {
            const numbers = obj.value.split(',').map(num => num.trim());
            const money = obj.money;
            numbers.forEach(number => {
                const entry = moneyDict.get(number);
                if (entry) {
                    entry.totalMoney += money;
                }
            });
        });

        // Prepare the response
        let copyTarget = "";
        const result = {};

        moneyDict.forEach((entry, key) => {
            const total = entry.totalMoney - limitSetting.limit;
            if (total > 0) {
                copyTarget += `${key} = ${total} ; `;
            }
            result[key] = {
                idtienung: entry.idtienung,
                totalMoney: entry.totalMoney,
                tienung: entry.tienung,
                history: entry.history,
                total,
                status: total > limitSetting.limit ? 'Vượt quá hạn mức' : 'Bình Thường'
            };
        });

        // Return the response with the computed values
        return res.status(200).json({
            copyTarget,
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
        const [limitSetting, ungchuyens] = await Promise.all([
            DanDeService.findByIdSetting(),
            DanDeService.findAllUngChuyen()
        ]);



        // Initialize the money dictionary for numbers from 00 to 99
        const moneyDict = Array.from({ length: 100 }, (_, i) => ({
            key: i.toString().padStart(2, '0'),
            tongtien: 0,
            tienung: 0,
            idtienung: 0,
            history: ""
        }));

        // Update moneyDict with tienung values from ungchuyens
        ungchuyens.forEach(({ name, tienung, id, history, tongtien }) => {
            const index = moneyDict.findIndex(item => item.key === name);
            if (index !== -1) {
                moneyDict[index].tongtien = tongtien;
                moneyDict[index].tienung = tienung;
                moneyDict[index].idtienung = id;
                moneyDict[index].history = history;
            }
        });


        // // Update the money dictionary based on the fetched objects
        // objects.forEach(obj => {
        //     const numbers = obj.value.split(',').map(num => num.trim());
        //     const money = obj.money;
        //     numbers.forEach(number => {
        //         const dictEntry = moneyDict.find(entry => entry.key === number);
        //         if (dictEntry) {
        //             dictEntry.totalMoney += money;
        //         }
        //     });
        // });

        // Convert the moneyDict array to an object and process status
        const result = moneyDict.reduce((acc, { key, tongtien, tienung, idtienung, history }) => {
            const status = tongtien - tienung > limitSetting.limit ? 'Vượt quá hạn mước' : 'Bình Thường';
            const total = tongtien - tienung;
            acc[key] = {
                idtienung,
                totalMoney : tongtien,
                tienung,
                history,
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

exports.updateCongtien = async (req, res) => {

    let object = await DanDeService.findById(req.params.id);

    await DanDeService.update({ ...object, money: Number(req.body.money) + object.money }, req.params.id);

    dande = await DanDeService.findById(req.params.id);

    // Tách chuỗi thành mảng các số
    const numbersArray = object.value.split(', ');

    // Tạo mảng các promises
    const updatePromises = numbersArray.map(async (number) => {
        try {
            const objectt = await DanDeService.findByUngChuyenNameId(number);
            await DanDeService.updateUngTienByName(
                { ...objectt, tongtien: Number(req.body.money) + Number(objectt.tongtien) },
                number
            );
        } catch (error) {
            console.error(`Error processing number ${number}:`, error);
        }
    });

    // Chờ tất cả promises hoàn thành
    await Promise.all(updatePromises);
    return res.json({
        data: dande,
        message: 'Cập nhật giá tiền thành công.',
        status: true
    });
}


exports.updateUngTien = async (req, res) => {


    var object = await DanDeService.findByUngChuyenId(req.params.id)
    console.log(object)
    let historyTmp = "";
    if (object.history == "") {
        historyTmp = req.params.tienung;
    } else {
        historyTmp = object.history + ", " + req.params.tienung;
    }


    await DanDeService.updateUngTien({ ...object, tienung: Number(req.params.tienung) + Number(object.tienung), history: historyTmp }, req.params.id);

    try {
        // Fetch data from DanDeService
        const [limitSetting, ungchuyens] = await Promise.all([
            DanDeService.findByIdSetting(),
            DanDeService.findAllUngChuyen()
        ]);



        // Initialize the money dictionary for numbers from 00 to 99
        const moneyDict = Array.from({ length: 100 }, (_, i) => ({
            key: i.toString().padStart(2, '0'),
            tongtien: 0,
            tienung: 0,
            idtienung: 0,
            history: ""
        }));

        // Update moneyDict with tienung values from ungchuyens
        ungchuyens.forEach(({ name, tienung, id, history, tongtien }) => {
            const index = moneyDict.findIndex(item => item.key === name);
            if (index !== -1) {
                moneyDict[index].tongtien = tongtien;
                moneyDict[index].tienung = tienung;
                moneyDict[index].idtienung = id;
                moneyDict[index].history = history;
            }
        });


        // // Update the money dictionary based on the fetched objects
        // objects.forEach(obj => {
        //     const numbers = obj.value.split(',').map(num => num.trim());
        //     const money = obj.money;
        //     numbers.forEach(number => {
        //         const dictEntry = moneyDict.find(entry => entry.key === number);
        //         if (dictEntry) {
        //             dictEntry.totalMoney += money;
        //         }
        //     });
        // });

        // Convert the moneyDict array to an object and process status
        const result = moneyDict.reduce((acc, { key, tongtien, tienung, idtienung, history }) => {
            const status = tongtien - tienung > limitSetting.limit ? 'Vượt quá hạn mước' : 'Bình Thường';
            const total = tongtien - tienung;
            acc[key] = {
                idtienung,
                totalMoney : tongtien,
                tienung,
                history,
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

    await DanDeService.updateSetting({ ...limitSetting, limit: req.body.limit });

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

