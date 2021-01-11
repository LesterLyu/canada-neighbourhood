const {writeJson, copyDir} = require('./utils');
const ON = require('./ON');
const BC = require('./BC');
const QC = require('./QC');
const AB = require('./AB');
const fs = require('fs');
const {runCommands} = require('mapshaper');

const dataFolderPath = `${__dirname}/../../data`;

/**
 * Use mapshaper to reduce geojson size.
 * @return {Promise<void>}
 */
async function writeReducedGeoJson(province, region, targetPercentage = 1) {
  const filePath = `${dataFolderPath}/original/${province}/${region}.geojson`;
  const targetFolder = `${dataFolderPath}/reduced/${province}`;
  fs.mkdirSync(targetFolder, {recursive: true});
  await runCommands(`"${filePath}" -simplify dp ${targetPercentage} keep-shapes -o "${targetFolder}" extension=geojson`);
}

/**
 * Update and copy the neighbourhood data to a given path.
 * @function
 * @param {string} [path] - data folder path
 * @param {boolean} [print=false] - enable console log
 * @return {Promise.<void>}
 */
async function run(path, print = false) {

  const provinces = {ON, BC, QC, AB};
  const metadata = {};
  const neighbourhoods = {};

  const paths = path ? [dataFolderPath, path] : [dataFolderPath];

  for (const [province, regions] of Object.entries(provinces)) {
    for (const [region, {getData}] of Object.entries(regions)) {
      print && console.log(`canada-neighbourhood: Getting data for ${region}, ${province}...`);
      try {
        let data = await getData();
        if (!Array.isArray(data)) data = [data];

        for (let {name, list, geojson, reduce} of data) {

          // If name is not provided, use the region's name
          if (!name) name = region;

          // Check if the data is valid
          if (list.length < 1 || !list[0].name)
            console.error(`canada-neighbourhood: Malformed result at ${name}, ${province}!`);
          else {
            for (const path of paths) {
              await writeJson(list, `${path}/original/${province}/${name}.json`);
              await writeJson(geojson, `${path}/original/${province}/${name}.geojson`);
              await writeReducedGeoJson(province, name, reduce);
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
