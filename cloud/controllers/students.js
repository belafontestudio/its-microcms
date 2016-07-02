var _ = require('underscore');
var Student = Parse.Object.extend('Student');



// Display all posts.
exports.index = function(req, res) {
  res.locals.path = req.path;
  var query = new Parse.Query(Student);
  query.descending('createdAt');


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
    var Years = Parse.Object.extend('Year');
    var yearQuery = new Parse.Query(Years);
    yearQuery.find().then(function(years){
      var Courses = Parse.Object.extend('Course');
      var courseQuery = new Parse.Query(Courses);
      courseQuery.find().then(function(courses){
        var Skills = Parse.Object.extend('Skill');
        var skillQuery = new Parse.Query(Skills);
        skillQuery.include("course");
        skillQuery.find().then(function(skills) {

          res.render('students/new', {
            courses: courses,
            years:years,
            currentUser: user,
            skills: skills
          });
        });
      });
    });
  });

};

exports.create = function(req, res) {
  var student = new Student();
  res.locals.path = req.path;
  // Explicitly specify which fields to save to prevent bad input data
  studentData = req.body;

  if(studentData.name != "undefined"){
    student.set("name", studentData.name);
  }
  if(studentData.surname != "undefined"){
    student.set("surname", studentData.surname);
  }
  if(studentData.years != "undefined"){
    student.set("year", studentData.years);
  }
  if(studentData.course != "undefined"){
    student.set("course", studentData.course);
  }
  if(studentData.bio != "undefined"){
    student.set("bio", studentData.bio);
  }
  if(studentData.skills != "undefined"){
    var skills=[];
    if(typeof studentData.skills === "string"){
      skills.push(studentData.skills)
    }else{
      skills = studentData.skills;
    }

    student.set("skills", skills);
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


exports.update = function(req, res) {
  var student = new Student();
  res.locals.path = req.path;
  if(req.params.id){
    student.id = req.params.id;
  }

  studentData = req.body;

  if(studentData.name != "undefined"){
    student.set("name", studentData.name);
  }
  if(studentData.surname != "undefined"){
    student.set("surname", studentData.surname);
  }
  if(studentData.years != "undefined"){
    student.set("year", studentData.years);
  }
  if(studentData.course != "undefined"){
    student.set("course", studentData.course);
  }
  if(studentData.bio != "undefined"){
    student.set("bio", studentData.bio);
  }
  if(studentData.skills != "undefined"){
    var skills=[];
    if(typeof studentData.skills === "string"){
      skills.push(studentData.skills)
    }else{
      skills = studentData.skills;
    }

    student.set("skills", skills);
  }

  Parse.Cloud.useMasterKey();
  student.save().then(function() {

    res.redirect('/students/'+student.id+"/edit");
  },
  function(err) {
    console.log(err);
    res.send(500, 'Failed saving student');
  });
};

exports.edit = function(req, res) {
  var query = new Parse.Query(Student);
  res.locals.path = req.path;
  query.get(req.params.id).then(function(student) {
    if (student) {
      var Years = Parse.Object.extend('Year');
      var yearQuery = new Parse.Query(Years);
      yearQuery.find().then(function(years){
        var Courses = Parse.Object.extend('Course');
        var courseQuery = new Parse.Query(Courses);
        courseQuery.find().then(function(courses){
          var Skills = Parse.Object.extend('Skill');
          var skillQuery = new Parse.Query(Skills);
          skillQuery.find().then(function(skills) {
            Parse.User.current().fetch().then(function(current){
              var course = student.get("course");
              var mobileapp = false;
              var videomaking = false;
              var coding = false;
              var studentSkills = student.get("skills");
              var allSkills= [];
              for (var i in skills) {
                var skill={};
                for (var j in studentSkills) {
                  if(studentSkills[j]==skills[i].get("name")){
                    skill={"name":skills[i].get("name"),"checked":true};
                    break;
                  }else{
                    skill={"name":skills[i].get("name"),"checked":false};
                  }
                }
                allSkills.push(skill);
              }
              res.render('students/edit', {
                years:years,
                student: student,
                courses: courses,
                mobileapp: mobileapp,
                videomaking: videomaking,
                coding: coding,
                skills: allSkills,
                currentUser: current,
              });
          });
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
