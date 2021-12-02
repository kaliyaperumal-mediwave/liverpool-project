var _ = require("lodash");

module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Referral Completed Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      require('../../middleware')(self, options);
      self.dispatch('/', self.middleware.checkCommonPageAuth, self.completed);
    };
    self.completed =  async function (req, callback) {
      console.log("section 5: " + req.session.uuid)
      if (!req.session.user_role) {
        return req.res.redirect("/")
      }
      var recommendedList = await getUserRec(req,req.session.uuid)
      return self.sendPage(req, self.renderer('completed', {
        showHeader: true,
        headerContent: "The referral has been made to Sefton & Liverpool Children’s and Young Person’s Mental Health Services",
        headerDescription: '',
        backContent: '',
        home: false,
        completed: true,
        hideRefButton: false,
      }));
    };
    require('../../middleware')(self, options);
    self.route('get', 'getRefNo/:userid', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/getRefNo?user_id=' + req.params.userid;
      //console.log("-------");
      //console.log(url);
      //console.log("-------");

      self.middleware.get(req, url).then((data) => {
        console.log(data)
        console.log(data.reference_code)
        if (data) {
          req.session.referralCode = data.reference_code;
        }
        return res.send(data);

      }).catch((error) => {
        //  //console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });
  
    self.route('get', 'getSavedRes/:userid', async function (req, res) {
      var cmsResources = await self.apos.modules['Resources-pages'].pieces.find(req, {}).toArray();
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/resources/getSavedRes?user_id=' + req.params.userid;
      self.middleware.get(req, url).then((data) => {
        var dbUserReason = data.data.reasonArray
        var personalArray = [];
        var recommended = _.map(cmsResources, (item) => {
          _.map(item.tags, (tagObj) => {
            _.map(dbUserReason, (dbAr) => {
              if (tagObj.toLowerCase() == dbAr.toLowerCase()) {
                personalArray.push(item)
              }
            })
          });
        });
        personalArray = personalArray.filter(function (item, index, inputArray) {
          return inputArray.indexOf(item) == index;
        });
        req.data.recommended = personalArray
        return res.send(personalArray);

      }).catch((error) => {
       console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });

    self.route('post', 'sendConfirmationMail', function (req, res) {
      //req.body.email = req.session.email
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/referral/sendConfirmationMail'
      //console.log("-------");
      //console.log(url);
      //console.log("-------");
      self.middleware.post(req, res, url, req.body).then((data) => {
        return res.send(data);
      }).catch((error) => {
        //  //console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });

    self.route('get', 'getReferalByCode/:reqCode', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/referral/getReferalByCode?reqCode=' + req.params.reqCode;
      ////console.log("------- URL --------", url);
      self.middleware.get(req, url).then((data) => {
        console.log(data[0].reference_code)
        if (data) {
          req.session.referralCode = data[0].reference_code;
        }
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      });
    });

    require('../../middleware')(self, options);
    self.route('post', 'doCreateAcc', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/referralSignup';
      self.middleware.post(req, res, url, req.body).then((data) => {
        if (data) {
          req.session.email = data.data.email
          req.session.auth_token = data.data.token;
          req.session.user_role = data.data.data.user_role;
          req.session.loginFlag = "true";
          req.session.prof_data = data.data.prof_data ? JSON.stringify(data.data.prof_data) : '';
          req.session.reload(function () { });
        }
        return res.send(data);
      }).catch((error) => {
        //console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });
    self.route('post', 'feedback', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/refFeedback';
      // //console.log(req.body, "req.body=========");
      self.middleware.post(req, res, url, req.body).then((data) => {
        // //console.log(data);
        return res.send(data);
      }).catch((error) => {
        //console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });

    self.route('post', 'sendReferralToMe/', function (req, res) {
      //req.body.email = req.session.email
      //  var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/referral/sendReferralToMe?role=' + req.params.role +'&profEmail='+ req.params.profEmail +'&refPdfCode='+ req.params.refPdfCode +'&referralCode='+ req.params.referralCode;
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/referral/sendReferralToMe';
      //console.log("-------");
      //console.log(url);
      //console.log("-------");
      self.middleware.post(req, res, url, req.body).then((data) => {
        return res.send(data);
      }).catch((error) => {
        console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });

    const getUserRec = async (req,refId) => {
     console.log("working")
     console.log(refId)
      var cmsResources = await self.apos.modules['Resources-pages'].pieces.find(req, {}).toArray();
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/resources/getSavedRes?user_id=' + refId;
      self.middleware.get(req, url).then((data) => {
        var dbUserReason = data.data.reasonArray
        var personalArray = [];
        var recommended = _.map(cmsResources, (item) => {
          _.map(item.tags, (tagObj) => {
            _.map(dbUserReason, (dbAr) => {
              if (tagObj.toLowerCase() == dbAr.toLowerCase()) {
                personalArray.push(item)
              }
            })
          });
        });
        personalArray = personalArray.filter(function (item, index, inputArray) {
          return inputArray.indexOf(item) == index;
        });
        console.log("return")
        req.data.recommended = personalArray
        return personalArray
       // return res.send(personalArray);

      }).catch((error) => {
       console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
  
      //return dbUserReason;
    };

  }
}