import * as Joi from 'joi';

export const createMessageSchema = Joi.object({
    message: Joi.string().min(4).max(255).required(),
});

export const messageQuerySchema = Joi.object({
    id: Joi.string().optional(),
    search: Joi.string().optional(),
});
