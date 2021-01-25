module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Home Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    require('../../middleware')(self, options);
    self.addDispatchRoutes = function () {
      self.dispatch('/',self.middleware.checkCommonPageAuth, self.home);
    };
    self.home = function (req, callback) {

      // check already logged user 
      // if yes redirect user to dashboard directly else redirect them to home page
      if(req.session.auth_token)
      {
        return req.res.redirect("/dashboard");
      }
      else
      {
        return self.sendPage(req, self.renderer('home', {
          showHeader: false,
        }));
      }
    };
  }
};