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
      //console.log("show==========tst");
      //console.log(req.data.piece._url);
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
         // piecesArray = ThingsToWatch.concat(ThingsToRead, Games, Events, PartnerAgencies)
        }
        //console.log("-----------shoiw=--------------")
       // req.data.piecesArray = piecesArray;
        //return superBefore(req, callback);
        var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/orcha/getAllApps';
        //console.log(url)
        req.body.searchCategory=req.data.piece.title;
        req.session.categoryTitle = req.data.piece.title;
        req.session.resUrl = req.data.piece._url
        self.middleware.post(req, res, url, req.body).then((data) =>  {
          var appsName=[];
          var appTitle = {};
          var listOfApps = data.data.result.items
          //console.log(listOfApps);
          for (var i = 0; i < listOfApps.length; i++) {
            appTitle = {};
            appTitle.title = listOfApps[i].appName;
            appTitle.platform = listOfApps[i].platform;
            appTitle.Topic = "Downloads"
            appTitle.custom_url ='/downloads?app_id='+listOfApps[i].id;
            appTitle.score = listOfApps[i].score
            appsName.push(appTitle);
          }
         // console.log( data.data.result.items);
          piecesArray = ThingsToWatch.concat(ThingsToRead, Games, Events, PartnerAgencies,appsName)
         // console.log(piecesArray);
          req.data.piecesArray = piecesArray;
          req.data.orchaApps = data.data.result.items;
          req.session.orchaApps = data.data.result.items;
          return superBefore(req, callback);
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
      }).catch(() => {
      });
    };


    self.orcha = function (req, callback) {
      console.log("orcha load")
   }
  }
};
