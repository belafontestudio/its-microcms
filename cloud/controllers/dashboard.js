var _ = require('underscore');



// Display all posts.
exports.index = function(req, res) {
  res.locals.path = req.path;
  Parse.User.current().fetch().then(function(user){
    console.log(user.getEmail());
    res.render('index',{user : user});
  });

};