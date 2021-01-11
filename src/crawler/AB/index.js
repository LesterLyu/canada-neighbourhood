let cities = {};

require("fs").readdirSync(__dirname).forEach(function(file) {
  if (file !== 'index.js' && file.endsWith('.js')) {
    const name = file.slice(0, -3);
    cities[name] = require(`./${name}`);
  }
});

module.exports = {
  ...cities
}
