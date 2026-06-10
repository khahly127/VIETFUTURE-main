const fs = require('fs');
const content = fs.readFileSync('D:/VIETFUTURE/Roadmap2_original.txt', 'utf8');

const regex = /bg-[a-zA-Z0-9#\[\]\/]+/g;
let match;
while ((match = regex.exec(content)) !== null) {
  console.log(`Found match at index ${match.index}: ${match[0]}`);
  console.log(content.substring(match.index - 50, match.index + 150));
}
