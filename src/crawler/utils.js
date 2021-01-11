const fetch = require('node-fetch');
const {promises: fs} = require('fs');
const path = require("path")

const getJson = async (url) => {
  return await ((await fetch(url)).json());
}

const writeJson = async (json, path) => {
  // mkdir if not exists
  await fs.mkdir(path.slice(0, path.lastIndexOf('/')), {recursive: true});

  if (Array.isArray(json))
    json = json.sort((a, b) => a.code - b.code);
  try {
    const data = JSON.stringify(json);
    await fs.writeFile(path, data);
  } catch (e) {
    console.error('Failed to write file:\n', e);
  }
}

const initGeoJson = () => {
  return {
    type: 'FeatureCollection',
    features: []
  }
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, {recursive: true});
  let entries = await fs.readdir(src, {withFileTypes: true});

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    entry.isDirectory() ?
      await copyDir(srcPath, destPath) :
      await fs.copyFile(srcPath, destPath);
  }
}

module.exports = {getJson, writeJson, initGeoJson, copyDir};
