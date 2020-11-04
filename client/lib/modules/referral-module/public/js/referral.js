module.exports = {
    extend: 'apostrophe-custom-pages',
    label: 'Referral Module',
    afterConstruct: function (self) {
        self.addDispatchRoutes();
    },
    construct: function (self, options) {
        self.addDispatchRoutes = function () {
            self.dispatch('/', self.home);
        };
        self.home = function (req, callback) {
            return self.sendPage(req, self.renderer('home', {}));
        };
    }
}