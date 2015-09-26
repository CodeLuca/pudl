module.exports = function(app, db, fs) {
  var path = require('path');
  var fs = require('fs');

  // Root
  app.get('/', function(req, res) {
    // See if user is logged in
    if(!req.session.username) {
      res.render('index', {'auth': false});
    } else {
      // Get user data
      utils.findUserData(username, function(response) {
        res.render('index', {'auth': true, 'userData': response})
      });
    }
  });

  // Registration
  app.post('/register', function(req, res) {
    var username = req.body.username;
    // Does user exist?
    db.users.find({
      'username': username
    }, function(err, docs) {
      if(docs[0]) {
        res.send('User already exists.');
      } else {
        //Add to Database
        utils.addToDB(username, req.body.password, function() {
          req.session.username = username;
          //Find from Database
          utils.findUserData(username, function(response) {
            res.send(response);
          });
        });
      }
    })
  });

  // Login
  app.post('/login', function(req, res) {
    var username = req.body.username,
        password = req.body.password;
    // Correct user and pass?
    db.users.find({
      'username': username,
      'password': password
    }, function(err, docs) {
      if(!docs[0]) {
        res.send('User not found');
      } else {
        // Send user data
        utils.findUserData(username, function(response) {
          res.send(response);
        });
      }
    });
  });

  // Partials
  app.get('/partials/:route', function(req, res) {
    // Get file data
    fs.readFile(path.join(__dirname, '/..', '/views/' + req.params.route + '.hbs'),'utf-8', function(err, data) {
      res.send(data);
    });
  });

  // Utility Functions
  var utils = {
    // Add user to the database
    addToDB: function(user, pass, callback) {
      db.users.insert({
        'username': user,
        'password': pass
      }, function(err, docs) {
        callback();
      });
    },
    // Find User Data
    findUserData: function(user, callback) {
      db.users.find({
        'username': user
      }, function(err, docs) {
        if(!docs[0]) {
          callback(404);
        } else {
          callback(docs[0]);
        }
      });
    }
  }
}