const {getJson, initGeoJson} = require('../utils');

/**
 * https://opendata.vancouver.ca/explore/dataset/local-area-boundary/information/?rows=100
 * @return {Promise<{geojson: {features: [], type: string}, list: []}>}
 */
async function getData() {
  const data = await getJson(`https://opendata.vancouver.ca/explore/dataset/local-area-boundary/download/?format=geojson&timezone=America/New_York&lang=en`);
  const store = [];
  const geojson = initGeoJson();

  /**
   * Keep code, name, geometry
   */
  for (const feature of data.features) {
    const name = feature.properties.name;
    const code = feature.properties.mapid;

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
  return {name: 'Vancouver',list: store, geojson};
}

module.exports = {getData};
