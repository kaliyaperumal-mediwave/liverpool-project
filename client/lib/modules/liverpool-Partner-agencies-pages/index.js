var _ = require('lodash');

module.exports = {
  name: 'liverpool-Partner-agencies-pages',
  extend: 'apostrophe-pieces-pages',
  label: 'Partner-agencies Page',
  piecesFilters: [
    { name: 'tags' }
  ],


  construct: function(self, options) {
    var superBefore = self.beforeShow;
    self.beforeShow = function(req, callback) {
      require('../../middleware')(self, options);

      self.checkCommonPageAuth(req).then((req) => {
        return superBefore(req, callback);
      }).catch(() => {
      });
    };
    var beforeIndex = self.beforeIndex;
    self.beforeIndex = function(req, callback) {
      require('../../middleware')(self, options);

      self.checkCommonPageAuth(req).then((req) => {
        return beforeIndex(req, callback);
      }).catch(() => {
      });
    };
  }
};
