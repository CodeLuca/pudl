module.exports = function(app, db, fs) {
  var path = require('path');

  app.get('/', function(req, res) {
    if(!req.session.username) {
      res.render('index', {'auth': false});
    } else {
      utils.findUserData(username, function(response) {
        res.render('index', {'auth': true, 'userData': response})
      });
    }
  });

  app.post('/register', function(req, res) {
    var username = req.body.username;
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

  app.post('/login', function(req, res) {
    var username = req.body.username,
        password = req.body.password;
    db.users.find({
      'username': username,
      'password': password
    }, function(err, docs) {
      if(!docs[0]) {
        res.send('User not found');
      } else {
        utils.findUserData(username, function(response) {
          res.send(response);
        });
      }
    });
  });

  app.get('/partials/:route', function(req, res) {
    fs.readFile(path.join(__dirname, '/..', '/views/' + req.params.route + '.hbs'),'utf-8', function(err, data) {
      res.send(data);
    });
  });

  var utils = {
    addToDB: function(user, pass, callback) {
      db.users.insert({
        'username': user,
        'password': pass
      }, function(err, docs) {
        callback();
      });
    },
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