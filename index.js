// Expressjs
var express = require('express');
var app = express();
// Sessions
var session = require('express-session')
// MongoDB
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/pudl', ['users']);
// Body-Parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json('application/json'));
//  Handlebars
var expressHbs = require('express-handlebars');

// Sessions Init.
app.use(session({ secret: 'wowtoZJVxpdk5736=99', name: 'id'}));

var Forecast = require('forecast.io');

var options = {
  APIKey: '87e0ac0c3a2a4f6190b1fe21f3090df7'
},
forecast = new Forecast(options);

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
        forecast.get(19.432608, -99.133208, function (err, res, data) {
          console.log('data: ' + data.daily.data[0].precipIntensity * 24);
        });
        callback(docs[0]);
      }
    });
  }
}

// Require backend files.
require('./backend/utils')(app, db, utils);
require('./backend/registration')(app, db, utils);

// Set Handlebars as templating engine.
app.use(express.static(__dirname + '/views'));
app.engine('hbs', expressHbs({extname:'hbs', defaultLayout:'main.hbs'}));
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/views'));  
app.use(express.static(__dirname + '/assets'));

var port = 80
app.listen(port);
console.log('* pudl running on port: ' + port + ' *');