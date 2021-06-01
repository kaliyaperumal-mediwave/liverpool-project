module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Admin Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.middleware.checkAdminAuth, self.admin);
      self.dispatch('/archive', self.middleware.checkAdminAuth, self.archive);
      self.dispatch('/serviceAdmin', self.middleware.checkServiceAdminAuth, self.serviceAdmin);
    };
    self.archive = function (req, callback) {
      return self.sendPage(req, self.renderer('admin-referral-archive', {
        superAdmin: true,
        adminPanel: true
      }));
    };
    self.serviceAdmin = function (req, callback) {
      return self.sendPage(req, self.renderer('serviceAdmin', {
        superAdmin: false,
        adminPanel: true
      }));
    };
    require('../../middleware')(self, options);

    self.admin = function (req, callback) {
      return self.sendPage(req, self.renderer('admin', {
        superAdmin: true,
        adminPanel: true
      }));
    };

    self.route('get', 'referral', function (req, res) {
     // console.log('\n\nget referral queries-----------------------------------------\n', req.query, '\n\n');
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/admin/referral?offset=' + (parseInt(req.query.start)/parseInt(req.query['length']) + 1) +'&limit=' + req.query['length'];
      if(req.query.search && req.query.search.value) {
        url += '&searchValue=' + req.query.search.value;
      }
      url += '&orderBy=' + req.query.order[0].column + '&orderType=' + req.query.order[0].dir;
      console.log(url)
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
      console.log('referralStatusUpdate put', url);
      self.middleware.put(req, res, url, req.body).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      })
    });

    self.route('get', 'getAllreferral', function (req, res) {
      console.log("get all referal")
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/admin/getAllreferral';
     //console.log(url);
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
       // console.log(error)
        return res.status(error.statusCode).send(error.error);
      })
    });

    self.route('get', 'downloadReferral/:refID/:refRole', function (req, res) {
      console.log("get all referal")
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/admin/downloadReferral?refID=' + req.params.refID +'&refRole='+ req.params.refRole ;
      console.log(url);
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
       // console.log(error)
        return res.status(error.statusCode).send(error.error);
      })
    });

    self.route('get', 'getArchived', function (req, res) {
      // console.log('\n\nget referral queries-----------------------------------------\n', req.query, '\n\n');
       var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/admin/getArchived?offset=' + (parseInt(req.query.start)/parseInt(req.query['length']) + 1) +'&limit=' + req.query['length'];
       if(req.query.search && req.query.search.value) {
         url += '&searchValue=' + req.query.search.value;
       }
       url += '&orderBy=' + req.query.order[0].column + '&orderType=' + req.query.order[0].dir;
       self.middleware.get(req, url).then((data) => {
         return res.send(data);
       }).catch((error) => {
         return res.status(error.statusCode).send(error.error);
       });
     });

    self.route('get', 'sendReferral/:refID/:refRole/:selectedProvider/:refCode', function (req, res) {
      console.log("get all referal")
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/admin/sendReferral?refID=' + req.params.refID +'&refRole='+ req.params.refRole +'&selectedProvider=' + req.params.selectedProvider +'&refCode=' + req.params.refCode;
      console.log(url);
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
       // console.log(error)
        return res.status(error.statusCode).send(error.error);
      })
    });
  }
}