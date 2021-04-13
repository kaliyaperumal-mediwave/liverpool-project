// module.exports = {
//   extend: 'apostrophe-module',
//   label: 'Account Settings Module',
//   construct: function (self, options, callback) {

//   }
// };


const { btoa } = require('../../utils')
const { atob } = require('../../utils')
module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Account Settings Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    require('../../middleware')(self, options);
    self.addDispatchRoutes = function () {
      self.dispatch('/change_email', self.middleware.checkAuth,self.changeEmail);
      self.dispatch('/change_password',self.middleware.checkAuth, self.changePassword);
      self.dispatch('/confirmation_email',self.middleware.clearSessionReferral, self.confirmationEmail);
    };

    self.changeEmail = function (req, callback) {
      req.res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate'); //This will force the browser to obtain new copy of the page even when they hit "back".
      return self.sendPage(req, self.renderer('change_email', {
        showHeader: true,
        hideRefButton: true,
      }));
    };

    self.changePassword = function (req, callback) {
      req.res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate'); //This will force the browser to obtain new copy of the page even when they hit "back".
      return self.sendPage(req, self.renderer('change_password', {
        showHeader: true,
        hideRefButton: true,
      }));
    };

    self.confirmationEmail = function (req, callback) {
      return self.sendPage(req, self.renderer('confirmation_email', {
        showHeader: false,
        hideRefButton: false,
      }));
    };



    self.route('post', 'changePassword', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/changePassword';
      self.middleware.post(req, res, url, req.body).then((data) => {
        return res.send(data);
      }).catch((error) => {
        console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });

    self.route('post', 'changeEmail', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/changeEmail';
     // console.log("changeEmailchangeEmailchangeEmail",url);

      self.middleware.post(req, res, url, req.body).then((data) => {
        //console.log(data)
        //req.session.destroy();
        return res.send(data);
      }).catch((error) => {
        console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });
    self.route('post', 'resetEmail', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/resetEmail';
   //   console.log(req.body, "req.body=========");
      self.middleware.post(req, res, url, req.body).then((data) => {
      //  console.log(data)
        return res.send(data);
      }).catch((error) => {
        console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });
  }
}