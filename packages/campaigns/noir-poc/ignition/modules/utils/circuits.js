const fs = require('fs');
const path = require('path');

function getCircuit(levelName) {
  return fs.readFileSync(getCircuitPath(levelName), 'utf8');
}

function getCircuitPath(levelName) {
  return path.join(
    __dirname,
    '../../../circuits',
    `${levelName}`,
    'target',
    'circuits.json'
  );
}

module.exports = { getCircuit };
