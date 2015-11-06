/**
 * App routes
 *
 * @module app_routes
 */

module.exports = function(App) {
  'use strict';

  var debug = require('debug')('app_routes');

  debug('exported.');

  var app_router = App.Router();

  /**
   * @todo Refactor
   */
  App.Express.use(['/setup', '/settings', '/account'], function(req, res, next) {
    if (!req.session.username) {
      res.redirect('/');
    } else {
      next();
    }
  });

  app_router.get('/', function(req, res, next) {
    if (!req.session.username) {
      res.render('index');
    } else {
      App.api.user.read({
        username: req.session.username
      })
      .then(function(doc) {
        if (doc !== null) {
          if (!doc[0].setup) {
            res.redirect('/setup');
          } else {
            res.render('index', { 'auth': true, 'data': doc[0] });
          }
        }
      }, function(err) {
        debug(err);
      })
      .done();
    }
  });

  app_router.get('/setup', function(req, res, next) {
    res.render('setup');
  });

  app_router.get('/settings', function(req, res, next) {
    App.api.user.read({ 'username': req.session.username})
    .then(function(doc) {
      if (doc !== null) {
        res.render('settings', { 'data': doc[0].settings });
      }
    }, function(err) {
      debug(err);
    })
    .done();
  });

  app_router.post('/settings', function(req, res, next) {
    App.api.utils.geocode(req.body.location)
    .then(function(data) {
      return [
        data,
        App.api.utils.geoToTZ({
          'lat': req.body.lat || data.results[0].geometry.location.lat,
          'lng': req.body.lng || data.results[0].geometry.location.lng
        })
      ];
    }, function(err) {
      debug(err);
    })
    .spread(function(data, timeZoneId) {
      return App.api.user.update(
        { 'username': req.session.username } ,
        {
          $set: {
            setup: true,
            settings: {
              surfaceSize: req.body.surfaceSize,
              containerSize: req.body.containerSize,
              location: {
                string: req.body.location,
                lat: req.body.lat || data.results[0].geometry.location.lat,
                lng: req.body.lng || data.results[0].geometry.location.lng
              },
              goal: req.body.goal,
              timezone: timeZoneId
            }
          }
        }
      );
    }, function(err) {
      debug(err);
    })
    .then(function(updated) {
      if (updated) {
        res.redirect('/');
      }
    }, function(err) {
      debug(err);
    })
    .done();
  });

  app_router.get('/account', function(req, res, next) {
    App.api.user.read({ 'username': req.session.username})
    .then(function(doc) {
      if (doc !== null) {
        res.render('account',
          {
            'data': {
              'email': doc[0].email,
              'username': doc[0].username
            }
          }
        );
      }
    }, function(err) {
      debug(err);
    })
    .done();
  });

  app_router.post('/account', function(req, res, next) {

    /**
     * @todo
     */

    // if (req.body.username) {
    //   App.api.user.isExist(req.body.username)
    //     .then(function(exists) {
    //       if (exists) {
    //         return App.api.user.update(req.session.username,
    //           {
    //             $set: {
    //               username: req.body.username
    //             }
    //           }
    //         );
    //       } else {
    //         debug('User already exists');
    //         return null;
    //       }
    //     }, function(err) {
    //       debug(err);
    //     })
    //     .then(function(updated) {
    //       if (updated) {
    //         req.session.username = req.body.username;
    //       }
    //     }, function(err) {
    //       debug(err);
    //     })
    //     .done();
    // }
  });

  // ===========================================================================

  app_router.post('/', function(req, res, next) {
    if (req.body.submit.toLowerCase() === 'login') {
      debug('attempt login.');

      App.api.user.isExist(req.body.username)
        .then(function(exists) {
          if (exists) {
            return App.api.auth.isAuth(req.body.username, req.body.password);
          } else {
            return null;
          }
        }, function(err) {
          debug(err);
          return err;
        })
        .then(function(auth) {
          if (auth) {
            req.session.username = req.body.username;
            res.redirect('/');
          } else {
            debug('incorrect creds');
          }
        }, function(err) {
          debug(err);
          return err;
        })
        .done();
    } else {
      debug('attempt register.');

      App.api.user.isExist(req.body.username)
        .then(function(exists) {
          if (!exists) {
            return App.api.utils.hashPass(req.body.password);
          } else {
            debug('user already exists');
            return null;
          }
        }, function(err) {
          return err;
        })
        .then(function(hash) {
          if (hash) {
            return App.api.user.create(
              new App.api.user.constructor({
                username: req.body.username,
                password: hash,
              })
            );
          } else {
            return null;
          }
        }, function(err) {
          debug(err);
        })
        .then(function(doc) {
          if (doc) {
            req.session.username = doc.username;
            res.redirect('/');
          }
        }, function(err) {
          debug(err);
        })
        .done();
    }
  });

  app_router.post('/logout', function(req, res, next) {
    App.api.auth.unAuth();
  });

  App.Express.use(app_router);
};
