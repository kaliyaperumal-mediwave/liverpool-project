module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Referral Home Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.refHome);
    };
    self.refHome = function (req, callback) {
      const getParams = req.url.substring(req.url.indexOf("?") + 1);
      return self.sendPage(req, self.renderer('referral-home', {
        headerContent: "Make a referral to Children’s and Young Person’s Liverpool & Sefton Mental Health Services",
        headerDescription: '',
        backContent: '',
        home: true,
        path: '/role?' + getParams,
        showHeader: true,
        showLogout: true
      }));
    };
  }
}