const publishEvent = require("./publisher");
require("./worker"); // this starts the subscriptions

async function main() {
    console.log("Starting worker...");

    console.log("Sending test updates...");

    await publishEvent("author_updates", {
        authorId: "6742f83b84153b31b5a4f8aa",
        value: 99
    });

    await publishEvent("book_updates", {
        bookId: "6742f83b84153b31b5a4f8aa",
        title: "New Title"
    });

    console.log("Both events published!");
}

main();
