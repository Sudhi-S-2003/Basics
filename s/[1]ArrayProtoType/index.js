// Array.prototype.find = function(callback) {
//     console.log("Custom find called on", this);
//     return "🔍 Found by custom logic!";
// };

// console.log(["a", "b", "c"].find(x => x === "b"));


// String.prototype.yell = function() {
//     return this.toUpperCase() + "!!!";
// };

// console.log("hello".yell()); // HELLO!!!

// Object.prototype.sayHi = function () {
//     return "👋 Hi from Object!";
// };

// console.log({}.sayHi());               // 👋 Hi from Object!
// console.log({ name: "Alice" }.sayHi()); // 👋 Hi from Object!
// console.log([1, 2, 3].sayHi());         // 👋 Hi from Object!


// class ObjectIdLike {
//   constructor(id) {
//     if (!ObjectIdLike.isValid(id)) {
//       throw new Error("Invalid ObjectId string");
//     }
//     this.value = id;
//   }

//   toString() {
//     return this.value;
//   }

//   valueOf() {
//     return this.value;
//   }

//   toJSON() {
//     return this.value;
//   }

//   static isValid(str) {
//     return typeof str === "string" && /^[a-fA-F0-9]{24}$/.test(str);
//   }
// }

// // Usage:
// const id = new ObjectIdLike("507f1f77bcf86cd799439011");

// console.log(id);                        // ObjectIdLike { value: '507f1f77bcf86cd799439011' }
// console.log(id == "507f1f77bcf86cd799439011");   // ✅ true
// console.log(id === "507f1f77bcf86cd799439011");  // ❌ false
// console.log(String(id));                // "507f1f77bcf86cd799439011"
// console.log(JSON.stringify({ id }));    // {"id":"507f1f77bcf86cd799439011"}
// console.log(ObjectIdLike.isValid(id));  // true

// class Email {
//   constructor(value, verified = false) {
//     if (!Email.isValid(value)) {
//       throw new Error("Invalid email address");
//     }
//     this.value = value;
//     this.verified = verified;
//   }

//   toString() {
//     return this.value;
//   }

//   valueOf() {
//     return this.value;
//   }

//   toJSON() {
//     return this.value;
//   }

//   isVerified() {
//     return this.verified;
//   }

//   static isValid(email) {
//     // Very basic email regex. You can use a stricter one if needed.
//     return typeof email === "string" &&
//       /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   }
// }
// const myEmail = new Email("user@example.com", true);

// console.log(myEmail);                   // Email { value: 'user@example.com', verified: true }
// console.log(String(myEmail));          // "user@example.com"
// console.log(myEmail == "user@example.com");  // true
// console.log(myEmail === "user@example.com"); // false
// console.log(JSON.stringify({ email: myEmail })); // {"email":"user@example.com"}
// console.log(myEmail.isVerified());     // true


class Email {
    #verified; // private field

    constructor(value, verified = false) {
        if (!Email.isValid(value)) {
            throw new Error("Invalid email address");
        }
        this.value = value;
        this.#verified = verified;
    }

    toString() {
        return this.value;
    }

    valueOf() {
        console.log("this.value")
        return this.value;
    }

    toJSON() {
        return this.value;
    }

    equals(other) {
        console.log("---")
        if (!(other instanceof Email)) return false;
        return this.value === other.value && this.#verified === other.#verified;
    }

    isVerified() {
        return this.#verified;
    }

    static isValid(email) {
        return typeof email === "string" &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}


const myEmail = new Email("user@example.com", true);

// console.log(myEmail); // 👉 Only shows: Email { value: 'user@example.com' }

// console.log(String(myEmail));         // "user@example.com"
console.log(myEmail === "user@example.com"); // true
// console.log(myEmail.isVerified());    // true

// console.log(JSON.stringify({ email: myEmail }));
// // 👉 {"email":"user@example.com"}
