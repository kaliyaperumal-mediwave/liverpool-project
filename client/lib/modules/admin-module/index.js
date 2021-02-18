module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Admin Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.admin);
    };
    require('../../middleware')(self, options);

    self.admin = function (req, callback) {
      return self.sendPage(req, self.renderer('admin', {
        showHeader: true,
        home: true,
        hideRefButton: true,
      }));
    };

    self.route('get', 'referral', function (req, res) {
      console.log('\n\nget referral queries-----------------------------------------\n', req.query, '\n\n');
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/admin/referral?offset=' + (parseInt(req.query.start)/parseInt(req.query['length']) + 1) +'&limit=' + req.query['length'];
      if(req.query.search && req.query.search.value) {
        url += '&searchValue=' + req.query.search.value;
      }
      if(req.query.order && req.query.order.length) {
        var orderBy = [], orderType = [];
        for(let index = 0; index < req.query.order.length; index++) {
          orderBy.push(req.query.order[index].column);
          orderType.push(req.query.order[index].dir);
        }
        url += '&orderBy=' + orderBy.toString() + '&orderType=' + orderType.toString();
      }
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      });
    });

    self.route('get', 'searchReferalByCode/:reqCode', function (req, res) {
      console.log("----------------------------------------------------- " + req.params.reqCode);
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/referral/searchReferalByCode?reqCode=' + req.params.reqCode
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      });
    });

    self.route('put', 'referral', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/admin/referral';
      self.middleware.put(req, res, url, req.body).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      })
    });
  }
}