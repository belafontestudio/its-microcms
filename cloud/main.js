require('cloud/app.js');


var mailchimpApiKey = "b38bbe7f505ad8ac5b927ceccc7fdfe9-us8";

Parse.Cloud.beforeSave(Parse.User, function(request, response) {

		user = request.object.toJSON();
		if (!user ||
            !user.email){
        response.error("Must supply email address, firstname and lastname to Mailchimp signup");
        return;
      }

      var mailchimpData =
			{
		    "email_address": user.email,
		    "status": "subscribed",
		    "merge_fields": {
		        "FNAME": user.name,
		        "LNAME": user.surname,
						"CONTACT": user.contact
		    }
			}
      var url = "https://us8.api.mailchimp.com/3.0/lists/c837717243/members/";

      Parse.Cloud.httpRequest({
        method: 'POST',
        url: url,
				headers: {
				 Authorization: "apikey " + mailchimpApiKey
			 	},
        body: JSON.stringify(mailchimpData),
        success: function(httpResponse) {
          response.success();
        },
        error: function(httpResponse) {
					json_result = JSON.parse(httpResponse.text);
					if(json_result.title == "Member Exists"){
						response.success();
					}else{
						console.error('Request failed with response code ' + httpResponse.status);
						response.error('Mailchimp subscribe failed with response code ' + httpResponse.status);
					}
        }
      });

});


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
