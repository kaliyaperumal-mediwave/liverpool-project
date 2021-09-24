const config = require("../../gplist.json");
const { btoa } = require('../../utils')
const { atob } = require('../../utils')

var _ = require("lodash");
module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Young Referral Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.middleware.checkCommonPageAuth, self.young_referral_screen);
      self.dispatch('/youngAbout', self.middleware.checkCommonPageAuth, self.young_referral_about);
      self.dispatch('/education', self.middleware.checkCommonPageAuth, self.young_education);
      self.dispatch('/referral', self.middleware.checkCommonPageAuth, self.young_referral);
      self.dispatch('/review', self.middleware.checkCommonPageAuth, self.young_review);



    };
    require('../../middleware')(self, options);


    self.young_referral_screen = function (req, callback) {
      console.log('-------------------------');
      if (!req.session.frm_ref_home) {
        return req.res.redirect("/")
      }
      if (req.session.referralCode) {
        return req.res.redirect("/acknowledge")
      }
      req.res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      return self.sendPage(req, self.renderer('young_referral_form', {
        headerContent: "Section 1 of 5: Eligibility",
        headerDescription: "Before we get too far, let’s check we can support you",
        backContent: '',
        home: false,
        showHeader: true,
        hideRefButton: false,
      }));
    };

    self.young_referral_about = function (req, callback) {
      // if (!req.session.user_role) {
      //   return req.res.redirect("/")
      // }
      console.log("3434")
      if (req.session.referralCode) {
        return req.res.redirect("/acknowledge")
      }
      const getParamsData = req.url.substring(req.url.indexOf("?") + 1);
      var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
      let labels;
      let decryptedUrl;
      const getParams = req.url.substring(req.url.indexOf("?") + 1);
      const deCodeParameter = atob(getParams);
      let decodeValues = deCodeParameter.split("&");
      const getParamsRedirect = "backbutton";
      decryptedUrl = btoa(getParamsRedirect);

      req.res.header('Cache-Control', 'no-cache, no-store'); //This will force the browser to obtain new copy of the page even when they hit "back".
      return self.sendPage(req, self.renderer('young_about', {
        headerContent: "Section 2 of 5: About you & your household",
        headerDescription: "Now we need some personal details, such as name & contact details",
        backContent: '/young-referral?' + decryptedUrl,
        home: false,
        showHeader: true,
        hideRefButton: false,
      }));

    };

    self.young_education = function (req, callback) {
      // if (!req.session.user_role) {
      //   return req.res.redirect("/")
      // }
      if (req.session.referralCode) {
        return req.res.redirect("/acknowledge")
      }
      let decryptedUrl;
      const getParams = req.url.substring(req.url.indexOf("?") + 1);
      const deCodeParameter = atob(getParams)
      let decodeValues = deCodeParameter.split("&");
      const getParamsRedirect = "backbutton";
      decryptedUrl = btoa(getParamsRedirect);
      req.res.header('Cache-Control', 'no-cache, no-store'); //This will force the browser to obtain new copy of the page even when they hit "back".

      return self.sendPage(req, self.renderer('young_education', {
        headerContent: "Section 3 of 5: Education, employment & support needs",
        headerDescription: "We also need details about school & employment",
        backContent: '/young-referral/about?' + decryptedUrl,
        home: false,
        showHeader: true,
        //completed: true,
        hideRefButton: false,
      }));
    };

    self.young_referral = function (req, callback) {
      // if (!req.session.user_role) {
      //   return req.res.redirect("/")
      // }
      if (req.session.referralCode) {
        return req.res.redirect("/acknowledge")
      }
      let labels;
      let decryptedUrl;
      const getParams = req.url.substring(req.url.indexOf("?") + 1);
      const deCodeParameter = atob(getParams)
      const decodeValues = deCodeParameter.split("&");
      const getParamsRedirect = "backbutton";
      decryptedUrl = btoa(getParamsRedirect);

      req.res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      return self.sendPage(req, self.renderer('young_referral', {
        headerContent: "Section 4 of 5: Reason for referral",
        headerDescription: "The most important part - why are you making a referral today?",
        backContent: '/young-referral/education?' + decryptedUrl,
        home: false,
        showHeader: true,
        hideRefButton: false,
      }));
    };

    self.young_review = function (req, callback) {
      // if (!req.session.user_role) {
      //   return req.res.redirect("/")
      // }
      if (req.session.referralCode) {
        return req.res.redirect("/acknowledge")
      }
      let decryptedUrl;
      const getParams = req.url.substring(req.url.indexOf("?") + 1);
      const deCodeParameter = atob(getParams);
      let decodeValues = deCodeParameter.split("&");
      const getParamsRedirect = "backbutton";
      decryptedUrl = btoa(getParamsRedirect);
      req.res.header('Cache-Control', 'no-cache, no-store'); //This will force the browser to obtain new copy of the page even when they hit "back".
      return self.sendPage(req, self.renderer('young_review', {
        headerContent: "Section 5 of 5: Form review & contact preferences",
        headerDescription: "Check over your answers and let us know how to keep in touch",
        backContent: '/young-referral/referral?' + decryptedUrl,
        home: false,
        showHeader: true,
        hideRefButton: false,
      }));
    };


    // save eligibitiy
    self.route('post', 'youngEligibility', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/youngEligibility';
      self.middleware.post(req, res, url, req.body).then((data) => {
        // setting the uuid and userrole to use in upcoming sections.
        console.log(data)
        if (!req.body.editFlag) {
          if (req.session.auth_token) {
            req.session.uuid = data.userid;
          }
          else {
            req.session.user_role = data.user_role;
            req.session.uuid = data.userid;
          }
        }
        return res.send(data);
      }).catch((error) => {
        //console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });

    self.route('get', 'youngFetchEligibility/:userid', function (req, res) {
      console.log("Ere")
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/youngFetchEligibility?user_id=' + req.params.userid;
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      });
    });

    self.route('get', 'getGpByName/:name', function (req, res) {
      var searchTxt = req.params.name;
      var searchRslt = []
      var result = _.filter(config, function (gp) {
        if (!!~gp.Name.toLowerCase().indexOf(searchTxt.toLowerCase())) {
          searchRslt.push(gp);
        }
      });
      return res.send(searchRslt);
    });


    self.route('get', 'getGpByPostCode/:postcode', function (req, res) {
      var searchTxt = req.params.postcode;
      var searchRslt = []
      var result = _.filter(config, function (gp) {
        if (!!~gp.Postcode.toLowerCase().indexOf(searchTxt.toLowerCase())) {
          searchRslt.push(gp);
        }
      });
      return res.send(searchRslt);
    });

    self.route('post', 'saveYoungReferral', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/saveYoungReferral';
      self.middleware.post(req, res, url, req.body).then((data) => {
        return res.send(data);
      }).catch((error) => {
        console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });

    self.route('post', 'fetchYoungReferral', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/fetchYoungReferral';
      self.middleware.post(req, res, url, req.body).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      });
    });


    self.route('post', 'fetchYoungAbout', function (req, res) {
      console.log('fetchYoungAbout')
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/fetchYoungAbout';
      self.middleware.post(req, res, url, req.body).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      });
    });

    self.route('post', 'young_education', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/saveYoungeducation';
      self.middleware.post(req, res, url, req.body).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      });
    });

    self.route('post', 'fetchProfession', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/fetchYoungProfession';
      self.middleware.post(req, res, url, req.body).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      });
    });


    self.route('get', 'fetchReview/:userid', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/fetchReview?user_id=' + req.params.userid;
      //console.log("-------");
      ////console.log(req.params.userid);
      //console.log(url);
      //console.log("-------");
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        //  //console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });
    self.route('post', 'saveReview', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/saveReview';
      //console.log("-------");
      //console.log(url);
      //console.log("-------");
      req.body.venusApi = self.apos.LIVERPOOLMODULE.getOption(req, 'useVenusIaptusAPI');
      //console.log(req.body)
      self.middleware.post(req, res, url, req.body).then((data) => {
        return res.send(data);
      }).catch((error) => {
        //console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });

    self.route('put', 'updateInfo', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + req.body.endPoint;
      //console.log("-------");
      //console.log(url);
      //console.log("-------");
      self.middleware.put(req, res, url, req.body).then((data) => {
        if (req.session.redirectto) {
          data.redirectto = req.session.redirectto;
        }
        req.session.reload(function () { });
        return res.send(data);
      }).catch((error) => {
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

  }
}
