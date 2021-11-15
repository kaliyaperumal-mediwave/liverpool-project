const request = require('request-promise');

module.exports = function (self, options) {
  self.middleware = {

    checkAuth: function (req, res, next) {
      if (req.session.auth_token) {
        self.verifyToken(req)
          .then((data) => {
            req.data.loginId = req.session.loginIdUrl;
            req.data.userRole = req.session.user_role;
            req.data.logoPath = "/dashboard";
            req.data.aboutPage = "/pages/about";
            req.data.termPage = "/pages/terms";
            req.data.privacyPage = "/pages/privacy";
            req.data.feedbackPage = "/pages/feedback";
            req.data.contactPage = "/pages/contact";
            req.data.navigateViewRfrl = "/viewreferrals";
            req.data.urgentHelpPage = "/pages/urgent-help";
            req.data.mentalHeathPage = "/mental-health";
            req.data.resourcesPage = "/resources";
            req.data.orchaPage = "/apps";
            req.data.navigateMkeRfrl = "/make-referral";
            req.data.mentalHealth_peoplePage = "mental-health/people";
            req.data.mentalHealth_servicePage = "mental-health/services";
            req.data.showLogout = true;
            req.data.ga_code= process.env.GA_CODE;

            if (req.session.user_role === 'service_admin') {
              return req.res.redirect("/admin/serviceAdmin")
            } else if (req.session.user_role === 'admin') {
              return req.res.redirect("/admin")
            }
            return next();
          })
          .catch((error) => {
            return req.res.redirect("/users/login");
          });
      }
      else {
        req.data.userRole = req.session.user_role;
        req.data.ga_code= process.env.GA_CODE;
        return req.res.redirect("/")
      }
    },

    checkCommonPageAuth: function (req, res, next) {
      req.res.header('Cache-Control', 'no-cache, no-store');
      if (req.session.user_role === 'service_admin') {
        return req.res.redirect("/admin/serviceAdmin")
      } else if (req.session.user_role === 'admin') {
        return req.res.redirect("/admin")
      }
      //console.log("----------------checkCommonPageAuth-----------------------");
      req.data.aboutPage = "/pages/about";
      req.data.termPage = "/pages/terms";
      req.data.privacyPage = "/pages/privacy";
      req.data.feedbackPage = "/pages/feedback";
      req.data.contactPage = "/pages/contact";
      req.data.navigateViewRfrl = "/viewreferrals";
      req.data.urgentHelpPage = "/pages/urgent-help";
      req.data.mentalHeathPage = "/mental-health";
      req.data.resourcesPage = "/resources";
      req.data.orchaPage = "/apps";
      req.data.navigateMkeRfrl = "/make-referral";
      req.data.mentalHealth_peoplePage = "mental-health/people";
      req.data.mentalHealth_servicePage = "mental-health/services";
      req.data.path = "/role";
      req.data.showHome = true;
      req.data.ga_code= process.env.GA_CODE;

      if (req.session.auth_token) {
        self.verifyToken(req)
          .then((data) => {

            if (req.session.user_role === 'service_admin') {
              return req.res.redirect("/admin/serviceAdmin")
            } else if (req.session.user_role === 'admin') {
              return req.res.redirect("/admin")
            }

            req.data.loginId = req.session.loginIdUrl;
            req.data.userRole = req.session.user_role;
            req.data.uuid = req.session.uuid;
            req.data.prof_data = req.session.prof_data;
            req.data.logoPath = "/dashboard"
            req.data.showLogout = true;
            return next();
          })
          .catch((error) => {
            return req.res.redirect("/users/login");
          });
      }
      else {
        req.data.logoPath = "/";
        req.data.showLogout = false;
        req.data.loginId = "";
        req.data.prof_data = "";
        req.data.uuid = req.session.uuid;
        req.data.userRole = req.session.user_role;
        return next();
      }
    },

    //to clear uuid and userrole in referrance home page.

    clearSessionReferral: function (req, res, next) {
      if (req.session.user_role === 'service_admin') {
        return req.res.redirect("/admin/serviceAdmin")
      } else if (req.session.user_role === 'admin') {
        return req.res.redirect("/admin")
      }
      console.log("clearSessionHt")
      console.log("req.session.user_role: " + req.session.user_role)
      req.data.aboutPage = "/pages/about";
      req.data.termPage = "/pages/terms";
      req.data.privacyPage = "/pages/privacy";
      req.data.feedbackPage = "/pages/feedback";
      req.data.contactPage = "/pages/contact";
      req.data.navigateViewRfrl = "/viewreferrals";
      req.data.urgentHelpPage = "/pages/urgent-help";
      req.data.mentalHeathPage = "/mental-health";
      req.data.resourcesPage = "/resources";
      req.data.orchaPage = "/apps";
      req.data.navigateMkeRfrl = "/make-referral";
      req.data.mentalHealth_peoplePage = "mental-health/people";
      req.data.mentalHealth_servicePage = "mental-health/services";
      req.data.path = "/role";
      req.data.showHome = true;
      //console.log(req.session.auth_token)
      if (req.session.auth_token) {
        self.verifyToken(req)
          .then((data) => {
            req.data.loginId = req.session.loginIdUrl;
            req.data.userRole = req.session.user_role;
            req.data.prof_data = req.session.prof_data;
            delete req.session.uuid;
            delete req.session.referralCode
            req.data.uuid = "";
            req.data.logoPath = "/dashboard"
            req.data.showLogout = true;
            return next();
          })
          .catch((error) => {
            return req.res.redirect("/users/login");
          });
      }
      else {
        req.data.logoPath = "/";
        req.data.showLogout = false;
        req.data.loginId = "";
        delete req.session.uuid;
        delete req.session.user_role;
        delete req.session.prof_data;
        delete req.session.referralCode
        req.data.uuid = "";
        req.data.userRole = "";
        return next();
      }
    },

    checkAdminAuth: function (req, res, next) {
      if (req.session.auth_token) {
        self.verifyToken(req)
          .then((data) => {
            req.data.logoPath = "/admin";
            req.data.referral = "/admin";
            req.data.archive = "/admin/archive";
            req.data.loginAsAdmin = req.session.loginAsAdmin
            if (req.session.user_role === 'service_admin') {
              return req.res.redirect("/admin/serviceAdmin")
            } else if (req.session.user_role === 'admin') {
              return next();
            } else {
              return req.res.redirect("/dashboard")
            }
          })
          .catch((error) => {
            return req.res.redirect("/users/login");
          });
      }
      else {
        return req.res.redirect("/users/login");
      }
    },

    checkServiceAdminAuth: function (req, res, next) {
      if (req.session.auth_token) {
        self.verifyToken(req)
          .then((data) => {
            req.data.archive = "/admin/archive";
            console.log("middleware" + req.session.loginAsAdmin)
            req.data.loginAsAdmin = req.session.loginAsAdmin
            if (req.session.user_role === 'service_admin') {
              req.data.logoPath = "/admin/serviceAdmin";
              req.data.referral ="/admin/serviceAdmin";
              return next();
            } else if (req.session.user_role === 'admin') {
              req.data.logoPath = "/admin";
              req.data.referral ="/admin";
              return next();
            } else {
              return req.res.redirect("/dashboard")
            }
          })
          .catch((error) => {
            return req.res.redirect("/users/login");
          });
      }
      else {
        return req.res.redirect("/users/login");
      }
    },

    post: function (req, res, url, body) {
      console.log("post request", url);
      return new Promise((resolve, reject) => {
        let options = {
          method: 'POST',
          uri: url,
          body: body,
          headers: self.setHeader(req),
          json: true, // Automatically stringifies the body to JSON
          rejectUnauthorized: false, // temp certificate validation false
          resolveWithFullResponse: true // Get the full response instead of just the body
        };
        try {
          request(options)
            .then(function (response) {
              resolve(response.body);
            })
            .catch(function (err) {
              if (err.statusCode === 401 && req.session.auth_token) {
                req.session.destroy(function () { });
              } else if (err.error.code === 'ECONNREFUSED') {
                err.statusCode = 500;
              }
              reject(err);
            });
        } catch (error) {
          let err = {
            statusCode: 408,
            error: 'Request Timeout'
          };
          reject(err);
        }

      });
    },

    get: function (req, url) {
      console.log("get request", url);
      return new Promise((resolve, reject) => {
        let options = {
          method: 'GET',
          uri: url,
          headers: self.setHeader(req),
          json: true, // Automatically stringifies the body to JSON
          rejectUnauthorized: false, // temp certificate validation false
          resolveWithFullResponse: true // Get the full response instead of just the body
        };
        try {
          request(options)
            .then(function (response) {
              resolve(response.body);
            })
            .catch(function (err) {
              reject(err);
            });
        } catch (error) {
          let err = {
            statusCode: 408,
            error: 'Request Timeout'
          };
          reject(err);
        }
      });
    },

    put: function (req, res, url, body) {
      console.log("put request", url);
      return new Promise((resolve, reject) => {
        let options = {
          method: 'PUT',
          uri: url,
          body: body,
          headers: self.setHeader(req),
          json: true, // Automatically stringifies the body to JSON
          rejectUnauthorized: false, // temp certificate validation false
          resolveWithFullResponse: true // Get the full response instead of just the body
        };
        try {
          request(options)
            .then(function (response) {
              resolve(response.body);
            })
            .catch(function (err) {
              if (err.statusCode === 401) {
                req.session.destroy(function () { });
              } else {
                err.statusCode = 500;
              }
              reject(err);
            });
        } catch (error) {
          let err = {
            statusCode: 408,
            error: 'Request Timeout'
          };
          reject(err);
        }

      });
    },

    delete: function (req, res, url, body) {
      console.log("delete request", url);
      return new Promise((resolve, reject) => {
        let options = {
          method: 'DELETE',
          uri: url,
          body: body,
          headers: self.setHeader(req),
          json: true, // Automatically stringifies the body to JSON
          rejectUnauthorized: false, // temp certificate validation false
          resolveWithFullResponse: true // Get the full response instead of just the body
        };
        try {
          request(options)
            .then(function (response) {
              resolve(response.body);
            })
            .catch(function (err) {
              if (err.statusCode === 401) {
                req.session.destroy(function () { });
              } else {
                err.statusCode = 500;
              }
              reject(err);
            });
        } catch (error) {
          let err = {
            statusCode: 408,
            error: 'Request Timeout'
          };
          reject(err);
        }

      });
    }
  };

  self.checkCommonPageAuth = function (req) {
    if (req.session.user_role === 'service_admin') {
      return req.res.redirect("/admin/serviceAdmin")
    } else if (req.session.user_role === 'admin') {
      return req.res.redirect("/admin")
    }
    // //console.log("----------------self.checkCommonPageAuth-----------------------",req.session);
    // return new Promise((resolve, reject) => {
    //   if (req.session.aposBlessings || !req.session.auth_token) {
    //     //console.log('-------------no-user----------------');
    //     req.data.user_data = {};
    //     req.data.rolesIds = [];
    //     resolve(req);
    //   } else {
    //     //console.log('--------user exist-------',self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module'));
    //     //console.log('--------user exist-------',self.apos.PATH.getOption(req, 'authentication-path'));
    //     let url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + self.apos.PATH.getOption(req, 'authentication-path') + '/apostropheAuth';
    //     //console.log('---------------',url);
    //     self.middleware.get(req, url).then((data) => {
    //       //console.log('-------res--------',data);
    //       req.data.user_data = data.data;
    //       var rolesIds = [];
    //       for (let i = 0; i < data.data.roles.length; i++) {
    //         rolesIds.push(data.data.roles[i].id);
    //       }
    //       req.data.rolesIds = rolesIds;
    //       resolve(req);
    //     }).catch((e) => {
    //       //console.log('------------error-------',e);
    //       req.data.user_data = {};
    //       req.data.rolesIds = [];
    //       resolve(req);
    //     });
    //   }
    // });
    return new Promise((resolve, reject) => {
      req.res.header('Cache-Control', 'no-cache, no-store'); //This will force the browser to obtain new copy of the page even when they hit "back".
      //console.log("----------------checkCommonPageAuth-----------------------");
      req.data.aboutPage = "/pages/about";
      req.data.termPage = "/pages/terms";
      req.data.privacyPage = "/pages/privacy";
      req.data.feedbackPage = "/pages/feedback";
      req.data.contactPage = "/pages/contact";
      req.data.navigateViewRfrl = "/viewreferrals";
      req.data.urgentHelpPage = "/pages/urgent-help";
      req.data.mentalHeathPage = "/mental-health";
      req.data.resourcesPage = "/resources";
      req.data.orchaPage = "/apps";
      req.data.navigateMkeRfrl = "/make-referral";
      req.data.mentalHealth_peoplePage = "mental-health/people";
      req.data.mentalHealth_servicePage = "mental-health/services";
      req.data.path = "/role";
      req.data.showHome = true;
      if (req.session.auth_token) {
        self.verifyToken(req)
          .then((data) => {
            req.data.loginId = req.session.loginIdUrl;
            req.data.userRole = req.session.user_role;
            req.data.uuid = req.session.uuid;
            req.data.prof_data = req.session.prof_data;
            req.data.logoPath = "/dashboard"
            req.data.showLogout = true;
            return resolve(req);
          })
          .catch((error) => {
            return req.res.redirect("/users/login");
          });
      }
      else {
        req.data.logoPath = "/";
        req.data.showLogout = false;
        req.data.loginId = "";
        req.data.uuid = req.session.uuid;
        req.data.prof_data = req.session.prof_data;
        req.data.userRole = req.session.user_role;
        return resolve(req);
      }
    });
  };
  self.setHeader = function (req) {
    let headers;
    if (req.session.auth_token) {
      headers = {
        'Authorization': 'Bearer ' + req.session.auth_token,
        'domain_url': req.baseUrl ? req.baseUrl : req.data.baseUrl
      };
    } else {
      headers = {
        'domain_url': req.baseUrl ? req.baseUrl : req.data.baseUrl
      };
    }
    return headers;
  };

  self.verifyToken = function (req) {
    return new Promise((resolve, reject) => {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/token';
      self.middleware.get(req, url).then((data) => {
        return resolve(data);
      }).catch((error) => {
        //console.log("verify tokn");
        delete req.session.uuid;
        delete req.session.user_role;
        delete req.session.auth_token;
        delete req.session.loginFlag;
        delete req.session.prof_data;
        // req.session.sessionExp = true;
        return reject(error);
      });
    });
  };

};