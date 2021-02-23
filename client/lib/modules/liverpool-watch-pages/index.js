var _ = require('lodash');
const moment = require('moment');

module.exports = {
  name: 'liverpool-watch-pages',
  extend: 'apostrophe-pieces-pages',
  label: 'watchPage',
  piecesFilters: [
    { name: 'tags' }
  ],


  construct: function (self, options) {
    var superBefore = self.beforeShow;
    self.beforeShow = function (req, callback) {
      require('../../middleware')(self, options);

      self.checkCommonPageAuth(req).then((req) => {
        return superBefore(req, callback);
      }).catch(() => {
      });
    };
    var beforeIndex = self.beforeIndex;
    self.beforeIndex = function (req, callback) {
      require('../../middleware')(self, options);
      req.data.piecesArray = _.map(req.session.watchArray, (item) => {
        item.custom_url = "/watch?piece_id=" + item._id
        return item;
      })
      const pieces = [];
        for (let index = 0; index < req.session.watchArray.length; index++) {
          if(req.session.watchArray[index].createdAt) {
            req.session.watchArray[index].uploadTime = moment(req.session.watchArray[index].createdAt).fromNow();
          } else {
            req.session.watchArray[index].uploadTime = '';
          }
          if (req.query && req.query.piece_id) {
            if (req.session.watchArray[index]._id == req.query.piece_id) {
              pieces.splice(0, 0, req.session.watchArray[index]);
            } else {
              pieces.push(req.session.watchArray[index]);
            }
          }
        }
        req.data.pieces = pieces;
      self.checkCommonPageAuth(req).then((req) => {
        return beforeIndex(req, callback);
      }).catch(() => {
      });
    };
  }
};
