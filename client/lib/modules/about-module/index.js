const { btoa } = require('../../utils')
const { atob } = require('../../utils')
module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'About Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    require('../../middleware')(self, options);
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.middleware.checkCommonPageAuth, self.about);
    };
    self.about = function (req, callback) {
      if (!req.session.user_role) {
        return req.res.redirect("/")
      }
      if(req.session.referralCode)
      {
        return req.res.redirect("/acknowledge")
      }
      const getParamsData = req.url.substring(req.url.indexOf("?") + 1);
      var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
      let labels;
      let decryptedUrl;
      const getParams = req.url.substring(req.url.indexOf("?") + 1);
      const deCodeParameter = atob(getParams);
      let decodeValues = deCodeParameter.split("&");
      const getParamsRedirect = "backbutton";
      decryptedUrl = btoa(getParamsRedirect);

      req.res.header('Cache-Control', 'no-cache, no-store'); //This will force the browser to obtain new copy of the page even when they hit "back".
      return self.sendPage(req, self.renderer('about', {
        headerContent: "Section 2 of 5: About you & your household",
        headerDescription: "Now we need some personal details, such as name & contact details",
        backContent: '/role?' + decryptedUrl,
        home: false,
        showHeader: true,
        hideRefButton: false,
      }));

    };

    require('../../middleware')(self, options);
    self.route('post', 'saveReferral', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/about';
      // console.log("-------");
      // console.log(url);
      // console.log("-------");
      self.middleware.post(req, res, url, req.body).then((data) => {
        // console.log(data)
        return res.send(data);
      }).catch((error) => {
        console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });


    self.route('post', 'fetchAbout', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/fetchAbout';
      // console.log("-------");
      // console.log(url);
      // console.log("-------");
      self.middleware.post(req, res, url, req.body).then((data) => {
        // console.log(data)
        return res.send(data);
      }).catch((error) => {
       // console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });

  }
}