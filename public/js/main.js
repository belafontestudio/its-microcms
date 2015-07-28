Parse.initialize("2RD3MsL6Lf8FgGRkgNNehB0r5RvJRr0km7rZb9VS", "ygZYx64QQISpshuwxWhyQgEKGDnXRtvldz9E0VDA");


var uploadable = false;
var file;
var loader = $("#loader");
var uploadInput = $('#uploadfile');

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




$(document).ready(function(){

  $('#body').trumbowyg({
     btns: ['bold', 'italic', '|', 'btnGrp-lists','btnGrp-justify'],
		 removeformatPasted: true,
     fullscreenable: false,
		 resetCss: true
  });


  fileUploader();

});
