const subscribeTo = require("./subscriber");

// Author updates
subscribeTo("author_updates", async ({ authorId, value }) => {
  console.log(`Mongo Sync Worker: Updating author ${authorId} score -> ${value}`);
});

// Book updates
subscribeTo("book_updates", async ({ bookId, title }) => {
  console.log(`Mongo Sync Worker: Updating book ${bookId} title -> ${title}`);
});
