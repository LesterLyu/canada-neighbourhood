const {getJson, initGeoJson} = require('../utils');

/**
 * https://data-markham.opendata.arcgis.com/datasets/york::early-development-instrument-edi-neighbourhood-boundary?geometry=-85.227%2C43.243%2C-73.258%2C44.627
 * @return {Promise<{geojson: {features: [], type: string}, list: [], name: string}>}
 */
async function getData() {

  // This API get all boundaries in york region instead of a city, i.e. Markham
  const data = await getJson(`https://opendata.arcgis.com/datasets/424f0630283a452db5ac90db5d784422_0.geojson`);
  const list = [], geojson = initGeoJson();

  /**
   * Keep code, name, geometry
   */
  for (const feature of data.features) {
    const name = feature.properties.NBHDNAME;
    const code = feature.properties.NBHDCODE;

    list.push({code, name});
    geojson.features.push({
      type: 'Feature',
      geometry: feature.geometry,
      properties: {
        name,
        code
      }
    })
  }
  return {list, geojson, name: 'York Region'};
}

module.exports = {getData};
