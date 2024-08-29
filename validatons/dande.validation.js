const Joi = require('joi');
const passwordRegex = new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/);

const validatePassword = (value) => {  
    if(!passwordRegex.test(String(value))) { 
        throw new Error('Password should contains a lowercase, a uppercase character and a digit.')
    }
}

module.exports = {
    create: Joi.object().keys({
        id: Joi.number().allow(),
        name: Joi.string().allow(null).allow(''),
        createdAt: Joi.string().allow(),
        updatedAt: Joi.string().allow(),
        id: Joi.number().allow(),
        value: Joi.string().required(),
        money: Joi.number().required(),
    })
}