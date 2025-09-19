const zlib = require("zlib");

function compress(obj) {
    const json = JSON.stringify(obj);
    console.log("Original size:", Buffer.byteLength(json, "utf8"), "bytes");
    const compressed = zlib.gzipSync(json).toString("base64");
    console.log("Compressed size:", Buffer.byteLength(compressed, "utf8"), "bytes");
    console.log("Compression ratio:", ((Buffer.byteLength(compressed) / Buffer.byteLength(json)) * 100).toFixed(2) + "%");
    return compressed;
}

function decompress(str) {
    const buffer = Buffer.from(str, "base64");
    const decompressed = zlib.gunzipSync(buffer).toString();
    console.log("Decompressed size:", Buffer.byteLength(decompressed, "utf8"), "bytes");
    return JSON.parse(decompressed);
}

// Generate sample dataset (10 orders)
function generateOrders(n = 10) {
    const orders = [];
    for (let i = 1; i <= n; i++) {
        orders.push({
            orderId: `ORD${10000 + i}`,
            customerId: `CUST${500 + i}`,
            items: [
                { productId: "P1", name: "Laptop", quantity: 1, price: 1200 },
                { productId: "P2", name: "Phone", quantity: 2, price: 800 },
                { productId: "P3", name: "Tablet", quantity: 3, price: 300 },
                { productId: "P4", name: "Headphones", quantity: 2, price: 150 },
                { productId: "P5", name: "Smartwatch", quantity: 1, price: 250 },
                { productId: "P6", name: "Keyboard", quantity: 4, price: 100 },
                { productId: "P7", name: "Monitor", quantity: 2, price: 400 }
            ],
            shippingAddress: {
                street: `${100 + i} Market St`,
                city: "San Francisco",
                zip: "94105",
                country: "USA"
            },
            totalAmount: 4050 + i * 10,
            status: i % 2 === 0 ? "pending" : "processing",
            createdAt: new Date().toISOString()
        });
    }
    return orders;
}

// Example
const data = generateOrders(20); // make 20 orders
const compressed = compress(data);
console.log("Compressed string preview:", compressed.slice(0, 100) + "...");
console.log("data:", {compressed});

const restored = decompress(compressed);
console.log("data:", {restored});

console.log("Restored equal:", JSON.stringify(data) === JSON.stringify(restored));
