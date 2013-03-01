window.DBForm = new Object();
DBForm.FormFields = new Object();
DBForm.recaptcha = false; //set to false to remove the recaptcha from the form
DBForm.recaptchaTheme = "red";
DBForm.recaptchaPublicKey = "YOUR RECAPTCHA PUBLIC KEY HERE";

DBForm.GetSubmittedFields = function() {
	var radioGroups = new Object();
	$("#dbform-fields input[type='radio']").each(function() {
		if (this.checked) {
			radioGroups[$(this).attr("name")] = new Object();
			radioGroups[$(this).attr("name")]["name"] = $(this).attr("name");
			radioGroups[$(this).attr("name")]["type"] = "TEXT";
			radioGroups[$(this).attr("name")]["value"] = $(this).attr("value");
		}
	});
	for (var group in radioGroups) {
		DBForm.FormFields[group] = radioGroups[group];
	}
	$("#dbform-fields input:not([type='radio']):not([type='button']), #dbform-fields textarea, #dbform-fields select").each(function() {
		if ($(this).attr("type") == "checkbox") {
			DBForm.FormFields[$(this).attr("name")] = new Object();
			DBForm.FormFields[$(this).attr("name")]["name"] = $(this).attr("name");
			DBForm.FormFields[$(this).attr("name")]["type"] = "TINYTEXT";
			DBForm.FormFields[$(this).attr("name")]["value"] = this.checked ? "true" : "false";
		}
		else if (this.tagName == "textarea") {
			DBForm.FormFields[$(this).attr("name")] = new Object();
			DBForm.FormFields[$(this).attr("name")]["name"] = $(this).attr("name");
			DBForm.FormFields[$(this).attr("name")]["type"] = "LONGTEXT";
			DBForm.FormFields[$(this).attr("name")]["value"] = $(this).val();
		}
		else {
			DBForm.FormFields[$(this).attr("name")] = new Object();
			DBForm.FormFields[$(this).attr("name")]["name"] = $(this).attr("name");
			DBForm.FormFields[$(this).attr("name")]["type"] = "TEXT";
			DBForm.FormFields[$(this).attr("name")]["value"] = $(this).val();
		}
	});
}

DBForm.ValidateClient = function() {
	DBForm.FormFields = new Object();
	$("#validationMessage").hide();
	$(".formLabel").css("color","#000000");
	var valid = true;
	$("#dbform .required").each(function() {
		if ($(this).find("input[type='radio']").length > 0) {
			if ($(this).find("input[type='radio']:checked").length < 1) {
				valid = false;
				$(this).find(".formLabel").css("color","red");
			}
		}
		else {
			if ($(this).find("input:not([type='checkbox']),select,textarea").val() == "" ||
				typeof $(this).find("input:not([type='checkbox']),select,textarea").val() != "string") {
				valid = false;
				$(this).find(".formLabel").css("color","red");
			}
		}
	});
	if (!valid) {
		$("#validationMessage").show();
	}
	return valid;
}

DBForm.RecaptchaFail = function() {
	DBForm.FormFields = new Object();
	$(".dbform-validation").hide();
	Recaptcha.reload();
	$("#dbform-recaptchavalidation").show();
}

DBForm.SubmitSuccess = function() {
	alert("Form Submitted Successfully!");
	//Do more stuff
	//window.location.href = "success.html";
}

DBForm.SubmitForm = function() {
	var recaptcha = DBForm.recaptcha ? "true" : "false";
	var recaptchaChallenge = DBForm.recaptcha ? Recaptcha.get_challenge() : "";
	var recaptchaResponse = DBForm.recaptcha ? Recaptcha.get_response() : "";
	$.ajax({
		url: "form.php",
		type: "POST",
		data: {
				  "fields" : JSON.stringify(DBForm.FormFields),
				  "recaptcha" : recaptcha,
				  "challenge" : recaptchaChallenge,
				  "response" : recaptchaResponse
			  },
		dataType: "text",
		success: function(data) {
					if (data == "recaptcha invalid") {
						DBForm.RecaptchaFail();
					}
					else {
						DBForm.SubmitSuccess();
					}
				 }
	});
}

DBForm.StartSubmission = function() {
	DBForm.GetSubmittedFields();
	if (DBForm.ValidateClient()) {
		DBForm.SubmitForm();
	}
}

$(document).ready(function() {
	if (DBForm.recaptcha) {
		Recaptcha.create(DBForm.recaptchaPublicKey,"dbform-recaptcha",{ theme : DBForm.recaptchaTheme });
	}
	$("#dbform").on("click","#dbform-submit",function() {
		DBForm.StartSubmission();
	});
});