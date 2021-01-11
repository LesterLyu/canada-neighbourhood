const {getJson, initGeoJson} = require('../utils');

/**
 * https://open.hamilton.ca/datasets/370a19ad2e1543989e6dcb00254b3eb4_3/data?page=11
 * @return {Promise<{geojson: {features: [], type: string}, list: []}>}
 */
async function getData() {
  const data = await getJson(`https://opendata.arcgis.com/datasets/370a19ad2e1543989e6dcb00254b3eb4_3.geojson`);
  const store = [];
  const geojson = initGeoJson();

  /**
   * Keep code, name, geometry
   */
  for (const feature of data.features) {
    const name = feature.properties.NH_NAME;
    const code = Number(feature.properties.NH_NUMBER);

    store.push({code, name});
    geojson.features.push({
      type: 'Feature',
      geometry: feature.geometry,
      properties: {
        name,
        code
      }
    })
  }
  return {name: 'Hamilton', list: store, geojson};
}

module.exports = {getData};
