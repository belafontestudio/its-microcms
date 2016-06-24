Parse.initialize("2RD3MsL6Lf8FgGRkgNNehB0r5RvJRr0km7rZb9VS", "ygZYx64QQISpshuwxWhyQgEKGDnXRtvldz9E0VDA");


var uploadable = false;
var file;
var loader = $("#loader");
var uploadInput = $('#uploadfile');
var userPortraitInput = $('#portraitfile');
var userUploadable = false;
var userFile;
var portraitFile;
var loader = $("#loader");
var userUploadInput = $('#useruploadfile');

function uploadFile(){
	var serverUrl = 'https://api.parse.com/1/files/' + file.name;

	$.ajax({
		type: "POST",
		beforeSend: function(request) {
			request.setRequestHeader("X-Parse-Application-Id", '2RD3MsL6Lf8FgGRkgNNehB0r5RvJRr0km7rZb9VS');
			request.setRequestHeader("X-Parse-REST-API-Key", 'Pu2r6VO4K1Wp6XIZkKyG4wu9A4YqaWsHeaVgnvfc');
			request.setRequestHeader("Content-Type", file.type);
		},
		url: serverUrl,
		data: file,
		processData: false,
		contentType: false,
		success: function(data) {
			var pdfTitle = $("#title").val();
			console.log("File available at: " + data.url);
			var pdf = new Parse.Object("Attachment");
			pdf.set("title", pdfTitle);
			pdf.set("url", data.url);

			pdf.set({file: {"name": data.name,"url": data.url,"__type": "File"}});
			pdf.save().then(function(pdf) {
						var relatedID = $('#tenderid').val();
						var query = new Parse.Query("Tender");
							query.select("id", relatedID);
							query.get(relatedID).then(function(tender) {

								pdf.set("related", tender);
								pdf.save().then(function(){
									loader.fadeOut();
									var url = "/tenders/"+relatedID+"/edit";
									$(location).attr('href',url);
								});

						});

			})

		},
		error: function(data) {
			var obj = $.parseJSON(data);
			console.log(obj.error);
		}
	});
}

function userUploadFile(){
	var serverUrl = 'https://api.parse.com/1/files/' + userFile.name;

	$.ajax({
		type: "POST",
		beforeSend: function(request) {
			request.setRequestHeader("X-Parse-Application-Id", '2RD3MsL6Lf8FgGRkgNNehB0r5RvJRr0km7rZb9VS');
			request.setRequestHeader("X-Parse-REST-API-Key", 'Pu2r6VO4K1Wp6XIZkKyG4wu9A4YqaWsHeaVgnvfc');
			request.setRequestHeader("Content-Type", userFile.type);
		},
		url: serverUrl,
		data: userFile,
		processData: false,
		contentType: false,
		success: function(data) {
			var pdfTitle = $("#usertitle").val();
			console.log("File available at: " + data.url);
			var pdf = new Parse.Object("UserAttachment");
			pdf.set("title", pdfTitle);
			pdf.set("url", data.url);

			pdf.set({userFile: {"name": data.name,"url": data.url,"__type": "File"}});
			pdf.save().then(function(pdf) {
						var relatedID = $('#userid').val();
						var query = new Parse.Query("User");
							query.select("id", relatedID);
							query.get(relatedID).then(function(user) {

								pdf.set("related", user);
								pdf.save().then(function(){
									loader.fadeOut();
									var url = "/users/"+relatedID+"/edit";
									$(location).attr('href',url);
								});

						});

			})

		},
		error: function(data) {
			var obj = $.parseJSON(data);
			console.log(obj.error);
		}
	});
}


function fileUploader(){
	console.log("fileupload");


  // Set an event listener on the Choose File field.
  $('#fileselect').bind("change", function(e) {

    var files = e.target.files || e.dataTransfer.files;
    // Our file var now holds the selected file
    file = files[0];
		if (uploadable && typeof file != 'undefined'){
			uploadInput.removeAttr('disabled');
		}
  });

	var titleField = $('#title');
	titleField.keyup(function(e) {
		if(titleField.val().length > 1){

			uploadable = true;
		}else{
			uploadable = false;
		}
	});


  // This function is called when the user clicks on Upload to Parse. It will create the REST API request to upload this image to Parse.
	uploadInput.click(function(e) {
		e.preventDefault();
		console.log(file)
		if (uploadable && typeof file != 'undefined'){

			console.log("uploadfile");
			loader.fadeIn();


	    uploadFile();
		}
  });
}


function userFileUploader(){
	console.log("user fileupload");


  // Set an event listener on the Choose File field.
  $('#userfileselect').bind("change", function(e) {

    var files = e.target.files || e.dataTransfer.files;
    // Our file var now holds the selected file
    userFile = files[0];
		if (userUploadable && typeof userFile != 'undefined'){
			userUploadInput.removeAttr('disabled');
		}
  });

	var titleField = $('#usertitle');
	titleField.keyup(function(e) {
		if(titleField.val().length > 1){

			userUploadable = true;
		}else{
			userUploadable = false;
		}
	});


  // This function is called when the user clicks on Upload to Parse. It will create the REST API request to upload this image to Parse.
	userUploadInput.click(function(e) {
		e.preventDefault();
		console.log(userFile)
		if (userUploadable && typeof userFile != 'undefined'){

			console.log("uploadfile");
			loader.fadeIn();
	    userUploadFile();
		}
  });
}
function portraitUploadFile(){



	  var file = portrait;
	  var name = portrait.name;

	  var portraitFile = new Parse.File(name, file);
		portraitFile.save().then(function() {
			var studentid = $('#studentid').val();
			var query = new Parse.Query("Student");
				query.select("id", studentid);
				query.get(studentid).then(function(student) {
					console.log(student);
					student.set("portrait", portraitFile);
					student.save().then(function() {
				    location.reload();
				  },
				  function(err) {
				    console.log(err);

				  });
				});
		}, function(error) {
			console.log(error)
		});

}
function portraitUploader(){
	console.log("portraitupload");
  // Set an event listener on the Choose File field.
  $('#portrait').bind("change", function(e) {

    var files = e.target.files || e.dataTransfer.files;
    // Our file var now holds the selected file
    portrait = files[0];
		if ( typeof portrait != 'undefined'){
			uploadInput.removeAttr('disabled');
		}
  });
  // This function is called when the user clicks on Upload to Parse. It will create the REST API request to upload this image to Parse.
	userPortraitInput.click(function(e) {
		e.preventDefault();

		if ( typeof portrait != 'undefined'){

			console.log("upload portrait");
			loader.fadeIn();


	    portraitUploadFile();
		}
  });
}


function userButton(){

	var adminButton = $('#adminButton');
	adminButton.submit(function( event ) {
  event.preventDefault();
});

}


$(document).ready(function(){
	if($('.datepicker')){
		$('.datepicker').pickadate({
    selectYears: 60,
    firstDay: 1,
    selectMonths: true,
    formatSubmit: 'dd/mm/yyyy',
    format: 'dd/mm/yyyy',
    hiddenName: true,
    monthsFull: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
    monthsShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
    weekdaysFull: ['Domenica', 'Lunedì', 'Martedi', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
    weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
    showWeekdaysFull: true,
    today: 'Oggi',
    clear: 'Pulisci',
    close: 'Chiudi',
    onSet: function(context) {
      $("label.birthday").addClass("isSet");
    }
  });
	}
  $('#body').trumbowyg({
     btns: ['bold', 'italic', '|', 'btnGrp-lists','btnGrp-justify'],
		 removeformatPasted: true,
     fullscreenable: false,
		 resetCss: true
  });

	//userButton();
	portraitUploader();
  fileUploader();
	userFileUploader();

});
