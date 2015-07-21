var express = require('express');
var moment = require('moment');

var _ = require('underscore');
var md5 = require('cloud/libs/md5.js');

// Controller code in separate files.
var postsController = require('cloud/controllers/posts.js');
var commentsController = require('cloud/controllers/comments.js');
var adminController = require('cloud/controllers/admin.js');
var dashboardController = require('cloud/controllers/dashboard.js');
var announcementsController = require('cloud/controllers/announcements.js');
var tendersController = require('cloud/controllers/tenders.js');


var parseExpressHttpsRedirect = require('parse-express-https-redirect');
var parseExpressCookieSession = require('parse-express-cookie-session');
// Required for initializing Express app in Cloud Code.
var app = express();

var user;

function isAuthenticated(req, res, next) {
    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    console.log("check authentication");
    if (Parse.User.current()){
      console.log("is authenticated");
        return next();
    }
    console.log("is not authenticated");
    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/login');
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

  return moment(time).format('DD/MM/YY, h:mm a');
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

// RESTful routes for the blog post object.
app.get('/posts', isAuthenticated, postsController.index);
app.get('/posts/new', isAuthenticated, postsController.new);
app.post('/posts', isAuthenticated, postsController.create);
app.get('/posts/:id', postsController.show);
app.get('/posts/:id/edit', isAuthenticated, postsController.edit);
app.put('/posts/:id', isAuthenticated, postsController.update);
app.del('/posts/:id', isAuthenticated, postsController.delete);


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
app.put('/tenders/:id/activate', isAuthenticated, tendersController.activate);
app.put('/tenders/:id/deactivate', isAuthenticated, tendersController.deactivate);

// RESTful routes for the blog comment object, which belongs to a post.
app.post('/posts/:post_id/comments', commentsController.create);
app.del('/posts/:post_id/comments/:id', isAuthenticated, commentsController.delete);

// Route for admin pages
app.get('/admin', isAuthenticated, adminController.index);
app.get('/admin/posts', isAuthenticated, adminController.index);
app.get('/admin/comments', isAuthenticated, commentsController.index);

// Required for initializing Express app in Cloud Code.
app.listen();
