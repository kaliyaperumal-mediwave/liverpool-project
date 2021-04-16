const { btoa } = require('../../utils')
const { atob } = require('../../utils')
module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Orcha Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/details',self.middleware.checkCommonPageAuth, self.orcha);
      self.dispatch('/',self.middleware.checkCommonPageAuth, self.orchaHome);
    };
    require('../../middleware')(self, options);
    self.orcha = function (req, callback) {
     // console.log(req.session.resUrl)
     req.data.orchaApps = req.session.orchaApps;
     //req.data.orchaApps = req.session.orchaApps;
      return self.sendPage(req, self.renderer('orcha', {
        showHeader: true,
        home: true,
        hideRefButton: true,
        bckBtn:req.session.resUrl,
      }));
    };
    self.orchaHome = function (req, callback) {
      let decryptedUrl;
      decryptedUrl = btoa('orchaBack');
      req.session.resUrl = "/apps?"+decryptedUrl;
      return self.sendPage(req, self.renderer('orchaNew', {
        showHeader: true,
        home: true,
        hideRefButton: true,
      }));
    };
    require('../../middleware')(self, options);
    self.route('get', 'getFilterData/', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/orcha/getFilterData';
      console.log("-------");
      console.log(url);
      console.log("-------");
      self.middleware.get(req, url).then((data) => {
       // console.log(data)
        return res.send(data);
      }).catch((error) => {
        //console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });
    self.route('post', 'getSearchData/', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/orcha/getSearchData';
      self.middleware.post(req, res, url, req.body).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      });
    });
  }
}