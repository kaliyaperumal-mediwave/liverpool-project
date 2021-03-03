module.exports = {
  extend: "apostrophe-custom-pages",
  label: "Auth Module",
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    require('../../middleware')(self, options);
    self.addDispatchRoutes = function () {
      self.dispatch('/login', self.middleware.checkCommonPageAuth, self.login);
      self.dispatch('/sign_up', self.middleware.checkCommonPageAuth, self.sign_up);
      self.dispatch('/forgotpassword', self.middleware.checkCommonPageAuth, self.forgotpassword);
      self.dispatch("/resetpassword", self.middleware.checkCommonPageAuth, self.resetPassword);
    };

    self.forgotpassword = function (req, callback) {

      return self.sendPage(req, self.renderer('forgot_password', {
        showHeader: true,
        home: true,
        hideRefButton: true,
      }));
    };
    self.login = function (req, callback) {

      // check already logged user 
      // if yes redirect user to dashboard directly else redirect them to login page
      req.res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate'); //This will force the browser to obtain new copy of the page even when they hit "back".
      console.log(req.session.auth_token)
      console.log(req.session.sessionExp)
      if (req.session.auth_token) {
        return req.res.redirect("/dashboard");
      }
      return self.sendPage(req, self.renderer('login', {
        showHeader: true,
        home: true,
        hideRefButton: true,
        sessionExp: req.session.sessionExp
      }));
    };
    self.sign_up = function (req, callback) {

      // check already logged user 
      // if yes redirect user to dashboard directly else redirect them to signup page
      req.res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate'); //This will force the browser to obtain new copy of the page even when they hit "back".
      if (req.session.auth_token) {
        return req.res.redirect("/dashboard");
      }
      return self.sendPage(req, self.renderer('sign_up', {
        showHeader: true,
        home: true,
      }));
    };

    self.resetPassword = function (req, callback) {
      if (req.query && req.query.token) {
        return self.sendPage(req, self.renderer('reset_password', {
          showHeader: true,
          home: true,
          hideRefButton: true,
        }));
      } else {
        return req.res.redirect("/dashboard");
      }
    };

    require('../../middleware')(self, options);
    self.route('post', 'doCreateAcc', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/signup';
      self.middleware.post(req, res, url, req.body).then((data) => {
        console.log(data.data.data.user_role)
        if (data) {
          ///req.session.auth_token = data.data.token;
          req.session.email = data.data.email
          req.session.auth_token = data.data.token;
          req.session.user_role = data.data.data.user_role;
          req.session.loginFlag = "true";
          req.session.reload(function () { });
        }
        return res.send(data);
      }).catch((error) => {
        console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });

    self.route('post', 'doLogin', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/login';
      self.middleware.post(req, res, url, req.body).then((data) => {
        console.log(data)
        if (data) {
          req.session.auth_token = data.data.sendUserResult.token;
          req.session.user_role = data.data.sendUserResult.role
          req.session.email = data.data.sendUserResult.email
          req.session.loginFlag = "true";
          // need a change - decrypt
          req.session.reload(function () { });
        }
        return res.send(data);
      }).catch((error) => {
        console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });


    self.route('post', 'forgotPassword', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/forgotPassword';
      self.middleware.post(req, res, url, req.body).then((data) => {
        console.log(data)
        return res.send(data);
      }).catch((error) => {
        console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });
    self.route('post', 'resetPassword', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/resetPassword';
      self.middleware.post(req, res, url, req.body).then((data) => {
        console.log(data)
        return res.send(data);
      }).catch((error) => {
        console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });
    self.route('get', 'doLogout', function (req, res) {
      console.log("---- doLogout -------")
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/logOut';
      self.middleware.post(req, res, url, req.body).then((data) => {
        console.log(data)
        console.log(req.session.auth_token)
        req.session.destroy();
        return res.send(data);
      }).catch((error) => {
        // console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });
    self.route('get', 'resetPassword/verifyToken', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/resetPassword/verifyToken?token=' + req.query.token;
      self.middleware.get(req, url).then((data) => {
        console.log(data);
        return res.send(data);
      }).catch((error) => {
        console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });

    //set sessionExp to false
    self.route('get', 'setSessionExpFalse/:fromLogin', function (req, res) {
      req.session.sessionExp = "false";
      console.log(req.session.frm_ref_home)
      return res.send({ data: { success: "true", message: "session ref_home set" } });
    });
  },
};
