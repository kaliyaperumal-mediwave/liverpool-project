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
      const getParams = req.url.substring(req.url.indexOf("?") + 1);
      const deCodeParameter = atob(getParams)
      const getParamsRedirect = deCodeParameter + "&edit";
      const decryptedUrl = btoa(getParamsRedirect);
      return self.sendPage(req, self.renderer('review', {
        headerContent: "Section 5 of 5: Preferences and review",
        headerDescription: " Before we get too far, let’s check that you or the child / young person is eligible to refer into this service.",
        backContent: '/referral/' + decryptedUrl,
        home: false
      }));
    };

    require('../../middleware')(self, options);
    self.route('get', 'fetchReview/:userid', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/fetchReview?user_id=' + req.params.userid;
      console.log("-------");
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
  }
}