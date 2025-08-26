const { default: throwError } = require("@/utils/errors");
const Joi = require("joi");

const validate = async (req) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    age: Joi.number().required(),
  });

  const body = req.json ? await req.json() : req.body;

  const { error, value } = schema.validate(body, { abortEarly: false });

  if (error) {
    throwError(
      "VALIDATION_ERROR",
      error.details.map(d => d.message).join(", ")
    );
  }

  return value;
};

export default validate;
