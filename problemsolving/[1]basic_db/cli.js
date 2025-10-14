const User = require('./models/User');
const Order = require('./models/Order');

// Map model names to model classes
const models = {
  user: User,
  order: Order
};

/**
 * List all records for a model
 */
function listRecords(modelName) {
  const Model = models[modelName];
  
  if (!Model) {
    console.error(`❌ Unknown model: ${modelName}`);
    console.log('Available models: user, order');
    return;
  }

  const records = Model.findAll();

  if (records.length === 0) {
    console.log(`📋 No ${modelName}s found.`);
    return;
  }

  console.log(`\n📋 ${modelName.toUpperCase()}S (${records.length} total):\n`);
  console.log(JSON.stringify(records, null, 2));
}

/**
 * Add a new record
 */
function addRecord(modelName, fields) {
  const Model = models[modelName];
  
  if (!Model) {
    console.error(`❌ Unknown model: ${modelName}`);
    console.log('Available models: user, order');
    return;
  }

  const result = Model.saveRecord(fields);

  if (!result.success) {
    console.error(`\n❌ Validation failed for ${modelName}:\n`);
    result.errors.forEach(err => {
      console.error(`  • ${err.field}: ${err.message}`);
    });
    return;
  }

  console.log(`\n✅ ${modelName.charAt(0).toUpperCase() + modelName.slice(1)} created successfully!`);
  console.log(JSON.stringify(result.record, null, 2));
}

/**
 * Update an existing record
 */
function updateRecord(modelName, id, fields) {
  const Model = models[modelName];
  
  if (!Model) {
    console.error(`❌ Unknown model: ${modelName}`);
    console.log('Available models: user, order');
    return;
  }

  // Check if record exists
  const existing = Model.findById(id);
  if (!existing) {
    console.error(`❌ ${modelName.charAt(0).toUpperCase() + modelName.slice(1)} with id ${id} not found.`);
    return;
  }

  // Add id to fields for update
  fields.id = parseInt(id);

  const result = Model.saveRecord(fields);

  if (!result.success) {
    console.error(`\n❌ Validation failed for ${modelName}:\n`);
    result.errors.forEach(err => {
      console.error(`  • ${err.field}: ${err.message}`);
    });
    return;
  }

  console.log(`\n✅ ${modelName.charAt(0).toUpperCase() + modelName.slice(1)} updated successfully!`);
  console.log(JSON.stringify(result.record, null, 2));
}

/**
 * Delete a record by ID
 */
function deleteRecord(modelName, id) {
  const Model = models[modelName];
  
  if (!Model) {
    console.error(`❌ Unknown model: ${modelName}`);
    console.log('Available models: user, order');
    return;
  }

  const deleted = Model.deleteById(id);

  if (!deleted) {
    console.error(`❌ ${modelName.charAt(0).toUpperCase() + modelName.slice(1)} with id ${id} not found.`);
    return;
  }

  console.log(`✅ ${modelName.charAt(0).toUpperCase() + modelName.slice(1)} with id ${id} deleted successfully!`);
}

module.exports = {
  listRecords,
  addRecord,
  updateRecord,
  deleteRecord
};