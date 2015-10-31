/**
 * Config
 * A module for config properties.
 *
 * @module config
 * @todo Comment
 */

module.exports = function(App) {
  'use strict';

  /**
   * Configures an instance of a static path
   *
   * @constructor {Object} StaticPathConfig
   * @param {string} origin
   * @param {string} resolve
   * @param {Object} options
   * @see {@link http://expressjs.com/4x/api.html#express.static|Express static options}
   */
  function StaticPathConfig(origin, resolve, options) {
    this.origin = origin;
    this.resolve = resolve;
    this.options = options;
  }

  return {
    /**
     * Specify whether the app is in a development environment or not
     * @type {boolean}
     */
    dev: true,

    db_path: 'mongodb://localhost:27017/pudl',

    db_collections: ['users'],

    /**
     * The port that the app will run on.
     * @type {number}
     */
    port: 80,

    /**
     * The cost of encrypting data.
     * @type {number}
     * @see {@link https://github.com/ncb000gt/node.bcrypt.js/#a-note-on-rounds}
     */
    encrypt_rounds: 10,

    /**
     * The static resources.
     * @type {StaticPathConfig[]}
     */
    static_paths: [
      new StaticPathConfig('/public', '/static', { 'maxAge': 604800017})
    ],

    /**
     * The engine used to parse templates and views.
     * @type {string}
     */
    view_engine: 'jade'
  };
};
