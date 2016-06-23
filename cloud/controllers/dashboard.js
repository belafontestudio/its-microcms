var _ = require('underscore');



// Display all posts.
exports.index = function(req, res) {
  res.locals.path = req.path;
  Parse.User.current().fetch().then(function(user){
    res.render('index',{currentUser : user});
  });

};
