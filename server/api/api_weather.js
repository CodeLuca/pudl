/**
 * Auth API
 *
 * @module api_auth
 * @return {Object}
 */

module.exports = function(App) {
  'use strict';

  var debug = require('debug')('log_api');

  debug('exported.');

  var weather = {
    /**
    * Finds weather at specified coordinates.
    *
    * @func get
    * @param {string} lat
    * @param {string} long
    * @return {Object} Contains timestamp and average amount of rainfall in inches per hour.
    */
    get: function(lat, long) {
      debug('getting amount of rainfall.');

      // Using Darksky API to get forecast in area.
      App.Forecast.get(lat, long, function (err, res, data) {
        var inchesPerHour = data.daily.data[0].precipIntensity,
        time = Date(Number(data.daily.data[0].time) * 1000);
        // Send debug message
        debug('rainfall: ' + inchesPerHour + ' inches per hour. Time: ' + time);
        // Return object
        return {
          'time': time,
          'rainfall': inchesPerHour.toString()
        }
      });
    }
  }
  return weather;
};