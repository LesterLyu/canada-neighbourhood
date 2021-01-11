## Canada neighbourhood data with crawler

### Install
```sh
npm i canada-neighbourhood
# OR
yarn add canada-neighbourhood
```

### Data Folder Structure
```text
 - 📁 AB               --- Province AB
   - Edmonton.geojson  --- Geojson
   - Edmonton.json     --- A list of neighbourhood names and unique code
 - 📁 BC
 - 📁 ON
 - 📁 QC
 - data.json           --- e.g. {"ON":{"Hamilton":["Ainslie Wood","Ainslie Wood East", ...]}}
 - metadata.json       --- e.g. {"AB": ["Edmonton"], "ON": ["Toronto", ...]}
```


### APIs
```js
const {update, copy} = require('canada-neighbourhood');
```

#### copy(path: string)
Copy the whole data folder to a given path.

#### update([path: string, print: boolean])
Update the data folder inside this package. If path is given, also copy the updated data folder
to the given path. Set print to true will enable log into the console.
