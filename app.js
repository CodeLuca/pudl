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
process.env.DEBUG = 'app, app_routes, api_routes, auth_api, log_api, user_api, api_utils, auth_weather';

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
debug('Express dependency loaded.');

/**
 * Assign bcrypt dependency an alias.
 * bcrypt is a key derivation function for passwords based on the Blowfish cipher.
 * @see {@link https://github.com/ncb000gt/node.bcrypt.js}
 */
App.Encrypt = require('bcrypt');
debug('bcrypt dependency loaded.');

/**
 * Assign compression dependency an alias and mount it.
 * compression is a NodeJS middleware for compression.
 * @see {@link https://github.com/expressjs/compression}
 */
App.Compression = require('compression');
App.Express.use(App.Compression());
debug('compression dependency loaded.');

/**
 * Assign Q dependency an alias.
 * Q is a tool for creating and composing asynchronous promises in JavaScript.
 * @see {@link http://documentup.com/kriskowal/q/}
 * @see {@link https://github.com/kriskowal/q}
 */
App.Promise = require('q');
debug('Q dependency loaded.');

/**
 * Assign express-session an alias.
 * express-session is middleware for Express.
 * @see {@link https://github.com/expressjs/session}
 */
App.Sessions = require('express-session');
debug('express-session dependency loaded.');

/**
 * Assign connect-mongo dependency an alias.
 * connect-mongo is a MongoDB session store for Express.
 * @see {@link https://github.com/kcbanner/connect-mongo}
 */
App.SessionStore = require('connect-mongo')(App.Sessions);
debug('connect-mongo dependency loaded.');

/**
 * Assign node-cron dependency an alias.
 * node-cron is a library to create cron jobs in Node.
 * @see {@link https://github.com/ncb000gt/node-cron}
 */
App.Cron = require('cron').CronJob;
debug('node-cron dependency loaded.');

/**
 * Assign node-uuid dependency an alias.
 * node-uuid generates RFC4122 (v1 and v4 )compliant UUIDs simply and quickly.
 * @see {@link https://www.npmjs.com/package/node-uuid}
 */
App.uuid = require('node-uuid');
debug('node-uuid dependency loaded.');

/**
 * Assign Forecast.io dependency an alias.
 * @see {@link https://github.com/mateodelnorte/forecast.io}
 */
var forecastModule = require('forecast.io');
App.Forecast = new forecastModule({APIKey: '87e0ac0c3a2a4f6190b1fe21f3090df7'});
debug('Forecast.io dependency loaded.');

/**
 * Assign Geocoder dependency an alias.
 * Geocoder is a wrapper for Google's Geocoding API.
 * @see {@link https://www.npmjs.com/package/geocoder}
 * @see {@link https://developers.google.com/maps/documentation/javascript/geocoding}
 */
App.Geocoder = require('geocoder');
debug('Geocoder dependency loaded.');

/**
 */
App.Moment = require('moment-timezone');
debug('moment-timezone dependency loaded.');

/**
 * Assign timezoner dependency an alias.
 * timezoner gets a timezone based on latitude and longitude coords.
 * @see {@link https://www.npmjs.com/package/timezoner}
 */
App.GeoToTZ = require('timezoner');
debug('timezoner dependency loaded.');

/**
 * Mount body-parser middleware
 * @todo Review code. This code is legacy which has been brought in from previous projects.
 */
App.Express.use(bodyParser.urlencoded({extended: false}));
App.Express.use(bodyParser.json('application/json'));
debug('bodyParser middleware mounted.');

/** Initialise config */
App.config = require('./config.js')(App);

/** Initialise database */
App.db = require('mongojs')(App.config.db_path, App.config.db_collections);
debug('db initialised.');

/** Initialise APIs */
App.api = App.api || {};
App.api.auth = require('./server/api/api_auth.js')(App);
App.api.log = require('./server/api/api_log.js')(App);
App.api.user = require('./server/api/api_user.js')(App);
App.api.utils = require('./server/api/api_utils.js')(App);
App.api.weather = require('./server/api/api_weather.js')(App);
App.api.weather.get(19.432608, -99.133208);
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
debug('sessions configured.');

/** Initialise routes */
App.Express.use(function(req, res, next) {
  debug('%s %s', req.method, req.url);
  next();
});
require('./server/routes/app_routes.js')(App);
require('./server/routes/api_routes.js')(App);

/** Set the view engine used to parse templates and views */
App.Express.set('view engine', App.config.view_engine);
debug('view engine set.');

/** Set up virtual paths for static files */
App.config.static_paths.forEach(function(obj) {
  App.Express.use(obj.resolve, express.static(__dirname + obj.origin, obj.options));
});
debug('virtual paths set up.');

/** Start server listening on configured port */
App.Express.listen(App.config.port);
debug('running on port ' + App.config.port + '.');
