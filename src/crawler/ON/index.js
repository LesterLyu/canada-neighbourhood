let cities = {};
const excludes = ['index.js', 'helpers.js'];

require("fs").readdirSync(__dirname).forEach(function(file) {
  if (!excludes.includes(file) && file.endsWith('.js')) {
    const name = file.slice(0, -3);
    cities[name] = require(`./${name}`);
  }
});

module.exports = {
  ...cities
}
