const { default: throwError } = require("@/utils/errors");
const Joi = require("joi");

const validateQuery = (req) => {
  // example schema
  const schema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().optional(),
  });

  // get query params
  const url = new URL(req.url);
  const query = Object.fromEntries(url.searchParams.entries());

  // validate
  const { error, value } = schema.validate(query, { abortEarly: false });

  if (error) {
    throwError(
      "VALIDATION_ERROR",
      error.details.map((d) => d.message).join(", ")
    );
  }

  return value;
};

export default validateQuery;
