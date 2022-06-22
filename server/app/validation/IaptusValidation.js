const Joi = require('joi');
const options = {
    errors: {
        wrap: {
            label: ''
        }
    }
};

const payloadMandatoryField = data => {
    ("--------------------------------------payloadMandatoryField-----------start------------------------")
    const schema = Joi.object().keys({
        pat_title: Joi.string().required(),
        pat_lastname: Joi.string().required(),
        pat_dob: Joi.date().required(''),
        pat_gender: Joi.string().required(),
        pat_address1: Joi.string().required(),
        pat_postcode: Joi.string().required(),
        pat_home_tel: Joi.string().length(10).pattern(/^[0-9]+$/).allow(''),
        pat_mob_tel: Joi.string().length(10).pattern(/^[0-9]+$/).allow(''),

    })
    return schema.validate(data, options)
}

module.exports = { payloadMandatoryField };