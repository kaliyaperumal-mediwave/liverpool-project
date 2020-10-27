module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Education Employment Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.education);
    };
    self.education = function (req, callback) {
      return self.sendPage(req, self.renderer('education', {}));
    };

    require('../../middleware')(self, options);
    self.route('post', 'education', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module')+ '/user/education';
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