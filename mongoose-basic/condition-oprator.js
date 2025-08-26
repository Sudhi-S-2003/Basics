// 🔹 1. $cond → if / else

// Basic if–else operator.

{ 
  $cond: [ <ifCondition>, <thenValue>, <elseValue> ] 
}

{/* Example: */}
{ $cond: [ { $gt: ["$qty", 100] }, "bulk", "normal" ] }

{/* 
if qty > 100 → "bulk"

else → "normal" */}

{/* 👉 This is like a simple if ... else.

🔹 2. $ifNull → null check with default */}
{ $ifNull: [ <expression>, <replacementIfNull> ] }

{/* Example: */}
{ $ifNull: ["$discount", 0] }


{/* if discount is null or missing → return 0

otherwise → return discount value */}
{/* 
👉 Like field ?? default in JavaScript.

🔹 3. $switch → multiple if–else chain */}
{
  $switch: {
    branches: [
      { case: <condition1>, then: <value1> },
      { case: <condition2>, then: <value2> }
    ],
    default: <defaultValue>
  }
}
{/* 
Example:
{
  $switch: {
    branches: [
      { case: { $eq: ["$status", "A"] }, then: "Approved" },
      { case: { $eq: ["$status", "P"] }, then: "Pending" }
    ],
    default: "Unknown"
  }
} */}

{/* 
if status = A → "Approved"

if status = P → "Pending"

else → "Unknown" */}

👉 This is like switch ... case ... default.
{/* 
🔹 4. $coalesce (MongoDB 5.0+)

Return the first non-null expression. */}

{ $coalesce: [ "$field1", "$field2", "fallback" ] }

Example:
{ $coalesce: ["$nickname", "$username", "Guest"] }

{/* 
If nickname exists → use it

Else if username exists → use it

Else → "Guest" */}

{/* 👉 Like field1 ?? field2 ?? fallback. */}
{/* 
🔹 5. $nullIf (MongoDB 5.0+)

Return null if two values are equal, otherwise return the first value. */}

{ $nullIf: [ <expression1>, <expression2> ] }

Example:
{ $nullIf: ["$phone", "N/A"] }


{/* If phone = "N/A" → return null */}
{/* 
Else → return phone */}
{/* 
✅ Summary (Conditional Operators Cheat Sheet)
Operator	Purpose	Example
$cond	if–else	{ $cond: [ { $gt: ["$qty", 10] }, "big", "small" ] }
$ifNull	return default if null/missing	{ $ifNull: ["$discount", 0] }
$switch	multiple if–else chain	{ $switch: { branches: [...], default: "Other" } }
$coalesce	first non-null value	{ $coalesce: ["$nick", "$name", "Guest"] }
$nullIf	null if equal, else first value	{ $nullIf: ["$phone", "N/A"] }

⚡ In short:

$cond → if/else (ternary operator)

$ifNull → null coalescing

$switch → switch/case

$coalesce → first non-null

$nullIf → null if equal */}