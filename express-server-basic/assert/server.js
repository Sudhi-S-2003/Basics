const assert = require('assert'); // CommonJS


// assert(1 + 1 === 2);     // OK
// assert(1 + 1 === 3);     // Throws AssertionError


// assert.strictEqual(5, 5);      // OK
// assert.strictEqual('5', 5);    // ❌ Throws


// assert.notStrictEqual('5', 5); // OK
// assert.notStrictEqual(10, 10); // ❌ Throws


// assert.deepStrictEqual(
//   { a: 1, b: { c: 2 } },
//   { a: 1, b: { c: 2 } }
// ); // OK


