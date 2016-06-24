var _ = require('underscore');
var Student = Parse.Object.extend('Student');



// Display all posts.
exports.index = function(req, res) {
  res.locals.path = req.path;
  var query = new Parse.Query(Student);
  query.descending('createdAt');
  query.include('year');

  query.find().then(function(results) {
    Parse.User.current().fetch().then(function(user){

      res.render('students/index', {
        students: results,
        currentUser: user
      });
    });
  },
  function() {
    res.send(500, 'Failed loading students');
  });
};

// Display a form for creating a new tender.
exports.new = function(req, res) {
  res.locals.path = req.path;
  Parse.User.current().fetch().then(function(user){

    res.render('students/new', {
      currentUser: user
    });
  });

};

// exports.create = function(req, res) {
//   var user = new Parse.User();
//   res.locals.path = req.path;
//   // Explicitly specify which fields to save to prevent bad input data
//   userData = req.body;
//
//   if(userData.email != "undefined"){
//     user.set("username", userData.email);
//   }
//   if(userData.name != "undefined"){
//     user.set("name", userData.name);
//   }
//   if(userData.surname != "undefined"){
//     user.set("surname", userData.surname);
//   }
//   if(userData.password != "undefined"){
//     user.set("password", userData.password);
//   }
//   if(userData.courses){
//     if(userData.courses != "undefined"){
//       var courses = new Array();
//       courses = userData.courses.split(",");
//       user.set("courses", courses);
//     }
//   }
//
//   if(userData.date != "undefined"){
//     user.set("birthday", userData.date);
//   }
//   if(userData.email != "undefined"){
//     user.set("email", userData.email);
//   }
//
//   if(userData.admin != "undefined"){
//     if(userData.admin == "on"){
//       user.set("admin", true);
//     }else{
//       user.set("admin", false);
//     }
//
//   }
//   if(userData.candidate != "undefined"){
//     if(userData.candidate == "on"){
//       user.set("candidate", true);
//     }else{
//       user.set("candidate", false);
//     }
//
//   }
//   if(userData.contact != "undefined"){
//     user.set("contact", userData.contact);
//   }
//
//   user.signUp(null, {
//     success: function(user) {
//       res.redirect('/users');
//     },
//     error: function(user, error) {
//       // Show the error message somewhere and let the user try again.
//
//       res.send(500, "Error: " + error.code + " " + error.message);
//     }
//   });
// };


exports.update = function(req, res) {
  var student = new Student();
  res.locals.path = req.path;
  if(req.params.id){
    student.id = req.params.id;
  }


studentData = req.body;
  console.log(studentData);
  if(studentData.name != "undefined"){
    student.set("name", studentData.name);
  }
  if(studentData.surname != "undefined"){
    student.set("surname", studentData.surname);
  }
  if(studentData.year != "undefined"){
    student.set("year", studentData.year);
  }
  if(studentData.course != "undefined"){
    student.set("course", studentData.course);
  }
  if(studentData.bio != "undefined"){
    student.set("bio", studentData.bio);
  }
  if(studentData.bio != "undefined"){
    student.set("bio", studentData.bio);
  }




  Parse.Cloud.useMasterKey();
  student.save().then(function() {
    res.redirect('/students');
  },
  function(err) {
    console.log(err);
    res.send(500, 'Failed saving student');
  });
};

exports.edit = function(req, res) {
  var query = new Parse.Query(Student);
  res.locals.path = req.path;
  query.include("year");
  query.get(req.params.id).then(function(student) {
    if (student) {
      var Years = Parse.Object.extend('Year');
      var yearQuery = new Parse.Query(Years);
      yearQuery.descending('createdAt');
      yearQuery.find().then(function(years) {
        Parse.User.current().fetch().then(function(current){
          var course = student.get("course");
          var portrait = student.get("portrait").url();
          var mobileapp = false;
          var videomaking = false;
          var coding = false;
          switch(course){
            case "Mobile App Design":
              mobileapp= true;
            break;
            case 'Videomaking':
              videomaking= true;
            break;
            case 'Coding':
              coding= true;
            break;

          }

          var skills = student.get("skills");


        res.render('students/edit', {
          years:years,
          student: student,
          mobileapp: mobileapp,
          videomaking: videomaking,
          coding: coding,
          skills: skills,
          currentUser: current,
        });
      });

      });

    } else {
      res.send('specified student does not exist');
    }
  },
  function() {
    res.send(500, 'Failed finding student to edit');
  });
};

// Delete a post corresponding to the specified id.
exports.delete = function(req, res) {
  var student = new Student();
  Parse.Cloud.useMasterKey();
  student.id = req.params.id;

  student.destroy().then(function() {
    res.redirect('/students');
  },
  function() {
    res.send(500, 'Failed deleting student');
  });
};
