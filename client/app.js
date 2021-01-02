var path = require('path');
const dotenv = require("dotenv");
dotenv.config();
var apos = require('apostrophe')({
  shortName: 'client',

  // See lib/modules for basic project-level configuration of our modules
  // responsible for serving static assets, managing page templates and
  // configuring user accounts.

  modules: {

    // Apostrophe module configuration

    // Note: most configuration occurs in the respective
    // modules' directories. See lib/apostrophe-assets/index.js for an example.

    // However any modules that are not present by default in Apostrophe must at
    // least have a minimal configuration here: `moduleName: {}`

    // If a template is not found somewhere else, serve it from the top-level
    // `views/` folder of the project

    settings: {
      // So we can write `apos.settings` in a template
      alias: 'LIVERPOOLMODULE',
      // NOTE: LIVE ENV FILE . Comment when working in local.
      'phr-module': process.env.SERVICE_PHR
      //'phr-module': 'https://localhost:3010'
    },
    "apostrophe-db": {
      uri: process.env.MONGO_STRING
    },
    'auth-module': {},
    'about-module': {},
    'dashboard-module': {},
    'home-module': {},
    'referral-home-module': {},
    'referral-module': {},
    'education-employment-module': {},
    'review-module': {},
    'role-module': {},
    'referral-complete-module': {},
    'resources-module': {},
    'feedback-module': {},
    'check-referral-module': {},
    'footer-pages-module': {},
    'apostrophe-templates': { viewsFolderFallback: path.join(__dirname, 'views') }

  }
});
