/* globals parse*/
var _ = require('underscore');
var Tender = Parse.Object.extend('Tender');
var Attachment = Parse.Object.extend('Attachment');

// Display all posts.
exports.index = function(req, res) {
  res.locals.path = req.path;
  var query = new Parse.Query(Tender);
  query.descending('createdAt');
  query.find().then(function(tenders) {



    Parse.User.current().fetch().then(function(user){

      res.render('tenders/index', {
        tenders: tenders,
        currentUser: user
      });
    });
  },
  function() {
    res.send(500, 'Failed loading tenders');
  });
};



// Display a form for creating a new tender.
exports.new = function(req, res) {
  res.locals.path = req.path;
  Parse.User.current().fetch().then(function(user){

    res.render('tenders/new', {
      currentUser: user
    });
  });

};

// Create a new tender with specified title and body.
exports.create = function(req, res) {
  var tender = new Tender();
  res.locals.path = req.path;
  // Explicitly specify which fields to save to prevent bad input data
  tender.save(_.pick(req.body, 'title', 'body')).then(function() {
    res.redirect('/tenders');
  },
  function() {
    res.send(500, 'Failed saving tender');
  });
};


exports.activate = function(req, res) {
  var tender = new Tender();
  tender.id = req.params.id;
  tender.save({"active":true}).then(function() {
    res.redirect('/tenders');
  },
  function() {
    res.send(500, 'Failed saving active');
  });

};

exports.deactivate = function(req, res) {
  var tender = new Tender();
  tender.id = req.params.id;
  tender.save({"active":false}).then(function() {
    res.redirect('/tenders');
  },
  function() {
    res.send(500, 'Failed saving active');
  });

};

exports.edit = function(req, res) {
  var query = new Parse.Query(Tender);
  res.locals.path = req.path;
  query.get(req.params.id).then(function(tender) {
    if (tender) {
			var Attachment = Parse.Object.extend('Attachment');
      var attachmentQuery = new Parse.Query(Attachment);
      attachmentQuery.equalTo('related', tender);
      attachmentQuery.descending('createdAt');
      attachmentQuery.find().then(function(attachments) {
				Parse.User.current().fetch().then(function(user){

	        res.render('tenders/edit', {
	          tender: tender,
						attachments: attachments,
	          currentUser: user
	        });
	      });
      });

    } else {
      res.send('specified tender does not exist');
    }
  },
  function() {
    res.send(500, 'Failed finding tender to edit');
  });
};

// Update a tender based on specified id, title and body.
exports.update = function(req, res) {
  var tender = new Tender();
  res.locals.path = req.path;
  tender.id = req.params.id;
  tender.save(_.pick(req.body, 'title', 'body')).then(function() {
    res.redirect('/tenders');
  },
  function() {
    res.send(500, 'Failed saving tender');
  });
};



// Delete a post corresponding to the specified id.
exports.delete = function(req, res) {
  var tender = new Tender();
  tender.id = req.params.id;

  tender.destroy().then(function() {
    res.redirect('/tenders');
  },
  function() {
    res.send(500, 'Failed deleting tender');
  });
};
