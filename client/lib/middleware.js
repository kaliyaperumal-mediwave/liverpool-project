const request = require('request-promise');

module.exports = function (self, options) {
  self.middleware = {
    post: function (req, res, url, body) {
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
              console.log("response")
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

};
