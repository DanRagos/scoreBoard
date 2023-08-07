var userPermissions = {
	'perm_1': 'JO Dashboard',
	'perm_2': 'Schedule',
	'perm_3': 'Rejects Remarks',
	'perm_4': 'Data Amendment',
	'perm_5': 'Admin Access',
};
var adminCtr = 0;

function newSystemHandler() {
	initUsers();

	$('.systemContent > div > span').eq(0).html( lang[flags.pref.lang].system.routename[0] );

	$('.systemContent input[data-toggle="popover"]').popover({
		trigger: 'manual'
	});

	if ($('#dnt-config-page').hasClass('active')) {
		getDateAndTime()
		getAllTimezone();
		query_start();
	}

	$('.accntpasswBtn').on('click', function() {
		const passInput = this;
		$(passInput).find('i').each(function() {
			const state = $(this).hasClass('fa-eye-slash');
			if (state) {
				$(this).removeClass('fa-eye-slash').addClass('fa-eye');
				// $(passInput).parent().parent().find('input[name="accntpassword"]').eq(0).attr('type', 'text');
				$('#addUserMngmtModal').find('.accntPassword').attr('type', 'text');
			} else {
				$(this).removeClass('fa-eye').addClass('fa-eye-slash');
				// $(passInput).parent().parent().find('input[name="accntpassword"]').eq(0).attr('type', 'password');
				$('#addUserMngmtModal').find('.accntPassword').attr('type', 'password');
			}
		});
	});

	$('.system-route').on('click', function(event) {
		$('.system-route').not(this).removeClass('active');
		var name = $(this).find('span').eq(0).text();
		$('.systemContent > div > span').eq(0).html(name);

		const buttonVal = {};
		buttonVal[lang[flags.pref.lang].system.routename[0]] = [ lang[flags.pref.lang].system.buttons.sync, lang[flags.pref.lang].system.buttons.save ];
		buttonVal[lang[flags.pref.lang].system.routename[1]] = [ '', lang[flags.pref.lang].system.buttons.applysave ];
		buttonVal[lang[flags.pref.lang].system.routename[2]] = [ lang[flags.pref.lang].system.buttons.addusr, lang[flags.pref.lang].system.buttons.delusr ];
		buttonVal[lang[flags.pref.lang].system.routename[3]] = [ lang[flags.pref.lang].system.buttons.save, lang[flags.pref.lang].system.buttons.delete ];
		buttonVal[lang[flags.pref.lang].system.routename[4]] = [];
		buttonVal[lang[flags.pref.lang].system.routename[5]] = [ '', lang[flags.pref.lang].system.buttons.apply ];
		// buttonVal[lang[flags.pref.lang].system.routename[5]] = [ lang[flags.pref.lang].system.buttons.activedev, lang[flags.pref.lang].system.buttons.removeddev ];

		try {
			if ($.isEmptyObject(buttonVal[name])) {
				$('.systemContent > div > .btn').hide();
			} else {
				$('.systemContent > div > .btn').each(function(i, event) {
					var val = buttonVal[name][i];
					if (val != '') {
						$(this).html(val).show();
					} else {
						$(this).hide();
					}
				});
			}

   			if (lang[flags.pref.lang].system.routename.indexOf(name) != 3) { // Cause Registration Tab
				$('.systemContent > .footer .hideable').css({
					'visibility': 'hidden',
				});
				// Hanz: Need to improve later because there is a css !important overriding this
				$('.systemContent > .footer').css({
					'display': 'none'
				});
			} else {
				$('.systemContent > .footer .hideable').css({
					'visibility': 'visible',
				});
				$('.systemContent > .footer').css({
					'display': ''
				});
			}

			if (flags.system.mobileView) {
				$('#drawerBtn > button').click();
			}

			$('.systemContent input[data-toggle="popover"]').popover('dispose');
			switch (name) {
				case lang[flags.pref.lang].system.routename[0]:
					flags.system.pageIndex = 1;
					getAllTimezone();
					query_start();
					break;

				case lang[flags.pref.lang].system.routename[1]:
					flags.system.pageIndex = 2;
					ethernetInfo('getInfo');
					break;

				case lang[flags.pref.lang].system.routename[2]:
					flags.system.pageIndex = 3;
					getUsers();
					break;

				case lang[flags.pref.lang].system.routename[3]:
					flags.system.pageIndex = 4;
					loadCauseRegPage();
					setSelectedCauseRegNum();
					break;

				case lang[flags.pref.lang].system.routename[4]:
					flags.system.pageIndex = 5;
					break;
				
				case lang[flags.pref.lang].system.routename[5]:
					flags.system.pageIndex = 6;
					$('#selDBMode').change();
					break;

				default:
					break;
			}
		} catch (e) {
			console.log(e);
		}
	});

	// DRAWER button, visible on small display
	$('#drawerBtn > button').on('click', function() {
		const state = $('#sideBtnContainer').hasClass('active');

		if (state) {
			$('#sideBtnContainer').removeClass('active');
			$('.systemContent').addClass('d-flex shrink').show();
			$(this).find('i').removeClass('fa-angle-double-left').addClass('fa-angle-double-right');
		} else {
			$('#sideBtnContainer').addClass('active');
			$('.systemContent').removeClass('d-flex shrink').hide();
			$(this).find('i').removeClass('fa-angle-double-right').addClass('fa-angle-double-left');
		}
	});

	// SAVE button
	$('#systemBtn-1').on('click', function() {
		var name = $(this).html();

		switch (name) {
			case lang[flags.pref.lang].system.buttons.sync:
				setDateTimeTz('sync');
				break;

			case lang[flags.pref.lang].system.buttons.addusr:
				clearUserCheckbox();
				clearAddNewUser();
				$('#addUserMngmtModal').modal('show');
				break;

			case lang[flags.pref.lang].system.buttons.save:
				updateCauseRegList(getAllCauseReg());
				break;

			case lang[flags.pref.lang].system.buttons.activedev:
				// List active devices for DB delete
				listActiveDevices();
				break;

			// case lang[flags.pref.lang].system.buttons.apply:
			// 	// DB process here
			// 	break;

			default:
				break;
		}
	});

	// DELETE button
	$('#systemBtn-2').on('click', function() {
		var name = $(this).html();

		switch (name) {
			case lang[flags.pref.lang].system.buttons.save:
				setDateTimeTz('manual');
				break;

			case lang[flags.pref.lang].system.buttons.applysave:
				ethernetInfo('set');
				break;

			case lang[flags.pref.lang].system.buttons.delusr:
				var items = getSelectedUserAccnt();
				if (items.length > 0) {
					Object.keys(items).map(function(idx) {
						deleteSelectedUserAccnt(items[idx].id);
					});
				}
				break;

			case lang[flags.pref.lang].system.buttons.delete:
				deleteSelectedCauseReg(getSelectedCauseReg());
				break;
			
			case lang[flags.pref.lang].system.buttons.removeddev:
				// List removed devices for DB delete
				listRemovedDevices();
				break;
			
			case lang[flags.pref.lang].system.buttons.apply:
				// DB process here
				deleteAllData();
				break;

			default:
				break;
		}
	});

	$('#causeReg-next').on('click', function() {
		flags.system.causeRegPage++;
		clearCauseRegistration();
		console.log(JSON.stringify(setSelectedCauseRegNum()));
	});

	$('#causeReg-prev').on('click', function() {
		if (flags.system.causeRegPage > 1) {
			flags.system.causeRegPage--;
		}
		clearCauseRegistration();
		console.log(JSON.stringify(setSelectedCauseRegNum()));
	});

	$('.checkBtn-user-master').on('change', function() {
		var state = $(this).prop('checked');
		$('.config-content input.checkBtn-user').each(function() {
			$(this).prop('checked', state);
		});
	});

	/* Note: Ayaw ni Engr. Santiago kaya tinanggal */
	// $('#perm_1, #perm_2, #perm_3, #perm_4, #perm_5').on('change', function() {
	// 	$(this).parent().find('label').html($(this).prop('checked') ? 'Enabled' : 'Disabled');
	// });

	$('#userMngmt-save').on('click', function() {
		var format = {
			'user': '',
			'pass': '',
			'fname': '',
			'perm_1': '',
			'perm_2': '',
			'perm_3': '',
			'perm_4': '',
			'perm_5': '',
		};

		// if ($('#addUserMngmtModal').find('.accntpasswBtn').hasClass(('fa-eye'));
		// $('.accntpasswBtn').click();

		var elem = $('#addUserMngmtModal div.modal-body');
		format.fname = elem.find('input[type=text]').eq(0).val();
		format.user = elem.find('input[type=text]').eq(1).val();

		var passes = [];
		// elem.find('input[type=password]').each(function() {
		elem.find('.accntPassword').each(function() {
			passes.push($(this).val());
		});
		format.pass = (passes[0] == passes[1] && passes.indexOf('') <= 0 ? passes[0] : '');

		format.perm_1 = $('#perm_1').prop('checked');
		format.perm_2 = $('#perm_2').prop('checked');
		format.perm_3 = $('#perm_3').prop('checked');
		format.perm_4 = $('#perm_4').prop('checked');
		format.perm_5 = $('#perm_5').prop('checked');

		if (!flags.system.userandpass[0] || !flags.system.userandpass[1] || format.pass == '') {
			var result = '';
			if (!flags.system.userandpass[0] && !flags.system.userandpass[1]) {
				result = lang[flags.pref.lang].system.usermngmt.prompts.addinvalid; //'Username and Password are invalid';
				$('.uname-error').show();
				$('.pass-error').show();
				$('.vpass-error').hide();
			} else if (!flags.system.userandpass[0]) {
				result = lang[flags.pref.lang].system.usermngmt.prompts.adduserinvalid; //'Username is invalid';
				$('.uname-error').show();
				$('.pass-error').hide();
				$('.vpass-error').hide();
			} else if (!flags.system.userandpass[1]) {
				result = lang[flags.pref.lang].system.usermngmt.prompts.addpassinvalid; //'Password is invalid';
				$('.pass-error').show();
				$('.uname-error').hide();
				$('.vpass-error').hide();
			}
			if (format.pass == '') {
				result += (result != '' ? ', ' : '') + lang[flags.pref.lang].system.usermngmt.prompts.addnotmatch;//'Password does not match';
				$('.pass-error').show();
				$('.vpass-error').show();
			}

			$('#addUserMngmtModal .error').html('<i>*' + result + '</i>');
			return;
		}

		$('#addUserMngmtModal').modal('hide');
		/* Submit data here */
		$.ajax({
			type: 'POST',
			url: 'php/config/addNewUser.php',
			data: format,
			dataType:'json',
			async: true,
			success: function(retData) {
				if (retData == 'success') {
					showPrompt(lang[flags.pref.lang].system.usermngmt.prompts.addsuccess, 'Success');
					getUsers();
				} else {
					showPrompt(lang[flags.pref.lang].system.usermngmt.prompts.addfail, 'Failed');
				}
			},
			fail: function(errThrown) {
				console.log('Failed: ' + errThrown);
			}
		});
	});
	
	$('#causeReg-1 input.causeReg-all').on('change', function() {
		const state = $(this).prop('checked');
		$('#causeReg-1 div:not(:first-child) input[type=checkbox]').each(function() {
			$(this).prop('checked', state);
		});
	});

	$('#causeReg-2 input.causeReg-all').on('change', function() {
		const state = $(this).prop('checked');
		$('#causeReg-2 div:not(:first-child) input[type=checkbox]').each(function() {
			$(this).prop('checked', state);
		});
	});

	$('#selDBMode').on('change', function () {
        var dbMode = $('#selDBMode option:selected').text();
		var dbModeval = $('#selDBMode option:selected').val();
        console.log(dbMode);
		console.log(dbModeval);
		getDBMemSpace();
		/**Au: Do something with the DB Mgmt mode here */
		var selDate = document.getElementById("selDateRange");
		switch (dbModeval) {
			case "optimize":
				selDate.style.display = "none";
				$('#systemBtn-2').html(lang[flags.pref.lang].system.buttons.apply);
				$('#systemBtn-1').hide();
            	// $('#systemBtn-2').html(lang[flags.pref.lang].system.buttons.cancel);
				break;
			case "partial":
				selDate.style.display = "flex";
				$('#systemBtn-1').html(lang[flags.pref.lang].system.buttons.activedev);
            	$('#systemBtn-2').html(lang[flags.pref.lang].system.buttons.removeddev);
				$('#systemBtn-1').show();
				break;
			case "full":
				selDate.style.display = "none";
				$('#systemBtn-2').html(lang[flags.pref.lang].system.buttons.apply);
				$('#systemBtn-1').hide();
            	// $('#systemBtn-2').html(lang[flags.pref.lang].system.buttons.cancel);
				break;
			default:
				break;
		}
	});
	
	
	// window.addEventListener('resize', function() {
	// 	checkIfMobileScreen();
	// });

	checkIfMobileScreen();
}

function checkIfMobileScreen() {
	if (document.documentElement.clientWidth < 450) {
		flags.system.mobileView = true;
		$('#sideBtnContainer').removeClass('active');
		$('.systemContent').addClass('d-flex shrink').show();
		$('#drawerBtn > button > i').removeClass('fa-angle-double-left').addClass('fa-angle-double-right');

		mobileTableChild('mobile');
	} else if (document.documentElement.clientWidth > 450) {
		flags.system.mobileView = false;
		if(!$('#sideBtnContainer').hasClass('active')) {
			$('#sideBtnContainer').addClass('active');
			$('.systemContent').removeClass('shrink').show();
			$('#drawerBtn > button > i').removeClass('fa-angle-double-right').addClass('fa-angle-double-left');
		}

		if (document.documentElement.clientWidth > 768) {
			mobileTableChild('desktop');
		} else {
			mobileTableChild('mobile');
		}
	}
}

function getDateAndTime() {
	$.ajax({
		type: 'POST',
		url: 'php/config/getDateAndTime.php',
		data: {},
		dataType:'json',
		async: true,
		success: function(retData) {
			$('#serverdnt').val(retData.dnt);
			flags.system.currentTz = retData.tz;
		},
		fail: function(errThrown) {
			console.log('Failed: ' + errThrown);
		}
	});
}

function getAllTimezone() {
	$.ajax({
		type: 'POST',
		url: 'php/config/tzList.php',
		data: {},
		dataType:'json',
		async: true,
		success: function(retData) {
			if(retData.length != 0) {
				$('#tzList').html(retData);
				$('#tzList').val(flags.system.currentTz);
			}
		},
		fail: function(errThrown) {
			console.log('Failed: ' + errThrown);
		}
	});
}

function setDateTimeTz(type) {
	var tz = $('#tzList').val();
	var dt = $('#inputdt').val();
	var nw = new Date($.now());
	var ndt = nw.getFullYear() + "-" + (nw.getMonth() + 1) + "-" + (nw.getDate() < 10 ? '0' + nw.getDate() : nw.getDate()) + " ";
	ndt += nw.getHours() + ":" + nw.getMinutes() + ":" + nw.getSeconds();

	$.ajax({
		type: 'POST',
		url: 'php/config/setDateTimeTz.php',
		data: { curr: ndt, date: dt, timezone: tz, mode: type },
		dataType:'json',
		async: true,
		success: function(retData) {
			if(retData == 'success') {
				$('#inputdt').val("YYYY-MM-DD hh:mm:ss");
			  	showPrompt(lang[flags.pref.lang].system.dtprompt.success, 'Success');
			} else {
			  	showPrompt(lang[flags.pref.lang].system.dtprompt.failed, 'Failed');
			}
		},
		fail: function(errThrown) {
			console.log('Failed: ' + errThrown);
		}
	});
}

function getSystemInfo() {
	$.ajax({
		type: 'POST',
		url: 'php/readInfoFile.php',
		data: {},
		dataType:'json',
		async: true,
		success: function(retData) {
			if(retData.isValid) {
				$('#sysInfoPN').val(retData.name);
				$('#sysInfoPC').val(retData.category);
				$('#sysInfoOS').val(retData.version);
				$('#sysInfoLG').val(retData.lang);
				$('#sysInfoFW').val(retData.fw);
				$('#sysInfoUP').val(retData.uptime);
				$('#sysInfoLB').val(retData.boot);
			}
		},
		fail: function(errThrown) {
			console.log('Failed: ' + errThrown);
		}
	});
}

function ethernetInfo(cmd) {
	var ipset = $('#selIpMode').val();
	var ipaddr = '';
	var ipgw = '';

	if(ipset == 'static' && cmd != 'getInfo') {
		ipaddr = $('#srvIP').val();
		ipgw = $('#srvGW').val();
	}

	$.ajax({
		type: 'POST',
		url: 'php/config/getEthernetInfo.php',
		data: { 
			command: cmd,
			mode: ipset,
			ip: ipaddr,
			gate: ipgw
		},
		dataType:'json',
		async: true,
		success: function(retData) {
			if (retData !== null) {
				if (typeof retData === 'object') {
					$('#selIpMode').off().on('change', (state) => {
						$('#srvIP').attr('readonly', $('#selIpMode').val() == 'dhcp' ? true : false);
						$('#srvGW').attr('readonly', $('#selIpMode').val() == 'dhcp' ? true : false);
					});

					$('#selIpMode').val(retData.mode);
					$('#srvIP').val(retData.ip);
					$('#srvGW').val(retData.gw);
					$('#selIpMode').trigger('change');
				} else {
					showPrompt(lang[flags.pref.lang].system.ipfail, 'Error');
					$('#systemBtn-2').attr('disabled', true);
				}
			}
		},
		fail: function(errThrown) {
			console.log('Failed: ' + errThrown);
		}
	});

	if(cmd == 'set') {
		showPrompt(lang[flags.pref.lang].system.netprompt, 'Success');
	}
}

/*
 * Users Management page
 */
function initUsers() {
	if($.isEmptyObject(flags.system.table)) {
		flags.system.table = $('#usrMngmt').DataTable({
			"lengthChange": false,
			"language": {
			    "paginate": {
			      "previous": lang[flags.pref.lang].general.datatable.prev,
			      "next": lang[flags.pref.lang].general.datatable.next,
			    },
			    "info": lang[flags.pref.lang].general.datatable.info,
			    "emptyTable": lang[flags.pref.lang].general.datatable.empty,
			    "infoEmpty": lang[flags.pref.lang].general.datatable.infoempty,
			    "search": lang[flags.pref.lang].general.datatable.search,
			},
			"stateSave": true,
			"columnDefs": [
				// { "orderable": false, "targets": [0], "checkboxes": {'selectrow' : true } },
				{ "orderable": false, "targets": [0, 2, 3] },
		        { "type": 'natural', "targets": [1] },
		    ],
			// "select": {
			// 	"style":    'multi',
			// 	"selector": 'td:first-child'
			// },
		    'order': [
		    	[1, 'asc']
		    ],
		    'columns': [
		    	{ data: "perm_2",
		    		render: function(data, type, row) {
						return '<input class="checkBtn-user" name="user" type="checkbox" ' + (row.perm1 == '1' ? 'checked' : '') + '/>';
					}
		    	},
				{ data: "user",
					render: function(data, type, row) {
						return '<input class="usrMngmt-userInput text-center" type="text" data-toggle="popover" data-placement="left" data-content="' + lang[flags.pref.lang].system.usermngmt.prompts.invaliduser + '" value="' + data + '"/>';
					}
				},
				{ data: "pass",
					render: function(data, type, row) {
						return '<input class="usrMngmt-passInput text-center" type="text" data-toggle="popover" data-placement="left" data-content="' + lang[flags.pref.lang].system.usermngmt.prompts.invalidpass + '" value="' + data + '"/>';
					}
				},
				{ data: "perm_1",
					render: function(data, type, row) {
						/** JO Dashboard, Schedule, Reject Remarks, Data Amendment, Admin Access */
						var dataName = [ userPermissions.perm_1, userPermissions.perm_2, userPermissions.perm_3, userPermissions.perm_4, userPermissions.perm_5 ];
						var dataPerm = [ row.perm_1, row.perm_2, row.perm_3, row.perm_4, row.perm_5 ];
						var elemName = [ 'perm_1', 'perm_2', 'perm_3', 'perm_4', 'perm_5' ];
						var retVal = '';
						for (var i = 0; i < dataName.length; i++) {
							/** Gold: LSJ disable permissions 03012023 */
							retVal += '<input type="checkbox" onchange="setUserPermission(this)" name="' + elemName[i] + '" ' + (dataPerm[i] == '1' ? 'checked' : '') + ' disabled />&nbsp;<span>' + dataName[i] + '</span>&nbsp;&nbsp;&nbsp;';
						}
						return retVal;
					}
				},
			],
			"destroy": true,
			"scrollX": true,
			"scrollCollapse": true,
			"bFilter": false, // disable Search
			// "bInfo": false,
		});

		$('body').on('click', '#usrMngmt td:nth-child(1) .checkBtn-user', function (e) {
			console.log('System Management row checkbox clicked!');
			var numChecked = $(this).find('input[name="user"]:checked').length;
			var numCheckbox = $(this).find('input[name="user"]').length;
			console.log(numCheckbox);
			console.log(numChecked);
			if (numChecked == numCheckbox - 1) {
				console.log ("this is not allowed!")
			} else {
				$(this).parent('td').trigger('click');
			}
			// $(this).parent('td').trigger('click');
		});

		flags.system.table.on('draw', function() {
			console.log('systems table draw');
		});

		/***************Hanz: Bug #27 (generic list) fix or http-1201 bug #26 fix*************/
		flags.system.table.on('preDraw', function() {
			console.log("System table pre-draw!");

			if (!$.isEmptyObject(flags.system.table))
			{
				if ($('#usrMngmt tr.child').length != 0)
				{
					// If a child row is currently displayed, do not update number of rows display.
					// Let the y-scroll do its thing.
					return;
				}

				// var available_height = 	$('.systemContent').outerHeight() -
				// 						$('.systemContent>div').eq(0).outerHeight() -
				// 						$('#usrMngmt_filter').outerHeight() -
				// 						$('#usr-config-page .dataTables_scrollHead').outerHeight() -
                //                         $('#usrMngmt_info').outerHeight() -
				// 						$('#usrMngmt_paginate').outerHeight();

				var available_height = 	$('.systemContent').outerHeight() -
										$('.systemContent>div').eq(0).outerHeight() -
										$('#usrMngmt_filter').outerHeight() -
										$('#usr-config-page .dataTables_scrollHead').outerHeight() -
                                        $('#usrMngmt_info').outerHeight();

				if (flags.system.table.responsive.hasHidden())
				// if ($('body').width() < 461)
				{
					/* This evaluates to true if datatable extra button (+) is present
					because responsive plug in will show the extra button whenever
					there are hidden columns. This is better than using experimentally 
					determined pixel widths because breakpt for hiding of + button
					is also affected by long values (job order names example) or changing
					font size in the future).*/
					var no_of_rows = Math.trunc(available_height/39) - 1;
				}
				else
				{
					var no_of_rows = Math.trunc(available_height/39) - 1;
				}
				console.log(`Can fit this number of rows:${no_of_rows}`);
				if (no_of_rows > 4)
				{
					flags.system.table.page.len(no_of_rows);
				}
				else
				{
					flags.system.table.page.len(5);
				}
				if (flags.currPage != 'date-tab')
				{
					// No need to redraw if user is not at schedule page anyway.
					return false;
				}
			}
		});
		/*************************************************************************************/
	}
}

function getUsers() {
	var example;
	adminCtr = 0;
	flags.ajaxRequestStatus = $.ajax({
		type: 'POST',
		url: 'php/config/viewAccount.php',
		data: {},
		dataType:'json',
		async: true,
		success: function(retData) {
			/** disable delete button if there is only 1 user account */
			retData.forEach((data) => {
				if (data.perm_5 == "1") {
					adminCtr++;
				}
			});
			console.log(adminCtr);
			if (retData.length == 1) {
				$('#systemBtn-2').prop('disabled', true);
			} else {
				$('#systemBtn-2').prop('disabled', false);
			}
			example = retData;
			flags.ajaxRequestStatus = null;

			setTimeout(function() {
				showTableLoading();
				if ($.isEmptyObject(flags.system.table)) {
					initUsers();
				}
				flags.system.table.clear().rows.add(example).draw(false);

				//  $('.config-content input.usrMngmt-userInput').off().on('change', function() {
				// 	var idx = $(this).parent().parent();
				// 	var parentId = '#' + idx[0].id;
				// 	// alert('ID: ' + parentId + ' New data: ' + $(this).val());

				// 	/* IMPORTANT! : Add validation before update */
				// 	userValidation(parentId.split('userM_')[1], this);
				// }).on('click', function() {
				// 	flags.system.prevUserInput = $(this).val();
				// });

				// // $('.config-content input.usrMngmt-passInput').off().on('change', function() {
				// $('#usrMngmt').off().on('change', '.usrMngmt-passInput', function() {
				// 	var idx = $(this).parent().parent();
				// 	var parentId = '#' + idx[0].id;
				// 	// alert('ID: ' + parentId + ' New data: ' + $(this).val());

				// 	/* IMPORTANT! : Add validation before update */
				// 	passValidation(parentId.split('userM_')[1], this);
				// }).on('click', '.usrMngmt-passInput', function() {
				// 	flags.system.prevPassInput = $(this).val();
				// });

				$('#usrMngmt').off().on('change', 'td', function() {
					var idx = $(this).parent();
					var parentId = '#' + idx[0].id;
					console.log(parentId);
					// alert('ID: ' + parentId + ' New data: ' + $(this).val());
					var inputElem = $(this).find('input');
					// console.log(inputElem);
					if (inputElem.hasClass('usrMngmt-userInput')) {
						console.log('User Input Clicked!');
						userValidation(parentId.split('userM_')[1], inputElem);
					} else if (inputElem.hasClass('usrMngmt-passInput')) {
						console.log('Password Input Clicked!');
						passValidation(parentId.split('userM_')[1], inputElem);
					} else {
						console.log("ANO YUN?");
					}
				}).on('click', 'td', function() {
					var inputElem = $(this).find('input');
					if (inputElem.hasClass('usrMngmt-userInput')) {
						flags.system.prevUserInput = inputElem.val();
					} else if (inputElem.hasClass('usrMngmt-passInput')) {
						flags.system.prevPassInput = inputElem.val();
					}
				});

			}, 200);
		},
		fail: function(errThrown) {
			console.log('Failed: ' + errThrown);
			if(flags.ajaxRequestStatus !== null) {
				flags.ajaxRequestStatus.abort();
				flags.ajaxRequestStatus = null;
			}
		}
	});

	// setTimeout(function() {
	// 	showTableLoading();
	// 	if ($.isEmptyObject(flags.system.table)) {
	// 		initUsers();
	// 	}
	// 	flags.system.table.clear().rows.add(example).draw(false);

	// 	$('.config-content input.usrMngmt-userInput').off().on('change', function() {
	// 		var idx = $(this).parent().parent();
	// 		var parentId = '#' + idx[0].id;
	// 		// alert('ID: ' + parentId + ' New data: ' + $(this).val());

	// 		/* IMPORTANT! : Add validation before update */
	// 		userValidation(parentId.split('userM_')[1], this);
	// 	}).on('click', function() {
	// 		flags.system.prevUserInput = $(this).val();
	// 	});

	// 	$('.config-content input.usrMngmt-passInput').off().on('change', function() {
	// 		var idx = $(this).parent().parent();
	// 		var parentId = '#' + idx[0].id;
	// 		// alert('ID: ' + parentId + ' New data: ' + $(this).val());

	// 		/* IMPORTANT! : Add validation before update */
	// 		passValidation(parentId.split('userM_')[1], this);
	// 	}).on('click', function() {
	// 		flags.system.prevPassInput = $(this).val();
	// 	});
	// }, 500);
}

function getSelectedUserAccnt() {
	var items = [];
	var admin = [];
	var checkedUsers = [];
	var userTable = flags.system.table;
	var checkedCtr = 0;

	var count = userTable.data().count();
	var recordCnt = userTable.page.info().recordsTotal;
	console.log("count " + count);
	console.log("record count " + recordCnt);

	var rowcollection = userTable.$(".checkBtn-user:checked", {"page": "all"});
	rowcollection.each(function(index,elem){
		var trId = $(elem).closest('tr').attr('id');
		console.log(trId);
		checkedUsers.push(trId);
		var parentId = '#' + trId;
		var data = flags.system.table.row(parentId).data();
		if (data.perm_5 == "1") {
			admin.push(data);
		} else {
			items.push(data);
		}
		checkedCtr++;
	});

	if ((checkedCtr < recordCnt)) {
		if (admin.length < adminCtr) {
			items.push.apply(items, admin);
		} else {
			console.log ("You are not allowed to delete all admin accounts. Duh!!");
			showPrompt(lang[flags.pref.lang].system.usermngmt.prompts.donotdeletealladmin, 'Failed');
			items = [];
		}
	} else {
		console.log ("You are not allowed to delete all user accounts! HALER!!")
		showPrompt(lang[flags.pref.lang].system.usermngmt.prompts.donotdeleteall, 'Failed');
		items = [];
	}
	console.log("items length: " + items.length);
	console.log("sel admin: " + admin.length);
	console.log("sel checkbox: " + checkedUsers.length);
	console.log(items);
	return items;
}

// function getSelectedUserAccnt() {
// 	var items = [];
// 	var admin = [];
// 	$('.config-content input.checkBtn-user').each(function() {
// 		var idx = $(this).parent().parent();
// 		var parentId = '#' + idx[0].id;
// 		var data = flags.system.table.row(parentId).data();
// 		var selected = $(this).prop('checked');
// 		if (selected) {	
// 			items.push(data);
// 		}
// 	});
// 	console.log(items);
// 	return items;
// }

function deleteSelectedUserAccnt(id) {
	flags.ajaxRequestStatus = $.ajax({
		type: 'POST',
		url: 'php/config/deleteAccount.php',
		data: { 'id': id },
		dataType:'json',
		async: true,
		success: function(retData) {
			showPrompt(lang[flags.pref.lang].system.usermngmt.prompts.delete, 'Success');
			flags.ajaxRequestStatus = null;
			getUsers();
		},
		fail: function(errThrown) {
			console.log('Failed: ' + errThrown);
			if(flags.ajaxRequestStatus !== null) {
				flags.ajaxRequestStatus.abort();
				flags.ajaxRequestStatus = null;
			}
		}
	});
}

function clearAddNewUser() {
	var elem = $('#addUserMngmtModal div.modal-body');
	elem.find('input[type=text]').each(function() {
		$(this).val('');
	});

	elem.find('input[type=password]').each(function() {
		$(this).val('');
	});

	elem.find('input[type=checkbox]').each(function() {
		$(this).prop('checked', false);
	});

	$('#addUserMngmtModal .error').html('');
	$('.uname-error').hide();
	$('.pass-error').hide();
	$('.vpass-error').hide();

	flags.system.userandpass = [0, 0];
}

function clearUserCheckbox() {
	// var elem = $('#usrMngmt tbody');
	// elem.find('input[type=checkbox]').each(function() {
	// // elem.find('.checkBtn-user').each(function() { 
	// 	$(this).prop('checked', false);
	// });
	var userTable = flags.system.table;
	var rowcollection = userTable.$(".checkBtn-user:checked", {"page": "all"});
	rowcollection.each(function(index,elem){
		$(elem).prop('checked', false);
	});
}

function setUserPermission(elem) {
	var idx = $(elem).parent().parent();
	var elemId;

	if ($(idx[0]).is('li')) {
		idx = $(elem).parent().parent().parent().parent().parent();
		elemId = idx[0].previousSibling.id;
	} else {
		elemId = idx[0].id;
	}

	var parentId = '#' + elemId;

	/* Update data here */
	const id = parentId.split('userM_')[1];
	// console.log('ID: ' + id + ' Perm: ' + elem.name + ' New data: ' + $(elem).prop('checked'));

	flags.ajaxRequestStatus = $.ajax({
		type: 'POST',
		url: 'php/config/setUserPermissions.php',
		data: { 'id': id, 'perm': elem.name, 'state': $(elem).prop('checked') },
		dataType:'json',
		async: true,
		success: function(retData) {
			flags.ajaxRequestStatus = null;
			getUsers();
		},
		fail: function(errThrown) {
			console.log('Failed: ' + errThrown);
			if(flags.ajaxRequestStatus !== null) {
				flags.ajaxRequestStatus.abort();
				flags.ajaxRequestStatus = null;
			}
		}
	});
}

function mobileTableChild(type) {
	var elem = $('#usrMngmt .dtr-data');
	elem.each(function() {
		var that = this;
		if (type === 'mobile') {
			var hasNL = $(that).hasClass('active');
			$(this).find('input').each(function() {
				if (!hasNL) {
					$(that).addClass('active')
					$(this).before('<br>');
				}
			});
		} else {
			$(that).removeClass('active');
			$(this).find('br').each(function() {
				$(this).remove();
			});
		}
	});
}

/**
 * Username:
 * 5 to 16 characters in length
 * Can use upper case and lower case alphanumeric characters
 * Can use underscore, dash, and spaces, but can't use two in a row or begin or end the username with it. 
**/
function userValidation(id, elem, isEventType=false) {
	// var re = /^(?![_ -])(?:(?![_ -]{2})[\w -]){5,16}(?<![_ -])$/;
	// var re = /^(?![_ -])(?:(?![_ -]{2})[\w -]){5,16}$/;
	var re = /^(?![_ -])(?!.*?[^\na-z0-9]{2})(?=.[\w -]{4,15}$).*?[a-z0-9]$/gmi;
	var retval = re.test($(elem).val());

	if (isEventType) {
		if (!retval) {
			flags.system.userandpass[0] = false;
			$('.uname-error').show();
		} else {
			flags.system.userandpass[0] = true;
			$('.uname-error').hide();
		}
		return;
	}

	if (retval) {
		flags.ajaxRequestStatus = $.ajax({
			type: 'POST',
			url: 'php/config/updateUserAndPass.php',
			data: { 'id': id, 'type': 'username', 'value': $(elem).val() },
			dataType:'json',
			async: true,
			success: function(retData) {
				flags.ajaxRequestStatus = null;
				$('.systemContent input[data-toggle="popover"]').popover('dispose');
				getUsers();
			},
			fail: function(errThrown) {
				console.log('Failed: ' + errThrown);
				if(flags.ajaxRequestStatus !== null) {
					flags.ajaxRequestStatus.abort();
					flags.ajaxRequestStatus = null;
				}
			}
		});
	} else {
		// $('.systemContent input[data-toggle="popover"]').popover('dispose');
		$('#usrMngmt input[data-toggle="popover"]').popover('dispose');
		$(elem).popover('show');
		$(elem).val(flags.system.prevUserInput);
		setTimeout (function() {
			// $('.systemContent input[data-toggle="popover"]').popover('dispose');
			$('#usrMngmt input[data-toggle="popover"]').popover('dispose');
		}, 3000);
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
function passValidation(id, elem, isEventType=false) {
	// var re = /^(?![_ -])(?:(?![_ -]{2})[\w -]){5,16}(?<![_ -])$/; //same as user
	// var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,16})$/gim; //full  
	// var re = /^[a-zA-Z0-9](?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?!.*?[^\na-zA-Z0-9]{2})(?=.{7,15}$).*?[a-zA-Z0-9]$/gm; //GOLD accepts all character
	// // GOLD: at least 1 uppercase, 1 lowercase, 1 number, 1 spec. char [@#$%^&+!=_-], spec. character cannot appear twice in a row, cannot appear at the end of the string
	// var re = /(?=[A-Za-z0-9@#$%^&+!=_-]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=_-])(?!.*?[^\na-zA-Z0-9]{2})(?=.{8,16}$).*?[a-zA-Z0-9]$/gm;

	// GOLD: at least 1 uppercase, 1 lowercase, 1 number, 1 spec. char [@#$%^&+!=_-], spec. character cannot appear twice in a row, cannot appear at the start & end of the string
	var re = /^(?![@#$%^&+!=_-])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=_-])(?!.*?[^\na-zA-Z0-9]{2})(?=.[\w @#$%^&+!=_-]{7,15}$).*?[a-zA-Z0-9]$/gm;
	var retval = re.test($(elem).val());

	if (isEventType) {
		if (!retval) {
			flags.system.userandpass[1] = false;
			$('.pass-error').show();
		} else {
			flags.system.userandpass[1] = true;
			$('.pass-error').hide();
		}
		return;
	}

	if (retval) {
		flags.ajaxRequestStatus = $.ajax({
			type: 'POST',
			url: 'php/config/updateUserAndPass.php',
			data: { 'id': id, 'type': 'password', 'value': $(elem).val() },
			dataType:'json',
			async: true,
			success: function(retData) {
				flags.ajaxRequestStatus = null;
				$('.systemContent input[data-toggle="popover"]').popover('dispose');
				getUsers();
				// var table = flags.system.table;
				// table.draw( false );
			},
			fail: function(errThrown) {
				console.log('Failed: ' + errThrown);
				if(flags.ajaxRequestStatus !== null) {
					flags.ajaxRequestStatus.abort();
					flags.ajaxRequestStatus = null;
				}
			}
		});
	} else {
		// $('.systemContent input[data-toggle="popover"]').popover('dispose');
		$('#usrMngmt input[data-toggle="popover"]').popover('dispose');
		$(elem).popover('show');
		$(elem).val(flags.system.prevPassInput);
		setTimeout (function() {
			// $('.systemContent input[data-toggle="popover"]').popover('dispose');
			$('#usrMngmt input[data-toggle="popover"]').popover('dispose');
		}, 3000);
	}

	return retval;
}

/* 
 * Cause Registration page 
 */
function getSelectedCauseReg() {
	var items = [];

	$('#causeReg-1 > div').not(':first-child').each(function() {
		var format = {
			'id': '',
			'cause': ''
		};
		$(this).find('input, .causeReg-span').each(function() {
			var isForm = $(this).parent().is('form');
			var justNumber = $(this).parent().hasClass('flex-row');

			if (justNumber) {
				format.id = $(this).text();
			} else {
				if (isForm) {
					format.cause = $(this).val();
					items.push(format);
				} else {
					if (!$(this).prop('checked')) {
						return false;
					}
				}
			}
		});

	});

	if (!flags.system.mobileView) {
		$('#causeReg-2 > div').not(':first-child').each(function() {
			var format = {
				'id': '',
				'cause': ''
			};
			$(this).find('input, .causeReg-span').each(function() {
				var isForm = $(this).parent().is('form');
				var justNumber = $(this).parent().hasClass('flex-row');

				if (justNumber) {
					format.id = $(this).html();
				} else {
					if (isForm) {
						format.cause = $(this).val();
						items.push(format);
					} else {
						if (!$(this).prop('checked')) {
							return false;
						}
					}
				}
			});

		});
	}

	console.log(JSON.stringify(items));
	return items;
}

function getAllCauseReg() {
	var items = [];

	$('#causeReg-1 > div').not(':first-child').each(function() {
		var format = {
			'id': '',
			'cause': ''
		};
		$(this).find('input, .causeReg-span').each(function() {
			var isForm = $(this).parent().is('form');
			var justNumber = $(this).parent().hasClass('flex-row');

			if (justNumber) {
				format.id = $(this).text();
			} else {
				if (isForm) {
					format.cause = $(this).val();
					if (format.cause == '' || format.cause === undefined) {
						return false;
					}
					items.push(format);
				}
			}
		});

	});

	if (!flags.system.mobileView) {
		$('#causeReg-2 > div').not(':first-child').each(function() {
			var format = {
				'id': '',
				'cause': ''
			};
			$(this).find('input, .causeReg-span').each(function() {
				var isForm = $(this).parent().is('form');
				var justNumber = $(this).parent().hasClass('flex-row');

				if (justNumber) {
					format.id = $(this).html();
				} else {
					if (isForm) {
						format.cause = $(this).val();
						if (format.cause == '' || format.cause === undefined) {
							return false;
						}
						items.push(format);
					}
				}
			});

		});
	}

	console.log(JSON.stringify(items));
	return items;
}

function clearCauseRegistration() {
	loadCauseRegPage();
	$('#causeReg-1 > div, #causeReg-2 > div').not(':first-child').find('form').each(function() {
		$(this).find('input').val('');
	});

	$('#causeReg-1 > div, #causeReg-2 > div').not(':first-child').find('input[type=checkbox]').each(function() {
		$(this).prop('checked', false);
	});

	$('#causeReg-1 input.causeReg-all').prop('checked', false);
	$('#causeReg-2 input.causeReg-all').prop('checked', false);
}

function deleteSelectedCauseReg(items) {
	if (items.length > 0) {
		flags.ajaxRequestStatus = $.ajax({
			type: 'POST',
			url: 'php/config/deleteCauseReg.php',
			data: { 'ids': JSON.stringify(items) },
			dataType:'json',
			async: true,
			success: function(retData) {
				showPrompt(lang[flags.pref.lang].system.causereg.prompts.delete, 'Success');
				clearCauseRegistration();
				setSelectedCauseRegNum();
				flags.ajaxRequestStatus = null;
			},
			fail: function(errThrown) {
				console.log('Failed: ' + errThrown);
				if(flags.ajaxRequestStatus !== null) {
					flags.ajaxRequestStatus.abort();
					flags.ajaxRequestStatus = null;
				}
				showPrompt('Network problem encountered, please try again.', 'Error');
			}
		});
	} else {
		// display error for no selected cause to delete
		// showPrompt('Network problem encountered, please try again.', 'Error');
		showPrompt(lang[flags.pref.lang].system.causereg.prompts.seldelete, 'Failed');
	}

}

function setSelectedCauseRegNum() {
	flags.ajaxRequestStatus = $.ajax({
		type: 'POST',
		url: 'php/getUnproductiveList.php',
		data: {},
		dataType:'json',
		async: true,
		success: function(retData) {
			assignCauseReg(retData);
			flags.ajaxRequestStatus = null;
		},
		fail: function(errThrown) {
			console.log('Failed: ' + errThrown);
			if(flags.ajaxRequestStatus !== null) {
				flags.ajaxRequestStatus.abort();
				flags.ajaxRequestStatus = null;
			}
			showPrompt('Network problem encountered, please try again.', 'Error');
		}
	});
}

function loadCauseRegPage() {
	var pageRef = flags.system.causeRegPage;
	var cnt = pageRef * (flags.system.mobileView ? 10 : 20);

	if (flags.system.mobileView) {
		$('#causeReg-next').show();
		$('#causeReg-prev').show();
		if (cnt >= 20){
			// disable next button
			$('#causeReg-next').attr('disabled', true);
		} else {
			$('#causeReg-next').attr('disabled', false);
		}
	} else {
		$('#causeReg-next').hide();
		$('#causeReg-prev').hide();
	}

	// if (cnt >= 20){
	// 	// disable next button
	// 	$('#causeReg-next').attr('disabled', true);
	// } else {
	// 	$('#causeReg-next').attr('disabled', false);
	// }
	
}

function assignCauseReg(cause) {
	var pageRef = flags.system.causeRegPage - 1;
	var items = [];
	var offset = pageRef * (flags.system.mobileView ? 10 : 20);
	var cnt = offset;

	loadCauseRegPage();

	$('#causeReg-1 > div').not(':first-child').each(function() {
		cnt++;
		var span = $(this).find('.causeReg-span').eq(0);
		// var checkbox = span[0].previousElementSibling.firstElementChild;
		var input = span[0].nextElementSibling.firstElementChild;

		var val = cause.find(item => parseInt(item.dtuid) === cnt);
		$(span).html(cnt);
		$(input).val($.isEmptyObject(val) ? '' : val.dtucs);
	});

	if (!flags.system.mobileView) {
		var cnt = offset + 10;
		$('#causeReg-2 > div').not(':first-child').each(function() {
			cnt++;
			var span = $(this).find('.causeReg-span').eq(0);
			// var checkbox = span[0].previousElementSibling.firstElementChild;
			var input = span[0].nextElementSibling.firstElementChild;

			var val = cause.find(item => parseInt(item.dtuid) === cnt);
			$(span).html(cnt);
			$(input).val($.isEmptyObject(val) ? '' : val.dtucs);
		});
	}

	return { min: offset + 1, max: flags.system.mobileView ? offset + 10 : offset + 20 };
}

function updateCauseRegList(causeList) {
	if ($.isEmptyObject(causeList)) {
		return;
	}

	flags.ajaxRequestStatus = $.ajax({
		type: 'POST',
		url: 'php/config/updateCauseList.php',
		// data: { 'id': id, 'cause': val },
		data: { 'data': causeList },
		dataType: 'json',
		async: true,
		success: function(retData) {
			// if (retData == 'updated') {
			// 	showPrompt('Cause List was updated successfully!', 'Success');
			// } else if (retData == 'added') {
			// 	showPrompt('Cause List was added successfully!', 'Success');
			if (!$.isEmptyObject(retData)) {
				if (retData.result == 'updated') {
					showPrompt(lang[flags.pref.lang].system.causereg.prompts.regsuccess + `<br><br>${lang[flags.pref.lang].general.result}:<br><span class="text-success">${lang[flags.pref.lang].general.successlbl}${flags.pref.lang == 'jp' ? '&nbsp;&nbsp;&nbsp;&nbsp;' : '' }</span>: ` + retData.success + `<br><span class="text-danger">${lang[flags.pref.lang].general.error}&nbsp;&nbsp;&nbsp;&nbsp;</span>: ` + retData.fail, 'Success');
				} else {
					showPrompt(lang[flags.pref.lang].system.causereg.prompts.regfail, 'Failed');
				}
			} else {
				showPrompt(lang[flags.pref.lang].system.causereg.prompts.regfail, 'Failed');
			}
			flags.ajaxRequestStatus = null;
			setSelectedCauseRegNum();
		},
		fail: function(errThrown) {
			console.log('Failed: ' + errThrown);
			if(flags.ajaxRequestStatus !== null) {
				flags.ajaxRequestStatus.abort();
				flags.ajaxRequestStatus = null;
			}
		}
	});
}

var delRecordsCtr = 0;

function listActiveDevices() {
	console.log ("listActiveDevices");
	// check daterange if available
	let frVal;
    let toVal;
	frVal = $('#dbm-from input').eq(0).val();
    toVal = $('#dbm-to input').eq(0).val();
	console.log (frVal, toVal);
	if (Date.parse(frVal) > Date.parse(toVal)) {
		showPrompt(lang[flags.pref.lang].general.datepicker.invalid, 'error');
		return;
	}

	delRecordsCtr = 0;
	$.ajax({
		type: 'POST',
		url: 'php/jogetdevices.php',
		data: {},
		dataType:'json',
		async: true,
		success: function(retData) {
			$('#activeDevModal label.title').html(lang[flags.pref.lang].system.devicelist.activedevtitle);
			$('#activeDevModal .modal-body > h6').html(lang[flags.pref.lang].system.devicelist.devicesub);
			$('#activeDevModal .activeStatus > label').html(lang[flags.pref.lang].system.devicelist.deleteddatafooter);
			$('#activeDevModal .activeStatus > span').html(delRecordsCtr);
			$('#activeDevModal .activeDevList').html(`<p class="text-center mb-0 px-3 pt-2 pb-3">${lang[flags.pref.lang].cluster.scandev.prompt.none}</p>`);
			if(!(retData === null)  && (retData.length > 0)) {
				var ui = '';
				for(var i = 0; i < retData.length; i++) {
					ui += '<div class="row no-gutters mb-2">';
					ui += '<div class="col-2 col-sm-1 col-md-1 col-lg-1 col-xl-1 align-self-center" >';
					ui += `<input type="checkbox" id="devCbox${retData[i].devdid}" name="sysdevlist" value="${retData[i].devdid}" style="transform: scale(1.4);" ></div>`
			        ui += '<div class="col-10 col-sm-11 col-md-11 col-lg-11 col-xl-11 pr-2">';
			        ui += `<form><input class="form-control form-control-sm" type="text" value="${retData[i].devnme}" readonly></form></div></div>`;
				}	
			    $('#activeDevModal .activeDevList').html(ui);
				$('#activeDevModal .deletelbl').prop('disabled', true);
				$('#applyDBDelete').off().on('click', function () {
					deleteDataByDevice();
				});
				$('input[name=sysdevlist]').click(function() {
					if ($('input[name=sysdevlist]:checked').length > 0) {
						$('#activeDevModal .deletelbl').prop('disabled', false);
					} else {
						$('#activeDevModal .deletelbl').prop('disabled', true);
					}
				})
			} else {
				$('#activeDevModal .activeDevList').html(`<p class="text-center mb-0 px-3 pt-2 pb-3">${lang[flags.pref.lang].cluster.scandev.prompt.none}</p>`);
				$('#activeDevModal .deletelbl').prop('disabled', true);
			}
            $('#activeDevModal').modal('show');
		},
		fail: function(errThrown) {
			console.log('Failed: ' + errThrown);
		}
	});
}

function listRemovedDevices() {
	console.log ("listRemovedDevices");
	// check daterange if available
	let frVal;
    let toVal;
	frVal = $('#dbm-from input').eq(0).val();
    toVal = $('#dbm-to input').eq(0).val();
	console.log (frVal, toVal);
	if (Date.parse(frVal) > Date.parse(toVal)) {
		showPrompt(lang[flags.pref.lang].general.datepicker.invalid, 'error');
		return;
	}
	delRecordsCtr = 0;
	$.ajax({
		type: 'POST',
		url: 'php/jogetarchiveddevices.php',
		data: {},
		dataType:'json',
		async: true,
		success: function(retData) {
			$('#activeDevModal label.title').html(lang[flags.pref.lang].system.devicelist.removeddevtitle);
			$('#activeDevModal .modal-body > h6').html(lang[flags.pref.lang].system.devicelist.removeddevsub);
			$('#activeDevModal .activeStatus > label').html(lang[flags.pref.lang].system.devicelist.deleteddatafooter);
			$('#activeDevModal .activeStatus > span').html(delRecordsCtr);
			$('#activeDevModal .activeDevList').html(`<p class="text-center mb-0 px-3 pt-2 pb-3">${lang[flags.pref.lang].cluster.scandev.prompt.none}</p>`);
			if(!(retData === null) && (retData.length > 0)) {
				var ui = '';
				for(var i = 0; i < retData.length; i++) {
					ui += '<div class="row no-gutters mb-2">';
					ui += '<div class="col-2 col-sm-1 col-md-1 col-lg-1 col-xl-1 align-self-center" >';
			        ui += `<input type="checkbox" id="devCbox${retData[i].devdid}" name="sysdevlist" value="${retData[i].devdid}" style="transform: scale(1.4);" ></div>`
			        ui += '<div class="col-10 col-sm-11 col-md-11 col-lg-11 col-xl-11 pr-2">';
			        ui += `<form><input class="form-control form-control-sm" type="text" id="devList${retData[i].devdid}" value="${retData[i].devnme}" readonly></form></div></div>`;
				}	
			    $('#activeDevModal .activeDevList').html(ui);
				$('#activeDevModal .deletelbl').prop('disabled', true);
				$('#applyDBDelete').off().on('click', function () {
					deleteDataByDevice();
				});
				$('input[name=sysdevlist]').click(function() {
					if ($('input[name=sysdevlist]:checked').length > 0) {
						$('#activeDevModal .deletelbl').prop('disabled', false);
					} else {
						$('#activeDevModal .deletelbl').prop('disabled', true);
					}
				})
			} else {
				$('#activeDevModal .activeDevList').html(`<p class="text-center mb-0 px-3 pt-2 pb-3">${lang[flags.pref.lang].cluster.scandev.prompt.none}</p>`);
				$('#activeDevModal .deletelbl').prop('disabled', true);
			}
            $('#activeDevModal').modal('show');
		},
		fail: function(errThrown) {
			console.log('Failed: ' + errThrown);
		}
	});
}

/** Delete data based on selected devices and date range.
 *  If no date range set, delete all data for the selected devices.
 *  If there is a running job for the selected device, that job will not be deleted. 
 * 	
 * 	Process:
 * 		1. Get the id of selected devices
 * 		2. Check if there's a set date range (if none, there will be no limit on date).
 *			Date is based on JO start time.
 * 		3. Delete records on tables: job_schedule, job_info, downtime, 
 */
function deleteDataByDevice() {
	// check daterange if available
	let frVal;
    let toVal;
	frVal = $('#dbm-from input').eq(0).val();
    toVal = $('#dbm-to input').eq(0).val();
	console.log (frVal, toVal);
	if (Date.parse(frVal) > Date.parse(toVal)) {
		showPrompt(lang[flags.pref.lang].general.datepicker.invalid, 'error');
		return;
	}
	$('#activeDevModal .cancellbl').prop('disabled',true);
	$('#activeDevModal .close').prop('disabled',true);
	$('#activeDevModal .activeStatus > span').html('<span role="status" class="spinner-border spinner-border-sm text-primary"></span>');

	// get selected devices 
	let elem = $('#activeDevModal .activeDevList');
	let devid = [];
	let deletedCnt = 0;
	elem.find('input[name=sysdevlist]:checked').each(function() {
		devid.push($(this).val());
	});

	console.log("selected devices: ", devid);
	$.ajax({
		type: 'POST',
		url: 'php/config/deleteDbData_mux.php',
		data: {
			idlist: JSON.stringify(devid),
			dateFr: frVal,
			dateTo: toVal,
		},
		dataType:'json',
		async: true,
		success: function(retData) {
			// alert("Deleted Job schedule: " + retData);
			console.log("total deleted jobs: ", retData);
			delRecordsCtr += retData;
			elem.find('input[name=sysdevlist]:checked').each(function() {
				$(this).attr("disabled", true);
			});
			$('#activeDevModal .activeStatus > span').html(delRecordsCtr);
			$('#activeDevModal .cancellbl').prop('disabled',false);
			$('#activeDevModal .close').prop('disabled',false);
			// showPrompt(lang[flags.pref.lang].system.datamgmnt.prompt.success.dbdeleted, 'Success');
		}, 
		fail: function(errThrown) {
			console.log('Failed: ' + errThrown);
		}
	});	
}

function deleteAllData() {
	$.ajax({
		type: 'POST',
		url: 'php/config/deleteDbData.php',
		data: {},
		dataType:'json',
		async: true,
		success: function(retData) {
			// alert("Deleted Job schedule: " + retData);
			console.log("total deleted jobs: ", retData);
			showPrompt(lang[flags.pref.lang].system.datamgmnt.prompt.success.dbdeletedall + retData, 'Success');
		}, 
		fail: function(errThrown) {
			console.log('Failed: ' + errThrown);
		}
	});
}

function getDBMemSpace() {
	$.ajax({
		type: 'POST',
		url: 'php/config/getDBMemSpace.php',
		data: {},
		dataType:'json',
		async: true,
		success: function(retData) {
			console.log("disk space: ", retData.disk);
			console.log("db size: ", retData.db);
			$('#dbmem').val((retData.db == '-1' ? "--" : retData.db) + "B");
			$('#diskmem').val((retData.disk == '-1' ? "--" : retData.disk) + "B");
			// $('#dbmem').val(retData.db);
			// $('#diskmem').val(retData.disk);
		},
		fail: function(errThrown) {
			console.log('Failed: ' + errThrown);
		}
	});
}

