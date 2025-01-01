import {cypress} from 'eslint-plugin-cypress/flat';
import {baseConfig} from '../../eslint.config.cjs';


module.exports = [
  cypress.configs['recommended'],

  ...baseConfig,
  {
    // Override or add rules here
    rules: {},
  },
];
