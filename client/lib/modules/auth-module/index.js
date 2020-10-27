module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Auth Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.role);
    };
    self.role = function (req, callback) {
      return self.sendPage(req, self.renderer('role', {}));
    };
    require('../../middleware')(self, options);
    // save eligibitiy
    self.route('post', 'eligibility', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module')+ '/user/eligibility';
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