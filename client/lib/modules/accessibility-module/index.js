module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Accessibility Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    require('../../middleware')(self, options);
    self.addDispatchRoutes = function () {
      self.dispatch('/theme', self.middleware.checkCommonPageAuth, self.changeTheme);
      self.dispatch('/text_size', self.middleware.checkCommonPageAuth, self.changeTextSize);
      self.dispatch('/voiceover', self.middleware.checkCommonPageAuth, self.voiceover);
    };

    self.changeTheme = function (req, callback) {
      return self.sendPage(req, self.renderer('theme', {
        showHeader: true,
        home: true,
        hideRefButton: true,
      }));
    };

    self.changeTextSize = function (req, callback) {
      return self.sendPage(req, self.renderer('textSize', {
        showHeader: true,
        home: true,
        hideRefButton: true,
      }));
    };

    self.voiceover = function (req, callback) {
      return self.sendPage(req, self.renderer('voiceover', {
        showHeader: true,
        home: true,
        hideRefButton: true,
      }));
    };

  }
}