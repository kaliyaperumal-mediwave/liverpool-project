// module.exports = {
//   extend: 'apostrophe-module',
//   label: 'Dashboard Module',
//   construct: function (self, options, callback) {

//   }
// };
// remove unused var
const { btoa } = require('../../utils')
const { atob } = require('../../utils')
module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Dashboard Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    require('../../middleware')(self, options);
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.middleware.checkAuth, self.landing);
    };
    self.landing = function (req, callback) {
      return self.sendPage(req, self.renderer('dashboard', {
        showHeader: true,
        home: true,
        hideRefButton: true,
      }));
    };
    // need a change loginId/:userRole
    self.route('get', 'getIncompleteReferral', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/referral/getIncompleteReferral';
      console.log(url)
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      });
    });
    // need a change loginId/:userRole

    self.route('get', 'getUserReferral/:loginId', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/referral/getUserReferral?loginId=' + req.params.loginId
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      });
    });

    self.route('get', 'searchReferalByCode/:reqCode', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/referral/searchReferalByCode?reqCode=' + req.params.reqCode
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      });
    });
  }
}