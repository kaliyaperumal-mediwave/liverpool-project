const { btoa } = require('../../utils')
const { atob } = require('../../utils')
module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'About Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.about);
    };
    self.about = function (req, callback) {
      var path;
      const getParamsData = req.url.substring(req.url.indexOf("?") + 1);
      var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
      console.log(!base64Matcher.test(getParamsData))
      if (!base64Matcher.test(getParamsData)) {
        req.res.redirect("/users/login")
      } else {
        var logoPath,aboutPage,termPage,privacyPage,feedbackPage,contactPage,navigateMkeRfrl,navigateViewRfrl,urgentHelpPage,mentalHeathPage;
        if(req.session.loginFlag=="true")
        {
          logoPath="/dashboard?"+req.session.loginIdUrl;
          aboutPage="/pages/about?"+req.session.loginIdUrl;
          termPage = "/pages/terms?"+req.session.loginIdUrl;
          privacyPage = "/pages/privacy?"+req.session.loginIdUrl;
          feedbackPage = "/pages/feedback?"+req.session.loginIdUrl;
          contactPage = "/pages/contact?"+req.session.loginIdUrl;
          navigateViewRfrl = "/viewreferals?"+req.session.loginIdUrl;
          showLogout=true;
          navigateMkeRfrl =  "/make-referral?" + req.session.loginIdUrl;
          urgentHelpPage = "/pages/urgent-help?"+req.session.loginIdUrl;
          mentalHeathPage="/mental-health?"+req.session.loginIdUrl;
        }
        else
        {
          logoPath = "/";
          aboutPage="/pages/about";
          termPage = "/pages/terms";
          privacyPage = "/pages/privacy";
          feedbackPage = "/pages/feedback";
          contactPage = "/pages/contact";
          navigateMkeRfrl = "/make-referral";
          showLogout=false;
          urgentHelpPage = "/pages/urgent-help";
          mentalHeathPage="/mental-health";
        }


        let labels;
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

        if (decodeValues[1] == 'child') {
          labels = "Section 2 of 5: About you & your household";
        } else if (decodeValues[1] == 'parent') {
          labels = "Section 2 of 5: About the child & their household";
        }
        else if (decodeValues[1] == 'professional') {
          labels = "Section 2 of 5: About the child /young person & their household";
        }
        return self.sendPage(req, self.renderer('about', {
          headerContent: labels,
          headerDescription: " Before we get too far, let’s check that you or the child / young person is eligible to refer into this service.",
          backContent: '/role?' + decryptedUrl,
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
          mentalHeathPage:mentalHeathPage
        }));
      }
    };

    require('../../middleware')(self, options);
    self.route('post', 'saveReferral', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/about';
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

    // self.route('get', 'fetchAbout/:userid', function (req, res) {
    //   var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/fetchAbout?user_id=' + req.params.userid;
    //   console.log("-------");
    //   console.log(req.params.userid);
    //   console.log(url);
    //   console.log("-------");
    //   self.middleware.get(req, url).then((data) => {
    //     return res.send(data);
    //   }).catch((error) => {
    //     // console.log("---- error -------", error)
    //     return res.status(error.statusCode).send(error.error);
    //   });
    // });

    self.route('post', 'fetchAbout', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/fetchAbout';
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