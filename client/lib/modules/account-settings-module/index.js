// module.exports = {
//   extend: 'apostrophe-module',
//   label: 'Account Settings Module',
//   construct: function (self, options, callback) {

//   }
// };


const { btoa } = require('../../utils')
const { atob } = require('../../utils')
module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Account Settings Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/change_email', self.changeEmail);
      self.dispatch('/change_password', self.changePassword);
      self.dispatch('/confirmation_email', self.confirmationEmail);
    };

    self.changeEmail = function (req, callback) {
      var logoPath, aboutPage, termPage, privacyPage, feedbackPage, contactPage, navigateMkeRfrl, navigateViewRfrl, urgentHelpPage, mentalHeathPage, resourcesPage;
      logoPath = "/dashboard?" + req.url.substring(req.url.indexOf("?") + 1)
      aboutPage = "/pages/about?" + req.url.substring(req.url.indexOf("?") + 1);
      termPage = "/pages/terms?" + req.url.substring(req.url.indexOf("?") + 1);
      privacyPage = "/pages/privacy?" + req.url.substring(req.url.indexOf("?") + 1);
      feedbackPage = "/pages/feedback?" + req.url.substring(req.url.indexOf("?") + 1);
      contactPage = "/pages/contact?" + req.url.substring(req.url.indexOf("?") + 1);
      navigateViewRfrl = "/viewreferals?" + req.url.substring(req.url.indexOf("?") + 1);
      urgentHelpPage = "/pages/urgent-help?" + req.url.substring(req.url.indexOf("?") + 1);
      mentalHeathPage = "/mental-health?" + req.url.substring(req.url.indexOf("?") + 1);
      resourcesPage = "/resources?" + req.url.substring(req.url.indexOf("?") + 1);
      showLogout = true;
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
      navigateMkeRfrl = "/make-referral?" + btoa(deCodeParameter);

      return self.sendPage(req, self.renderer('change_email', {
        showHeader: true,
        home: true,
        showLogout: showLogout,
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
        mentalHeathPage: mentalHeathPage,
        resourcesPage: resourcesPage
      }));
    };

    self.changePassword = function (req, callback) {
      var logoPath, aboutPage, termPage, privacyPage, feedbackPage, contactPage, navigateMkeRfrl, navigateViewRfrl, urgentHelpPage, mentalHeathPage, resourcesPage;
      logoPath = "/dashboard?" + req.url.substring(req.url.indexOf("?") + 1)
      aboutPage = "/pages/about?" + req.url.substring(req.url.indexOf("?") + 1);
      termPage = "/pages/terms?" + req.url.substring(req.url.indexOf("?") + 1);
      privacyPage = "/pages/privacy?" + req.url.substring(req.url.indexOf("?") + 1);
      feedbackPage = "/pages/feedback?" + req.url.substring(req.url.indexOf("?") + 1);
      contactPage = "/pages/contact?" + req.url.substring(req.url.indexOf("?") + 1);
      navigateViewRfrl = "/viewreferals?" + req.url.substring(req.url.indexOf("?") + 1);
      urgentHelpPage = "/pages/urgent-help?" + req.url.substring(req.url.indexOf("?") + 1);
      mentalHeathPage = "/mental-health?" + req.url.substring(req.url.indexOf("?") + 1);
      resourcesPage = "/resources?" + req.url.substring(req.url.indexOf("?") + 1);
      showLogout = true;
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
      navigateMkeRfrl = "/make-referral?" + btoa(deCodeParameter);

      return self.sendPage(req, self.renderer('change_password', {
        showHeader: true,
        home: true,
        showLogout: showLogout,
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
        mentalHeathPage: mentalHeathPage,
        resourcesPage: resourcesPage
      }));
    };

    self.confirmationEmail = function (req, callback) {
      var logoPath, aboutPage, termPage, privacyPage, feedbackPage, contactPage, navigateMkeRfrl, navigateViewRfrl, urgentHelpPage, mentalHeathPage, resourcesPage;
      logoPath = "/dashboard?" + req.url.substring(req.url.indexOf("?") + 1)
      aboutPage = "/pages/about?" + req.url.substring(req.url.indexOf("?") + 1);
      termPage = "/pages/terms?" + req.url.substring(req.url.indexOf("?") + 1);
      privacyPage = "/pages/privacy?" + req.url.substring(req.url.indexOf("?") + 1);
      feedbackPage = "/pages/feedback?" + req.url.substring(req.url.indexOf("?") + 1);
      contactPage = "/pages/contact?" + req.url.substring(req.url.indexOf("?") + 1);
      navigateViewRfrl = "/viewreferals?" + req.url.substring(req.url.indexOf("?") + 1);
      urgentHelpPage = "/pages/urgent-help?" + req.url.substring(req.url.indexOf("?") + 1);
      mentalHeathPage = "/mental-health?" + req.url.substring(req.url.indexOf("?") + 1);
      resourcesPage = "/resources?" + req.url.substring(req.url.indexOf("?") + 1);
      showLogout = true;
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
      navigateMkeRfrl = "/make-referral?" + btoa(deCodeParameter);

      return self.sendPage(req, self.renderer('confirmation_email', {
        showHeader: true,
        home: true,
        showLogout: showLogout,
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
        mentalHeathPage: mentalHeathPage,
        resourcesPage: resourcesPage
      }));
    };

  }
}