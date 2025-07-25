const fs = require('fs');
const path = require('path');

if (process.argv.length < 3) {
  console.error('Usage: node change_toy_of_the_day.js <toyIndex>');
  process.exit(1);
}

const toyIndex = parseInt(process.argv[2], 10);
if (isNaN(toyIndex) || toyIndex < 0) {
  console.error('Invalid toy index. Must be a non-negative integer.');
  process.exit(1);
}

const indexPath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

// Regex to find currentToyIndexOverride variable assignment or declaration
const regex = /const\s+currentToyIndexOverride\s*=\s*(\d+|null);?/;

// If variable exists, replace it; otherwise, insert it before getToyOfTheDay function
if (regex.test(content)) {
  content = content.replace(regex, `const currentToyIndexOverride = ${toyIndex};`);
} else {
  // Insert declaration before function getToyOfTheDay
  const insertPos = content.indexOf('function getToyOfTheDay()');
  if (insertPos === -1) {
    console.error('Could not find getToyOfTheDay function in index.html');
    process.exit(1);
  }
  const before = content.substring(0, insertPos);
  const after = content.substring(insertPos);
  content = before + `const currentToyIndexOverride = ${toyIndex};\n\n` + after;
}

fs.writeFileSync(indexPath, content, 'utf8');
console.log(`Toy of the day index set to ${toyIndex} in index.html`);
