var _ = require('lodash');

module.exports = {
  name: 'Resources-pages',
  extend: 'apostrophe-pieces-pages',
  label: 'ResourcesPage',
  piecesFilters: [
    { name: 'tags',
  counts: true }
  ],
  moogBundle: {
  modules: ['liverpool-read-pages', 'liverpool-games-pages'],
  directory: 'lib/modules'
},

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
