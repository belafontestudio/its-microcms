var _ = require('underscore');
var Tender = Parse.Object.extend('Tender');

// Display all posts.
exports.index = function(req, res) {

  var query = new Parse.Query(Tender);
  query.descending('createdAt');
  query.find().then(function(tenders) {

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
