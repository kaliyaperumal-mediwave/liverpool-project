
module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Liverpool Orcha Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.orcha);
    };
    self.orcha = function (req, callback) {
      console.log(req.session.categoryTitle);
      req.data.orchaApps = req.session.orchaApps
      return self.sendPage(req, self.renderer('orcha', {
        showHeader: true,
        hideRefButton: true,
        bckBtn:"/resources/" + (req.session.categoryTitle).toLowerCase()
      }));
    };
    require('../../middleware')(self, options);
    self.route('get', 'getApp/:appId', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/orcha/getApp?app_id='+ req.params.appId;
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
  }
}