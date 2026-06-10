const fs = require('fs');
try {
  const content = fs.readFileSync('D:/VIETFUTURE/Roadmap2_original.txt', 'utf8');
  console.log("File read success. Length of characters:", content.length);
  const lines = content.split('\n');
  console.log("Number of lines:", lines.length);
  // Print first 5 lines
  console.log("First 5 lines:");
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    console.log(`${i}: ${lines[i]}`);
  }
} catch (e) {
  console.error(e);
}
