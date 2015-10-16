// Load all required modules

var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

// Server
var http = require('http').Server(app);

// Database configuration
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

// Setting up Express
app.use(morgan('dev')); // Logging
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up templating engine and 'public' folder
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Passport configuration
require('./config/passport')(passport);
app.use(session({ 
  secret: 'chamberOfSecrets',
  resave: true,
  saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Routes
require('./app/routes.js')(app, passport);

// Import Models
var Composition = require('./app/models/composition');

// API Code ===========================================================================

/*
      ROUTE                     HTTP VERB       DES
      /api/compositions         GET             Gets a list of a user's compositions
      /api/compositions         POST            Creates a composition
      /api/compositions/:id     GET             Get composition with id
      /api/compositions/:id     PUT             Update composition with id
      /api/compositions/:id     DELETE          Delete composition with id
*/

// Gets a list of a user's compositions
app.get('/api/compositions', function(req, res) {
  Composition.find({'owner_id': req.user.id}, 'title', function(err, compositions) { 
    if (err)
      res.send(err);
    res.json(compositions);
  });
});

// Creates a composition
app.post('/api/compositions', function(req, res) {
  var composition = new Composition();

  composition.owner_id = req.user.id;
  composition.title = req.body.title;
  composition.content = "";

  composition.save(function(err) {
    if (err)
      res.send(err);
    res.json({ message: 'Composition created!' });
  });
});

// Get composition with id
app.get('/api/compositions/:id', function(req, res) {
  Composition.findOne({_id: req.params.id, 'owner_id': req.user.id}, 'title content', function(err, composition) { 
    if (err)
      res.send(err);
    res.json(composition);
  });
});

// Update composition with id
app.put('/api/compositions/:id', function(req, res) {
  Composition.findOne({_id: req.params.id, 'owner_id': req.user.id}, 'title content', function(err, composition) { 
    if (err)
      res.send(err);
    composition.title = req.body.title;
    composition.content = req.body.content;

    composition.save(function(err) {
      if (err)
        res.send(err);
      res.json({ message: 'Composition updated!' });
    });
  });
});

// Delete composition with id
app.delete('/api/compositions/:id', function(req, res) {
  Composition.remove({_id: req.params.id, 'owner_id': req.user.id}, function(err, composition) {
    if (err)
      res.send(err);
    res.json({ message: 'Successfully deleted composition' });
  });
});

// End of API Code ====================================================================

// Start server
http.listen(port);
console.log('Eloquence server is running on port ' + port);