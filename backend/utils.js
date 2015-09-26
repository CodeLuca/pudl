module.exports = function(app, db) {
  app.get('/', function(req, res) {
    if(!req.session.username) {
      res.render('index', {'auth': false});
    } else {
      db.users.find({
        'username': req.session.username
      }, function(err, docs) {
        res.render('index', {'auth': true, 'userData': docs[0]})
      });
    } 
  });

  app.post('/register', function(req, res) {
    console.log(req.body);
  });
  app.post('/login', function(req, res) {
    console.log(req.body);
  });
}