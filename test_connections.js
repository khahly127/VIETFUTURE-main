const fs = require('fs');
const content = fs.readFileSync('d:/VIETFUTURE/FE/src/components/Roadmap/Roadmap2.jsx', 'utf8');

// Find function start
const targetStr = 'function getDemoDataForRole(roleName)';
const startIdx = content.indexOf(targetStr);

let braceCount = 0;
let endIdx = -1;
for (let i = startIdx + targetStr.length; i < content.length; i++) {
  if (content[i] === '{') braceCount++;
  if (content[i] === '}') {
    braceCount--;
    if (braceCount === 0) {
      endIdx = i + 1;
      break;
    }
  }
}

const funcStr = content.substring(startIdx, endIdx) + '\nmodule.exports = getDemoDataForRole;';
fs.writeFileSync('d:/VIETFUTURE/getDemoData_clean.js', funcStr);

const getDemoDataForRole = require('./getDemoData_clean.js');
const roles = ['frontend', 'backend', 'fullstack', 'data', 'mobile', 'devops', 'security', 'uiux'];

let totalWarnings = 0;

roles.forEach(role => {
  const data = getDemoDataForRole(role);
  const nodes = Object.keys(data.nodes);
  
  const nodeCol = {};
  data.cols.forEach((col, ci) => {
    col.forEach(nid => {
      if (nid !== '_') nodeCol[nid] = ci;
    });
  });

  const incoming = {};
  const outgoing = {};
  nodes.forEach(n => {
    incoming[n] = [];
    outgoing[n] = [];
  });

  data.connections.forEach(([from, to]) => {
    if (outgoing[from]) outgoing[from].push(to);
    if (incoming[to]) incoming[to].push(from);
  });

  nodes.forEach(n => {
    const col = nodeCol[n];
    const isStart = (col === 0);
    const isEnd = (col === 3);
    if (!isStart && incoming[n].length === 0) {
      console.log(`[WARNING] ${role.toUpperCase()} Node has NO incoming connections: ${n} (Col ${col})`);
      totalWarnings++;
    }
    if (!isEnd && outgoing[n].length === 0) {
      console.log(`[WARNING] ${role.toUpperCase()} Node has NO outgoing connections: ${n} (Col ${col})`);
      totalWarnings++;
    }
  });
});

console.log(`Diagnostic finished with ${totalWarnings} warnings.`);
