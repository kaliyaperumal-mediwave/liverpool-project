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
    self.route('get','getUserReferral/:referralType', function (req, res) {
      console.log("----------------------------------------------------- " +req.params.referralType );
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/referral/getUserReferral?referralType=' +  req.params.referralType;
      console.log("-------");
      console.log(url);
      console.log("-------");
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      });
    });

    self.route('get','getReferalByCode/:seachTxt', function (req, res) {
      console.log("----------------------------------------------------- " +req.params.seachTxt );
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/referral/getReferalByCode?reqCode=' +  req.params.seachTxt;
      console.log("-------");
      console.log(url);
      console.log("-------");
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      });
    });
  }
}