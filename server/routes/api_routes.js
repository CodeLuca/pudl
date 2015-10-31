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

  App.Express.use(api_router);
};
