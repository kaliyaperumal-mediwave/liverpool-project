const { btoa } = require('../../utils')
const { atob } = require('../../utils')
module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Footer Pages Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/about', self.aboutUs);
      self.dispatch('/terms', self.termsCondition);
      self.dispatch('/privacy', self.privacyPolicy);
      self.dispatch('/urgent-help', self.urgentHelp);
    };

    self.aboutUs = function (req, callback) {
      var logoPath, aboutPage, termPage, privacyPage, feedbackPage, contactPage, navigateMkeRfrl, navigateViewRfrl,urgentHelpPage;
      if (req.session.loginFlag == "true") {
        logoPath = "/dashboard?" + req.url.substring(req.url.indexOf("?") + 1)
        aboutPage = "/pages/about?" + req.url.substring(req.url.indexOf("?") + 1)
        termPage = "/pages/terms?" + req.url.substring(req.url.indexOf("?") + 1)
        privacyPage = "/pages/privacy?" + req.url.substring(req.url.indexOf("?") + 1)
        feedbackPage = "/pages/feedback?" + req.url.substring(req.url.indexOf("?") + 1)
        contactPage = "/pages/contact?" + req.url.substring(req.url.indexOf("?") + 1)
        navigateViewRfrl = "/viewreferals?" + req.url.substring(req.url.indexOf("?") + 1)
        urgentHelpPage = "/pages/urgent-help?"+req.url.substring(req.url.indexOf("?") + 1)
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
        showLogout = false;
      }
      return self.sendPage(req, self.renderer('about', {
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
        urgentHelpPage:urgentHelpPage
      }));
    };

    self.termsCondition = function (req, callback) {
      var logoPath, aboutPage, termPage, privacyPage, feedbackPage, contactPage, navigateMkeRfrl, navigateViewRfrl,urgentHelpPage;
      if (req.session.loginFlag == "true") {
        logoPath = "/dashboard?" + req.url.substring(req.url.indexOf("?") + 1)
        aboutPage = "/pages/about?" + req.url.substring(req.url.indexOf("?") + 1)
        termPage = "/pages/terms?" + req.url.substring(req.url.indexOf("?") + 1)
        privacyPage = "/pages/privacy?" + req.url.substring(req.url.indexOf("?") + 1)
        feedbackPage = "/pages/feedback?" + req.url.substring(req.url.indexOf("?") + 1)
        contactPage = "/pages/contact?" + req.url.substring(req.url.indexOf("?") + 1)
        navigateViewRfrl = "/viewreferals?" + req.url.substring(req.url.indexOf("?") + 1)
        urgentHelpPage = "/pages/urgent-help?"+req.url.substring(req.url.indexOf("?") + 1)
        showLogout = true;
        //navigateMkeRfrl = "/make-referral?" + req.url.substring(req.url.indexOf("?") + 1)
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
        showLogout = false;
      }
      return self.sendPage(req, self.renderer('terms', {
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
        urgentHelpPage:urgentHelpPage

      }));
    };

    self.privacyPolicy = function (req, callback) {
      var logoPath, aboutPage, termPage, privacyPage, feedbackPage, contactPage, navigateMkeRfrl, navigateViewRfrl,urgentHelpPage;
      if (req.session.loginFlag == "true") {
        logoPath = "/dashboard?" + req.url.substring(req.url.indexOf("?") + 1)
        aboutPage = "/pages/about?" + req.url.substring(req.url.indexOf("?") + 1)
        termPage = "/pages/terms?" + req.url.substring(req.url.indexOf("?") + 1)
        privacyPage = "/pages/privacy?" + req.url.substring(req.url.indexOf("?") + 1)
        feedbackPage = "/pages/feedback?" + req.url.substring(req.url.indexOf("?") + 1)
        contactPage = "/pages/contact?" + req.url.substring(req.url.indexOf("?") + 1)
        navigateViewRfrl = "/viewreferals?" + req.url.substring(req.url.indexOf("?") + 1)
        urgentHelpPage = "/pages/urgent-help?"+req.url.substring(req.url.indexOf("?") + 1)
        showLogout = true;
        // navigateMkeRfrl = "/make-referral?" + req.url.substring(req.url.indexOf("?") + 1)
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
        showLogout = false;
      }
      return self.sendPage(req, self.renderer('privacy', {
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
        urgentHelpPage:urgentHelpPage

      }));
    };

    self.urgentHelp = function (req, callback) {
      var logoPath, aboutPage, termPage, privacyPage, feedbackPage, contactPage, navigateMkeRfrl, navigateViewRfrl,urgentHelpPage;
      if (req.session.loginFlag == "true") {
        logoPath = "/dashboard?" + req.url.substring(req.url.indexOf("?") + 1)
        aboutPage = "/pages/about?" + req.url.substring(req.url.indexOf("?") + 1)
        termPage = "/pages/terms?" + req.url.substring(req.url.indexOf("?") + 1)
        privacyPage = "/pages/privacy?" + req.url.substring(req.url.indexOf("?") + 1)
        feedbackPage = "/pages/feedback?" + req.url.substring(req.url.indexOf("?") + 1)
        contactPage = "/pages/contact?" + req.url.substring(req.url.indexOf("?") + 1)
        navigateViewRfrl = "/viewreferals?" + req.url.substring(req.url.indexOf("?") + 1)
        showLogout = true;
        navigateMkeRfrl = "/make-referral?" + req.url.substring(req.url.indexOf("?") + 1)
        urgentHelpPage = "/pages/urgent-help?"+req.url.substring(req.url.indexOf("?") + 1)
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
        showLogout = false;
      }
      return self.sendPage(req, self.renderer('urgent', {
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
        urgentHelpPage:urgentHelpPage
      }));
    };
  }
}