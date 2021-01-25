const { btoa } = require('../../utils')
const { atob } = require('../../utils')
module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Referral Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    require('../../middleware')(self, options);
    self.addDispatchRoutes = function () {
      self.dispatch('/',self.middleware.checkCommonPageAuth,self.referral);
    };
    self.referral = function (req, callback) {
      let labels;
      let decryptedUrl;
      const getParams = req.url.substring(req.url.indexOf("?") + 1);
      const deCodeParameter = atob(getParams)
      const decodeValues = deCodeParameter.split("&");
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


      if (decodeValues[1] == 'child') {
        labels = "Section 4 of 5: Your Reason For Referral";
      } else if (decodeValues[1] == 'parent') {
        labels = "Section 4 of 5: Your Reason For Referring your child";
      }
      else if (decodeValues[1] == 'professional') {
        labels = "Section 4 of 5: Your Reason For Referring the child/ young person";
      }
      return self.sendPage(req, self.renderer('referral', {
        headerContent: labels,
        headerDescription: " Before we get too far, let’s check that you or the child / young person is eligible to refer into this service.",
        backContent: '/education?' + decryptedUrl,
        home: false,
        showHeader: true,
        hideRefButton: false,
      }));
    };
    require('../../middleware')(self, options);
    self.route('post', 'saveReferral', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/referral';
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
    self.route('post', 'fetchReferral', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/fetchReferral';
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