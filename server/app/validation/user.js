const Joi = require('joi');
const options = {
  errors: {
    wrap: {
      label: ''
    }
  }
};

const registerValidation = data => {

  const schema = Joi.object({
    first_name: Joi.string().max(255).required(),
    last_name: Joi.string().max(255).required(),
    password: Joi.string().min(8).required(),
    confirm_password: Joi.string().min(6).valid(Joi.ref('password')).required(),
    email: Joi.string().email().required(),
    role: Joi.string().max(20).required()
  })
  return schema.validate(data, options)
}

const changepasswordValidation = data => {

  const schema = Joi.object({
    current_password: Joi.string().min(8).required(),
    new_password: Joi.string().min(8).required()
  })
  return schema.validate(data, options)
}
const forgotPasswordValidation = data => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  })
  return schema.validate(data, options)
}

const loginValidation = data => {

  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(255).required(),
  })
  return loginSchema.validate(data, options)
}

module.exports = { registerValidation, loginValidation, changepasswordValidation, forgotPasswordValidation };