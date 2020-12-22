module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Auth Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/login', self.login);
      self.dispatch('/sign_up', self.sign_up);
    };

    self.login = function (req, callback) {
      return self.sendPage(req, self.renderer('login', {
        showHeader: true,
        home: true
      }));
    };

    self.sign_up = function (req, callback) {
      return self.sendPage(req, self.renderer('sign_up', {
        showHeader: true,
        home: true
      }));
    };

  }
}