const { btoa } = require('../../utils')
const { atob } = require('../../utils')
module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Check Referral Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    require('../../middleware')(self, options);
    self.addDispatchRoutes = function () {
      self.dispatch('/',self.middleware.checkAuth, self.checkReferral);
    };

    self.checkReferral = function (req, callback) {
      return self.sendPage(req, self.renderer('check-referral', {
        showHeader: true,
        home: true,
      }));
    };
    require('../../middleware')(self, options);
    self.route('get', 'getUserReferral/:loginId/:referralType', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/referral/getUserReferral?loginId=' +  req.params.loginId +"&referralType=" +req.params.referralType;
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      });
    });
  }
}