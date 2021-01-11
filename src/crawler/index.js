const {writeJson, copyDir} = require('./utils');
const ON = require('./ON');
const BC = require('./BC');
const QC = require('./QC');
const AB = require('./AB');
const fs = require('fs');

const dataFolderPath = `${__dirname}/../../data`;

const provinces = {ON, BC, QC, AB};
const metadata = {};
const neighbourhoods = {};

/**
 * Update and copy the neighbourhood data to a given path.
 * @function
 * @param {string} [path] - data folder path
 * @param {boolean} [print=false] - enable console log
 * @return {Promise.<void>}
 */
async function run(path, print = false) {
  const paths = path ? [dataFolderPath, path] : [dataFolderPath];
  for (const path of paths)
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

  for (const [province, regions] of Object.entries(provinces)) {
    for (const path of paths)
      if (!fs.existsSync(`${path}/${province}`)) {
        fs.mkdirSync(`${path}/${province}`);
      }
    for (const [region, {getData}] of Object.entries(regions)) {
      print && console.log(`canada-neighbourhood: Getting data for ${region}, ${province}...`);
      try {
        let data = await getData();
        if (!Array.isArray(data)) data = [data];

        for (let {name, list, geojson} of data) {

          // If name is not provided, use the region's name
          if (!name) name = region;

          // Check if the data is valid
          if (list.length < 1 || !list[0].name)
            console.error(`canada-neighbourhood: Malformed result at ${name}, ${province}!`);
          else {
            for (const path of paths) {
              await writeJson(list, `${path}/${province}/${name}.json`);
              await writeJson(geojson, `${path}/${province}/${name}.geojson`);
            }

            if (!metadata[province]) metadata[province] = [];
            metadata[province].push(name);

            if (!neighbourhoods[province]) neighbourhoods[province] = {};
            neighbourhoods[province][name] = list.map(item => item.name).sort();
          }
        }

      } catch (e) {
        console.error(`canada-neighbourhood: Error at ${region}, ${province}!`)
        console.error(e);
      }

    }
  }

  for (const path of paths) {
    await writeJson(metadata, `${path}/metadata.json`);
    await writeJson(neighbourhoods, `${path}/data.json`);
  }
}

/**
 * Copy cached neighbourhood data to a given path.
 */
async function copy(path) {
  await copyDir(dataFolderPath, path);
}

module.exports = {run, copy}
