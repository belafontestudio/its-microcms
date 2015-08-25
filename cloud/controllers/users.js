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
