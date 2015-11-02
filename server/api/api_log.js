/**
 * Log API
 *
 * @module api_log
 * @return {Object}
 */

module.exports = function(App) {
  'use strict';

  var debug = require('debug')('log_api');

  debug('exported.');

  var log = {
    /**
     * Configures an instance of a log in the database
     *
     * @constructor
     * @param {Object} data
     * @param {} data.date,
     * @param {number} data.achieved
     * @param {number} data.forecast
     * @param {number} data.goal
     */
    constructor: function(data) {
      this.id = App.uuid.v1();
      this.date = data.date;
      this.achieved = data.achieved;
      this.forecast = data.forecast;
      this.goal = data.goal;
    },

    /**
     * Creates a log.
     *
     * @func create
     * @param {string} username
     * @param {Object} data
     * @return {Object} A promise object.
     */
    create: function(username, data) {
      debug('creating a log.');

      /**
       * Create a deferred promise
       * @see {@link https://github.com/kriskowal/q/wiki/API-Reference#qdefer}
       * @see {@link https://documentup.com/kriskowal/q/#the-beginning}
       */
      var deferred = App.Promise.defer();

      App.api.user.update(
        { 'username': username },
        {
          $push: {
            log: {
              $each: [new this.constructor(data)],
              $position: 0
            }
          }
        },
        function(err, result) {
          if (!err) {
            if (result.n > 0) {
              debug('log inserted.');
              deferred.resolve(true);
            } else {
              deferred.resolve(false);
            }
          } else {
            deferred.reject(err);
          }
        }
      );

      return deferred.promise;
    },

    cronUpdate: {
      count: -12,
      update: new App.Cron({
        cronTime: '*/2 * * * * *',
        onTick: function() {
          var getUTCTZPadded = function(number) {
            var UTCTZPaddedSplit, UTCTZPadded;

            UTCTZPaddedSplit = number.toString().split('');

            if (UTCTZPaddedSplit.length < 3 && UTCTZPaddedSplit[0] === '-') {
              UTCTZPaddedSplit.splice(1, 0, 0);
            } else if (UTCTZPaddedSplit.length < 2 && UTCTZPaddedSplit[0] !== '-') {
              UTCTZPaddedSplit.splice(0, 0, 0);
            }

            if (UTCTZPaddedSplit.length === 2 && UTCTZPaddedSplit[0] !== '-') {
              UTCTZPaddedSplit.splice(0, 0, '+');
            }

            UTCTZPaddedSplit.push.apply(UTCTZPaddedSplit, [':', 0, 0]);

            UTCTZPadded = UTCTZPaddedSplit.join('');

            return UTCTZPadded;
          };

          debug('cron job for timezone: ' + getUTCTZPadded(log.cronUpdate.count));

          if (log.cronUpdate.count !== 12) {
            log.cronUpdate.count++;
          } else {
            log.cronUpdate.count = -12;
          }
        },
        onComplete: function() {
          debug('cron complete.');
        },
        start: true,
        timeZone: 'Europe/London'
      })
    }
  };

  return log;
};
