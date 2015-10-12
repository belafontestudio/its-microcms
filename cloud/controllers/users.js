var _ = require('underscore');
var User = Parse.Object.extend('User');



// Display all posts.
exports.index = function(req, res) {
  res.locals.path = req.path;


  var query = new Parse.Query(User);
  query.descending('createdAt');
  query.find().then(function(results) {
    Parse.User.current().fetch().then(function(user){

      res.render('users/index', {
        users: results,
        currentUser: user
      });
    });
  },
  function() {
    res.send(500, 'Failed loading users');
  });
};


// Display a form for creating a new tender.
exports.new = function(req, res) {
  res.locals.path = req.path;
  Parse.User.current().fetch().then(function(user){

    res.render('users/new', {
      currentUser: user
    });
  });

};

// Create a new announcement with specified title and body.
exports.create = function(req, res) {
  var user = new Parse.User();
  res.locals.path = req.path;
  // Explicitly specify which fields to save to prevent bad input data
  userData = req.body;

  if(userData.email != "undefined"){
    user.set("username", userData.email);
  }
  if(userData.name != "undefined"){
    user.set("name", userData.name);
  }
  if(userData.surname != "undefined"){
    user.set("surname", userData.surname);
  }
  if(userData.password != "undefined"){
    user.set("password", userData.password);
  }
  if(userData.courses){
    if(userData.courses != "undefined"){
      var courses = new Array();
      courses = userData.courses.split(",");
      user.set("courses", courses);
    }
  }

  if(userData.date != "undefined"){
    user.set("birthday", userData.date);
  }
  if(userData.email != "undefined"){
    user.set("email", userData.email);
  }

  if(userData.admin != "undefined"){
    if(userData.admin == "on"){
      user.set("admin", true);
    }else{
      user.set("admin", false);
    }

  }
  if(userData.contact != "undefined"){
    user.set("contact", userData.contact);
  }

  user.signUp(null, {
    success: function(user) {
      res.redirect('/users');
    },
    error: function(user, error) {
      // Show the error message somewhere and let the user try again.

      res.send(500, "Error: " + error.code + " " + error.message);
    }
  });
};

// Create a new tender with specified title and body.
// Update a post based on specified id, title and body.
exports.update = function(req, res) {
  var user = new User();
  res.locals.path = req.path;
  if(req.params.id){
    user.id = req.params.id;
  }


  userData = req.body;
  if(userData.name != "undefined"){
    user.set("name", userData.name);
  }
  if(userData.surname != "undefined"){
    user.set("surname", userData.surname);
  }
  if(userData.password != "undefined"){
    user.set("password", userData.password);
  }
  if(userData.courses != "undefined"){
    user.set("courses", userData.courses);
  }
  if(userData.date != "undefined"){
    user.set("birthday", userData.date);
  }
  if(userData.email != "undefined"){
    user.set("email", userData.email);
  }
  if(userData.email != "undefined"){
    user.set("username", userData.email);
  }

  if(userData.admin != "undefined"){
    if(userData.admin == "on"){
      user.set("admin", true);
    }else{
      user.set("admin", false);
    }

  }
  if(userData.contact != "undefined"){
    user.set("contact", userData.contact);
  }


  Parse.Cloud.useMasterKey();
  user.save().then(function() {
    res.redirect('/users');
  },
  function(err) {
    res.send(500, 'Failed saving user');
  });
};


exports.addToAdmins = function(req, res) {

  userId = req.params.id;
  var queryUser = new Parse.Query(Parse.User);
  queryUser.equalTo('objectId',userId);
  queryUser.first({
      success: function(result) { // Role Object
          var user = result;
          var queryRole = new Parse.Query(Parse.Role);
          queryRole.equalTo('name',"Administrator");
          queryRole.first({
              success: function(result) { // Role Object
                  var role = result;
                  var roleACL = role.getACL();
                  roleACL.setWriteAccess(Parse.User.current(), false);
                  roleACL.setRoleWriteAccess(role,true);
                  role.getUsers().add(user);
                  role.save(null, {
                    success: function(saveObject) {
                      Parse.Cloud.useMasterKey();
                      user.save({"admin":true}, {
                        success: function(object) {
                          res.redirect('/users');
                        },
                        error: function(object, error) {
                          console.log(error);
                          res.redirect('/users');
                        }
                      });

                     },
                    error: function(saveObject, error) {
                      res.send(500, 'Failed saving user');
                    }
                  })
              },
              error: function(error) {
                res.send(500, 'Failed saving user');
              }
          });

      },
      error: function(error) {
        res.send(500, 'Failed saving user');
      }
  });
};

exports.edit = function(req, res) {
  var query = new Parse.Query(User);
  res.locals.path = req.path;
  query.get(req.params.id).then(function(user) {
    if (user) {

      Parse.User.current().fetch().then(function(current){
        var courses = user.get("courses");

        var contact = user.get("contact");
        var admin = user.get("admin");
        var website = false;
        var person = false;
        var email = false;
        var presentation = false;
        var emailVerified = false;

        if (contact == "website"){
            website = true;
        }else if(contact =="person"){
            person = true;
        }else if(contact == "email"){
            email = true;
        }else if(presentation == "presentation"){
            presentation = true;
        }
        var mobileapp = _.some(courses, function(c) {
                  return c == 'Mobile App Design';
              });
        var videomaking = _.some(courses, function(c) {
                  return c == 'Videomaking';
              });
        if(user.get("emailVerified") == "undefined"){
          emailVerified = false;
        }

        res.render('users/edit', {
          user: user,
          mobileapp: mobileapp,
          website: website,
          person: person,
          email: email,
          emailVerified: emailVerified,
          presentation: presentation,
          videomaking: videomaking,
          currentUser: current
        });
      });

    } else {
      res.send('specified user does not exist');
    }
  },
  function() {
    res.send(500, 'Failed finding user to edit');
  });
};


exports.removeFromAdmins = function(req, res) {
  userId = req.params.id;
  var queryUser = new Parse.Query(Parse.User);
  queryUser.equalTo('objectId',userId);
  queryUser.first({
      success: function(result) { // Role Object
          var user = result;
          var queryRole = new Parse.Query(Parse.Role);
          queryRole.equalTo('name',"Administrator");
          queryRole.first({
              success: function(result) { // Role Object
                  var role = result;

                  role.getUsers().remove(user);
                  role.save(null, {
                    success: function(saveObject) {
                      Parse.Cloud.useMasterKey();
                      user.save({"admin":false}, {
                        success: function(object) {
                          res.redirect('/users');
                        },
                        error: function(object, error) {
                          // saving the object failed.
                        }
                      });
                     },
                    error: function(saveObject, error) {
                      res.send(500, 'Failed saving user');
                    }
                  })
              },
              error: function(error) {
                res.send(500, 'Failed saving user');
              }
          });

      },
      error: function(error) {
        res.send(500, 'Failed saving user');
      }
  });
};

// Delete a post corresponding to the specified id.
exports.delete = function(req, res) {
  var user = new User();
  Parse.Cloud.useMasterKey();
  user.id = req.params.id;

  user.destroy().then(function() {
    res.redirect('/users');
  },
  function() {
    res.send(500, 'Failed deleting user');
  });
};
