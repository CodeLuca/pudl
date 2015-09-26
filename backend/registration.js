module.exports = function(app, db) {
  // Registration
  app.post('/register', function(req, res) {
    var username = req.body.username;
    // Does user exist?
    db.users.find({
      'username': username
    }, function(err, docs) {
      if(docs[0]) {
        res.send(true);
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

  app.post('/checkExists', function(req, res) {
    db.users.find({
      'username': req.body.username
    }, function(err, docs) {
      if(docs[0]) {
        res.send(true);
      } else {
        res.send(false);
      }
    });
  });

  // Set House Size.
  app.post('/setHouseSize', function(req, res) {
    if(!req.session.username) {
      res.send('Please sign in');
      return;
    }
    db.users.update({
      'username': req.session.username
    }, {
      $set: {
        'houseSize': req.body.houseSize
      }
    }, function(err, docs) {
      utils.findUserData(req.session.username, function(response) {
        res.send(response);
      });
    });
  });

  // Set Goal.
  app.post('/setGoal', function(req, res) {
    if(!req.session.username) {
      res.send('Please sign in');
      return;
    }
    db.users.update({
      'username': req.session.username
    }, {
      $set: {
        'goal': req.body.goal
      }
    }, function(err, docs) {
      utils.findUserData(req.session.username, function(response) {
        res.send(response);
      });
    });
  });

  // Set Location.
  app.post('/setLocation', function(req, res) {
    if(!req.session.username) {
      res.send('Please sign in');
      return;
    }
    db.users.update({
      'username': req.session.username
    }, {
      $set: {
        'location': req.body.location
      }
    }, function(err, docs) {
      utils.findUserData(req.session.username, function(response) {
        res.send(response);
      });
    });
  });


  var utils = {
    // Add user to the database
    addToDB: function(user, pass, callback) {
      db.users.insert({
        'username': user,
        'password': pass,
        'houseSize': undefined,
        'goal': undefined,
        'current': undefined,
        'location': undefined
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
          // var obj = docs[0];
          callback(docs[0]);
        }
      });
    }
  }
}