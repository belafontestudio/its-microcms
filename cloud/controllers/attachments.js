/*globals Parse*/
var _ = require('underscore');
var Attachment = Parse.Object.extend('Attachment');



// Display a form for creating a new attachments.
exports.new = function(req, res) {
  res.locals.path = req.path;
	if(req.query.t){
		console.log(req.query.t);
		res.locals.tenderid = req.query.t;
	}

  Parse.User.current().fetch().then(function(user){

    res.render('attachments/new', {
      user: user
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
