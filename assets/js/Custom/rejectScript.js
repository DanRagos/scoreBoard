var isShowAllJobMode = false;

function initReject() {
	if($.isEmptyObject(flags.reject.table)) {
		flags.reject.table = $('#rejectTbl').DataTable({
			"dom": 'tip',
			"language": {
			    "paginate": {
			      "previous": lang[flags.pref.lang].general.datatable.prev,
			      "next": lang[flags.pref.lang].general.datatable.next,
			    },
			    "info": lang[flags.pref.lang].general.datatable.info,
			    "emptyTable": lang[flags.pref.lang].general.datatable.empty,
			    "infoEmpty": lang[flags.pref.lang].general.datatable.infoempty,
			},
			"columnDefs": [
		    	{ "width": "150px", "targets": 8 },
		    	{ type: 'natural', targets: [0, 1, 4, 5] },
		    	{ "orderable": false, "targets": 8 },
		    	{ targets: 0, orderData: [0, 2, 1] },
	            { targets: 1, orderData: [1, 2] },
	            { targets: 2, orderData: [2, 2, 1] },
	            { targets: 3, orderData: [3, 2, 1] },
	            { targets: 4, orderData: [4, 2, 1] },
	            { targets: 5, orderData: [5, 2, 1] },
	            { targets: 6, orderData: [6, 2, 1] },
	            { targets: 7, orderData: [7, 2, 1] },
				// Hanz: Fix for problem where if there is a long job order name,
				// column display can become one only (machine) on page width resize.
				{ className: "all", targets: [0, 1, 2]}
		  	],
	        columns: [
				{ data: "devnme",
					render: function(data, type, row) {
						return row.devnme == null ? row.devdid : row.devnme;
					} 
				},
				{ data: "devjob" },
				{ data: "devstt" },
				{ data: "devend" },
				{ data: "devmod" },
				{ data: "devmat" },
				{ data: "devcnt" },
				{ data: "devrej" },
				{ data: '--',
					render: function(data, type, row) {
						// let isRunning = (flags.displayMode.others == 'today' && !isShowAllJobMode) ? 'disabled' : '';
						let isRunning = '';
						const userEnabled = (flags.reject.disableInput ? 'disabled': '')
						return `<div class="input-group input-group-sm inputTableBtn">
							<input type="text" maxlength="255" oninput="validateRejectRemarks(this)" class="form-control rejInput${row.devdid}_" value="${row.devrem||'--'}" data-toggle="tooltip" title="${row.devrem||'--'}" disabled/>
							<div class="input-group-append">
								<button class="btn btn-dark editlbl" type="button" onclick="handleUserRejectButton(this, ${row.devdid})" ${isRunning} ${userEnabled}>${lang[flags.pref.lang].general.editlbl}</button>
							</div>
						</div>`;
					}
				}
			],
			"destroy": true,
			/* Code modification to make reject table behavior similar with
			schedule table (bug #27 fix) */
			"pageResize": false,
			"scrollX": true,
			"scrollCollapse": true,
			"responsive": true,
		});

		/*************************************************************************************/
		/* Code modification to make reject table behavior similar with
    	schedule table (bug #27 fix) */
		flags.reject.table.on('preDraw', function() {
			console.log("Reject table pre-draw!");
			if (!$.isEmptyObject(flags.reject.table))
			{
				if ($('#rejectTbl tr.child').length != 0)
				{
					// If a child row is currently displayed, do not update number of rows display.
					// Let the y-scroll do its thing.
					return;
				}

				var available_height = 0;

				if ($('#reject-tab .dataTables_info').css('float') == 'none')
				{
					// .dataTables_info and .dataTables_paginate are on two separate lines.
					available_height = $('#reject-tab #reject-content div.table-responsive').outerHeight() -
					$('#reject-tab .dataTables_scrollHead').outerHeight() -
					$('#reject-tab #rejectTbl_info').outerHeight() - 
					$('#reject-tab #rejectTbl_paginate').outerHeight();
				}
				else
				{
					// .dataTables_info and .dataTables_paginate are both on single line.
					var larger_info_paginate = 0;
					if ($('#reject-tab #rejectTbl_info').outerHeight() > $('#reject-tab #rejectTbl_paginate').outerHeight())
					{
						larger_info_paginate = $('#reject-tab #rejectTbl_info').outerHeight();
					}
					else
					{
						larger_info_paginate = $('#reject-tab #rejectTbl_paginate').outerHeight();
					}
					available_height = $('#reject-tab #reject-content div.table-responsive').outerHeight() -
					$('#reject-tab .dataTables_scrollHead').outerHeight() -
					larger_info_paginate;
				}

				if (flags.reject.table.responsive.hasHidden())
				{
					/* This evaluates to true if datatable extra button (+) is present
					because responsive plug in will show the extra button whenever
					there are hidden columns. This is better than using experimentally 
					determined pixel widths because breakpt for hiding of + button
					is also affected by long values (job order names example) or changing
					font size in the future).*/
					var no_of_rows = Math.trunc(available_height/37);
				}
				else
				{
					var no_of_rows = Math.trunc(available_height/47);
				}
				console.log(`Can fit this number of rows:${no_of_rows}`);
				if (no_of_rows > 4)
				{
					flags.reject.table.page.len(no_of_rows);
				}
				else
				{
					flags.reject.table.page.len(5);
				}
				if (flags.currPage != 'reject-tab')
				{
					// No need to redraw if user is not at reject page anyway.
					return false;
				}
			}
		});
		/*************************************************************************************/

		/************************http-1201 bug #21 fix - Improved 12-15-22********************/
        flags.reject.table.on('draw', function() {
            setTimeout(() => {
                if ($('#rejectTbl_paginate>span>*').length == 0)
                {
                    $('#rejectTbl_paginate .paginate_button.previous').css({
                        'padding-left': '',
                        'padding-right': ''
                    });
                    $('#rejectTbl_paginate .paginate_button.next').css({
                        'padding-left': '',
                        'padding-right': ''
                    });
                }
                else
                {
                    if (($('#rejectTbl_paginate>span>a.paginate_button')[0].getBoundingClientRect().left
                        - $('#rejectTbl_paginate .paginate_button.previous')[0].getBoundingClientRect().right) > 16)
                    {
                        $('#rejectTbl_paginate .paginate_button.previous').css({
                            'padding-left': '',
                            'padding-right': ''
                        });
                        $('#rejectTbl_paginate .paginate_button.next').css({
                            'padding-left': '',
                            'padding-right': ''
                        });
                    }
                }
            }, 1);

            if ($('#rejectTbl_footer').length == 0)
            {
                // This added element is just for flexing the display of "Showing 1 of 9 entries" + buttons (previous, 1, 2,...,Next)
                $('#rejectTbl_info, #rejectTbl_paginate').wrapAll("<div id='rejectTbl_footer'></div>");
            }
			console.log('reject table was drawn');
		});
        /*************************************************************************************/
	}
}

const initRejectNew = () => {
	console.log('initRejectNew()');
	// if ($.isEmptyObject(flags.reject.table2)) {
	// 	flags.reject.table2 = $('#rejectTbl2').DataTable({
	// 		"dom": 'tip',
	// 		"language": {
	// 		    "paginate": {
	// 		      "previous": lang[flags.pref.lang].general.datatable.prev,
	// 		      "next": lang[flags.pref.lang].general.datatable.next,
	// 		    },
	// 		    "info": lang[flags.pref.lang].general.datatable.info,
	// 		    "emptyTable": lang[flags.pref.lang].general.datatable.empty,
	// 		    "infoEmpty": lang[flags.pref.lang].general.datatable.infoempty,
	// 		},
	// 		"columnDefs": [
	// 	    	{ "width": "150px", "targets": 8 },
	// 	    	{ type: 'natural', targets: [0, 1, 4, 5] },
	// 	    	{ "orderable": false, "targets": 8 },
	// 	    	{ targets: 0, orderData: [0, 2, 1] },
	//             { targets: 1, orderData: [1, 2] },
	//             { targets: 2, orderData: [2, 2, 1] },
	//             { targets: 3, orderData: [3, 2, 1] },
	//             { targets: 4, orderData: [4, 2, 1] },
	//             { targets: 5, orderData: [5, 2, 1] },
	//             { targets: 6, orderData: [6, 2, 1] },
	//             { targets: 7, orderData: [7, 2, 1] }
	// 	  	],
	//         columns: [
	// 			{ data: "devnme",
	// 				render: function(data, type, row) {
	// 					return row.devnme == null ? row.devdid : row.devnme;
	// 				} 
	// 			},
	// 			{ data: "devjob" },
	// 			{ data: "devstt" },
	// 			{ data: "devend" },
	// 			{ data: "devmod" },
	// 			{ data: "devmat" },
	// 			{ data: "devcnt" },
	// 			{ data: "devrej" },
	// 			{ data: '--',
	// 				render: function(data, type, row) {
	// 					let isRunning = (flags.displayMode.others == 'today' && !isShowAllJobMode) ? 'disabled' : '';
	// 					return `<div class="input-group input-group-sm inputTableBtn"><input type="text" oninput="validateRejectRemarks(this)" class="form-control rejInput${row.devdid}_" value="${row.devrem||'--'}" data-toggle="tooltip" title="${row.devrem||'--'}" disabled/><div class="input-group-append"><button class="btn btn-dark editlbl" type="button" onclick="handleUserRejectButton(this, ${row.devdid})" ${isRunning}>${lang[flags.pref.lang].general.editlbl}</button></div></div>`;
	// 				}
	// 			}
	// 		],
	// 		"destroy": true,
	// 		"pageResize": true,
	// 		"scrollX": true,
	// 		"scrollCollapse": true,
	// 	});
	// }
};

const getRejectByID = (id) => {
	flags.ajaxRequestStatus = $.ajax({
		type: 'POST',
		url: 'php/getrejectsnew.php',
		data: {
			id: id
		},
		dataType: 'json',
		async: true,
		success: (data) => {
			console.log('getRejectByID');
			console.log(data);
		}
	});
};

const validateRejectRemarks = (e) => {
	var c = e.selectionStart, r = /([!@#$%^&*+=`"':;<>?\\{}\[\]]+)/gm, v = $(e).val();
	if(r.test(v)) {
		$(e).val(v.replace(r, ''));
	    c--;
	}
	e.setSelectionRange(c, c);
}

const currentRejectButton = {
	id: '',
	inputElement: '',
	inputValue: '',
	buttonElement: '',
};

function handleUserRejectButton (e, jobid) {
	//  if there is a different previously selected button, disable it.
	if (currentRejectButton.inputElement !== '' && currentRejectButton.id !== jobid) {
		currentRejectButton.buttonElement.html(lang[flags.pref.lang].general.editlbl);
		currentRejectButton.inputElement.prop('disabled', true);
		currentRejectButton.inputElement.val(currentRejectButton.inputValue);
	}

	currentRejectButton.inputElement = $(`input.form-control.rejInput${jobid}_`);
	currentRejectButton.inputValue = currentRejectButton.inputElement.val();
	currentRejectButton.buttonElement = $(e);
	currentRejectButton.id = jobid;
	
	let currText = e.innerText;
	if (currText == lang[flags.pref.lang].general.editlbl) {
		query_stop();
		$(`input.form-control.rejInput${jobid}_`).prop('disabled', false);
		$(e).html(lang[flags.pref.lang].general.savelbl);
	} else if (currText == lang[flags.pref.lang].general.savelbl) {
		updateRejectValue(jobid);
		// //  revert to no selected button
		// currentRejectButton.inputElement = '';
		// currentRejectButton.inputValue = '';
		// currentRejectButton.buttonElement = '';
		// currentRejectButton.id = '';
	} else {
		console.error('Button unknown state');
	}
}

function rejectUpdate() {
	var dateParam = getDateTimeNow('-');
	var urlAddr =  "php/jofilterrejects.php";
	var showAllJobs = $('#' + flags.currPage).find('.showJob-btn').hasClass('active') ? 1 : 0;
	var dateToUse = { 'fr': '', 'to': '' };

	if(flags.displayMode.others == 'today') {
		dateToUse.fr = 'none';
		dateToUse.to = 'none';
		$('#reject-view-btn').removeClass('active');
        $('#reject-view-btn').find('i').removeClass('text-success');
		$('#reject-today-btn').addClass('active');
        $('#reject-today-btn').find('i').addClass('kulayng-araw');
		if((showAllJobs) || (currentRejectButton.id !== '')) {
			query_stop();
		} else {
			query_start();
		}
	} else {
		dateToUse.fr = addStartTime({dateString: $('.dateFr:not(.schedDate .dbmDate)').eq(0).val()});
		dateToUse.to = addEndTime({dateString: $('.dateTo:not(.schedDate .dbmDate)').eq(0).val()});
		// dateToUse.to = addEndTime({dateString: $('.dateTo:not(.schedDate)').eq(0).val()});
		// if ($('.dateFr:not(.schedDate)').eq(0).val() = '' || $('.dateTo:not(.schedDate)').eq(0).val() == '' || dateToUse.fr > dateToUse.to) {
		// 	flags.displayMode.others == 'today';
		// 	return;
		// }
		$('#reject-today-btn').removeClass('active');
        $('#reject-today-btn').find('i').removeClass('kulayng-araw');
		$('#reject-view-btn').addClass('active');
        $('#reject-view-btn').find('i').addClass('text-success');
		query_stop();
	}

	console.log(dateToUse);

	isShowAllJobMode = showAllJobs;
	console.log(flags.reject.isFiltered);
	console.log(flags.reject.selectedFilter);
	console.log('hasSelectedFilters');
	const hasFilters = hasSelectedFilters({filterArray: flags.reject.selectedFilter});
	if (!flags.reject.isFiltered && !hasFilters) {
		clearFilters();
	}

	if (hasFilters) {
		enableFilterLight();
	} else {
		disableFilterLight();
	}
	
	const isFiltered = $('#apply-filter-btn').find('input').attr('checked');
	var filterObj = [];
	if (flags.reject.isFiltered || isFiltered) {
		for (var i = 0; i < 4; i++) {
			var tempData = flags.reject.selectedFilter[i], newData = [];
			switch (i) {
				case 0:
					if (!$.isEmptyObject(tempData)) {
						newData = tempData.map(items => '"' + items + '"');
						// console.log('filter ' + i + ': ' + newData.join());
						filterObj.push("'filter_a'");
						filterObj.push("'devicename'");
						filterObj.push("'filterVal_a'");
						filterObj.push("'" + newData.join() + "'");
					}
					break;

				case 1:
					if (!$.isEmptyObject(tempData)) {
						newData = tempData.map(items => '"' + items + '"');
						// console.log('filter ' + i + ': ' + newData.join());
						filterObj.push("'filter_b'");
						filterObj.push("'job'");
						filterObj.push("'filterVal_b'");
						filterObj.push("'" + newData.join() + "'");
					}
					break;

				case 2:
					if (!$.isEmptyObject(tempData)) {
						newData = tempData.map(items => '"' + items + '"');
						// console.log('filter ' + i + ': ' + newData.join());
						filterObj.push("'filter_c'");
						filterObj.push("'model'");
						filterObj.push("'filterVal_c'");
						filterObj.push("'" + newData.join() + "'");
					}
					break;

				case 3:
					if (!$.isEmptyObject(tempData)) {
						newData = tempData.map(items => '"' + items + '"');
						// console.log('filter ' + i + ': ' + newData.join());
						filterObj.push("'filter_d'");
						filterObj.push("'material'");
						filterObj.push("'filterVal_d'");
						filterObj.push("'" + newData.join() + "'");
					}
					break;

				default:
					break;
			}
		}
	}

	/* Get Downtime table order */
	var order = "job_info.timestampStart ASC, job_schedule.job ASC";

	flags.ajaxRequestStatus = $.ajax({
		type: 'POST',
		url: urlAddr,
		data: {
			lang: flags.pref.lang, 
			start: dateToUse.fr, 
			end: dateToUse.to, 
			filter: JSON.stringify(filterObj),
			order: order,
			ongoing: (showAllJobs ? false : true),
		},
		dataType:'json',
		async: true,
		success: function(data) {
			if($.isEmptyObject(flags.reject.table)) {
				initReject();
				showTableLoading();
			}
			flags.reject.table.clear().rows.add(
				updateFilterSelection(data, filters.reject, flags.reject.selectedFilter, flags.reject.isFiltered)
			).draw(false);
			enableDisplayButton();
			$('#' + flags.currPage +  ' .last-update').html('<span>' + lang[flags.pref.lang].general.lastUpdate + '</span>: ' + dateParam.dnt);
			flags.ajaxRequestStatus = null;
		},
		fail: function(xhr, status, error) {
			$('#' + flags.currPage +  ' .last-update').html('Check network connection...');

			if(flags.ajaxRequestStatus !== null) {
				flags.ajaxRequestStatus.abort();
				flags.ajaxRequestStatus = null;
			}
		},
		statusCode: {
	        500: function() {
	        	if(flags.ajaxRequestStatus !== null) {
					flags.ajaxRequestStatus.abort();
					flags.ajaxRequestStatus = null;
				}
				/** Data too large **/
				showPrompt(lang[flags.pref.lang].export.prompts.expTooLarge, 'failed');
	        }
	    }
	});
}

function rejectUpdate_old() {
	var dateParam = getDateTimeNow('-');
	var urlAddr =  "php/jorejects.php";
	var showAllJobs = $('#' + flags.currPage).find('.showJob-btn').hasClass('active') ? 1 : 0;
	var dateToUse = { 'fr': '', 'to': '' };

	if(flags.displayMode.others == 'today') {
		dateToUse.fr = 'none';
		dateToUse.to = 'none';
		if(showAllJobs) {
			query_stop();
		} else {
			query_start();
		}
	} else {
		dateToUse.fr = $('.dateFr:not(.schedDate .dbmDate)').eq(0).val();
		dateToUse.to = $('.dateTo:not(.schedDate .dbmDate)').eq(0).val();
		query_stop();
	}

	flags.ajaxRequestStatus = $.ajax({
		type: 'POST',
		url: urlAddr,
		data: { start: dateToUse.fr, end: dateToUse.to, history: showAllJobs },
		dataType:'json',
		async: true,
		success: function(data) {
			if($.isEmptyObject(flags.reject.table)) {
				initReject();
				showTableLoading();
			}
			flags.reject.table.clear().rows.add(
				updateFilterSelection(data, filters.reject, flags.reject.selectedFilter, flags.reject.isFiltered)
			).draw(false);
			enableDisplayButton();
			$('#' + flags.currPage +  ' .last-update').html('<span>' + lang[flags.pref.lang].general.lastUpdate + '</span>: ' + dateParam.dnt);
			flags.ajaxRequestStatus = null;
		},
		fail: function(xhr, status, error) {
			$('#' + flags.currPage +  ' .last-update').html('Check network connection...');

			if(flags.ajaxRequestStatus !== null) {
				flags.ajaxRequestStatus.abort();
				flags.ajaxRequestStatus = null;
			}
		},
		statusCode: {
	        500: function() {
	        	if(flags.ajaxRequestStatus !== null) {
					flags.ajaxRequestStatus.abort();
					flags.ajaxRequestStatus = null;
				}
				/** Data too large **/
				showPrompt(lang[flags.pref.lang].export.prompts.expTooLarge, 'failed');
	        }
	    }
	});
}

/**
 * Description: Update the reject value of the datatable row.
 * Parameters: data - 0 to 1,000,000,000
 * Prereq: None
 * Return: None
**/
function updateRejectValue(rowId) {
	var a;

	const rejectTable = $('#reject-tab .tbl-container table').eq(1);

	if(rejectTable.hasClass('collapsed')) {
		a = $($('#reject-tab .tbl-container .rejInput' + rowId + '_')[1]).val();
	} else {
		a = $($('#reject-tab .tbl-container .rejInput' + rowId + '_')[0]).val();
	}

	if(a == null || a == '') {
		showPrompt(lang[flags.pref.lang].reject.prompts.rejInvalid, 'Error');
		return;
	}

	$.ajax({
		type: 'POST',
		url: 'php/joupdaterejects.php',
		data: { did: rowId, val: a },
		dataType:'json',
		async: true,
		success: function(data) {
			/** Check if data is empty **/
			if(data == 'failed') {
				showPrompt(lang[flags.pref.lang].reject.prompts.rejFailed, 'Failed');
			} else {
				showPrompt(lang[flags.pref.lang].reject.prompts.rejSuccess, 'success');

				if(flags.displayMode.others == 'view' || $('#' + flags.currPage).find('.showJob-btn').hasClass('active') || (currentRejectButton.id !== '')) {
					//  revert to no selected button
					currentRejectButton.inputElement = '';
					currentRejectButton.inputValue = '';
					currentRejectButton.buttonElement = '';
					currentRejectButton.id = '';
					rejectUpdate();
				}
			}
		}
	});
}