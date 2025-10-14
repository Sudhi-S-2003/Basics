const { listRecords, addRecord, updateRecord, deleteRecord } = require('./cli');

/**
 * Parse key=value pairs from command line arguments
 */
function parseFields(args) {
  const fields = {};
  
  args.forEach(arg => {
    const [key, ...valueParts] = arg.split('=');
    const value = valueParts.join('='); // Handle values with '=' in them
    
    if (key && value !== undefined) {
      // Try to parse as number
      if (!isNaN(value) && value.trim() !== '') {
        fields[key] = parseFloat(value);
      } else {
        fields[key] = value;
      }
    }
  });
  
  return fields;
}

/**
 * Display usage information
 */
function showUsage() {
  console.log(`
📚 JSON Database CLI Usage:

  List all records:
    node main.js list <user|order>

  Add a new record:
    node main.js add <user|order> key=value key2=value2 ...

  Update a record:
    node main.js update <user|order> <id> key=value key2=value2 ...

  Delete a record:
    node main.js delete <user|order> <id>

Examples:

  node main.js list user
  node main.js add user name="John Doe" email=john@example.com age=30
  node main.js update user 1 name="Jane Doe" age=31
  node main.js delete user 1

  node main.js add order userId=1 product="Laptop" quantity=2 price=999.99
  node main.js list order
  `);
}

/**
 * Main CLI handler
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    showUsage();
    return;
  }

  const command = args[0];
  const modelName = args[1];

  switch (command) {
    case 'list':
      if (!modelName) {
        console.error('❌ Please specify a model (user or order)');
        showUsage();
        return;
      }
      listRecords(modelName);
      break;

    case 'add':
      if (!modelName) {
        console.error('❌ Please specify a model (user or order)');
        showUsage();
        return;
      }
      const addFields = parseFields(args.slice(2));
      if (Object.keys(addFields).length === 0) {
        console.error('❌ Please provide fields in key=value format');
        showUsage();
        return;
      }
      addRecord(modelName, addFields);
      break;

    case 'update':
      if (!modelName) {
        console.error('❌ Please specify a model (user or order)');
        showUsage();
        return;
      }
      const id = args[2];
      if (!id) {
        console.error('❌ Please specify the record ID to update');
        showUsage();
        return;
      }
      const updateFields = parseFields(args.slice(3));
      if (Object.keys(updateFields).length === 0) {
        console.error('❌ Please provide fields to update in key=value format');
        showUsage();
        return;
      }
      updateRecord(modelName, id, updateFields);
      break;

    case 'delete':
      if (!modelName) {
        console.error('❌ Please specify a model (user or order)');
        showUsage();
        return;
      }
      const deleteId = args[2];
      if (!deleteId) {
        console.error('❌ Please specify the record ID to delete');
        showUsage();
        return;
      }
      deleteRecord(modelName, deleteId);
      break;

    case 'help':
    case '--help':
    case '-h':
      showUsage();
      break;

    default:
      console.error(`❌ Unknown command: ${command}`);
      showUsage();
  }
}

// Run the CLI
main();