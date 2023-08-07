var text_compilation = {
	'userlogin': 'User Log In',
	'username': 'Username',
	'password': 'Password',
	'login': 'Log In',
	'enteruser': 'Enter User ID',
	'enterpass': 'Enter Password',
	'errpass': 'Invalid Password. Please try again.',
	'erruser': 'Invalid Username. Please try again.',
	'errboth': ' & Password',
	'promptend': '. ',
	'tryagain': 'Please try again',
	'brand': 'Machine Monitoring System',
	'lang': 'en',
};

$(document).ready(function() {
	var local = {};
	local.lang = localStorage.getItem('langCached');
	if (local.lang === undefined || local.lang === null || local.lang === "null") {
		local.lang = 'en';
	}

	text_compilation.lang = local.lang;
	text_compilation.username = lang[local.lang].signin.uname;
	text_compilation.password = lang[local.lang].signin.passw;
	text_compilation.erruser = lang[local.lang].signin.prompt.usererr;
	text_compilation.errpass = lang[local.lang].signin.prompt.passerr;
	text_compilation.errboth = lang[local.lang].signin.prompt.userpasserr;
	text_compilation.promptend = lang[local.lang].signin.prompt.desu;
	text_compilation.tryagain = lang[local.lang].signin.prompt.tryagain;
	$('#loginbtn').html(lang[local.lang].signin.login);

	$('#brandCat').html(text_compilation.brand);

	$('#lineLogoDisplay').on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function() {
		setTimeout(function() {
			$(".signinCard").show();
		}, 1800);
	});

	$("#loginbtn").on('click', function(e){
        if(passAndUserValidation()) {
        	$.ajax({
				type: 'POST',
				url: 'php/signin/confirm.php',
				data: { username: $('#user').val(), password: $('#passw').val() },
				dataType: 'json',
				async: true,
				success: function(data) {
					alert(data);
					if(!$.isEmptyObject(data)) {
						window.location.replace(data);
					}
				},
				fail: function() {
					alert('Failed to set language. Please contact administrator!');
				}
			});
        } else {
        	return false;
        }
    });

    $('#user, #passw').keypress(function(e) {
    	var enterKey = e.which;
    	if(enterKey == 13) {
    		$('#loginbtn').click();
    	}
    });

    // if ($('#errPrompt').html() == 'You have been signed out.' || $('#errPrompt').html() == 'サインアウトしました。') {
    if ($('#errPrompt').html() == 'You have been signed out.') {
    	$('#errPrompt').html('* ' + lang[local.lang].signin.prompt.signout);
    }
    else if ($('#errPrompt').html() == 'password') {
    	$('#errPrompt').html('* ' + lang[local.lang].signin.prompt.passerr);
    }
    else if ($('#errPrompt').html() == 'username') {
    	$('#errPrompt').html('* ' + lang[local.lang].signin.prompt.usererr);
    }

    $('#user').attr('placeholder', lang[local.lang].signin.uname);
    $('#passw').attr('placeholder', lang[local.lang].signin.passw);
});

function gotopage(page) {
	window.location.href = page;
}

/**
 * Username:
 * 5 to 16 characters in length
 * Can use upper case and lower case alphanumeric characters
 * Can use underscore, dash, and spaces, but can't use two in a row or begin or start the username with it. 
**/

function userValidation(elem) {
	// var re = /^(?![_ -])(?:(?![_ -]{2})[\w -]){5,16}(?<![_ -])$/;
	var re = /^(?![_ -])(?:(?![_ -]{2})[\w -]){5,16}$/;
	var retval = re.test($(elem).val());
	if($(elem).val().toLowerCase() != "admin") {
		if(retval) {
			$('#errPrompt').html('');
		} else {
			$('#errPrompt').html('* ' + text_compilation['erruser']);
			$('#errPrompt').css('display', 'block');
			// $('.cardFrame').removeClass('animated zoomIn shake');
			// setTimeout(function() {
			// 	$('.cardFrame').addClass('animated shake fast');
			// }, 100);
		}
	} else {
		$('#errPrompt').html('');
		retval = true;
	}
	return retval;
}

/**
 * Password:
 * 8 to 16 character in length
 * At least one special character " !"#$%&'()*+,-./:;<=>?@[]^_`{|}~" (opt)
 * At least one number (opt)
 * At least one upper case character (opt)
 * At least one lower case character (opt)
**/

function passValidation(elem) {
	var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,16})/gm; //full
	// var re = /^(?![_ -])(?:(?![_ -]{2})[\w -]){5,16}(?<![_ -])$/; //same as user
	var retval = re.test($(elem).val());
	if($(elem).val().toLowerCase() != "admin") {
		if(retval) {
			$('#errPrompt').html('');
		} else {
			$('#errPrompt').html('* ' + text_compilation['errpass']);
			$('#errPrompt').css('display', 'block');
			// $('.cardFrame').removeClass('animated zoomIn shake');
			// setTimeout(function() {
			// 	$('.cardFrame').addClass('animated shake fast');
			// }, 100);
		}
	} else {
		$('#errPrompt').html('');
		retval = true;
	}
	return retval;
}

function passAndUserValidation() {
	var retval = false;	
	const uservalid = userValidation($('#user'));
	const passvalid = passValidation($('#passw'));
	var errstring = '';
	
	if (!uservalid && !passvalid) {
		errstring = text_compilation['errboth'];
	}
	else if (!uservalid) {
		errstring = text_compilation['erruser'];
	}
	else if (!passvalid) {
		errstring = text_compilation['errpass'];
	}
	else {
		retval = true;
	}

	if (!retval) {
		$('#errPrompt').html('* ' + errstring);
		$('#errPrompt').css('display', 'block');
		// $('.cardFrame').removeClass('animated zoomIn shake');
		// setTimeout(function() {
		// 	$('.cardFrame').addClass('animated shake fast');
		// }, 100);
	}

	return retval;
}
