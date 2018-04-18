const fs = require('fs');

// https://stackoverflow.com/a/32683879

/*
 * initializes all models and sources them as .model-name
 */
fs
  .readdirSync(__dirname)
  .forEach((file) => {
    if (file !== 'index.js') {
      const moduleName = file.split('.')[0];
      exports[moduleName] = require(`./${moduleName}`);
    }
  });
