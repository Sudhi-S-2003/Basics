const badgeColors = require("./badgeColors");

// Function to generate a Base64 SVG placeholder
const generatePlaceholder = (label, bg = "#ccc", fg = "#555") => {
  return "data:image/svg+xml;base64," +
    Buffer.from(`
      <svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'>
        <circle cx='24' cy='24' r='22' fill='${bg}' stroke='#999' stroke-width='2'/>
        <text x='24' y='30' text-anchor='middle' font-size='16' fill='${fg}'>${label}</text>
      </svg>
    `).toString("base64");
};

// Get all badge color values as an array
const colorValues = Object.values(badgeColors);

// Map letter to a consistent color using its char code
const getColorForLetter = (letter) => {
  const index = letter.toUpperCase().charCodeAt(0) - 65; // 'A' => 0, 'B' => 1...
  return colorValues[index % colorValues.length]; // wrap if more letters than colors
};

// Generate 260 avatars A1..Z10
const generatedAvatars = {};
const generatedAvatarKeys = [];
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
for (let i = 0; i < letters.length; i++) {
  const letter = letters[i];
  const bgColor = getColorForLetter(letter);
  for (let j = 1; j <= 10; j++) {
    const key = `${letter}${j}`;
    generatedAvatars[key] = generatePlaceholder(key, bgColor);
    generatedAvatarKeys.push(key);
  }
}

module.exports = { generatedAvatars, generatedAvatarKeys };
