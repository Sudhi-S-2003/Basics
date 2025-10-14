const fs = require('fs');
const path = require('path');

class Model {
  // Override these in subclasses
  static filename = null;
  static schema = null;
  
  // Cache for loaded data
  static _data = null;

  /**
   * Load data from JSON file
   */
  static load() {
    if (this._data !== null) {
      return this._data;
    }

    const filePath = path.join(__dirname, '..', 'data', this.filename);
    
    try {
      if (!fs.existsSync(filePath)) {
        this._data = [];
        this.save();
        return this._data;
      }

      const fileContent = fs.readFileSync(filePath, 'utf8');
      this._data = JSON.parse(fileContent);
      return this._data;
    } catch (error) {
      console.error(`Error loading ${this.filename}:`, error.message);
      this._data = [];
      return this._data;
    }
  }

  /**
   * Save data to JSON file
   */
  static save() {
    const filePath = path.join(__dirname, '..', 'data', this.filename);
    const dir = path.dirname(filePath);

    // Ensure data directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    try {
      fs.writeFileSync(filePath, JSON.stringify(this._data, null, 2), 'utf8');
    } catch (error) {
      console.error(`Error saving ${this.filename}:`, error.message);
      throw error;
    }
  }

  /**
   * Find all records
   */
  static findAll() {
    return this.load();
  }

  /**
   * Find record by ID
   */
  static findById(id) {
    const data = this.load();
    return data.find(record => record.id === parseInt(id));
  }

  /**
   * Validate data against Joi schema
   */
  static validate(data) {
    if (!this.schema) {
      throw new Error('Schema not defined for this model');
    }

    const { error, value } = this.schema.validate(data, { abortEarly: false });
    
    if (error) {
      return {
        valid: false,
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        })),
        value: null
      };
    }

    return {
      valid: true,
      errors: [],
      value
    };
  }

  /**
   * Create or update a record
   */
  static saveRecord(data) {
    const existingData = this.load();
    
    // If updating existing record
    if (data.id) {
      const index = existingData.findIndex(record => record.id === parseInt(data.id));
      
      if (index === -1) {
        throw new Error(`Record with id ${data.id} not found`);
      }

      // Merge existing data with new data
      const mergedData = { ...existingData[index], ...data };
      
      // Validate merged data
      const validation = this.validate(mergedData);
      if (!validation.valid) {
        return { success: false, errors: validation.errors };
      }

      existingData[index] = validation.value;
      this._data = existingData;
      this.save();

      return { success: true, record: validation.value };
    }

    // Creating new record
    const newId = existingData.length > 0 
      ? Math.max(...existingData.map(r => r.id)) + 1 
      : 1;

    const newRecord = { id: newId, ...data };

    // Validate new record
    const validation = this.validate(newRecord);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    existingData.push(validation.value);
    this._data = existingData;
    this.save();

    return { success: true, record: validation.value };
  }

  /**
   * Delete record by ID
   */
  static deleteById(id) {
    const data = this.load();
    const index = data.findIndex(record => record.id === parseInt(id));

    if (index === -1) {
      return false;
    }

    data.splice(index, 1);
    this._data = data;
    this.save();

    return true;
  }

  /**
   * Clear cache (useful for testing or forcing reload)
   */
  static clearCache() {
    this._data = null;
  }
}

module.exports = Model;