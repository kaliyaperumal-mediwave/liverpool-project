var path = require("path");
const dotenv = require("dotenv");
dotenv.config();
var apos = require("apostrophe")({
  shortName: "client",

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
      alias: "LIVERPOOLMODULE",
      // NOTE: LIVE ENV FILE . Comment when working in local.
      "phr-module": process.env.SERVICE_PHR,
      // 'phr-module': 'https://localhost:3010'
    },
    "apostrophe-db": {
      uri: process.env.MONGO_STRING,
    },

    "auth-module": {},
    "about-module": {},
    "dashboard-module": {},
    "Resources": {},
    "Resources-pages": { perPage: 999 },
    // "Resources-widgets": {
    //   extend: "apostrophe-pieces-widgets"
    // },

    "Resources-content-widgets": {},
    "liverpool-towatch-widgets": {},
    // "liverpool-watch-pages": {},
    "liverpool-watch": {},
    "liverpool-watch-pages": { perPage: 999 },
    "liverpool-read": {},
    "liverpool-read-pages": { perPage: 999 },
    "liverpool-events": {},
    "liverpool-events-pages": { perPage: 999 },
    "liverpool-games": {},
    "liverpool-games-pages": { perPage: 999 },
    "liverpool-Partner-agencies": {},
    "liverpool-Partner-agencies-pages": { perPage: 999 },
    "liverpool-mental-health": {},
    "liverpool-mental-health-pages": { perPage: 999 },
    "liverpool-about-service": {},
    "liverpool-about-service-pages": { perPage: 999 },
    "home-module": {},
    "referral-home-module": {},
    "referral-module": {},
    "education-employment-module": {},
    "review-module": {},
    "role-module": {},
    "referral-complete-module": {},
    "feedback-module": {},
    "check-referral-module": {},
    "mental-health-module": {},
    "account-settings-module": {},
    "accessibility-module": {},
    "footer-pages-module": {},
    "apostrophe-templates": {
      viewsFolderFallback: path.join(__dirname, "views"),
    },
  },
});
