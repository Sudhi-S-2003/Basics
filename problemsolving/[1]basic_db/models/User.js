const Joi = require('joi');
const createModel = require('./createModel');

// Define User schema
const userSchema = Joi.object({
  id: Joi.number().integer(),
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(0).optional()
});

// Create User model
const User = createModel('users.json', userSchema);

module.exports = User;