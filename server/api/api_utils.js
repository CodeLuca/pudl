/**
 * API utils
 *
 * @module api_utils
 * @return {Object}
 */

module.exports = function(App) {
  'use strict';

  var debug = require('debug')('api_utils');

  debug('exported.');

  var utils = {
    hashPass: function(data) {
      debug('hashing password.');

      var deferred = App.Promise.defer();

      App.Encrypt.hash(
        data,
        App.config.encrypt_rounds,
        function(err, hash) {
          if (!err) {
            debug('password hashed.');
            deferred.resolve(hash);
          } else {
            debug('Error hashing password.');
            deferred.reject(err);
          }
        }
      );

      return deferred.promise;
    }
  };

  return utils;
};
