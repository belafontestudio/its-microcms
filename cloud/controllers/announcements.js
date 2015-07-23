var _ = require('underscore');
var Announcement = Parse.Object.extend('Announcement');

// Display all posts.
exports.index = function(req, res) {

  res.locals.path = req.path;

  var query = new Parse.Query(Announcement);
  query.descending('createdAt');
  query.find().then(function(results) {
    Parse.User.current().fetch().then(function(user){
      res.render('announcements/index', {
        announcements: results,
        user: user
      });
    });
  },
  function() {
    res.send(500, 'Failed loading announcements');
  });
};

// Display a form for creating a new announcement.
exports.new = function(req, res) {
  res.locals.path = req.path;
  Parse.User.current().fetch().then(function(user){

    res.render('announcements/new', {
      user: user
    });
  });

};

// Create a new announcement with specified title and body.
exports.create = function(req, res) {
  var announcement = new Announcement();
  res.locals.path = req.path;
  // Explicitly specify which fields to save to prevent bad input data
  announcement.save(_.pick(req.body, 'title', 'body')).then(function() {
    res.redirect('/announcements');
  },
  function() {
    res.send(500, 'Failed saving announcement');
  });
};

var unpublishRecursive = function(objects, index, callback) {
  if (index >= objects.length) {
    callback();
  } else {

    objects[index].save({"published":false}).then(function() {
      unpublishRecursive(objects, index + 1, callback);
    });
  }
};

exports.unpublishAll = function(req, res) {
  var query = new Parse.Query(Announcement);
  console.log("unpublish all");
  res.locals.path = req.path;
  query.find().then(function(results) {
    unpublishRecursive(results, 0, function() {
      res.redirect("/announcements");
    },
    function() {
      res.send(500, 'Failed loading recursive');
    });
  },
  function() {
    res.send(500, 'Failed loading unpublishAll');
  });

};

exports.publish = function(req, res) {
  var query = new Parse.Query(Announcement);
  res.locals.path = req.path;
  console.log("unpublish all");
  query.find().then(function(results) {
    unpublishRecursive(results, 0, function() {

      var announcement = new Announcement();
      announcement.id = req.params.id;
      announcement.save({"published":true}).then(function() {
        res.redirect('/announcements');
      },
      function() {
        res.send(500, 'Failed saving published');
      });

    },
    function() {
      res.send(500, 'Failed loading recursive');
    });
  });

};



// Delete a post corresponding to the specified id.
exports.delete = function(req, res) {
  var announcement = new Announcement();
  announcement.id = req.params.id;
  res.locals.path = req.path;
  announcement.destroy().then(function() {
    res.redirect('/announcements');
  },
  function() {
    res.send(500, 'Failed deleting announcement');
  });
};

exports.edit = function(req, res) {
  var query = new Parse.Query(Announcement);
  res.locals.path = req.path;
  query.get(req.params.id).then(function(announcement) {
    if (announcement) {
      Parse.User.current().fetch().then(function(user){

        res.render('announcements/edit', {
          announcement: announcement,
          user: user
        });
      });

    } else {
      res.send('specified announcement does not exist');
    }
  },
  function() {
    res.send(500, 'Failed finding announcement to edit');
  });
};

// Update a post based on specified id, title and body.
exports.update = function(req, res) {
  var announcement = new Announcement();
  res.locals.path = req.path;
  announcement.id = req.params.id;
  announcement.save(_.pick(req.body, 'title', 'body')).then(function() {
    res.redirect('/announcements');
  },
  function() {
    res.send(500, 'Failed saving announcement');
  });
};
