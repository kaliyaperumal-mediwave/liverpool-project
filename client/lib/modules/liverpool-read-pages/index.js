var _ = require('lodash');
const moment = require('moment');

module.exports = {
  name: 'liverpool-read-pages',
  extend: 'apostrophe-pieces-pages',
  label: 'readPage',
  piecesFilters: [
    {
      name: 'tags',
      counts: true
    }
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
      req.data.piecesArray = _.map(req.session.readArray, (item) => {
        item.custom_url = "/read?piece_id=" + item._id
        return item;
      })
      const pieces = [];
     //console.log( req.session.readArray.doc_pdf);
     if(req.session.readArray!=undefined)
     {
      for (let index = 0; index < req.session.readArray.length; index++) {
        //console.log("req.session.readArray.doc_pdf");
       // console.log(req.session.readArray[index].doc_pdf);
        if(req.session.readArray[index].doc_pdf){
          req.session.readArray[index].doc_pdf.url=self.apos.LIVERPOOLMODULE.getOption(req, 'blobStorage') + "attachments/" + req.session.readArray[index].doc_pdf._id+"-"+req.session.readArray[index].doc_pdf.name+"."+req.session.readArray[index].doc_pdf.extension
          console.log(req.session.readArray[index].doc_pdf.url)
          req.session.readArray[index].isPdf = true;
        }
        else
        {
          req.session.readArray[index].isPdf = false;
        }
        if(req.session.readArray[index].createdAt) {
          req.session.readArray[index].uploadTime = moment(req.session.readArray[index].createdAt).fromNow();
        } else {
          req.session.readArray[index].uploadTime = '';
        }
        if (req.query && req.query.piece_id) {
          if (req.session.readArray[index]._id == req.query.piece_id) {
            pieces.splice(0, 0, req.session.readArray[index]);
          } else {
            pieces.push(req.session.readArray[index]);
          }
        }
      }
     }
        req.data.pieces = pieces;
      require('../../middleware')(self, options);
      self.checkCommonPageAuth(req).then((req) => {
        return beforeIndex(req, callback);
      }).catch(() => {
      });
    };
  }
};
