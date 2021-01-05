module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Check Referral Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.checkReferral);
    };

    self.checkReferral = function (req, callback) {
      var logoPath,aboutPage,termPage,privacyPage,feedbackPage,contactPage,navigateMkeRfrl,navigateViewRfrl;
      logoPath="/dashboard?"+req.url.substring(req.url.indexOf("?") + 1)
      aboutPage="/pages/about?"+req.url.substring(req.url.indexOf("?") + 1);
      termPage = "/pages/terms?"+req.url.substring(req.url.indexOf("?") + 1);
      privacyPage = "/pages/privacy?"+req.url.substring(req.url.indexOf("?") + 1);
      feedbackPage = "/pages/feedback?"+req.url.substring(req.url.indexOf("?") + 1);
      contactPage = "/pages/contact?"+req.url.substring(req.url.indexOf("?") + 1);
      navigateViewRfrl = "/viewreferals?"+req.url.substring(req.url.indexOf("?") + 1);
      navigateMkeRfrl =  "/make-referral?" + req.url.substring(req.url.indexOf("?") + 1);
      showLogout=true;
      return self.sendPage(req, self.renderer('check-referral', {
        showHeader: true,
        home: true,
        showLogout: showLogout,
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
    require('../../middleware')(self, options);
    self.route('get', 'getUserReferral/:loginId/:referralType', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/referral/getUserReferral?loginId=' +  req.params.loginId +"&referralType=" +req.params.referralType;
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      });
    });
  }
}