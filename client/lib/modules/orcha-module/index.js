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
      req.data.orchaApps = req.session.orchaApps;
     if(req.session.resUrl!='/orcha/orchahome')
     {
      var appsName=[];
      var appTitle = {};
      var listOfApps = req.data.orchaApps;
      for (var i = 0; i < listOfApps.length; i++) {
        appTitle = {};
        appTitle.title = listOfApps[i].appName;
        appTitle.Topic = "Downloads"
        appTitle.custom_url ='/apps/details?app_id='+listOfApps[i].id;
        appTitle.platform = listOfApps[i].platform;
        appsName.push(appTitle);
      }
      console.log(appsName);
      req.data.searchApps = appsName;
     }
     //req.data.orchaApps = req.session.orchaApps;
     //req.data.orchaApps = req.session.orchaApps;
      return self.sendPage(req, self.renderer('orcha', {
        showHeader: true,
        home: true,
        hideRefButton: true,
        bckBtn:req.session.resUrl
      }));
    };

    self.orchaHome = function (req, callback) {
      req.session.resUrl = "/apps";
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
      console.log("-------");
      console.log(url);
      console.log("-------");
      self.middleware.post(req, res, url, req.body).then((data) => {
       // console.log(data)
        return res.send(data);
      }).catch((error) => {
        //console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });
  }
}