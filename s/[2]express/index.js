const express = require("express");
const BageRoute = require("./bage/bageRoute");
const UserBadgeRoute = require("./user/userBadgeRoute");
const generatedAvatars = require("./user/generatedAvatars");
const app = express();
const PORT = process.env.PORT || 3000;

// Generate your SVG as a string
const badgeSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="87.25" height="28" role="img" aria-label="SUDHI">
  <title>SUDHI</title>
  <g shape-rendering="crispEdges">
    <rect width="87.25" height="28" fill="#f7df1e"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="100">
    <image x="9" y="7" width="14" height="14"
      href="data:image/svg+xml;base64,PHN2ZyBmaWxsPSJ3aGl0ZSIgcm9sZT0iaW1nIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHRpdGxlPkphdmFTY3JpcHQ8L3RpdGxlPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMFYwem0yMi4wMzQgMTguMjc2Yy0uMTc1LTEuMDk1LS44ODgtMi4wMTUtMy4wMDMtMi44NzMtLjczNi0uMzQ1LTEuNTU0LS41ODUtMS43OTctMS4xNC0uMDkxLS4zMy0uMTA1LS41MS0uMDQ2LS43MDUuMTUtLjY0Ni45MTUtLjg0IDEuNTE1LS42Ni4zOS4xMi43NS40Mi45NzYuOSAxLjAzNC0uNjc2IDEuMDM0LS42NzYgMS43NTUtMS4xMjUtLjI3LS40Mi0uNDA0LS42MDEtLjU4Ni0uNzgtLjYzLS43MDUtMS40NjktMS4wNjUtMi44MzQtMS4wMzRsLS43MDUuMDg5Yy0uNjc2LjE2NS0xLjMyLjUyNS0xLjcxIDEuMDA1LTEuMTQgMS4yOTEtLjgxMSAzLjU0MS41NjkgNC40NzEgMS4zNjUgMS4wMiAzLjM2MSAxLjI0NCAzLjYxNiAyLjIwNS4yNCAxLjE3LS44NyAxLjU0NS0xLjk2NiAxLjQxLS44MTEtLjE4LTEuMjYtLjU4Ni0xLjc1NS0xLjMzNmwtMS44MyAxLjA1MWMuMjEuNDguNDUuNjg5LjgxIDEuMTA5IDEuNzQgMS43NTYgNi4wOSAxLjY2NiA2Ljg3MS0xLjAwNC4wMjktLjA5LjI0LS43MDUuMDc0LTEuNjVsLjA0Ni4wNjd6bS04Ljk4My03LjI0NWgtMi4yNDhjMCAxLjkzOC0uMDA5IDMuODY0LS4wMDkgNS44MDUgMCAxLjIzMi4wNjMgMi4zNjMtLjEzOCAyLjcxMS0uMzMuNjg5LTEuMTguNjAxLTEuNTY2LjQ4LS4zOTYtLjE5Ni0uNTk3LS40NjYtLjgzLS44NTUtLjA2My0uMTA1LS4xMS0uMTk2LS4xMjctLjE5NmwtMS44MjUgMS4xMjVjLjMwNS42My43NSAxLjE3MiAxLjMyNCAxLjUxNy44NTUuNTEgMi4wMDQuNjc1IDMuMjA3LjQwNS43ODMtLjIyNiAxLjQ1OC0uNjkxIDEuODExLTEuNDExLjUxLS45My40MDItMi4wNy4zOTctMy4zNDYuMDEyLTIuMDU0IDAtNC4xMDkgMC02LjE3OWwuMDA0LS4wNTZ6Ii8+PC9zdmc+"/>
    <text transform="scale(.1)" x="536.25" y="175" textLength="432.5" fill="#333" font-weight="bold">SUDHI</text>
  </g>
</svg>
`.trim();

// Serve SVG at /badge (usable as <img src="/badge">)
app.get("/badge",BageRoute);
app.get("/user", UserBadgeRoute);
app.get("/", (req, res) => {
  res.send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Sudhi Badge</title>
        <style>
          body { background: #f4f4f4; text-align: center; padding-top: 40px; font-family: sans-serif; }
          img { border-radius: 50%; border: 2px solid #999; }
          code { background: #eee; padding: 2px 4px; border-radius: 4px; }
          .avatar-grid { display: flex; flex-wrap: wrap; justify-content: center; }
          .avatar-item { margin: 5px; text-align: center; }
        </style>
      </head>
      <body>
        <h2>Badge Preview</h2>
        <img src="/badge" alt="Sudhi Badge" width="96" height="96"/>
        <p>Use anywhere: <code>&lt;img src="http://localhost:${PORT}/badge" alt="SUDHI"/&gt;</code></p>

        <h3>User Avatars Preview</h3>
        <div class="avatar-grid">
          ${generatedAvatars.generatedAvatarKeys.slice(0, 50).map(key => `
            <div class="avatar-item">
              <img src="/user?avatar=${key}" width="48" height="48" alt="${key}"/><br/>
              ${key}
            </div>
          `).join("")}
        </div>
      </body>
    </html>
  `);
});

app.listen(PORT, () => 
  console.log(`✅ SVG Badge at http://localhost:${PORT}/badge, avatars at /user`)
);
