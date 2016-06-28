var Candidate = Parse.Object.extend('Candidate');

// Display all posts.
exports.index = function(req, res) {
  res.locals.path = req.path;
  var query = new Parse.Query(Candidate);
  query.descending('createdAt');
  query.find().then(function(candidates) {
    Parse.User.current().fetch().then(function(user){
      res.render('candidates/index', {
        candidates: candidates,
        currentUser: user
      });
    });
  },
  function() {
    res.send(500, 'Failed loading tenders');
  });
};

exports.activate = function(req, res) {
  var candidate = new Candidate();
  candidate.id = req.params.id;
  candidate.save({"active":true}).then(function() {
    res.redirect('/candidates');
  },
  function() {
    res.send(500, 'Failed saving active');
  });

};

exports.deactivate = function(req, res) {
  var candidate = new Candidate();
  candidate.id = req.params.id;
  candidate.save({"active":false}).then(function() {
    res.redirect('/candidates');
  },
  function() {
    res.send(500, 'Failed saving deactive');
  });

};
