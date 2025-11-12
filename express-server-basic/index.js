// ===========================================================
// SIMPLE pattern engine — add as many as you like
// ===========================================================

// each pattern is a function (rows) => void
const patterns = {

    // ---------------- SIMPLE ----------------
    1: (rows) => {                 // Triangular increment
        let c = 1;
        for (let i = 1; i <= rows; i++) {
            console.log(Array.from({ length: i }, _ => c++).join(' '));
        }
    },

    2: (rows) => {                 // Repeated numbers
        for (let i = 1; i <= rows; i++) console.log((i + ' ').repeat(i).trim());
    },

    3: (rows) => {                 // Right-triangle stars
        for (let i = 1; i <= rows; i++) console.log('* '.repeat(i).trim());
    },

    4: (rows) => {                 // Inverted triangle
        for (let i = rows; i >= 1; i--) console.log('* '.repeat(i).trim());
    },

    5: (rows) => {                 // Right-aligned triangle
        for (let i = 1; i <= rows; i++) console.log(' '.repeat(rows - i) + '* '.repeat(i).trim());
    },

    // ---------------- MEDIUM ----------------
    6: (rows) => {                 // Number pyramid
        for (let i = 1; i <= rows; i++) {
            const nums = Array.from({ length: i }, (_, j) => j + 1);
            console.log(' '.repeat(rows - i) + nums.join(' '));
        }
    },

    7: (rows) => {                 // Inverted number pyramid
        for (let i = rows; i >= 1; i--) {
            const nums = Array.from({ length: i }, (_, j) => j + 1);
            console.log(nums.join(' '));
        }
    },

    8: (rows) => {                 // Floyd’s triangle
        let n = 1;
        for (let i = 1; i <= rows; i++) {
            console.log(Array.from({ length: i }, _ => n++).join(' '));
        }
    },

    9: (rows) => {                 // Pascal-like 1 pattern
        for (let i = 0; i < rows; i++) {
            let num = 1, line = '';
            for (let j = 0; j <= i; j++) {
                line += num + ' ';
                num = num * (i - j) / (j + 1);
            }
            console.log(line.trim());
        }
    },

    10: (rows) => {                // 0-1 triangle
        for (let i = 1; i <= rows; i++) {
            const row = [];
            for (let j = 1; j <= i; j++) row.push((i + j) % 2);
            console.log(row.join(' '));
        }
    },

    // ---------------- HARD ----------------
    11: (rows) => {                // Diamond
        for (let i = 1; i <= rows; i++)
            console.log(' '.repeat(rows - i) + '* '.repeat(i).trim());
        for (let i = rows - 1; i >= 1; i--)
            console.log(' '.repeat(rows - i) + '* '.repeat(i).trim());
    },

    12: (rows) => {                // Hollow diamond
        for (let i = 1; i <= rows; i++)
            console.log(' '.repeat(rows - i) + '*'.padEnd(i > 1 ? 2 * i - 1 : 1, ' ') + (i > 1 ? '*' : ''));
        for (let i = rows - 1; i >= 1; i--)
            console.log(' '.repeat(rows - i) + '*'.padEnd(i > 1 ? 2 * i - 1 : 1, ' ') + (i > 1 ? '*' : ''));
    },

    13: (rows) => {                // Numeric diamond
        for (let i = 1; i <= rows; i++) {
            const part = Array.from({ length: i }, (_, j) => j + 1);
            console.log(' '.repeat(rows - i) + part.join(' ') + ' ' + part.slice(0, -1).reverse().join(' '));
        }
        for (let i = rows - 1; i >= 1; i--) {
            const part = Array.from({ length: i }, (_, j) => j + 1);
            console.log(' '.repeat(rows - i) + part.join(' ') + ' ' + part.slice(0, -1).reverse().join(' '));
        }
    },

    14: (rows) => {                // Alphabet triangle
        for (let i = 0; i < rows; i++)
            console.log(String.fromCharCode(...Array.from({ length: i + 1 }, (_, j) => 65 + j)).split('').join(' '));
    },

    15: (rows) => {                // Inverted alphabet
        for (let i = rows; i >= 1; i--)
            console.log(String.fromCharCode(...Array.from({ length: i }, (_, j) => 65 + j)).split('').join(' '));
    },

    // ---------------- EXTREME ----------------
    16: (rows) => {                // Palindromic number pyramid
        for (let i = 1; i <= rows; i++) {
            const left = Array.from({ length: i }, (_, j) => j + 1);
            const right = left.slice(0, -1).reverse();
            console.log(' '.repeat(rows - i) + left.concat(right).join(''));
        }
    },

    17: (rows) => {                // Hollow square
        for (let i = 1; i <= rows; i++) {
            let line = '';
            for (let j = 1; j <= rows; j++)
                line += (i === 1 || i === rows || j === 1 || j === rows) ? '* ' : '  ';
            console.log(line.trim());
        }
    },

    18: (rows) => {                // Checkerboard
        for (let i = 1; i <= rows; i++) {
            const row = Array.from({ length: rows }, (_, j) => ((i + j) % 2 ? 0 : 1));
            console.log(row.join(' '));
        }
    },

    19: (rows) => {                // Hourglass
        for (let i = rows; i >= 1; i--) console.log(' '.repeat(rows - i) + '* '.repeat(i).trim());
        for (let i = 2; i <= rows; i++) console.log(' '.repeat(rows - i) + '* '.repeat(i).trim());
    },

    20: (rows) => {                // Zigzag numbers
        for (let i = 1; i <= rows; i++) {
            const row = Array.from({ length: rows }, (_, j) =>
                (i % 2 ? (i - 1) * rows + j + 1 : i * rows - j)
            );
            console.log(row.join(' '));
        }
    },

    // ---------------- EXTREME HARD PATTERNS ----------------

    // 21️⃣ Spiral matrix (numbers clockwise)
    21: (n) => {
        let arr = Array.from({ length: n }, () => Array(n).fill(0));
        let num = 1, top = 0, bottom = n - 1, left = 0, right = n - 1;
        while (top <= bottom && left <= right) {
            for (let i = left; i <= right; i++) arr[top][i] = num++;
            top++;
            for (let i = top; i <= bottom; i++) arr[i][right] = num++;
            right--;
            for (let i = right; i >= left; i--) arr[bottom][i] = num++;
            bottom--;
            for (let i = bottom; i >= top; i--) arr[i][left] = num++;
            left++;
        }
        arr.forEach(r => console.log(r.join(' ')));
    },

    // 22️⃣ Butterfly pattern
   22: (n) => {
        for (let i = 1; i <= n; i++) {
            console.log('*'.repeat(i) + ' '.repeat(2 * (n - i)) + '*'.repeat(i));
        }
        for (let i = n; i >= 1; i--) {
            console.log('*'.repeat(i) + ' '.repeat(2 * (n - i)) + '*'.repeat(i));
        }
    },

    // 23️⃣ Concentric square (numbered layers)
   23: (n) => {
        let size = 2 * n - 1;
        for (let i = 0; i < size; i++) {
            let line = '';
            for (let j = 0; j < size; j++) {
                let val = n - Math.min(Math.min(i, j), Math.min(size - 1 - i, size - 1 - j));
                line += val + ' ';
            }
            console.log(line.trim());
        }
    },

    // 24️⃣ Cross/X pattern
   24: (n) => {
        for (let i = 0; i < n; i++) {
            let line = '';
            for (let j = 0; j < n; j++) {
                line += (i === j || i + j === n - 1) ? '* ' : '  ';
            }
            console.log(line.trim());
        }
    },

    // 25️⃣ Heart pattern
   25: (n) => {
        let size = 2 * n;
        for (let i = n / 2; i <= n; i += 2) {
            let line = ' '.repeat(n - i);
            line += '*'.repeat(i);
            line += ' '.repeat(n - i);
            line += '*'.repeat(i);
            console.log(line);
        }
        for (let i = n; i > 0; i--) {
            console.log(' '.repeat(n - i) + '*'.repeat(i * 2 - 1));
        }
    },

};

// ===========================================================
// run all registered patterns
// ===========================================================
Object.entries(patterns).forEach(([id, fn]) => {
    console.log(`\nPattern ${id}:`);
    fn(5);
});
