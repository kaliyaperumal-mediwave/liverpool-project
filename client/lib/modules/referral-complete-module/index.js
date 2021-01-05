module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Referral Completed Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.completed);
    };
    self.completed = function (req, callback) {
      var logoPath,aboutPage,termPage,privacyPage,feedbackPage,contactPage,navigateMkeRfrl,navigateViewRfrl;
      if(req.session.loginFlag=="true")
      {
        logoPath="/dashboard?"+req.session.loginIdUrl
        aboutPage="/pages/about?"+req.session.loginIdUrl
        termPage = "/pages/terms?"+req.session.loginIdUrl
        privacyPage = "/pages/privacy?"+req.session.loginIdUrl
        feedbackPage = "/pages/feedback?"+req.session.loginIdUrl
        contactPage = "/pages/contact?"+req.session.loginIdUrl
        navigateViewRfrl = "/viewreferals?"+req.session.loginIdUrl
        showLogout=true;
        navigateMkeRfrl =  "/make-referral?" + req.session.loginIdUrl;
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
        navigateMkeRfrl = "/make-referral";
      }

      return self.sendPage(req, self.renderer('completed', {
        showHeader: true,
        headerContent: "The referral has been made to Children’s and Young Person’s Liverpool & Sefton Mental Health Services",
        headerDescription: '',
        backContent: '',
        home: false,
        completed: true,
        hideRefButton: false,
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
    self.route('get', 'getRefNo/:userid', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/getRefNo?user_id=' + req.params.userid;
      console.log("-------");
      console.log(url);
      console.log("-------");
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        //  console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });
  }
}