var _ = require('lodash');

module.exports = {
  name: 'liverpool-watch-pages',
  label: 'watch Page',
  piecesFilters: [
    { name: 'tags' }
  ],


  extend: 'apostrophe-pieces-pages',
  construct: function(self, options) {
    var superBefore = self.beforeShow;
    self.beforeShow = function(req, callback) {
      require('../middleware')(self, options);
      // console.log("-----");
      // return;
      self.checkCommonPageAuth(req).then((req) => {
        return superBefore(req, callback);
      }).catch(() => {
      });
    };
    var beforeIndex = self.beforeIndex;
    self.beforeIndex = function(req, callback) {
      require('../middleware')(self, options);
      console.log("1-----");
      // return;
      self.checkCommonPageAuth(req).then((req) => {
        return beforeIndex(req, callback);
      }).catch(() => {
      });
    };
  }
};
