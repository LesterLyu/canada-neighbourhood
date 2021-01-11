const {parse} = require('node-html-parser');
const fetch = require('node-fetch');
const {initGeoJson} = require('../utils');

/**
 * https://donnees.montreal.ca/ville-de-montreal/quartiers
 * Notes:
 *  The link are generated dynamically with cookie, so we need to access the webpage and get the dynamic cookie!
 * @return {Promise<{geojson: {features: [], type: string}, list: []}>}
 */
async function getData() {
  const response = await fetch('https://donnees.montreal.ca/ville-de-montreal/quartiers');

  // Find and construct cookies
  const cookies = response.headers.raw()['set-cookie'];
  let cookieToSend = '';
  for (const cookie of cookies) {
    const str = cookie.match(/(.*?)=(.*?)($|;|,(?! ))/)[0];
    cookieToSend += str + ' ';
  }
  // Remove the last ';'
  cookieToSend = cookieToSend.slice(0, cookieToSend.length - 2);

  // Parse the page and find the link
  const body = await response.text();
  const root = parse(body);
  let downloadUrl;

  const tableRows = root.querySelectorAll('.border-t.border-gray-400');
  tableRows.forEach(row => {
    if (row.innerText.includes('geojson')) {
      downloadUrl = row.querySelector('a').attributes.href;
    }
  });

  if (!downloadUrl) throw Error('Failed to get downloadable geojson');

  // Fetch the downloadUrl with appropriate cookie
  const data = await (await fetch(downloadUrl, {headers: {cookie: cookieToSend}})).json();
  // const buffer = Buffer.from(await blob.arrayBuffer());
  // const data = JSON.parse(buffer.toString('latin1'));

  const store = [];
  const geojson = initGeoJson();

  /**
   * Keep code, name, geometry
   */
  for (const feature of data.features) {
    const name = feature.properties.nom_qr;
    const code = feature.properties.no_qr;

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
  return {name: 'Montreal', list: store, geojson, reduce: 0.45};
}

module.exports = {getData};
