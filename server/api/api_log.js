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
          /**
           * Push new instance of a log into the first position of the array storing logs.
           */
          $push: {
            log: {
              $each: [new this.constructor(data)],
              $position: 0
            }
          }
        }
      );

      return deferred.promise;
    },

    /**
     * Sets up cron jobs to update user logs in every timezone.
     * This function expression is immediately invoked.
     *
     * @func cronUpdate
     */
    cronUpdate: function() {
      /**
       * Loop through array of timezone names.
       */
      App.Moment.tz.names().forEach(function(tz) {
        debug('creating new cron job for ' + tz + '.');

        /**
         * Creates new instance of a cron job.
         */
        new App.Cron({
          cronTime: '00 00 00 * * *',
          onTick: function() {
            debug('starting cron job for ' + tz + '.');

            /**
             * Gather users in the current timezone iteration.
             */
            App.api.user.read({ 'settings.timezone': tz })
              .then(function(docs) {
                if (docs !== null) {

                  /**
                   * Loop through users that are in the current timezone iteration.
                   */
                  docs.forEach(function(doc) {
                    App.api.log.create(
                      doc.username,
                      {
                        date: App.Moment(new Date()).tz(tz).format('YYYY-MM-DD'),
                        achieved: 0,
                        forecast: null,
                        goal: doc.settings.goal
                      }
                    );
                  })
                }
              }, function(err) {
                debug(err);
              })
              .done();
          },
          onComplete: function() {
            debug('cron job for '+ tz +' complete.');
          },
          start: true,
          timeZone: tz
        });
      });
    }()
  };

  return log;
};
