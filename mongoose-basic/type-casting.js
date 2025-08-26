// 1. Type Checking Operators
{ field: { $type: "string" } }    // matches if field is string
{ field: { $type: 2 } }           // same as above (BSON type code for string)
{ field: { $exists: true } }      // field must exist
{ field: { $exists: false } }     // field must NOT exist


// 👉 Useful in $match (query filter).


// 2. Type Casting Operators (inside $expr, $project, $addFields)

// Convert one type to another.

{ $toString: "$field" }    // convert to string
{ $toInt: "$field" }       // convert to integer
{ $toDouble: "$field" }    // convert to double/float
{ $toDecimal: "$field" }   // convert to high-precision decimal
{ $toLong: "$field" }      // convert to 64-bit integer
{ $toBool: "$field" }      // convert to boolean
{ $toDate: "$field" }      // convert to Date
{ $toObjectId: "$field" }  // convert to ObjectId
{ $convert: { input: "$field", to: "string", onError: "N/A", onNull: "none" } }


// 👉 Used when you need a different type for comparison, math, etc.



// 🔹 3. Value Checking / Null Checking
{ field: null }                 // field is null OR doesn’t exist
{ field: { $eq: null } }        // same as above
{ field: { $ne: null } }        // not null
{ field: { $exists: true } }    // ensures field actually exists
{ $ifNull: ["$field", "default"] } // replace null with default
{ $coalesce: ["$a", "$b", "$c", "fallback"] } // return first non-null


// 👉 Difference: field: null matches both missing and null unless combined with $exists.


// 🔹 4. Length / Size Checking

// For arrays and strings:

// array length
{ $expr: { $eq: [ { $size: "$tags" }, 3 ] } }    // tags has length 3

// string length (use $strLenCP or $strLenBytes)
{ $expr: { $gt: [ { $strLenCP: "$name" }, 10 ] } }   // name length > 10 chars


// $size → array length

// $strLenBytes → string length in bytes

// $strLenCP → string length in code points (characters)

// 🔹 5. Null / Missing Handling in Expressions
{ $ifNull: ["$discount", 0] }   // if discount is null → 0
{ $cond: [ { $eq: ["$status", null] }, "Unknown", "$status" ] }
{ $type: "$field" }             // returns actual BSON type (string like "double")

// 🔹 6. Examples in Action
// ✅ Type check
db.users.find({ age: { $type: "int" } })


// → finds docs where age is integer.

// ✅ Type cast & compute
db.orders.aggregate([
  { $project: {
      priceAsInt: { $toInt: "$price" },
      taxAsDouble: { $toDouble: "$tax" }
  }}
])

// ✅ Null check with default
db.users.aggregate([
  { $project: {
      discount: { $ifNull: ["$discount", 0] }
  }}
])

// ✅ Length check
db.products.aggregate([
  { $match: { $expr: { $gt: [ { $size: "$tags" }, 2 ] } } }
])


// ✅ Summary

// Type checking → $type, $exists.

// Type casting → $toString, $toInt, $convert, etc.

// Value checking → $eq, $ne, $ifNull, $coalesce.

// Length checking → $size (arrays), $strLenCP (strings).

// Null checking → field: null, $exists, $ifNull.