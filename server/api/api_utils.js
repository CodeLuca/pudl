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
    },

    geocode: function(address) {
      debug('geocoding.');

      var deferred = App.Promise.defer();

      App.Geocoder.geocode(address, function(err, data) {
        if (!err) {
          deferred.resolve(data);
        } else {
          deferred.reject(err);
        }
      });

      return deferred.promise;
    },

    geoToTZ: function(data) {
      debug('converting geolocation to timezone.');

      var deferred = App.Promise.defer();

      App.GeoToTZ.getTimeZone(data.lat, data.lng, function(err, data) {
        if (!err) {
          debug(App.Moment.tz(data.timeZoneId).format('z'));
          deferred.resolve(App.Moment.tz(data.timeZoneId).format('z'));
        } else {
          deferred.reject(err);
        }
      });

      return deferred.promise;
    }
  };

  return utils;
};
