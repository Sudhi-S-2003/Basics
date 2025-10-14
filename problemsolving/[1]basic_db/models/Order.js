const Joi = require('joi');
const createModel = require('./createModel');

// Define Order schema
const orderSchema = Joi.object({
  id: Joi.number().integer(),
  userId: Joi.number().integer().required(),
  product: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().precision(2).min(0).required()
});

// Create Order model
const Order = createModel('orders.json', orderSchema);

module.exports = Order;