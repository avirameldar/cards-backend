const registerValidation = require("./Joi/registerValidation");
const loginValidation = require("./Joi/loginValidation");

const config = require("config");
const validator = config.get("VALIDATOR");

const validateRegistration = (user) => {
  if (validator === "Joi") return registerValidation(user);
};

const validateLogin = (user) => {
  if (validator === "Joi") return loginValidation(user);
};

exports.validateRegistration = validateRegistration;
exports.validateLogin = validateLogin;