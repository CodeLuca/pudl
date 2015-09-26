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
// Require backend files.
require('./backend/utils')(app, db);

// Set Handlebars as templating engine.
app.use(express.static(__dirname + '/views'));
app.engine('hbs', expressHbs({extname:'hbs', defaultLayout:'main.hbs'}));
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/assets'));

var port = 80
app.listen(port);
console.log('* pudl running on port: ' + port + ' *');