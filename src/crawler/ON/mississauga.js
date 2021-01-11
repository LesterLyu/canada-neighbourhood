const {getJson, initGeoJson} = require('../utils');

/**
 * https://data.mississauga.ca/datasets/2016-census-data-by-neighbourhoods-shape-file/data?geometry=-79.960%2C43.555%2C-79.212%2C43.642
 * @return {Promise<{geojson: {features: [], type: string}, list: []}>}
 */
async function getData() {
  const data = await getJson(`https://opendata.arcgis.com/datasets/3a90af0bfd034a48a1bee2f7ff4f105a_0.geojson`);
  const store = [];
  const geojson = initGeoJson();

  /**
   * Keep code, name, geometry
   */
  for (const feature of data.features) {
    const name = feature.properties.CENTROID;
    const code = feature.properties.FID;

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
  return {name: 'Mississauga', list: store, geojson};
}

module.exports = {getData};
