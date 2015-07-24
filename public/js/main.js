Parse.initialize("2RD3MsL6Lf8FgGRkgNNehB0r5RvJRr0km7rZb9VS", "ygZYx64QQISpshuwxWhyQgEKGDnXRtvldz9E0VDA");



function fileUploader(){
	console.log("fileupload");
	var file;
  // Set an event listener on the Choose File field.
  $('#fileselect').bind("change", function(e) {
    var files = e.target.files || e.dataTransfer.files;
    // Our file var now holds the selected file
    file = files[0];
  });

  // This function is called when the user clicks on Upload to Parse. It will create the REST API request to upload this image to Parse.
  $('#uploadfile').click(function(e) {
		console.log("uploadfile");
		e.preventDefault();
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


        console.log("File available at: " + data.url);
				var pdf = new Parse.Object("Attachment");
				pdf.set("title", data.name);
				pdf.set("url", data.url);

				pdf.set({file: {"name": data.name,"url": data.url,"__type": "File"}});
				pdf.save().then(function(pdf) {

							var related = $('#tenderid').val();
							var query = new Parse.Query("Tender");
								query.select("id", related);
								query.first().then(function(tender) {
									pdf.set("related", tender);
					        pdf.save();
							});

				})

      },
      error: function(data) {
        var obj = $.parseJSON(data);
        console.log(obj.error);
      }
    });
  });
}


$(document).ready(function(){
  $('#body').trumbowyg({
     btns: ['bold', 'italic', '|', 'btnGrp-lists'],
     fullscreenable: false
  });


  fileUploader();

});
