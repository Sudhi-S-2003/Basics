const Model = require('./Model');

/**
 * Factory function to create a Model subclass
 * @param {string} filename - JSON file name for storage
 * @param {object} schema - Joi validation schema
 * @returns {class} - Model subclass
 */
function createModel(filename, schema) {
  return class extends Model {
    static filename = filename;
    static schema = schema;
  };
}

module.exports = createModel;