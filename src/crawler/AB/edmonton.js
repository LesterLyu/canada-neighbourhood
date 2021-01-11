const {getJson, initGeoJson} = require('../utils');

/**
 * https://data.edmonton.ca/Geospatial-Boundaries/City-of-Edmonton-Neighbourhood-Boundaries/jfvj-x253
 * @return {Promise<{geojson: {features: [], type: string}, list: []}>}
 */
async function getData() {
  const data = await getJson('https://data.edmonton.ca/api/geospatial/jfvj-x253?method=export&format=GeoJSON');
  const store = [];
  const geojson = initGeoJson();

  /**
   * Keep code, name, geometry
   */
  for (const feature of data.features) {
    // Attribute `number` seems to be id-like
    const {name, number} = feature.properties;

    store.push({name, code: number});
    geojson.features.push({
      type: 'Feature',
      geometry: feature.geometry,
      properties: {
        name, code: number
      }
    })
  }
  return {name: 'Edmonton',list: store, geojson};
}

module.exports = {getData};
