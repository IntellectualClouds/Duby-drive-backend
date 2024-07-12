const Joi = require('joi');
const UserModel = require('../models/userModel');

// Define the user schema for validation
const userSchema = Joi.object({
  fullname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phonenumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
  role: Joi.string().valid('dealer', 'inputter', 'admin').required(),
});

// Validation middleware
const validateUser = (req, res, next) => {
  const { error, value } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next(); // Proceed to the next middleware or route handler
};

module.exports = validateUser;
