module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Admin Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.admin);
    };
    require('../../middleware')(self, options);

    self.admin = function (req, callback) {
      return self.sendPage(req, self.renderer('admin', {
        showHeader: true,
        home: true,
        hideRefButton: true,
      }));
    };

    self.route('get', 'referral', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/admin/referral';
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      });
    });
  }
}