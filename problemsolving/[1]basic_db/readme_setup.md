# JSON Database with Joi Validation

A lightweight, file-based JSON database for Node.js with built-in validation using Joi.

## 📁 Project Structure

```
/project-root
  /data
    users.json
    orders.json
  /models
    Model.js          # Base Model class
    createModel.js    # Model factory function
    User.js           # User model
    Order.js          # Order model
  cli.js              # CLI command functions
  main.js             # CLI entry point
  package.json        # Project dependencies
  README.md           # This file
```

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install Joi (the only dependency).

### 2. Create Data Directory

The `data` directory will be created automatically when you first run a command, but you can create it manually if you prefer:

```bash
mkdir data
```

The JSON files (`users.json` and `orders.json`) will be created automatically when needed.

## 📖 Usage

### List All Records

```bash
node main.js list user
node main.js list order
```

### Add a New Record

**Add a User:**
```bash
node main.js add user name="John Doe" email=john@example.com age=30
node main.js add user name="Jane Smith" email=jane@example.com age=25
```

**Add an Order:**
```bash
node main.js add order userId=1 product="Laptop" quantity=2 price=999.99
node main.js add order userId=1 product="Mouse" quantity=1 price=29.99
```

### Update a Record

```bash
node main.js update user 1 name="John Updated" age=31
node main.js update order 1 quantity=3 price=1499.99
```

### Delete a Record

```bash
node main.js delete user 1
node main.js delete order 1
```

### Show Help

```bash
node main.js help
node main.js --help
node main.js
```

## 📝 Model Schemas

### User Model

| Field | Type | Validation |
|-------|------|------------|
| id | Integer | Auto-generated |
| name | String | Required, 2-50 characters |
| email | String | Required, valid email format |
| age | Integer | Optional, minimum 0 |

### Order Model

| Field | Type | Validation |
|-------|------|------------|
| id | Integer | Auto-generated |
| userId | Integer | Required |
| product | String | Required |
| quantity | Integer | Required, minimum 1 |
| price | Number | Required, minimum 0, 2 decimal places |

## 🎯 Features

- ✅ **Auto-incrementing IDs** - IDs are automatically assigned to new records
- ✅ **Validation** - All data is validated using Joi schemas before saving
- ✅ **Lazy Loading** - Data is loaded only when needed and cached
- ✅ **Error Handling** - Clear error messages for validation failures
- ✅ **Modular Design** - Easy to add new models using the factory pattern
- ✅ **JSON Storage** - Human-readable data storage in JSON files

## 🔧 Extending with New Models

To add a new model:

1. Create a new file in `/models` (e.g., `Product.js`)
2. Define your Joi schema
3. Use the `createModel` factory:

```javascript
const Joi = require('joi');
const createModel = require('./createModel');

const productSchema = Joi.object({
  id: Joi.number().integer(),
  name: Joi.string().required(),
  price: Joi.number().min(0).required(),
  stock: Joi.number().integer().min(0).required()
});

const Product = createModel('products.json', productSchema);

module.exports = Product;
```

3. Import it in `cli.js` and add it to the `models` object:

```javascript
const Product = require('./models/Product');

const models = {
  user: User,
  order: Order,
  product: Product  // Add your new model
};
```

## 📦 Example Session

```bash
# Add some users
$ node main.js add user name="Alice Johnson" email=alice@example.com age=28
✅ User created successfully!
{
  "id": 1,
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "age": 28
}

$ node main.js add user name="Bob Williams" email=bob@example.com age=35
✅ User created successfully!
{
  "id": 2,
  "name": "Bob Williams",
  "email": "bob@example.com",
  "age": 35
}

# List all users
$ node main.js list user
📋 USERS (2 total):
[
  {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "age": 28
  },
  {
    "id": 2,
    "name": "Bob Williams",
    "email": "bob@example.com",
    "age": 35
  }
]

# Add an order
$ node main.js add order userId=1 product="Mechanical Keyboard" quantity=1 price=149.99
✅ Order created successfully!
{
  "id": 1,
  "userId": 1,
  "product": "Mechanical Keyboard",
  "quantity": 1,
  "price": 149.99
}

# Update a user
$ node main.js update user 1 age=29
✅ User updated successfully!
{
  "id": 1,
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "age": 29
}

# Try to add invalid data
$ node main.js add user name="X" email=invalid-email
❌ Validation failed for user:
  • name: "name" length must be at least 2 characters long
  • email: "email" must be a valid email
```

## 🛠️ Technical Details

### Base Model Class

The `Model` class provides:
- `load()` - Load data from JSON file with caching
- `save()` - Save data to JSON file
- `findAll()` - Get all records
- `findById(id)` - Find a single record by ID
- `saveRecord(data)` - Create or update a record with validation
- `deleteById(id)` - Delete a record by ID
- `validate(data)` - Validate data against the Joi schema
- `clearCache()` - Clear the data cache

### Data Persistence

Data is stored in JSON files in the `/data` directory. Each model has its own file:
- `users.json` - User records
- `orders.json` - Order records

The files are created automatically if they don't exist.

## 📄 License

MIT

//https://claude.ai/public/artifacts/435d8026-9653-459e-81d7-44b92e524092