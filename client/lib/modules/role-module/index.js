module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Role Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.role);
    };
    self.role = function (req, callback) {
      var logoPath,aboutPage,termPage,privacyPage,feedbackPage,contactPage,navigateMkeRfrl,navigateViewRfrl,urgentHelpPage,mentalHeathPage,resourcesPage;
      if(req.session.loginFlag=="true")
      {
        req.session.loginIdUrl = req.url.substring(req.url.indexOf("?") + 1);
        logoPath="/dashboard?"+req.url.substring(req.url.indexOf("?") + 1)
        aboutPage="/pages/about?"+req.url.substring(req.url.indexOf("?") + 1);
        termPage = "/pages/terms?"+req.url.substring(req.url.indexOf("?") + 1);
        privacyPage = "/pages/privacy?"+req.url.substring(req.url.indexOf("?") + 1);
        feedbackPage = "/pages/feedback?"+req.url.substring(req.url.indexOf("?") + 1);
        contactPage = "/pages/contact?"+req.url.substring(req.url.indexOf("?") + 1);
        navigateViewRfrl = "/viewreferals?"+req.url.substring(req.url.indexOf("?") + 1)
        navigateMkeRfrl =  "/make-referral?" + req.url.substring(req.url.indexOf("?") + 1)
        urgentHelpPage = "/pages/urgent-help?"+req.url.substring(req.url.indexOf("?") + 1)
        mentalHeathPage="/mental-health?"+req.url.substring(req.url.indexOf("?") + 1);
        resourcesPage ="/resources?"+req.url.substring(req.url.indexOf("?") + 1);
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
        navigateMkeRfrl="/make-referral",
        urgentHelpPage = "/pages/urgent-help";
        mentalHeathPage="/mental-health";
        resourcesPage = "/resources";
      }
      
      return self.sendPage(req, self.renderer('role', {
        headerContent: "Section 1 of 5: Eligibility",
        headerDescription: " Before we get too far, let’s check that you or the child / young person is eligible to refer into this service.",
        backContent: '',
        home: false,
        showHeader: true,
        hideRefButton: false,
        showLogout: showLogout,
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
    require('../../middleware')(self, options);
    // save eligibitiy
    self.route('post', 'eligibility', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/eligibility';
      console.log("-------");
      console.log(url);
      console.log("-------");
      self.middleware.post(req, res, url, req.body).then((data) => {
        return res.send(data);
      }).catch((error) => {
        console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });

    self.route('get', 'fetchEligibility/:userid', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/fetchEligibility?user_id=' + req.params.userid;
      console.log("-------");
      console.log(req.params.userid);
      console.log(url);
      console.log("-------");
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        // console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });

    // self.route('post', 'fetchEligibility', function (req, res) {
    //   var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/fetchEligibility';
    //   console.log("-------");
    //   console.log(url);
    //   console.log("-------");
    //   self.middleware.post(req, res, url, req.body).then((data) => {
    //     return res.send(data);
    //   }).catch((error) => {
    //     console.log("---- error -------", error)
    //     return res.status(error.statusCode).send(error.error);
    //   });
    // });
  }
}