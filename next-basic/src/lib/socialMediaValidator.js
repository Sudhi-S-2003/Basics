// lib/validators.js
const Joi = require("joi");

// Regex patterns
const YOUTUBE_REGEX = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[?&].*)?$/i;
const INSTAGRAM_REGEX = /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/(p|reel|tv)\/([A-Za-z0-9_-]+)\/?(?:\?.*)?$/i;
const LINKEDIN_REGEX = /^(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:(?:posts\/[A-Za-z0-9_-]+_[0-9]+)|(?:feed\/update\/urn:li:activity:\d+)|(?:.*activity[-_]\d+)).*$/i;

const schema = Joi.object({
  url: Joi.string()
    .uri()
    .custom((value, helpers) => {
      if (YOUTUBE_REGEX.test(value)) return value;
      if (INSTAGRAM_REGEX.test(value)) return value;
      if (LINKEDIN_REGEX.test(value)) return value;
      return helpers.error("any.invalid");
    })
    .required()
    .messages({
      "string.empty": "URL is required",
      "string.uri": "Must be a valid URI",
      "any.invalid": "Must be a YouTube, Instagram, or LinkedIn link",
    }),
  verifyRemote: Joi.boolean().default(false),
});

module.exports = {
  schema,
  YOUTUBE_REGEX,
  INSTAGRAM_REGEX,
  LINKEDIN_REGEX,
};
