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

const changePasswordValidation = data => {

  const schema = Joi.object({
    oldPassword: Joi.string().min(8).required(),
    newPassword: Joi.string().min(8).required()
  })
  return schema.validate(data, options)
}

const changeEmailValidation = data => {

  const schema = Joi.object({
    newEmail: Joi.string().email().required(),
  })
  return schema.validate(data, options)
}

const resetPasswordValidation = data => {

  const schema = Joi.object({
    new_password: Joi.string().min(8).required(),
    confirm_password: Joi.string().min(6).valid(Joi.ref('new_password')).required(),
    token: Joi.string().max(8).required(),
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

const resetEmailValidation = data => {
  const schema = Joi.object({
    token: Joi.string().max(8).required(),
  })
  return schema.validate(data, options)
}

const feedbackValidation = data => {

  const schema = Joi.object({
    comments: Joi.string().max(1000).required(),
    ratings: Joi.number().required()
  })
  return schema.validate(data, options)
}

const referralRegisterValidation = data => {

  const schema = Joi.object({
    first_name: Joi.string().max(255).required(),
    last_name: Joi.string().max(255).required(),
    password: Joi.string().min(8).required(),
    confirm_password: Joi.string().min(6).valid(Joi.ref('password')).required(),
    email: Joi.string().email().required(),
    role: Joi.string().max(20).required(),
    reference_code: Joi.string().max(20).required()
  })
  return schema.validate(data, options)
}

module.exports = { referralRegisterValidation, registerValidation, loginValidation, changePasswordValidation, resetEmailValidation, forgotPasswordValidation, resetPasswordValidation, changeEmailValidation, feedbackValidation };