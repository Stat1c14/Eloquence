// server.js

// set up ======================================================================
// get all the tools we need
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

var http = require('http').Server(app);

// configuration ===============================================================
var configDB = require('./config/database.js');
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating
app.use(express.static('public'));

// required for passport
app.use(session({ 
  secret: 'chamberOfSecrets',
  resave: true,
  saveUninitialized: true 
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// API Code ====================================================================

/*
      ROUTE                     HTTP VERB       DES
      /api/compositions         GET             Gets a list of a user's compositions
      /api/compositions         POST            Creates a composition
      /api/compositions/:id     GET             Get composition with id
      /api/compositions/:id     PUT             Update composition with id
      /api/compositions/:id     DELETE          Delete composition with id
*/

var Composition = require('./app/models/composition');

app.get('/api/compositions', function(req, res) {
    Composition.find({'owner_id': req.user.id}, 'title', function(err, compositions) { 
      if (err)
        res.send(err);
      res.json(compositions);
    });
});

app.get('/api/compositions/author', function(req, res) {
    Composition.findOne({'owner_id': req.user.id, 'title': 'Author'}, function(err, author) { 
      if (err)
        res.send(err);
      res.json(author);
    });
});

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

app.get('/api/compositions/:id', function(req, res) {
    Composition.findOne({_id: req.params.id, 'owner_id': req.user.id}, 'title content', function(err, composition) { 
      if (err)
        res.send(err);
      res.json(composition);
    });
});

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

app.delete('/api/compositions/:id', function(req, res) {
    Composition.remove({_id: req.params.id, 'owner_id': req.user.id}, function(err, composition) {
            if (err)
                res.send(err);
            res.json({ message: 'Successfully deleted composition' });
    });
});

// launch ======================================================================
//app.listen(port);
http.listen(port);
console.log('The magic happens on port ' + port);