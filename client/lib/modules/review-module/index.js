const { btoa } = require('../../utils')
const { atob } = require('../../utils')
module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Review Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.review);
    };
    self.review = function (req, callback) {
      var logoPath,aboutPage,termPage,privacyPage,feedbackPage,contactPage,navigateMkeRfrl,navigateViewRfrl,urgentHelpPage,mentalHeathPage,resourcesPage;
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
        urgentHelpPage = "/pages/urgent-help?"+req.session.loginIdUrl;
        mentalHeathPage="/mental-health?"+req.session.loginIdUrl;
        resourcesPage ="/resources?"+req.session.loginIdUrl;
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
        urgentHelpPage = "/pages/urgent-help";
        resourcesPage = "/resources";
      }


      let decryptedUrl;
      const getParams = req.url.substring(req.url.indexOf("?") + 1);
      const deCodeParameter = atob(getParams);
      let decodeValues = deCodeParameter.split("&");
      if (decodeValues[2] == undefined) {
        const getParamsRedirect = deCodeParameter + "&backbutton";
        decryptedUrl = btoa(getParamsRedirect);
      }
      else if (decodeValues[2] == "backbutton") {
        const getParamsRedirect = decodeValues[0] + "&" + decodeValues[1] + "&backbutton";
        decryptedUrl = btoa(getParamsRedirect);
      }
      else if (decodeValues[2] == "sec5back") {
        const getParamsRedirect = decodeValues[0] + "&" + decodeValues[1] + "&backbutton";
        decryptedUrl = btoa(getParamsRedirect);
      }
      return self.sendPage(req, self.renderer('review', {
        headerContent: "Section 5 of 5: Preferences and review",
        headerDescription: " Before we get too far, let’s check that you or the child / young person is eligible to refer into this service.",
        backContent: '/referral?' + decryptedUrl,
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
    self.route('get', 'fetchReview/:userid', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/fetchReview?user_id=' + req.params.userid;
      console.log("-------");
      console.log(req.params.userid);
      console.log(url);
      console.log("-------");
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        //  console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });
    self.route('post', 'saveReview', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/saveReview';
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

    self.route('put', 'updateInfo', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + req.body.endPoint;
      console.log("-------");
      console.log(url);
      console.log("-------");
      self.middleware.put(req, res, url, req.body).then((data) => {
        if (req.session.redirectto) {
          data.redirectto = req.session.redirectto;
        }
        req.session.reload(function () { });
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      });
    });
  }
}