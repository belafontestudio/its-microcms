var _ = require('underscore');
var Tender = Parse.Object.extend('Tender');
var Attachment = Parse.Object.extend('Attachment');

// Display all posts.
exports.index = function(req, res) {
  res.locals.path = req.path;
  var query = new Parse.Query(Tender);
  query.descending('createdAt');
  query.find().then(function(tenders) {

    _.each(tenders,function(tender){
      var Attachment = Parse.Object.extend('Attachment');
      var attachmentQuery = new Parse.Query(Attachment);
      attachmentQuery.equalTo('related', tender);
      attachmentQuery.descending('createdAt');
      attachmentQuery.find().then(function(attachments) {
        console.log(attachments);
      });
    });

    Parse.User.current().fetch().then(function(user){

      res.render('tenders/index', {
        tenders: tenders,
        user: user
      });
    });
  },
  function() {
    res.send(500, 'Failed loading tenders');
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
