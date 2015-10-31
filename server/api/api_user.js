/**
 * User API
 *
 * @module api_user
 * @return {Object}
 */

module.exports = function(App) {
  'use strict';

  var debug = require('debug')('user_api');

  debug('exported.');

  /**
   * Methods on the user data collection.
   * @type {Object} user
   */

  var user = {
    /**
     * Configures an instance of the user in the database
     *
     * @constructor constructor
     * @param {Object} data
     * @param {string} data.username
     * @param {type} data.password
     */
    constructor: function(data) {
      this.username = data.username;
      this.password = data.password;
      this.setup = false;
      this.achieved = 0;
      this.log = [];
      this.settings = {
        surfaceSize: 0,
        containerSize: 0,
        location: null,
        goal: 0
      };
    },

    /**
     * Creates a user.
     *
     * @func create
     * @param {Object} data
     * @return {Object} A promise object.
     */
    create: function(data) {
      debug('creating user.');

      /**
       * Create a deferred promise
       * @see {@link https://github.com/kriskowal/q/wiki/API-Reference#qdefer}
       * @see {@link https://documentup.com/kriskowal/q/#the-beginning}
       */
      var deferred = App.Promise.defer();

      App.db.users.insert(data, function(err, doc) {

        if (!err) {
          debug('user created.');

          /**
           * If no errors creating user, resolve promise and return the document created.
           * @see {@link https://github.com/kriskowal/q/wiki/API-Reference#deferredresolvevalue}
           */
          deferred.resolve(doc);

        } else {
          debug('error creating user.');
          debug(err);

          /**
           * If error creating user, reject promise and return the error as the reason.
           */
          deferred.reject(err);

        }

      });

      /**
       * Return promise object with state, either fulfilled or rejected.
       */
      return deferred.promise;
    },

    /**
     * Reads data from a user.
     *
     * @func read
     * @param {Object} data
     * @return {Object} A promise object.
     */
    read: function(data) {
      debug('attempting to read user.');

      /**
       * Create a deferred promise
       * @see {@link https://github.com/kriskowal/q/wiki/API-Reference#qdefer}
       * @see {@link https://documentup.com/kriskowal/q/#the-beginning}
       */
      var deferred = App.Promise.defer();

      App.db.users.find(data, function(err, docs) {

        if (!err) {
          if (docs[0]) {
            debug('user read.');
            deferred.resolve(docs);
          } else {
            deferred.resolve(null);
          }
        } else {
          debug('error reading user.');
          debug(err);

          deferred.reject(err);
        }
      });

      /**
       * Return promise object with state, either fulfilled or rejected.
       */
      return deferred.promise;
    },

    /**
     * Updates data on a user.
     *
     * @func update
     * @param {string} id
     * @param {Object} data
     * @return {Object} A promise object.
     *
     * @todo Check Mongo docs on `save` method.
     */
    update: function(username, data) {
      debug('updating user.');

      /**
       * Create a deferred promise
       * @see {@link https://github.com/kriskowal/q/wiki/API-Reference#qdefer}
       * @see {@link https://documentup.com/kriskowal/q/#the-beginning}
       */
      var deferred = App.Promise.defer();

      App.db.users.update({
        'username': username
      },
      data,
      function(err, result) {
        if (!err) {
          debug(result);
          if (result.n > 0) {
            debug('user updated.');
            deferred.resolve(true);
          } else {
            deferred.resolve(null);
          }
        } else {
          debug('error updating user.');
          debug(err);

          deferred.reject(err);
        }
      });

      /**
       * Return promise object with state, either fulfilled or rejected.
       */
      return deferred.promise;
    },

    /**
     * Deletes a user.
     *
     * @func destroy
     * @param {Object} data
     * @return {boolean} If the user was deleted.
     */
    destroy: function(data) {
      debug('deleting user.');

      /**
       * Create a deferred promise
       * @see {@link https://github.com/kriskowal/q/wiki/API-Reference#qdefer}
       * @see {@link https://documentup.com/kriskowal/q/#the-beginning}
       */
      var deferred = App.Promise.defer();

      App.db.user.remove(data, 1, function(err, doc) {
        if (!err) {
          debug('user destroyed');

          deferred.resolve(true);
        } else {
          debug('error destroying user.');

          deferred.reject(false);
        }
      });

      /**
       * Return promise object with state, either fulfilled or rejected.
       */
      return deferred.promise;
    },

    /**
     * Check if a user exists.
     *
     * @func isExist
     * @param {string} username
     * @return {boolean} If the user exists.
     */
    isExist: function(username) {
      debug('checking if user exists.');

      var deferred, exists;

      /**
       * Create a deferred promise
       * @see {@link https://github.com/kriskowal/q/wiki/API-Reference#qdefer}
       * @see {@link https://documentup.com/kriskowal/q/#the-beginning}
       */
      deferred = App.Promise.defer();

      exists = false;

      this.read({
        'username': username
      })
      .then(function(docs) {

        if (docs !== null) {
          debug('user exists.');

          exists = true;
        } else {
          debug('user does not exist.');
        }

        deferred.resolve(exists);

      }, function(err) {
        debug('error checking if user exists.');
        deferred.reject(err);
      })
      .done();

      /**
       * Return promise object with state, either fulfilled or rejected.
       */
      return deferred.promise;
    }
  };

  /** Make API public. */
  return user;
};
