var _ = require('lodash');

module.exports = {
  name: 'Resources-pages',
  extend: 'apostrophe-pieces-pages',
  label: 'ResourcesPage',
  piecesFilters: [
    {
      name: 'tags',
      counts: true
    }
  ],
  moogBundle: {
    modules: ['liverpool-read-pages', 'liverpool-games-pages'],
    directory: 'lib/modules'
  },

  construct: function (self, options) {

    self.addDispatchRoutes = function () {
      console.log("orcha load Dis")
      self.dispatch('/', self.middleware.checkCommonPageAuth, self.orcha);
   };


    var superBefore = self.beforeShow;
    self.beforeShow = function (req, callback) {
      require('../../middleware')(self, options);
      console.log("show==========tst");
      console.log(req.data.piece);
      self.checkCommonPageAuth(req).then(async (req,res) => {
        let piecesArray = [];
        if (req.data.piece) {
          var ThingsToWatchArray = req.data.piece._watchPage && req.data.piece._watchPage.length > 0 ? req.data.piece._watchPage : [];
          var ThingsToWatch = _.map(ThingsToWatchArray, (item) => {
            item.custom_url = "/watch?piece_id=" + item._id
            return item;
          })

          var ThingsToReadArray = req.data.piece._readPage && req.data.piece._readPage.length > 0 ? req.data.piece._readPage : [];
          var ThingsToRead = _.map(ThingsToReadArray, (item) => {
            item.custom_url = "/read?piece_id=" + item._id
            return item;
          })
          var GamesArray = req.data.piece._gamesPage && req.data.piece._gamesPage.length > 0 ? req.data.piece._gamesPage : [];
          var Games = _.map(GamesArray, (item) => {
            item.custom_url = "/games?piece_id=" + item._id
            return item;
          })
          var EventsArray = req.data.piece._eventPage && req.data.piece._eventPage.length > 0 ? req.data.piece._eventPage : [];
          var Events = _.map(EventsArray, (item) => {
            item.custom_url = "/events?piece_id=" + item._id
            return item;
          })
          var PartnerAgenciesArray = req.data.piece._partnerAgenciesPage && req.data.piece._partnerAgenciesPage.length > 0 ? req.data.piece._partnerAgenciesPage : [];
          var PartnerAgencies = _.map(PartnerAgenciesArray, (item) => {
            item.custom_url = "/partner?piece_id=" + item._id
            return item;
          })
          piecesArray = ThingsToWatch.concat(ThingsToRead, Games, Events, PartnerAgencies)
        }
        //console.log("-----------shoiw=--------------")
        req.data.piecesArray = piecesArray;
        //return superBefore(req, callback);
        var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/orcha/getAllApps';
        console.log(url)
        req.body.searchCategory=req.data.piece.title;
        req.session.categoryTitle = req.data.piece.title;
        self.middleware.post(req, res, url, req.body).then((data) =>  {
          console.log("-----------shoiw=--------------")
         // console.log(data.data.result.items)
          //req.session.orcha_auth_token = data.data.result.items;
          console.log(data.data.result.totalCount)
       //   console.log(data.data.result.items)
          req.data.orchaApps = data.data.result.items;
          req.session.orchaApps = data.data.result.items;
       //   console.log(req.data.orchaApps)
          return superBefore(req, callback);
         //return beforeIndex(req, callback);          
        }).catch((error) => {
          console.log("---- error -------", error)
          return res.status(error.statusCode).send(error.error);
        });

        
      }).catch(() => {
      });
    };

    var beforeIndex = self.beforeIndex;
    self.beforeIndex = function (req, callback) {
      require('../../middleware')(self, options);
      console.log("index==========tst");
      self.checkCommonPageAuth(req).then(async (req,res) => {
        var Resources = await self.apos.modules['Resources-pages'].pieces.find(req, {}).toArray();
        var ThingsToWatchArray = await self.apos.modules['liverpool-watch-pages'].pieces.find(req, {}).toArray();
        var ThingsToWatch = _.map(ThingsToWatchArray, (item) => {
          item.custom_url = "/watch?piece_id=" + item._id
          return item;
        })
        var ThingsToReadArray = await self.apos.modules['liverpool-read-pages'].pieces.find(req, {}).toArray();
        var ThingsToRead = _.map(ThingsToReadArray, (item) => {
          item.custom_url = "/read?piece_id=" + item._id
          return item;
        })
        var GamesArray = await self.apos.modules['liverpool-games-pages'].pieces.find(req, {}).toArray();
        var Games = _.map(GamesArray, (item) => {
          item.custom_url = "/games?piece_id=" + item._id
          return item;
        })
        var EventsArray = await self.apos.modules['liverpool-events-pages'].pieces.find(req, {}).toArray();
        var Events = _.map(EventsArray, (item) => {
          item.custom_url = "/events?piece_id=" + item._id
          return item;
        })

        var PartnerAgenciesArray = await self.apos.modules['liverpool-Partner-agencies-pages'].pieces.find(req, {}).toArray();
        var PartnerAgencies = _.map(PartnerAgenciesArray, (item) => {
          item.custom_url = "/partner?piece_id=" + item._id
          return item;
        })
        piecesArray = Resources.concat(ThingsToWatch, ThingsToRead, Games, Events, PartnerAgencies)
        req.data.piecesArray = piecesArray;
       
        return beforeIndex(req, callback); 

        var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/orcha/getAllApps';
        console.log(url)
        self.middleware.post(req, res, url, req.body).then(async (data) =>  {
          console.log("-----------index=--------------")
          //console.log(data.data.result.accessToken)
          //req.session.orcha_auth_token = data.data.result.accessToken;
         //return beforeIndex(req, callback);          
        }).catch((error) => {
         // console.log("---- error -------", error)
          return res.status(error.statusCode).send(error.error);
        });

        return beforeIndex(req, callback); 
      }).catch(() => {
      });
    };


    self.orcha = function (req, callback) {
      console.log("orcha load")
   }
  }
};
