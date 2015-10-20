/*globals Parse*/
var _ = require('underscore');
var Attachment = Parse.Object.extend('UserAttachment');



// Display a form for creating a new attachments.
exports.new = function(req, res) {
  res.locals.path = req.path;
	if(req.query.u){

		res.locals.userid = req.query.u;
	}

  Parse.User.current().fetch().then(function(user){

    res.render('users/attachment', {
      currentUser: user
    });
  });

};

// Delete a post corresponding to the specified id.
exports.delete = function(req, res) {
  backURL=req.header('Referer') || '/';
  var attachment = new Attachment();
  attachment.id = req.params.id;

  attachment.destroy().then(function() {
    res.redirect(backURL);
  },
  function() {
    res.send(500, 'Failed deleting attachment');
  });
};
