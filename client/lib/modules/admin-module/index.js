module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Admin Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.middleware.checkAdminAuth, self.admin);
      self.dispatch('/archive', self.middleware.checkServiceAdminAuth, self.archive);
      self.dispatch('/integration', self.integration);
      self.dispatch('/serviceAdmin', self.middleware.checkServiceAdminAuth, self.serviceAdmin);
    };
    self.integration = function (req, callback) {
      console.log("page land admin integration page")
      req.data.logoPath = "/";
      return self.sendPage(req, self.renderer('integration', {
        superAdmin: true,
        adminPanel: true,
        archivePge: true,
      }));
    };
    self.archive = function (req, callback) {
      console.log("page land admin archieve page")
      return self.sendPage(req, self.renderer('admin-referral-archive', {
        superAdmin: true,
        adminPanel: true,
        archivePge: true,
      }));
    };
    self.serviceAdmin = function (req, callback) {
      console.log(req.session.loginData.data.sendUserResult.service_admin_type )
      req.data.showLogout = true;
      req.data.loginAsAdmin = req.session.loginData.data.sendUserResult.service_admin_type ;
      return self.sendPage(req, self.renderer('serviceAdmin', {
        superAdmin: true,
        adminPanel: true,
        archivePge: false,
      }));
    };
    require('../../middleware')(self, options);

    self.admin = function (req, callback) {
      console.log("page land admin  page")
      console.log(req.session.loginData)
      req.data.loginAdminType = req.session.loginData.data.sendUserResult.role ;
      console.log("page land admin  page")
      return self.sendPage(req, self.renderer('admin', {
        superAdmin: true,
        adminPanel: true,
        archivePge: false,
      }));
    };

    self.route('get', 'referral', function (req, res) {
      // console.log('\n\nget referral queries-----------------------------------------\n', req.query, '\n\n');
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/admin/referral?offset=' + (parseInt(req.query.start) / parseInt(req.query['length']) + 1) + '&limit=' + req.query['length'];
      if (req.query.search && req.query.search.value) {
        url += '&searchValue=' + req.query.search.value.trim();
      }
      url += '&orderBy=' + req.query.order[0].column + '&orderType=' + req.query.order[0].dir;
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      });
    });

    // self.route('get', 'searchReferalByCode/:reqCode', function (req, res) {
    //   console.log("----------------------------------------------------- " + req.params.reqCode);
    //   var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/referral/searchReferalByCode?reqCode=' + req.params.reqCode
    //   self.middleware.get(req, url).then((data) => {
    //     return res.send(data);
    //   }).catch((error) => {
    //     return res.status(error.statusCode).send(error.error);
    //   });
    // });

    self.route('put', 'referral', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/admin/referral';
      self.middleware.put(req, res, url, req.body).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      })
    });

    self.route('put', 'referralStatusUpdate', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/admin/referralStatusUpdate';
      //console.log('referralStatusUpdate put', url);
      self.middleware.put(req, res, url, req.body).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      })
    });

    self.route('get', 'getAllreferral', function (req, res) {
      //console.log("get all referal")
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/admin/getAllreferral';
      //console.log(url);
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        // console.log(error)
        return res.status(error.statusCode).send(error.error);
      })
    });



    self.route('get', 'getActivity', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/getActivity' + ((req.query.fromDate) ? ('?fromDate=' + req.query.fromDate + '&endDate=' + req.query.endDate) : '');
      console.log(url);
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        // console.log(error)
        return res.status(error.statusCode).send(error.error);
      })
    });

    self.route('get', 'downloadReferral/:refID/:refRole/:formType', function (req, res) {
      // console.log("get all referal")
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/admin/downloadReferral?refID=' + req.params.refID + '&refRole=' + req.params.refRole + '&formType=' + req.params.formType;
      //console.log(url);
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        // console.log(error)
        return res.status(error.statusCode).send(error.error);
      })
    });

    self.route('get', 'getArchived', function (req, res) {
      // console.log('\n\nget referral queries-----------------------------------------\n', req.query, '\n\n');
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/admin/getArchived?offset=' + (parseInt(req.query.start) / parseInt(req.query['length']) + 1) + '&limit=' + req.query['length'];
      if (req.query.search && req.query.search.value) {
        url += '&searchValue=' + req.query.search.value;
      }
      url += '&orderBy=' + req.query.order[0].column + '&orderType=' + req.query.order[0].dir;
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      });
    });

    self.route('get', 'sendReferral/:refID/:refRole/:selectedProvider/:refCode/:formType', function (req, res) {

      var useVenusIaptusAPI = self.apos.LIVERPOOLMODULE.getOption(req, 'useVenusIaptusAPI');
      var url;
      url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/admin/sendReferral?refID=' + req.params.refID + '&refRole=' + req.params.refRole + '&selectedProvider=' + req.params.selectedProvider + '&refCode=' + req.params.refCode + '&formType=' + req.params.formType;
      // if (useVenusIaptusAPI=='true' && req.params.selectedProvider == 'Venus') {
      //   url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/admin/sendReferralByApi?refID=' + req.params.refID + '&refRole=' + req.params.refRole + '&selectedProvider=' + req.params.selectedProvider + '&refCode=' + req.params.refCode;
      // }
      // else {
      //   url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/admin/sendReferral?refID=' + req.params.refID + '&refRole=' + req.params.refRole + '&selectedProvider=' + req.params.selectedProvider + '&refCode=' + req.params.refCode;
      // }
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        // console.log(error)
        return res.status(error.statusCode).send(error.error);
      })
    });

    self.route('get', 'sendReferralByApi/:refID/:refRole/:selectedProvider/:refCode', function (req, res) {

      var useVenusIaptusAPI = self.apos.LIVERPOOLMODULE.getOption(req, 'useVenusIaptusAPI');
      var url;
      if (useVenusIaptusAPI == 'true' && req.params.selectedProvider == 'Venus') {
        url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/admin/sendReferralByApi?refID=' + req.params.refID + '&refRole=' + req.params.refRole + '&selectedProvider=' + req.params.selectedProvider + '&refCode=' + req.params.refCode + '&formType=' + req.params.formType;
      }
      else if (useVenusIaptusAPI == 'false' && req.params.selectedProvider == 'Venus') {
        url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/admin/sendReferral?refID=' + req.params.refID + '&refRole=' + req.params.refRole + '&selectedProvider=' + req.params.selectedProvider + '&refCode=' + req.params.refCode + '&formType=' + req.params.formType;
      }
      else {
        url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/admin/sendReferralByApi?refID=' + req.params.refID + '&refRole=' + req.params.refRole + '&selectedProvider=' + req.params.selectedProvider + '&refCode=' + req.params.refCode + '&formType=' + req.params.formType;
      }

      //var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/admin/sendReferralByApi?refID=' + req.params.refID + '&refRole=' + req.params.refRole + '&selectedProvider=' + req.params.selectedProvider + '&refCode=' + req.params.refCode;
      console.log(url);
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        // console.log(error)
        return res.status(error.statusCode).send(error.error);
      })
    });

    //Api end point to downlaod json file
    self.route('get', 'downloadJson', function (req, res) {
      console.log("downloadJson")
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/admin/downloadJson';
      //console.log(url);
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        // console.log(error)
        return res.status(error.statusCode).send(error.error);
      })
    });
    self.route('post', 'validateIntegration', function (req, res) {
      console.log("validateIntegration")
      console.log(req.body)
      var mindwavePassword = self.apos.LIVERPOOLMODULE.getOption(req, 'apiIntegrationPassword');
      if (mindwavePassword == req.body.password) {
        var data = {
          statusCode: 200,
          successMsg: "Integration password matched."
        }
        return res.send(data);
      }
      else {
        var data = {
          statusCode: 500,
          successMsg: "Integration password not matched."
        }
        return res.send(data);
      }
    });

    self.route('put', 'updateApiValue', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/admin/updateApiValue';
      //console.log('referralStatusUpdate put', url);
      self.middleware.put(req, res, url, req.body).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      })
    });

    self.route('get', 'getApiService', function (req, res) {
      console.log("downloadJson")
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/admin/getApiService';
      //console.log(url);
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        // console.log(error)
        return res.status(error.statusCode).send(error.error);
      })
    });

    self.route('post', 'bookAppointment', function (req, res) {
      console.log("bookAppointment")
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/appointment/create';
      self.middleware.post(req, res, url, req.body).then((data) => {
      //  //console.log(data)
        return res.send(data);
      }).catch((error) => {
        //console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });

    self.route('post', 'needAppointment', function (req, res) {
      console.log("needAppointment")
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/appointment/sendMail';
      self.middleware.post(req, res, url, req.body).then((data) => {
      //  //console.log(data)
        return res.send(data);
      }).catch((error) => {
        //console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });
  }
}