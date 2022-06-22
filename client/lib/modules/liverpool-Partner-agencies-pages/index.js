var _ = require('lodash');
const moment = require('moment');

module.exports = {
  name: 'liverpool-Partner-agencies-pages',
  extend: 'apostrophe-pieces-pages',
  label: 'partnerAgenciesPage',
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
      req.data.piecesArray = _.map(req.session.partnerAgenciesArray, (item) => {
        item.custom_url = "/partner?piece_id=" + item._id
        return item;
      })
      const pieces = [];
      if(req.session.partnerAgenciesArray!=undefined)
      {
        for (let index = 0; index < req.session.partnerAgenciesArray.length; index++) {
          if(req.session.partnerAgenciesArray[index].createdAt) {
            req.session.partnerAgenciesArray[index].uploadTime = moment(req.session.partnerAgenciesArray[index].createdAt).fromNow();
          } else {
            req.session.partnerAgenciesArray[index].uploadTime = '';
          }
          if (req.query && req.query.piece_id) {
            if (req.session.partnerAgenciesArray[index]._id == req.query.piece_id) {
              pieces.splice(0, 0, req.session.partnerAgenciesArray[index]);
            } else {
              pieces.push(req.session.partnerAgenciesArray[index]);
            }
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
