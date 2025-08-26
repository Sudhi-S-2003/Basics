// 1. Comparison Operators

//Used for comparing fields/values.

{ $expr: { $eq: ["$a", "$b"] } }   // a == b
{ $expr: { $ne: ["$a", "$b"] } }   // a != b
{ $expr: { $gt: ["$a", "$b"] } }   // a > b
{ $expr: { $gte: ["$a", "$b"] } }  // a >= b
{ $expr: { $lt: ["$a", "$b"] } }   // a < b
{ $expr: { $lte: ["$a", "$b"] } }  // a <= b


// 2. Logical Operators

// For combining multiple conditions.

{ $expr: { $and: [ { $gt: ["$a", 10] }, { $lt: ["$b", 50] } ] } }
{ $expr: { $or:  [ { $eq: ["$status", "active"] }, { $eq: ["$role", "admin"] } ] } }
{ $expr: { $not: [ { $eq: ["$a", "$b"] } ] } }

// 3. Set Operators

// Works with arrays.

{ $expr: { $in: ["$status", ["new", "pending", "approved"]] } }
{ $expr: { $nin: ["$status", ["cancelled", "rejected"]] } }
{ $expr: { $setEquals: ["$tags", ["a", "b", "c"]] } }
{ $expr: { $setIsSubset: [["$tags"], ["a","b","c"]] } }

// 4. Arithmetic Operators

// Math inside $expr.

{ $expr: { $add: ["$price", "$tax"] } }        // price + tax
{ $expr: { $subtract: ["$qty", "$used"] } }    // qty - used
{ $expr: { $multiply: ["$price", "$qty"] } }   // price * qty
{ $expr: { $divide: ["$total", "$count"] } }   // total / count
{ $expr: { $mod: ["$value", 2] } }             // value % 2

// 5. Conditional Operators

{ $expr: { $cond: [ { $gt: ["$qty", 100] }, "bulk", "normal" ] } }
{ $expr: { $ifNull: ["$discount", 0] } }
{ $expr: { $switch: {
    branches: [
      { case: { $eq: ["$type", "A"] }, then: "Group A" },
      { case: { $eq: ["$type", "B"] }, then: "Group B" }
    ],
    default: "Other"
} } }

// 6. String Operators
{ $expr: { $concat: ["$firstName", " ", "$lastName"] } }
{ $expr: { $toUpper: "$name" } }
{ $expr: { $toLower: "$name" } }
{ $expr: { $substr: ["$title", 0, 10] } }  // substring
{ $expr: { $regexMatch: { input: "$email", regex: /@gmail\.com$/ } } }

// 7. Date Operators
{ $expr: { $year: "$createdAt" } }
{ $expr: { $month: "$createdAt" } }
{ $expr: { $dayOfMonth: "$createdAt" } }
{ $expr: { $dateDiff: { startDate: "$start", endDate: "$end", unit: "day" } } }

// 8. Type & Array Operators
{ $expr: { $type: "$field" } }        // get BSON type
{ $expr: { $isArray: "$tags" } }      // true if tags is array
{ $expr: { $size: "$tags" } }         // length of array





// 1. $setEquals
// { $expr: { $setEquals: ["$tags", ["a", "b", "c"]] } }


// Meaning: true if the two arrays contain the same unique elements, regardless of order or duplicates.

// It treats arrays as sets (no duplicates, order doesn’t matter).

// Example:
// { tags: ["a", "b", "c"] }       ✅ match  
// { tags: ["c", "b", "a"] }       ✅ match (order ignored)  
// { tags: ["a", "b", "c", "a"] }  ✅ match (duplicates ignored)  
// { tags: ["a", "b"] }            ❌ not equal (missing c)  
// { tags: ["a", "b", "c", "d"] }  ❌ not equal (extra d)  


// 👉 Use $setEquals when you want exact same set of elements.

// 2. $setIsSubset
// { $expr: { $setIsSubset: ["$tags", ["a","b","c"]] } }


// Meaning: true if the first array’s elements are all contained in the second array.

// It checks for subset relationship.

// ⚠️ Be careful: in your snippet, you wrote [["$tags"], ["a","b","c"]] (extra brackets).
// The correct syntax is:

// { $expr: { $setIsSubset: ["$tags", ["a","b","c"]] } }

// Example:
// { tags: ["a", "b"] }       ✅ match (subset of a,b,c)  
// { tags: ["a", "c"] }       ✅ match  
// { tags: ["a", "b", "c"] }  ✅ match (equal is also subset)  
// { tags: ["a", "b", "d"] }  ❌ no match (d not in [a,b,c])  
// { tags: ["d"] }            ❌ no match  


// 👉 Use $setIsSubset when you want to ensure tags are allowed values from a predefined set.

// 🔑 Difference in one line

// $setEquals → both arrays contain exact same unique elements.

// $setIsSubset → first array must be contained inside the second.