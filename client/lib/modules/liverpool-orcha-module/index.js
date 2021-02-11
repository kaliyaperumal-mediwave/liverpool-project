
module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Liverpool Orcha Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    require('../../middleware')(self, options);
    self.addDispatchRoutes = function () {
      self.dispatch('/',self.middleware.checkCommonPageAuth, self.orcha);
    };
    self.orcha = function (req, callback) {
      var appsName=[];
      var appTitle = {};
      req.data.orchaApps = req.session.orchaApps;
      var listOfApps = req.data.orchaApps;
      for (var i = 0; i < listOfApps.length; i++) {
        appTitle = {};
        appTitle.title = listOfApps[i].appName;
        appTitle.Topic = "Downloads"
        appTitle.custom_url ='/downloads?app_id='+listOfApps[i].id;
        appTitle.platform = listOfApps[i].platform;
        appsName.push(appTitle);
      }
      console.log(appsName);
      req.data.searchApps = appsName;
      var allParameter = req.url.substring(req.url.indexOf("?") + 1);
      var urlAppParamenter=allParameter.split("=")
      var appId = urlAppParamenter[1];
      req.data.currentApp = appId;
      console.log(appId)
      return self.sendPage(req, self.renderer('orcha', {
        showHeader: true,
        hideRefButton: true,
        bckBtn:req.session.resUrl
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