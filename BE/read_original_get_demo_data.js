const fs = require('fs');
const content = fs.readFileSync('D:/VIETFUTURE/Roadmap2_original.txt', 'utf8');

const startIdx = content.indexOf('getDemoDataForRole');
if (startIdx !== -1) {
  console.log(content.substring(startIdx - 50, startIdx + 800));
} else {
  console.log("Not found");
}
