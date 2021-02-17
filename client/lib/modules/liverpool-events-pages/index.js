var _ = require('lodash');
const moment = require('moment');

module.exports = {
  name: 'liverpool-events-pages',
  extend: 'apostrophe-pieces-pages',
  label: 'eventPage',
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
    self.beforeIndex = async function (req, callback) {
      require('../../middleware')(self, options);
      req.data.piecesArray = _.map(req.session.eventsArray, (item) => {
        item.custom_url = "/events?piece_id=" + item._id
        return item;
      })
      console.log(req.session.eventsArrayArray);

      const pieces = [];
        for (let index = 0; index < req.session.eventsArray.length; index++) {
          if(req.session.eventsArray[index].createdAt) {
            req.session.eventsArray[index].uploadTime = moment(req.session.eventsArray[index].createdAt).fromNow();
          } else {
            req.session.eventsArray[index].uploadTime = '';
          }
          if (req.query && req.query.piece_id) {
            if (req.session.eventsArray[index]._id == req.query.piece_id) {
              pieces.splice(0, 0, req.session.eventsArray[index]);
            } else {
              pieces.push(req.session.eventsArray[index]);
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
