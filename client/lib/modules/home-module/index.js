module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Home Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.home);
    };
    self.home = function (req, callback) {
      req.session.auth_token = "";
      req.session.loginFlag = "false";
      req.session.loginIdUrl = "";
      var logoPath, aboutPage, termPage, privacyPage, feedbackPage, contactPage, navigateMkeRfrl, navigateViewRfrl;
      logoPath = "/";
      aboutPage = "/pages/about";
      termPage = "/pages/terms";
      privacyPage = "/pages/privacy";
      feedbackPage = "/pages/feedback";
      contactPage = "/pages/contact";
      navigateMkeRfrl = "/make-referral";
      showLogout = false;
      return self.sendPage(req, self.renderer('home', {
        showHeader: false,
        logoPath:logoPath,
        aboutPage:aboutPage,
        termPage:termPage,
        privacyPage:privacyPage,
        feedbackPage:feedbackPage,
        contactPage:contactPage,
        navigateViewRfrl:navigateViewRfrl,
        navigateMkeRfrl:navigateMkeRfrl
      }));
    };
  }
};