require('cloud/app.js');


Parse.Cloud.define("getRole", function(request, response) {
  var queryRole = new Parse.Query(Parse.Role);
  queryRole.equalTo('name', request.params.roleName);
  queryRole.first({
      success: function(result) { // Role Object
          var role = result;
          response.success(role);
      },
      error: function(error) {
        response.error("role lookup failed");
      }
  });

});


Parse.Cloud.define("updateRoleACL", function(request, response) {
	console.log("update")
	var role = request.params.role;
	var roleACL = role.getACL();
	roleACL.setWriteAccess(Parse.User.current(), false);
	roleACL.setRoleWriteAccess(role,true);
	role.save(null, {
		success: function(saveObject) {
			response.success(saveObject);

		 },
		error: function(saveObject, error) {
				response.error("Failed updating role with error: " + error.code + ":"+ error.message);
		}
	})
});


Parse.Cloud.define("setAdmin", function(request, response) {
	var anotherUser = request.anotherUser;
	var user = Parse.User.current();


  // The rest of the function operates on the assumption that request.user is *authorized*

  Parse.Cloud.useMasterKey();

  // Query for the user to be modified by username
  // The username is passed to the Cloud Function in a
  // key named "username". You can search by email or
  // user id instead depending on your use case.

	anotherUser.save({"admin":true}, {
		success: function(anotherUser) {
			// The user was saved successfully.
			response.success("Successfully updated user.");
		},
		error: function(anotherUser, error) {
			// The save failed.
			// error is a Parse.Error with an error code and description.
			response.error("Could not save changes to user.");
		}
	});
});
