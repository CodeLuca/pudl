/**
 * Pudl
 */

'use strict';

var App = App || {},
    bodyParser = require('body-parser');

/**
 * Configure debugging.
 * Sets modules to debug in an environment variable.
 */
process.env.DEBUG = "app, app_routes, api_routes, auth_api, log_api, user_api, api_utils";

var debug = require('debug')('app');

debug('started.');

/**
 * Require Express dependency.
 * Run express dependency on alias.
 * Assign router function to an alias.
 * @see {@link http://expressjs.com/4x/api.html}
 */
var express = require('express');
App.Express = express();
App.Router = express.Router;

/**
 * Assign bcrypt dependency an alias.
 * bcrypt is a key derivation function for passwords based on the Blowfish cipher.
 * @see {@link https://github.com/ncb000gt/node.bcrypt.js}
 */
App.Encrypt = require('bcrypt');

/**
 * Assign compression dependency an alias and mount it.
 * compression is a NodeJS middleware for compression.
 * @see {@link https://github.com/expressjs/compression}
 */
App.Compression = require('compression');
App.Express.use(App.Compression());

/**
 * Assign Q dependency an alias.
 * Q is a tool for creating and composing asynchronous promises in JavaScript.
 * @see {@link http://documentup.com/kriskowal/q/}
 * @see {@link https://github.com/kriskowal/q}
 */
App.Promise = require('q');

/**
 * Assign express-session an alias.
 * express-session is middleware for Express.
 * @see {@link https://github.com/expressjs/session}
 */
App.Sessions = require('express-session');

/**
 * Assign connect-mongo an alias.
 * connect-mongo is a MongoDB session store for Express.
 * @see {@link https://github.com/kcbanner/connect-mongo}
 */
App.SessionStore = require('connect-mongo')(App.Sessions);

/**
 *
 */
App.uuid = require('node-uuid');

/**
 * Assign Forecast.io dependency an alias.
 * @see {@link https://github.com/mateodelnorte/forecast.io}
 */
App.Forecast = require('forecast.io')({APIKey: '87e0ac0c3a2a4f6190b1fe21f3090df7'});

/**
 * Mount body-parser middleware
 * @todo Review code. This code is legacy which has been brought in from previous projects.
 */
App.Express.use(bodyParser.urlencoded({extended: false}));
App.Express.use(bodyParser.json('application/json'));

/** Initialise config */
App.config = require('./config.js')(App);

/** Initialise utilities */
// App.utils = require('./server/utils.js')(App, clc);

/** Initialise database */
App.db = require('mongojs')(App.config.db_path, App.config.db_collections);

/** Initialise APIs */
App.api = App.api || {};
App.api.auth = require('./server/api/api_auth.js')(App);
App.api.log = require('./server/api/api_log.js')(App);
App.api.user = require('./server/api/api_user.js')(App);
App.api.utils = require('./server/api/api_utils.js')(App);

/**
 * Configure sessions.
 */
App.Express.use(App.Sessions({
  secret: 'wowtoZJVxpdk5736=99',
  name: 'id',
  genid: function(req) {
    return App.uuid.v4();
  },
  saveUninitialized: false,
  resave: false,
  store: new App.SessionStore({
    url: App.config.db_path,
    collection: 'sessions'
  })
}));

/** Initialise routes */
App.Express.use(function(req, res, next) {
  debug('%s %s', req.method, req.url);
  next();
});
require('./server/routes/app_routes.js')(App);
require('./server/routes/api_routes.js')(App);

/** Set the view engine used to parse templates and views */
App.Express.set('view engine', App.config.view_engine);

/** Set up virtual paths for static files */
App.config.static_paths.forEach(function(obj) {
  App.Express.use(obj.resolve, express.static(__dirname + obj.origin, obj.options));
});

/** Start server listening on configured port */
App.Express.listen(App.config.port);
debug('running on port ' + App.config.port);
