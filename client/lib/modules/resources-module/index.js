const { btoa } = require('../../utils')
const { atob } = require('../../utils')
module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Resources Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    require('../../middleware')(self, options);
    self.addDispatchRoutes = function () {
      self.dispatch('/',self.middleware.setValues, self.resources);
      self.dispatch('/lists',self.middleware.setValues, self.lists);
      self.dispatch('/apps',self.middleware.setValues, self.apps);
      self.dispatch('/things-to-read', self.self.middleware.setValues,thingsToRead);
      self.dispatch('/video',self.middleware.setValues, self.video);
    };

    self.resources = function (req, callback) {
    
      return self.sendPage(req, self.renderer('resources', {
        showHeader: true,
        home: true,
        hideRefButton: true,
        backToResources:"/resources"

      }));
    };
    self.lists = function (req, callback) {
     
      return self.sendPage(req, self.renderer('things-to-watch', {
        showHeader: true,
        home: true,
        hideRefButton: true,
        backToResources:"/resources"
      }));
    };
    self.apps = function (req, callback) {
      return self.sendPage(req, self.renderer('apps', {
        showHeader: true,
        showLogout: true,
      }));
    };
    self.thingsToRead = function (req, callback) {
      return self.sendPage(req, self.renderer('things-to-read', {
        showHeader: true,
        showLogout: true,
      }));
    };
    self.video = function (req, callback) {
      return self.sendPage(req, self.renderer('video', {
        showHeader: true,
        showLogout: true,
      }));
    };
  }
}