module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Referral Home Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.refHome);
    };
    self.refHome = function (req, callback) {
      
      var logoPath,aboutPage,termPage,privacyPage,feedbackPage,contactPage,navigateMkeRfrl,navigateViewRfrl,urgentHelpPage;
      if(req.session.loginFlag=="true")
      {
        logoPath="/dashboard?"+req.url.substring(req.url.indexOf("?") + 1)
        aboutPage="/pages/about?"+req.url.substring(req.url.indexOf("?") + 1);
        termPage = "/pages/terms?"+req.url.substring(req.url.indexOf("?") + 1);
        privacyPage = "/pages/privacy?"+req.url.substring(req.url.indexOf("?") + 1);
        feedbackPage = "/pages/feedback?"+req.url.substring(req.url.indexOf("?") + 1);
        contactPage = "/pages/contact?"+req.url.substring(req.url.indexOf("?") + 1);
        navigateViewRfrl = "/viewreferals?"+req.url.substring(req.url.indexOf("?") + 1)
        urgentHelpPage = "/pages/urgent-help?"+req.url.substring(req.url.indexOf("?") + 1)
        showLogout=true;
      }
      else
      {
        logoPath = "/";
        aboutPage="/pages/about";
        termPage = "/pages/terms";
        privacyPage = "/pages/privacy";
        feedbackPage = "/pages/feedback";
        contactPage = "/pages/contact"
        showLogout=false;
        urgentHelpPage = "/pages/urgent-help";
      }
      var path;
      const getParams = req.url.substring(req.url.indexOf("?") + 1);
      var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
      if (base64Matcher.test(getParams)) {
        path = "/role?" + getParams
      }
      else {
        path = "/role"
      }
      return self.sendPage(req, self.renderer('referral-home', {
        headerContent: "Make a referral to Children’s and Young Person’s Liverpool & Sefton Mental Health Services",
        headerDescription: '',
        backContent: '',
        home: true,
        path: path,
        showHeader: true,
        showLogout: showLogout,
        logoPath:logoPath,
        aboutPage:aboutPage,
        termPage:termPage,
        privacyPage:privacyPage,
        feedbackPage:feedbackPage,
        contactPage:contactPage,
        navigateViewRfrl:navigateViewRfrl,
        urgentHelpPage:urgentHelpPage
      }));
    };
  }
}