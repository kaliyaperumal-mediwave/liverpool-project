module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Auth Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/login', self.login);
      self.dispatch('/sign_up', self.sign_up);
    };

    self.login = function (req, callback) {
      req.session.auth_token = "";
      req.session.loginFlag = "false";
      req.session.loginIdUrl ="";
      req.session.user_role = "";
      var logoPath, aboutPage, termPage, privacyPage, feedbackPage, contactPage, navigateMkeRfrl, navigateViewRfrl,urgentHelpPage,mentalHeathPage,resourcesPage;
      logoPath = "/";
      aboutPage = "/pages/about";
      termPage = "/pages/terms";
      privacyPage = "/pages/privacy";
      feedbackPage = "/pages/feedback";
      contactPage = "/pages/contact";
      navigateMkeRfrl = "/make-referral";
      showLogout = false;
      urgentHelpPage = "/pages/urgent-help";
      mentalHeathPage="/mental-health";
      resourcesPage = "/resources";
      return self.sendPage(req, self.renderer('login', {
        showHeader: true,
        home: true,
        hideRefButton: true,
        logoPath:logoPath,
        aboutPage:aboutPage,
        termPage:termPage,
        privacyPage:privacyPage,
        feedbackPage:feedbackPage,
        contactPage:contactPage,
        navigateViewRfrl:navigateViewRfrl,
        navigateMkeRfrl:navigateMkeRfrl,
        urgentHelpPage:urgentHelpPage,
        mentalHeathPage:mentalHeathPage,
        resourcesPage:resourcesPage
      }));
    };

    self.sign_up = function (req, callback) {
      var logoPath, aboutPage, termPage, privacyPage, feedbackPage, contactPage, navigateMkeRfrl, navigateViewRfrl,urgentHelpPage,mentalHeathPage,resourcesPage;
      logoPath = "/";
      aboutPage = "/pages/about";
      termPage = "/pages/terms";
      privacyPage = "/pages/privacy";
      feedbackPage = "/pages/feedback";
      contactPage = "/pages/contact";
      navigateMkeRfrl = "/make-referral";
      showLogout = false;
      urgentHelpPage = "/pages/urgent-help"
      mentalHeathPage="/mental-health";
      resourcesPage = "/resources";
      return self.sendPage(req, self.renderer('sign_up', {
        showHeader: true,
        home: true,
        showLogout: false,
        logoPath:logoPath,
        hideRefButton: true,
        aboutPage:aboutPage,
        termPage:termPage,
        privacyPage:privacyPage,
        feedbackPage:feedbackPage,
        contactPage:contactPage,
        navigateViewRfrl:navigateViewRfrl,
        navigateMkeRfrl:navigateMkeRfrl,
        urgentHelpPage:urgentHelpPage,
        mentalHeathPage:mentalHeathPage,
        resourcesPage:resourcesPage
      }));
    };

    require('../../middleware')(self, options);
    self.route('post', 'doCreateAcc', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/signup';
      self.middleware.post(req, res, url, req.body).then((data) => {
        return res.send(data);
      }).catch((error) => {
        console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });

    self.route('post', 'doLogin', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/login';
      self.middleware.post(req, res, url, req.body).then((data) => {
        console.log(data)
        if (data) {
          req.session.auth_token = data.data.sendUserResult.token;
          req.session.user_role=data.data.sendUserResult.role
          req.session.loginFlag = "true";
          req.session.loginIdUrl =  data.data.sendUserResult.loginId
          req.session.reload(function () { });
        }
        return res.send(data);
      }).catch((error) => {
        console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });

  }
}