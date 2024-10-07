const fs = require('fs');
const path = require('path');
const os = require('os');
const {
  createFolderIfMissing,
  createFileIfMissing,
} = require('ethernaut-common/src/io/create-file');

function read() {
  init();

  const data = fs.readFileSync(getStorageFilePath());
  return JSON.parse(data);
}

function write(data) {
  init();
  const storageFilePath = getStorageFilePath();
  fs.writeFileSync(storageFilePath, JSON.stringify(data, null, 2));
}

function init(
  defaultData = {
    chains: {},
  }
) {
  createFolderIfMissing(getStorageFolderPath());
  createFileIfMissing(getStorageFilePath(), () => defaultData);
}

function getStorageFilePath() {
  return path.join(getStorageFolderPath(), 'data.json');
}

function getStorageFolderPath() {
  return path.join(os.homedir(), '.zeronaut');
}

module.exports = {
  read,
  write,
};
