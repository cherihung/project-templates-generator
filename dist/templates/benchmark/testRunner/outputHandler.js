const fs = require('fs');
const path = require('path');

function outputToJson(data, callback) {
  const jsonData = JSON.stringify(data);
  const fileName = `results.json`;
  const resultsFile = path.join(__dirname, '..', 'results', 'src', 'data', `${fileName}`);
  fs.writeFile(resultsFile, jsonData, 'utf8', () => callback(resultsFile));
}

module.exports = outputToJson;