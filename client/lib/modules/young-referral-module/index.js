module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Young Referral Module',
  afterConstruct: function (self) {
     self.addDispatchRoutes();
  },
  construct: function (self, options) {
     self.addDispatchRoutes = function () {
        self.dispatch('/', self.young_referral_screen1);
     };
     self.young_referral_screen1 = function (req, callback) {
        return self.sendPage(req, self.renderer('young_referral_form', {}));
     };
  }
}
