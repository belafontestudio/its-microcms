var express = require('express');
var moment = require('moment');

var _ = require('underscore');
var md5 = require('cloud/libs/md5.js');

// Controller code in separate files.
var dashboardController = require('cloud/controllers/dashboard.js');
var announcementsController = require('cloud/controllers/announcements.js');
var tendersController = require('cloud/controllers/tenders.js');
var attachmentsController = require('cloud/controllers/attachments.js');
var usersController = require('cloud/controllers/users.js');
var studentsController = require('cloud/controllers/students.js');
var candidatesController = require('cloud/controllers/candidates.js');
var userAttachmentsController = require('cloud/controllers/user_attachments.js');


var parseExpressHttpsRedirect = require('parse-express-https-redirect');
var parseExpressCookieSession = require('parse-express-cookie-session');
// Required for initializing Express app in Cloud Code.
var app = express();




function isAuthenticated(req, res, next) {
    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    console.log("check authentication");
    if(Parse.User.current()){
      var query = (new Parse.Query(Parse.Role));
      query.equalTo("name", "Administrator");
      query.equalTo("users", Parse.User.current());
      query.first().then(function(adminRole) {
          if (adminRole) {
              console.log("user is an admin");
              return next();
          } else {
              console.log("user is not an admin");
              res.redirect('/login');
          }
      });
    }else{
      console.log("user is not logged in");
      res.redirect('/login');
    }

}




// Instead of using basicAuth, you can also implement your own cookie-based
// user session management using the express.cookieSession middleware
// (not shown here).

// Global app configuration section
app.set('views', 'cloud/views');
app.set('view engine', 'jade');  // Switch to Jade by replacing ejs with jade here.
app.set('strict routing', false);
app.use(parseExpressHttpsRedirect());  // Require user to be on HTTPS.

app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.cookieParser("ITS"));
app.use(parseExpressCookieSession({ cookie: { maxAge: 3600000 } }));

// Note that we do not write app.use(basicAuth) here because we want some routes
// (e.g. display all blog posts) to be accessible to the public.

// You can use app.locals to store helper methods so that they are accessible
// from templates.
app.locals._ = _;
app.locals.hex_md5 = md5.hex_md5;

app.locals.formatTime = function(time) {

  return moment(time).format('DD/MM/YY');
};
// Generate a snippet of the given text with the given length, rounded up to the
// nearest word.
app.locals.snippet = function(text, length) {
  if (text.length < length) {
    return text;
  } else {
    var regEx = new RegExp("^.{" + length + "}[^ ]*");
    return regEx.exec(text)[0] + "...";
  }
};

app.get('/login', function(req, res) {
    // Renders the login form asking for username and password.
    console.log("Login page");

    res.render('login.jade');
});


// Clicking submit on the login form triggers this.
app.post('/login', function(req, res) {
  Parse.User.logIn(req.body.username, req.body.password).then(function() {
    // Login succeeded, redirect to homepage.
    // parseExpressCookieSession will automatically set cookie.
    console.log("Login success");
    console.log(app.get('strict routing'));


    res.redirect('/');
  },
  function(error) {
    // Login failed, redirect back to login form.
    console.log("Login failed");
    res.redirect('/login');
  });
});

// You could have a "Log Out" link on your website pointing to this.
app.get('/logout', function(req, res) {
  Parse.User.logOut();
  console.log("Logout");
  res.redirect('/');
});

// Show all posts on homepage
app.get('/', isAuthenticated, dashboardController.index);



//users
app.get('/users', isAuthenticated, usersController.index);
app.put('/users/:id/addtoadmins', isAuthenticated, usersController.addToAdmins);
app.put('/users/:id/removefromadmins', isAuthenticated, usersController.removeFromAdmins);
app.put('/users/:id/addtocandidates', isAuthenticated, usersController.addToCandidates);
app.put('/users/:id/removefromcandidates', isAuthenticated, usersController.removeFromCandidates);
app.get('/users/:id/edit', isAuthenticated, usersController.edit);
app.del('/users/:id', isAuthenticated, usersController.delete);
app.post('/users', isAuthenticated, usersController.create);
app.put('/users/:id', isAuthenticated, usersController.update);
app.get('/users/new', isAuthenticated, usersController.new);

app.get('/students', isAuthenticated, studentsController.index);
app.del('/students/:id', isAuthenticated, studentsController.delete);
app.get('/students/:id/edit', isAuthenticated, studentsController.edit);
// app.post('/students', isAuthenticated, studentsController.create);
// app.put('/students/:id', isAuthenticated, studentsController.update);
app.get('/students/new', isAuthenticated, studentsController.new);

app.get('/users/attachments/new', isAuthenticated, userAttachmentsController.new);
app.del('/users/attachments/:id', isAuthenticated, userAttachmentsController.delete);

//candidates
app.get('/candidates', isAuthenticated, candidatesController.index);
app.put('/candidates/:id/activate', isAuthenticated, candidatesController.activate);
app.put('/candidates/:id/deactivate', isAuthenticated, candidatesController.deactivate);

// Announcements
app.get('/announcements', isAuthenticated, announcementsController.index);
app.get('/announcements/new', isAuthenticated, announcementsController.new);
app.get('/announcements/unpublishall', isAuthenticated, announcementsController.unpublishAll);
app.put('/announcements/:id/publish', isAuthenticated, announcementsController.publish);
app.post('/announcements', isAuthenticated, announcementsController.create);
app.del('/announcements/:id', isAuthenticated, announcementsController.delete);
app.get('/announcements/:id/edit', isAuthenticated, announcementsController.edit);
app.put('/announcements/:id', isAuthenticated, announcementsController.update);

// Tenders
app.get('/tenders', isAuthenticated, tendersController.index);
app.get('/tenders/new', isAuthenticated, tendersController.new);
app.post('/tenders', isAuthenticated, tendersController.create);
app.put('/tenders/:id/activate', isAuthenticated, tendersController.activate);
app.put('/tenders/:id/deactivate', isAuthenticated, tendersController.deactivate);
app.get('/tenders/:id/edit', isAuthenticated, tendersController.edit);
app.put('/tenders/:id', isAuthenticated, tendersController.update);
app.del('/tenders/:id', isAuthenticated, tendersController.delete);

app.get('/attachments/new', isAuthenticated, attachmentsController.new);
app.del('/attachments/:id', isAuthenticated, attachmentsController.delete);


// Required for initializing Express app in Cloud Code.
app.listen();
