function read() {
}
function init_dialog() {
	$('#progress-dialog').dialog( {
		"modal" : true,
		"autoOpen" : false
	});

}
function activeX_transfer_basic_properties(activeXObject) {
	$('#id').val(activeXObject.icno);
	$('#name').val(activeXObject.originalName);
	$('#religion').val(activeXObject.religion);
	$('#race').val(activeXObject.race);
	$('#dob').val(activeXObject.birthdate);
	$('#gender').val(activeXObject.gender);
	$('#nationality').val(activeXObject.citizenship);
	var address = '';
	address = address + activeXObject.address1;
	address = address + '\n' + activeXObject.address2;
	address = address + '\n' + activeXObject.address3;
	address = address + '\n' + activeXObject.postcode + ' '
			+ activeXObject.city;
	address = address + '\n' + activeXObject.state;
	$('#address').val(address);

};

function activeX_read_image(activeXObject) {
	$('#imageId').val($('#id').val());
	var i = 0;
	$('#uploadContent').val("");
	var elementSelector = 'imageBlock' + i;
	while ($('#' + elementSelector).size() == 1) {
		var statusText = "Reading image segment [" + i + "]";
		$('#progress-status').text(statusText);
		var content = activeXObject.getImageContent(i);
		$('#' + elementSelector).val(content);
		$('#uploadContent').val($('#uploadContent').val() + content);
		i++;
		elementSelector = 'imageBlock' + i;
	}
	return;
};

function show_image(responseText, statusText) {
	var getAction = $('form#pullImageAction').attr('action');
	var imageLocation = getAction + '?' + 'id=' + $('#imageId').val();
	$('#photo').attr('src', imageLocation);
};

function activeX_image_submit() {
	var options = {
		"cache" : false,
		"success" : show_image
	};
	$('form#pushImageAction').ajaxSubmit(options);
};

function readUsingService() {
	var activeXId = "Tabuk.MyKad.JpnReaderService";
	try {
		$('#progress-status').text("Unable to create ActiveX object");
		activeXObject = new ActiveXObject(activeXId);
		$('#progress-status').text("ActiveX object created...");
		var result;
		result = activeXObject.init();
		if (result != 0) {
			$('#progress-status').text("Reader initiliazation problem...");
			activeXObject.cleanUp();
			return false;
		}
		$('#progress-status').text("Reading basic info...");
		result = activeXObject.readTextInfo();
		if (result != true) {
			$('#progress-status').text("Reading basic info problem...");
			activeXObject.cleanUp();
			return false;
		}
		activeX_transfer_basic_properties(activeXObject);
		activeX_read_image(activeXObject);
		$('#progress-status').text("Done reading image...");
		activeX_image_submit();
		activeXObject.cleanUp();
		return true;
	} catch (e) {
		alert(activeXId + ":" + e);
		$('a.ui-dialog-titlebar-close').show();
	}
	return false;
}

function hook_up_read() {
	$('#button-read').click(function() {
		$('a.ui-dialog-titlebar-close').hide();
		$("#progress-bar").progressbar( {
			value : 0
		});
		$('#progress-dialog').dialog('open');
		$('#progress-status').text("Reading text info...");
		if (readUsingService()) {
			$('#progress-dialog').dialog('close');
		}

	});
}
function content_uploaded_confirm(responseText, statusText) {
	if (statusText == "success") {
		alert("Data stored");
	}
}
function hook_up_submit() {
	var options = {
		"cache" : false,
		"success" : content_uploaded_confirm
	};
	$("#contentUploadAction").ajaxForm(options);
}
function init_page() {
	init_dialog();
	hook_up_read();
	hook_up_submit();
}
$(document).ready(init_page);
