module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Referral Home Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    require('../../middleware')(self, options);
    self.addDispatchRoutes = function () {
      // clearSessionReferral - to clear uuid and userrole in referrance home page. 
      self.dispatch('/', self.middleware.clearSessionReferral,self.refHome);
    };
    self.refHome = function (req, callback) {
      req.res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      return self.sendPage(req, self.renderer('referral-home', {
        headerContent: "Make a referral to Children’s and Young Person’s Liverpool & Sefton Mental Health Services",
        headerDescription: '',
        backContent: '',
        home: true,
        showHeader: true,
      }));
    };

    //set session to use in role module to maintain session logout
    self.route('get', 'setSessionRefHome/:fromHome', function (req, res) {
      console.log("Role index");
      console.log(req.params.fromHome)
      req.session.frm_ref_home = "Y";
      console.log(req.session.frm_ref_home)
      return res.send({data: {success:"true",message:"session ref_home set"}});
    });
  }
}