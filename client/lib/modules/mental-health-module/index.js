const { btoa } = require('../../utils')
const { atob } = require('../../utils')
var _ = require('lodash');

module.exports = {
  extend: 'apostrophe-module',
  label: 'Mental Health Module',
  construct: function (self, options, callback) {

  }
};

module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Mental Health Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.aboutMentalHealth);
      self.dispatch('/people', self.aboutPeople);
      self.dispatch('/types', self.typesOfPeople);

    };

    self.aboutMentalHealth = async function (req, callback) {
      var AboutService = await self.apos.modules['liverpool-about-service-pages'].pieces.find(req, {}).toArray();
      var PeopleService = await self.apos.modules['liverpool-mental-health-pages'].pieces.find(req, {}).toArray();
      piecesArray = AboutService.concat(PeopleService)
      req.data.piecesArray = piecesArray;
      var logoPath, aboutPage, termPage, privacyPage, feedbackPage, contactPage, navigateMkeRfrl, navigateViewRfrl, urgentHelpPage, mentalHeathPage, backMentalHealth, gotoPeople, resourcesPage;
      if (req.session.loginFlag == "true") {
        logoPath = "/dashboard?" + req.url.substring(req.url.indexOf("?") + 1)
        aboutPage = "/pages/about?" + req.url.substring(req.url.indexOf("?") + 1)
        termPage = "/pages/terms?" + req.url.substring(req.url.indexOf("?") + 1)
        privacyPage = "/pages/privacy?" + req.url.substring(req.url.indexOf("?") + 1)
        feedbackPage = "/pages/feedback?" + req.url.substring(req.url.indexOf("?") + 1)
        contactPage = "/pages/contact?" + req.url.substring(req.url.indexOf("?") + 1)
        navigateViewRfrl = "/viewreferals?" + req.url.substring(req.url.indexOf("?") + 1)
        urgentHelpPage = "/pages/urgent-help?" + req.url.substring(req.url.indexOf("?") + 1)
        backMentalHealth = "/mental-health?" + req.url.substring(req.url.indexOf("?") + 1)
        mentalHeathPage = "/mental-health?" + req.url.substring(req.url.indexOf("?") + 1);
        gotoPeople = "/mental-health/people?" + req.url.substring(req.url.indexOf("?") + 1)
        resourcesPage = "/resources?" + req.url.substring(req.url.indexOf("?") + 1)
        showLogout = true;
        mentalHeathPage = "/mental-health?" + req.url.substring(req.url.indexOf("?") + 1);
        // navigateMkeRfrl = "/make-referral?" +req.url.substring(req.url.indexOf("?") + 1)
        var deCodeParameter;
        const getParams = req.url.substring(req.url.indexOf("?") + 1);
        const deCodeGetParams = atob(getParams);
        let decodeValuesGetParams = deCodeGetParams.split("&");
        console.log("---->" + decodeValuesGetParams[0]);
        if (decodeValuesGetParams[0] != "loginFlag") {
          console.log("--if-->" + decodeValuesGetParams[0]);
          deCodeParameter = "loginFlag&" + atob(getParams);
        }
        else {
          console.log("--else-->" + decodeValuesGetParams[0]);
          deCodeParameter = atob(getParams);
        }
        // let decodeValues = deCodeParameter.split("&");
        navigateMkeRfrl = "/make-referral?" + btoa(deCodeParameter);
      }
      else {
        logoPath = "/";
        aboutPage = "/pages/about";
        termPage = "/pages/terms";
        privacyPage = "/pages/privacy";
        feedbackPage = "/pages/feedback";
        contactPage = "/pages/contact";
        navigateMkeRfrl = "/make-referral";
        urgentHelpPage = "/pages/urgent-help";
        backMentalHealth = "/mental-health";
        mentalHeathPage = "/mental-health"
        gotoPeople = "/mental-health/people";
        resourcesPage = "/resources";
        showLogout = false;
        mentalHeathPage = "/mental-health"
      }

      return self.sendPage(req, self.renderer('mentalHealth', {

        showHeader: true,
        hideRefButton: true,
        showLogout: showLogout,
        logoPath: logoPath,
        aboutPage: aboutPage,
        termPage: termPage,
        privacyPage: privacyPage,
        feedbackPage: feedbackPage,
        contactPage: contactPage,
        navigateViewRfrl: navigateViewRfrl,
        navigateMkeRfrl: navigateMkeRfrl,
        urgentHelpPage: urgentHelpPage,
        backMentalHealth: backMentalHealth,
        mentalHeathPage: mentalHeathPage,
        gotoPeople: gotoPeople,
        resourcesPage: resourcesPage

      }));
    };

    self.aboutPeople = function (req, callback) {
      var logoPath, aboutPage, termPage, privacyPage, feedbackPage, contactPage, navigateMkeRfrl, navigateViewRfrl, urgentHelpPage, backMentalHealth;
      if (req.session.loginFlag == "true") {
        logoPath = "/dashboard?" + req.url.substring(req.url.indexOf("?") + 1)
        aboutPage = "/pages/about?" + req.url.substring(req.url.indexOf("?") + 1)
        termPage = "/pages/terms?" + req.url.substring(req.url.indexOf("?") + 1)
        privacyPage = "/pages/privacy?" + req.url.substring(req.url.indexOf("?") + 1)
        feedbackPage = "/pages/feedback?" + req.url.substring(req.url.indexOf("?") + 1)
        contactPage = "/pages/contact?" + req.url.substring(req.url.indexOf("?") + 1)
        navigateViewRfrl = "/viewreferals?" + req.url.substring(req.url.indexOf("?") + 1)
        urgentHelpPage = "/pages/urgent-help?" + req.url.substring(req.url.indexOf("?") + 1)
        backMentalHealth = "/mental-health?" + req.url.substring(req.url.indexOf("?") + 1)
        showLogout = true;
        // navigateMkeRfrl = "/make-referral?" +req.url.substring(req.url.indexOf("?") + 1)
        var deCodeParameter;
        const getParams = req.url.substring(req.url.indexOf("?") + 1);
        const deCodeGetParams = atob(getParams);
        let decodeValuesGetParams = deCodeGetParams.split("&");
        console.log("---->" + decodeValuesGetParams[0]);
        if (decodeValuesGetParams[0] != "loginFlag") {
          console.log("--if-->" + decodeValuesGetParams[0]);
          deCodeParameter = "loginFlag&" + atob(getParams);
        }
        else {
          console.log("--else-->" + decodeValuesGetParams[0]);
          deCodeParameter = atob(getParams);
        }
        // let decodeValues = deCodeParameter.split("&");
        navigateMkeRfrl = "/make-referral?" + btoa(deCodeParameter);
      }
      else {
        logoPath = "/";
        aboutPage = "/pages/about";
        termPage = "/pages/terms";
        privacyPage = "/pages/privacy";
        feedbackPage = "/pages/feedback";
        contactPage = "/pages/contact";
        navigateMkeRfrl = "/make-referral";
        urgentHelpPage = "/pages/urgent-help";
        backMentalHealth = "/mental-health";
        showLogout = false;
      }

      return self.sendPage(req, self.renderer('people', {
        showHeader: true,
        showLogout: showLogout,
        logoPath: logoPath,
        aboutPage: aboutPage,
        termPage: termPage,
        privacyPage: privacyPage,
        feedbackPage: feedbackPage,
        contactPage: contactPage,
        navigateViewRfrl: navigateViewRfrl,
        navigateMkeRfrl: navigateMkeRfrl,
        urgentHelpPage: urgentHelpPage,
        backMentalHealth: backMentalHealth
      }));
    };
  }
}