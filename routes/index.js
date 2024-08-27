const express = require('express');
const router = express.Router();

const ErrorHandler = require('../middleware/error.middleware');
const validate = require('../utils/validator.util');

const DanDeController = require('../controllers/dande.controller');

const dandeValidate = require('../validatons/dande.validation');

router.post('/dande/create', validate(dandeValidate.create), ErrorHandler(DanDeController.create));
router.put('/dande/:id', validate(dandeValidate.create), ErrorHandler(DanDeController.update));
router.delete('/dande/:id', ErrorHandler(DanDeController.delete));
router.get('/dande', ErrorHandler(DanDeController.getDanDes));

router.all('*', (req, res) => res.status(400).json({ message: 'Bad Request.' }));


module.exports = router;
