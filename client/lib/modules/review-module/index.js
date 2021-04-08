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
      require('../../middleware')(self, options);
      self.dispatch('/', self.middleware.checkCommonPageAuth, self.review);
    };
    self.review = function (req, callback) {
      if (!req.session.user_role) {
        return req.res.redirect("/")
      }
      let decryptedUrl;
      const getParams = req.url.substring(req.url.indexOf("?") + 1);
      const deCodeParameter = atob(getParams);
      let decodeValues = deCodeParameter.split("&");
      const getParamsRedirect = "backbutton";
      decryptedUrl = btoa(getParamsRedirect);
      // if (decodeValues[2] == undefined) {
      //   const getParamsRedirect = deCodeParameter + "&backbutton";
      //   decryptedUrl = btoa(getParamsRedirect);
      // }
      // else if (decodeValues[2] == "backbutton") {
      //   const getParamsRedirect = decodeValues[0] + "&" + decodeValues[1] + "&backbutton";
      //   decryptedUrl = btoa(getParamsRedirect);
      // }
      // else if (decodeValues[2] == "sec5back") {
      //   const getParamsRedirect = decodeValues[0] + "&" + decodeValues[1] + "&backbutton";
      //   decryptedUrl = btoa(getParamsRedirect);
      // }
      req.res.header('Cache-Control', 'no-cache, no-store'); //This will force the browser to obtain new copy of the page even when they hit "back".
      return self.sendPage(req, self.renderer('review', {
        headerContent: "Section 5 of 5: Preferences and review",
        headerDescription: "Finally please review all the information you have provided to check if anything needs changing",
        backContent: '/referral?' + decryptedUrl,
        home: false,
        showHeader: true,
        hideRefButton: false,
      }));
    };

    require('../../middleware')(self, options);
    self.route('get', 'fetchReview/:userid', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/fetchReview?user_id=' + req.params.userid;
      console.log("-------");
      //console.log(req.params.userid);
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