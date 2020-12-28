// module.exports = {
//   extend: 'apostrophe-module',
//   label: 'Dashboard Module',
//   construct: function (self, options, callback) {

//   }
// };

module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Dashboard Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.landing);
    };
    self.landing = function (req, callback) {
      return self.sendPage(req, self.renderer('dashboard', {
        showHeader: true,
        home: true
      }));
    };
    require('../../middleware')(self, options);
    self.route('get', 'getIncompleteReferral/:loginId/:userRole', function (req, res) {
      console.log(req.params.loginId); 
      console.log(req.params.userRole); 
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/referral/getIncompleteReferral?loginId=' +  req.params.loginId +"&userRole=" +req.params.userRole;
      console.log("-------");
      console.log(url);
      console.log("-------");
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        // console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });


    self.route('get', 'fetchEligibility/:userid', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/fetchEligibility?user_id=' + req.params.userid;
      console.log("-------");
      console.log(req.params.userid);
      console.log(url);
      console.log("-------");
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        // console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });
  }
}