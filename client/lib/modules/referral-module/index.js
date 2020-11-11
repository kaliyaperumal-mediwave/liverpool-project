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
      return self.sendPage(req, self.renderer('referral', {
        content: "hello",
        subContent: ""
      }));
    };
    require('../../middleware')(self, options);
    self.route('post', 'saveReferral', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module')+ '/user/referral';
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
    var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module')+ '/user/fetchReferral';
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