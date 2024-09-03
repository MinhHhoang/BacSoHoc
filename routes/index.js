const express = require('express');
const router = express.Router();

const ErrorHandler = require('../middleware/error.middleware');
const validate = require('../utils/validator.util');

const DanDeController = require('../controllers/dande.controller');

const dandeValidate = require('../validatons/dande.validation');

router.post('/dande/create', validate(dandeValidate.create), ErrorHandler(DanDeController.create));
router.get('/dande/createChuyen', ErrorHandler(DanDeController.createChuyen));
router.put('/dande/:id', validate(dandeValidate.create), ErrorHandler(DanDeController.update));
router.put('/dande/add/:id', validate(dandeValidate.create), ErrorHandler(DanDeController.updateCongtien));
router.get('/ungtien/:id/:tienung', ErrorHandler(DanDeController.updateUngTien));
router.delete('/dande/:id', ErrorHandler(DanDeController.delete));
router.get('/dande', ErrorHandler(DanDeController.getDanDes));
router.get('/static', ErrorHandler(DanDeController.getStatic));
router.get('/reset', ErrorHandler(DanDeController.reset));
router.get('/ungcopy', ErrorHandler(DanDeController.ungCopy));


router.put('/setting', ErrorHandler(DanDeController.updateSetting));

router.all('*', (req, res) => res.status(400).json({ message: 'Bad Request.' }));


module.exports = router;
