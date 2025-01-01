const cypress = require('eslint-plugin-cypress/flat');

module.exports = [
  cypress.configs['recommended'],
  {
    // Override or add rules here
    rules: {},
  },
];
