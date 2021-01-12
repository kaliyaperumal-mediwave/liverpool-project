const { btoa } = require('../../utils')
const { atob } = require('../../utils')
module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Resources Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.resources);
      self.dispatch('/lists', self.lists);
      self.dispatch('/apps', self.apps);
      self.dispatch('/things-to-read', self.thingsToRead);
      self.dispatch('/video', self.video);
    };

    self.resources = function (req, callback) {
      var logoPath, aboutPage, termPage, privacyPage, feedbackPage, contactPage, navigateMkeRfrl, navigateViewRfrl, urgentHelpPage,backToResources;
      if (req.session.loginFlag == "true") {
        logoPath = "/dashboard?" + req.url.substring(req.url.indexOf("?") + 1)
        aboutPage = "/pages/about?" + req.url.substring(req.url.indexOf("?") + 1)
        termPage = "/pages/terms?" + req.url.substring(req.url.indexOf("?") + 1)
        privacyPage = "/pages/privacy?" + req.url.substring(req.url.indexOf("?") + 1)
        feedbackPage = "/pages/feedback?" + req.url.substring(req.url.indexOf("?") + 1)
        contactPage = "/pages/contact?" + req.url.substring(req.url.indexOf("?") + 1)
        navigateViewRfrl = "/viewreferals?" + req.url.substring(req.url.indexOf("?") + 1)
        urgentHelpPage = "/pages/urgent-help?" + req.url.substring(req.url.indexOf("?") + 1)
       
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
        backToResources =  "/resources?";
        showLogout = false;
      }

      return self.sendPage(req, self.renderer('resources', {
        showHeader: true,
        home: true,
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
        backToResources:backToResources

      }));
    };
    self.lists = function (req, callback) {
      var logoPath, aboutPage, termPage, privacyPage, feedbackPage, contactPage, navigateMkeRfrl, navigateViewRfrl, urgentHelpPage,backToResources;
      if (req.session.loginFlag == "true") {
        logoPath = "/dashboard?" + req.url.substring(req.url.indexOf("?") + 1)
        aboutPage = "/pages/about?" + req.url.substring(req.url.indexOf("?") + 1)
        termPage = "/pages/terms?" + req.url.substring(req.url.indexOf("?") + 1)
        privacyPage = "/pages/privacy?" + req.url.substring(req.url.indexOf("?") + 1)
        feedbackPage = "/pages/feedback?" + req.url.substring(req.url.indexOf("?") + 1)
        contactPage = "/pages/contact?" + req.url.substring(req.url.indexOf("?") + 1)
        navigateViewRfrl = "/viewreferals?" + req.url.substring(req.url.indexOf("?") + 1)
        urgentHelpPage = "/pages/urgent-help?" + req.url.substring(req.url.indexOf("?") + 1)
        backToResources =  "/resources?" + req.url.substring(req.url.indexOf("?") + 1)
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
        backToResources =  "/resources";
        showLogout = false;
      }
      return self.sendPage(req, self.renderer('things-to-watch', {
        showHeader: true,
        home: true,
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
        backToResources:backToResources
      }));
    };
    self.apps = function (req, callback) {
      return self.sendPage(req, self.renderer('apps', {
        showHeader: true,
        showLogout: true,
      }));
    };
    self.thingsToRead = function (req, callback) {
      return self.sendPage(req, self.renderer('things-to-read', {
        showHeader: true,
        showLogout: true,
      }));
    };
    self.video = function (req, callback) {
      return self.sendPage(req, self.renderer('video', {
        showHeader: true,
        showLogout: true,
      }));
    };
  }
}