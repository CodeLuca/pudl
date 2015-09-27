module.exports = function(app, db, utils) {
  var path = require('path');
  var fs = require('fs');

  // Root
  app.get('/', function(req, res) {
    // See if user is logged in
    console.log(123);
    if(!req.session.username) {
      res.render('index', {'auth': false});
    } else {
      // Get user data
      utils.findUserData(req.session.username, function(response) {
        res.render('index', {'auth': true, 'userData': response})
      });
    }
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
        res.send(false);
      } else {
        // Send user data
        utils.findUserData(username, function(response) {
          req.session.username = username;
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
}