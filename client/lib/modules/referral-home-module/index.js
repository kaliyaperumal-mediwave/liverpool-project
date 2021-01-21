module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Referral Home Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    require('../../middleware')(self, options);
    self.addDispatchRoutes = function () {
      // clearSessionReferral - to clear uuid and userrole in referrance home page. 
      self.dispatch('/', self.middleware.clearSessionReferral,self.refHome);
    };
    self.refHome = function (req, callback) {
      return self.sendPage(req, self.renderer('referral-home', {
        headerContent: "Make a referral to Children’s and Young Person’s Liverpool & Sefton Mental Health Services",
        headerDescription: '',
        backContent: '',
        home: true,
        showHeader: true,
      }));
    };
  }
}