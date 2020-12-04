const { btoa } = require('../../utils')
const { atob } = require('../../utils')
module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Referral Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.referral);
    };
    self.referral = function (req, callback) {
      var labels;
      const getParams = req.url.substring(req.url.indexOf("?") + 1);
      const deCodeParameter = atob(getParams)
      const getParamsRedirect = deCodeParameter+"&edit";
      const decryptedUrl = btoa(getParamsRedirect);
    //  const decryptedUrl = btoa(getParams);
      if (req.query.role == 'child') {
        labels = "Section 4 of 5: Your Reason For Referral";
      } else if (req.query.role == 'parent') {
        labels = "Section 4 of 5: Your Reason For Referring your child";
      }
      else if (req.query.role == 'professional') {
        labels = "Section 4 of 5: Your Reason For Referring the child/ young person";
      }
      return self.sendPage(req, self.renderer('referral', {
        headerContent: labels,
        headerDescription: " Before we get too far, let’s check that you or the child / young person is eligible to refer into this service.",
        backContent: '/education/' + decryptedUrl,
        home: false
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