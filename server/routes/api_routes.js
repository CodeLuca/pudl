/**
 * API routes
 *
 * @module api_routes
 */

module.exports = function(App) {
  'use strict';

  var debug = require('debug')('api_routes');

  debug('exported.');

  var api_router = App.Router();
  
  /**
   * @request GET
   * Get user profile
   *
   * @param {string} username
   */
   api_router.get('/api/get/user/:username?', function(req, res, next) {
    // Check if user is logged in.
    if(!req.session.username) {
      // Check if user exists
      App.api.user.isExist(req.params.username)
        .then(function(doc) {
          // Send true or false
          res.send(doc);
        }, function(err) {
          // Send error
          debug(err);
          res.send(500);
        });  
    } else {
      // Read the users doc.
      App.api.user.read({
        'username': req.session.username
      }).then(function(doc) {
        // Send doc
        res.send(doc);
      }, function(err) {
        // Send error
        debug(err);
        res.send(500);
      });
    }
   });


  App.Express.use(api_router);
};
