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
var io = require('socket.io')(http);

var configDB = require('./config/database.js');

io.on('connection', function(socket){
  console.log("User connected with ID of " + socket.id);

  socket.on('createComposition', function(title){
  	console.log("User with ID of " + socket.id + " created a composition titled " + title);
    //io.to(socket.id).emit();
  });
  socket.on('getCompositionList', function(){
  	console.log("User with ID of " + socket.id + " requested their composition list");
  });
  socket.on('rename', function(title){
  	console.log("User with ID of " + socket.id + " requested to rename their composition to '" + title + "'");
  });
  socket.on('changeCurrentComp', function(compID){
  	console.log("User with ID of " + socket.id + " requested to change their current composition to '" + compID + "'");
  });
  socket.on('autosave', function(text, compID){
  	console.log("User with ID of " + socket.id + " autosaved their current composition with ID '" + compID + "'");
  });
});
// configuration ===============================================================
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
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
//app.listen(port);
http.listen(port);
console.log('The magic happens on port ' + port);