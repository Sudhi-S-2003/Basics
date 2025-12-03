import Joi from 'joi';

export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
      });
    }

    req.validatedBody = value;
    next();
  };
};

// Common validation schemas
export const schemas = {
  register: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
    password: Joi.string().min(8).required().messages({
      'string.min': 'Password must be at least 8 characters long',
      'any.required': 'Password is required',
    }),
    name: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters',
      'any.required': 'Name is required',
    }),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  sendMessage: Joi.object({
    conversationId: Joi.string().required(),
    content: Joi.string().max(5000).when('type', {
      is: Joi.valid('text', 'system'),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    type: Joi.string().valid('text', 'image', 'file', 'system').default('text'),
    replyTo: Joi.string().optional(),
  }),

  createConversation: Joi.object({
    type: Joi.string().valid('direct', 'group').required(),
    participants: Joi.array().items(Joi.string()).min(1).required(),
    name: Joi.string().when('type', {
      is: 'group',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    statusMessage: Joi.string().max(150).optional(),
    avatar: Joi.string().uri().optional(),
  }),
};