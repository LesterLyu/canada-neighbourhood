const {getJson, initGeoJson} = require('../utils');

/**
 * https://open.toronto.ca/dataset/neighbourhoods/
 * @return {Promise<{geojson: {features: [], type: string}, list: []}>}
 */
async function getData() {
  const packageId = "4def3f65-2a65-4a4f-83c4-b2a4aed72d46";
  const {result: packages} = await getJson(`https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/package_show?id=${packageId}`);
  const resources = packages["resources"].filter(r => r.datastore_active);

  const data = await getJson(`https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search?limit=1000&id=${resources[0]["id"]}`);
  const store = [], geojson = initGeoJson();

  /**
   * Keep code, name, geometry
   */
  for (const item of data.result.records) {
    const name = item.AREA_NAME.slice(0, item.AREA_NAME.indexOf(' ('));
    const code = Number(item.AREA_SHORT_CODE);

    store.push({
      code,
      name,
    });

    geojson.features.push({
      type: 'Feature',
      geometry: JSON.parse(item.geometry),
      properties: {
        name,
        code
      }
    })
  }
  return {name: 'Toronto', list: store, geojson, reduce: 0.3};
}

module.exports = {getData};
