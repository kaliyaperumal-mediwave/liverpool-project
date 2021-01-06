const { btoa } = require('../../utils')
const { atob } = require('../../utils')
module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Education Employment Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.education);
    };
    self.education = function (req, callback) {

      var logoPath,aboutPage,termPage,privacyPage,feedbackPage,contactPage,navigateMkeRfrl,navigateViewRfrl,urgentHelpPage;
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
        urgentHelpPage = "/pages/urgent-help?"+req.session.loginIdUrl
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
      }


      let decryptedUrl;
      const getParams = req.url.substring(req.url.indexOf("?") + 1);
      const deCodeParameter = atob(getParams)
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

      return self.sendPage(req, self.renderer('education', {
        headerContent: "Section 3 of 5: Education / employment & support needs",
        headerDescription: " Before we get too far, let’s check that you or the child / young person is eligible to refer into this service.",
        backContent: '/about?' + decryptedUrl,
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
        urgentHelpPage:urgentHelpPage
      }));
    };

    require('../../middleware')(self, options);
    self.route('post', 'education', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/education';
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

    self.route('post', 'fetchProfession', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/fetchProfession';
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
  }
}