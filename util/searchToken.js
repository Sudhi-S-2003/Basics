function searchToken(search) {
  if (!search) return { q: [], search: "" };

  const tokens = search.trim().split(/\s+/);
  const result = { q: [] };

  tokens.forEach(token => {
    if (token.includes(":")) {
      const [key, ...rest] = token.split(":");
      const value = rest.join(":");
      if (key && value) {
        if (key === "q") {
          throw new Error("q is reserved key");
        } else {
          result[key] = value;
        }
      }
    } else {
      result.q.push(token);
    }
  });

  result.search = result.q.join(" ");
  return result;
}


// ✅ handle errors outside
try {
  console.log(searchToken("q:edd ee:ee name:appu"));
} catch (err) {
  console.error("Error:", err.message);
}

try {
  console.log(searchToken("hello world name:appu"));
} catch (err) {
  console.error("Error:", err.message);
}
