// 🔹 1. $map → transform each element (like Array.map())
{
  $map: {
    input: <array>,          // array to loop
    as: "item",              // variable name
    in: <expression>         // what to return for each element
  }
}

{/* Example: uppercase all tags */}
{
  $map: {
    input: "$tags",
    as: "t",
    in: { $toUpper: "$$t" }
  }
}


{/* 👉 If tags = ["red", "blue"] → ["RED", "BLUE"] */}

{/* 🔹 2. $filter → filter array elements (like Array.filter()) */}
{
  $filter: {
    input: <array>,
    as: "item",
    cond: <expression>   // condition to keep item
  }
}

{/* Example: keep numbers > 5 */}
{
  $filter: {
    input: "$numbers",
    as: "n",
    cond: { $gt: ["$$n", 5] }
  }
}


{/* 👉 If numbers = [2, 6, 8, 3] → [6, 8] */}

{/* 🔹 3. $reduce → accumulate array values (like Array.reduce()) */}
{
  $reduce: {
    input: <array>,
    initialValue: <start>,
    in: <expression>    // combine previous + current
  }
}

{/* Example: sum of numbers */}
{
  $reduce: {
    input: "$numbers",
    initialValue: 0,
    in: { $add: ["$$value", "$$this"] }
  }
}

{/* 
👉 If numbers = [1,2,3] → 6

👉 $$value = accumulator, $$this = current element. */}

{/* 🔹 4. $zip → combine multiple arrays element-wise */}
{ $zip: { inputs: [ <array1>, <array2>, ... ] } }

Example:
{ $zip: { inputs: ["$names", "$ages"] } }


{/* If names=["A","B"] and ages=[10,20] → [["A",10],["B",20]] */}

{/* 🔹 5. $range → generate sequence of numbers (like a for-loop range) */}
{ $range: [ <start>, <end>, <step> ] }

Example:
{ $range: [0, 5, 1] }


👉 [0,1,2,3,4]

{/* 🔹 6. $arrayElemAt, $slice, $reverseArray (helpers, not loops but useful) */}
{ $arrayElemAt: ["$tags", 0] }   // first element
{ $slice: ["$tags", 2] }         // first 2 elements
{ $reverseArray: "$tags" }       // reverse order
{/* 
✅ Summary: Looping Operators
Operator	Purpose	Example
$map	Transform each element	Uppercase all tags
$filter	Keep elements that match cond.	Only numbers > 5
$reduce	Accumulate into single value	Sum array
$zip	Merge arrays element by element	Names + Ages
$range	Generate sequence of numbers	[0..N]
Helpers	$arrayElemAt, $slice, $reverseArray	Access/manipulate arrays */}

{/* 
🔹 MongoDB $slice Syntax
{ $slice: [ <array>, <n> ] }               // first n elements
{ $slice: [ <array>, <skip>, <count> ] }

1. First N elements
{ $slice: ["$tags", 2] }

👉 If tags = ["a","b","c","d"] → ["a","b"]

2. From index to end
{ $slice: ["$tags", 2, { $subtract: [ { $size: "$tags" }, 2 ] }] }

👉 Start from index 2 (0-based) until array end.
If tags = ["a","b","c","d","e"] → ["c","d","e"]

⚡ Trick: limit = (size - start)

3. Range (index 2 to 5)
{ $slice: ["$tags", 2, 3] }

👉 Start at index 2, take 3 elements → index 2,3,4
If tags = ["a","b","c","d","e","f"] → ["c","d","e"]

✅ Quick Reference

$slice: [array, n] → first n elements
$slice: [array, skip, limit] → slice like [skip : skip+limit]
To get "2 → end", use $subtract: [ $size, start ] for limit
 */}