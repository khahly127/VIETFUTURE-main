const fs = require('fs');
const content = fs.readFileSync('D:/VIETFUTURE/Roadmap2_original.txt', 'utf8');

const startIdx = content.indexOf('Internet');
if (startIdx !== -1) {
  console.log("FOUND AT INDEX:", startIdx);
  console.log(content.substring(startIdx - 100, startIdx + 400));
} else {
  console.log("NOT FOUND");
}
