/**
 * Forecast API
 *
 * @module api_forecast
 * @return {Object}
 */

module.exports = function(App) {
  'use strict';

  var debug = require('debug')('forecast_api');

  debug('exported.');

  var forecast = {
    /**
     * Gets rainfall forecast for the day.
     *
     * @func get
     * @param {(number|string)} lat
     * @param {(number|string)} lng
     * @param {string} tz
     * @return {Object}
     */
    get: function(lat, lng, tz) {
      debug('getting forecast.');

      var deferred = App.Promise.defer();

      App.Forecast.get(lat, lng, function(err, res, data) {
        if (!err) {
          var precipIntensity, date;

          precipIntensity = data.daily.data[0].precipIntensity;
          date = App.Moment(new Date(Number(data.daily.data[0].time) * 1000)).tz(tz).format('YYYY-MM-DD');

          debug(precipIntensity);
          debug(date);

          deferred.resolve({
            precipIntensity: precipIntensity,
            date: date
          });
        } else {
          deferred.reject(err);
        }
      });

      return deferred.promise;
    }
  };

  return forecast;
};
