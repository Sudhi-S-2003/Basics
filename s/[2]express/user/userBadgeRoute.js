const badgeColors = require("./badgeColors");
const fillColors = require("./fillColors");
const avatars = require("./avatars");

const UserBadgeRoute = (req, res) => {
  const {
    name = "Anonymous",
    role = "Developer",
    color = "default",
    textColor = "light",
    avatar = "",
  } = req.query;

  // 🧩 Resolve colors
  const bgColor = color.startsWith("#") ? color : (badgeColors[color] || badgeColors.default);
  const txtColor = textColor.startsWith("#") ? textColor : (fillColors[textColor] || fillColors.default);

  // 🧠 Safe text escaping
  const escapeXML = (str = "") =>
    str.replace(/[<>&'"]/g, c =>
      ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c])
    );

  const safeName = escapeXML(name);
  const safeRole = escapeXML(role);

  // 🔠 Dynamic width
  const nameWidth = safeName.length * 9;
  const roleWidth = safeRole.length * 6;
  const totalWidth = Math.max(160, nameWidth + roleWidth + 80);

  // 🖼️ Avatar selection priority:
  // 1️⃣ Custom URL or base64 (if avatar includes "http" or "data:image")
  // 2️⃣ Pre-stored avatar key (from avatars.js)
  // 3️⃣ Default avatar
  const resolvedAvatar =
    avatar.startsWith("http") || avatar.startsWith("data:image")
      ? avatar
      : avatars[avatar] || avatars.default;

  const avatarTag = resolvedAvatar
    ? `<image x="10" y="6" width="28" height="28" clip-path="url(#clipCircle)" href="${resolvedAvatar}" />`
    : `<circle cx="24" cy="20" r="12" fill="#ccc" />`;

  // 🧠 SVG Badge
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="40" role="img" aria-label="${safeName}">
  <title>${safeName} - ${safeRole}</title>

  <defs>
    <clipPath id="clipCircle">
      <circle cx="24" cy="20" r="12"/>
    </clipPath>
  </defs>

  <!-- Background -->
  <rect width="${totalWidth}" height="40" rx="8" fill="${bgColor}" stroke="rgba(0,0,0,0.1)" />

  <!-- Avatar -->
  ${avatarTag}

  <!-- Text -->
  <text x="55" y="20" font-size="14" font-weight="bold" fill="${txtColor}" font-family="Verdana, sans-serif">
    ${safeName}
  </text>
  <text x="55" y="33" font-size="11" fill="${txtColor}" opacity="0.85" font-family="Verdana, sans-serif">
    ${safeRole}
  </text>

  <!-- Shadow border -->
  <rect width="${totalWidth}" height="40" rx="8" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="1" />
</svg>
`.trim();

  // 🧾 Headers
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(svg);
};

module.exports = UserBadgeRoute;
