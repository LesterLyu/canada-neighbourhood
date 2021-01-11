const {getJson, initGeoJson} = require('../utils');

/**
 * https://open.ottawa.ca/datasets/ottawa-neighbourhood-study-ons-neighbourhood-boundaries-gen-2/data
 * @return {Promise<{geojson: {features: [], type: string}, list: []}>}
 */
async function getData() {
  const data = await getJson(`https://opendata.arcgis.com/datasets/32fe76b71c5e424fab19fec1f180ec18_0.geojson`);
  const store = [];
  const geojson = initGeoJson();

  /**
   * Keep code, name, geometry
   */
  for (const feature of data.features) {
    const name = feature.properties.Name;
    const nameInFrench = feature.properties.Name_FR;
    const code = feature.properties.FID;

    store.push({code, name, nameInFrench});
    geojson.features.push({
      type: 'Feature',
      geometry: feature.geometry,
      properties: {
        name, nameInFrench,
        code
      }
    })
  }
  return {name: 'Ottawa', list: store, geojson, reduce: 0.4};
}

module.exports = {getData};
