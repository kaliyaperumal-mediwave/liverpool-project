const { btoa } = require('../../utils')
const { atob } = require('../../utils')
module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Education Employment Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    require('../../middleware')(self, options);
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.middleware.checkCommonPageAuth, self.education);
    };
    self.education = function (req, callback) {
      if (!req.session.user_role) {
        return req.res.redirect("/")
      }
      let decryptedUrl;
      const getParams = req.url.substring(req.url.indexOf("?") + 1);
      const deCodeParameter = atob(getParams)
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

      return self.sendPage(req, self.renderer('education', {
        headerContent: "Education, employment & support needs",
        headerDescription: "We also need details about school & employment",
        backContent: '/about?' + decryptedUrl,
        home: false,
        showHeader: true,
        //completed: true,
        hideRefButton: false,
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