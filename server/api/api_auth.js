/**
 * Auth API
 *
 * @module api_auth
 * @return {Object}
 */

module.exports = function(App) {
  'use strict';

  var debug = require('debug')('auth_api');

  debug('exported');
  
  /**
   * Methods on user authenticity.
   * @type {Object} auth
   */

  var auth = {
    /**
     * Checks user authenticity.
     *
     * @func isAuth
     * @param {string} username
     * @param {string} password
     * @return {Object} A promise object indicating if the user was authenticated.
     */
    isAuth: function(username, password) {
      debug('checking user authenticity.');

      var auth, deferred;

      auth = false;

      /**
       * Create a deferred promise
       * @see {@link https://github.com/kriskowal/q/wiki/API-Reference#qdefer}
       * @see {@link https://documentup.com/kriskowal/q/#the-beginning}
       */
      deferred = App.Promise.defer();

      App.api.user.read({
        'username': username
      })
      .then(function(docs) {
        if (docs !== null) {
          debug('comparing password with hash.');

          App.Encrypt.compare(password, docs[0].password, function(err, res) {
            if (!err) {
              debug('password compared with hash.');
              debug(res ? 'Password correct.' : 'Password incorrect.');

              deferred.resolve(res);
            } else {
              debug('error comparing password with hash.');

              deferred.reject(err);
            }
          });
        }
      }, function(err) {
        deferred.reject(err);
      })
      .done();

      return deferred.promise;
    },

    /**
     * Authenticates the user.
     *
     * @func setAuth
     * @param {Object} data
     * @return {boolean} If the user is authenticated.
     */
    setAuth: function(data) {
      debug('authenticating user.');

      req.session.username = req.body.username;
    },

    /**
     * Unauthenticates the user (logs the user out of the session).
     *
     * @func unAuth
     * @param {Object} data
     * @return {boolean} If the unauthentication was successful.
     */
    unAuth: function(data) {
      debug('unauthenticating user.');

      var auth = true;

      req.session.destroy(function(err) {
        if (!err) {
          debug('user unauthenticated.');

          auth = false;
          res.redirect('/');
        } else {
          debug('Error unauthenticating user.');
          debug(err);
        }
      });

      return auth;
    }
  };

  /** Make API public. */
  return auth;
};
