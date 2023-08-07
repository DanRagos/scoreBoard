function initSummary(prendvisible = true, scendvisible = false) {
	if($.isEmptyObject(flags.summary.table)) {
		flags.summary.table = $('#summaryTbl').DataTable({
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
				// Hanz: Fix for problem where if there is a long job order name,
				// column display can become one only (machine) on page width resize.
				{
		            "targets": [ 2 ],
		            "visible": prendvisible,
		        },
		        {
		            "targets": [ 6 ],
		            "visible": scendvisible,
		        },
				
				{ className: "all", targets: [0, 1, 2]}
		    ],
		    columns: [
				{ data: "devnme",
					render: function(data, type, row) {
						return row.devnme == "--" ? row.devdid : row.devnme;
					}
				},
				{ data: "devstt" },
				{ data: "devend" },
				{ data: "devtgt" },
				{ data: "devact" },
				{ data: "devdif",
					render: function(data, type, row) {
						var val; 
						if (row.devoff == 'OFFLINE' && (row.devsta == 'PRODUCTIVE' || row.devsta == 'UNPRODUCTIVE')) {
							val = '<i class="fas fa-question-circle"></i>';
						} else {
							val = data;
						}
						return val;
					}
				},
				{ data: "devprod",
					render: function(data, type, row) {
						var val; 
						if (row.devoff == 'OFFLINE' && (row.devsta == 'PRODUCTIVE' || row.devsta == 'UNPRODUCTIVE')) {
							val = '<i class="fas fa-question-circle"></i>';
						} else {
							val = data;
						}
						return val;
					}
				},
				{ data: "devdown",
					render: function(data, type, row) {
						var val; 
						if (row.devoff == 'OFFLINE' && (row.devsta == 'PRODUCTIVE' || row.devsta == 'UNPRODUCTIVE')) {
							val = '<i class="fas fa-question-circle"></i>';
						} else {
							val = data;
						}
						return val;
					}
				},
				
				{ data: "devsts",
					render: function(data, type, row) {
						var retval;
						retval = lang[flags.pref.lang].status[row.devsta];
						if (retval === undefined) {
							retval = getKeyByValue(lang['en'].status, data);
							if (retval === undefined) {
								retval = getKeyByValue(lang['jp'].status, data);
							}
						}
						return retval;
					}
				}
			],
			rowCallback: function(row, data) {
				/** this is where we put certain conditions on each row,
				  * such as highlight and status.
				 **/
				if ( flags.displayMode.others == 'today' && (data.devsts == 'PRODUCTIVE' || data.devsts == 'UNPRODUCTIVE')) {
					$(row).addClass('offlineRow');
				} else {
					switch(data.devsts) {
						case 'PRODUCTIVE':
							$(row).addClass('transRow');
							break;

						case 'UNPRODUCTIVE':
							$(row).addClass('redRow');
							break;

						case 'COMPLETED*':
						case 'CONTINUED':
							$(row).addClass('lBlueRow');
							break;

						case 'COMPLETED':
							$(row).addClass('blueRow');
							break;

							
						case 'DOWNTIME':
							$(row).addClass('redRow');
							break;
					}
				}
			},
			"destroy": true,
			/* Code modification to make summary table behavior similar with
			schedule table (bug #27 fix) */
			"pageResize": false,
			"scrollX": true,
			"scrollCollapse": true,
		});

		/*************************************************************************************/
		/* Code modification to make summary table behavior similar with
    	schedule table (bug #27 fix) */
		flags.summary.table.on('preDraw', function() {
			console.log("Summary table pre-draw!");
			if (!$.isEmptyObject(flags.summary.table))
			{
				if ($('#summaryTbl tr.child').length != 0)
				{
					// If a child row is currently displayed, do not update number of rows display.
					// Let the y-scroll do its thing.
					return;
				}

				var available_height = 0;

				if ($('#summary-tab .dataTables_info').css('float') == 'none')
				{
					// .dataTables_info and .dataTables_paginate are on two separate lines.
					$.fn.DataTable.ext.pager.numbers_length = 5
					available_height = $('#summary-tab #summary-content div.table-responsive').outerHeight() -
					$('#summary-tab .dataTables_scrollHead').outerHeight() -
					$('#summary-tab #summaryTbl_info').outerHeight() - 
					$('#summary-tab #summaryTbl_paginate').outerHeight();
				}
				else
				{
					// .dataTables_info and .dataTables_paginate are both on single line.
					var larger_info_paginate = 0;
					if ($('#summary-tab #summaryTbl_info').outerHeight() > $('#summary-tab #summaryTbl_paginate').outerHeight())
					{
						larger_info_paginate = $('#summary-tab #summaryTbl_info').outerHeight();
					}
					else
					{
						larger_info_paginate = $('#summary-tab #summaryTbl_paginate').outerHeight();
					}
					available_height = $('#summary-tab #summary-content div.table-responsive').outerHeight() -
					$('#summary-tab .dataTables_scrollHead').outerHeight() -
					larger_info_paginate;
				}

				// Hanz: In summary page, tr height is always 37px regardless if child row functionality
				// is on or not.
				var no_of_rows = Math.trunc(available_height/37);
				console.log(`Can fit this number of rows:${no_of_rows}`);
				if (no_of_rows > 4)
				{
					flags.summary.table.page.len(no_of_rows);
				}
				else
				{
					flags.summary.table.page.len(5);
				}
				if (flags.currPage != 'summary-tab')
				{
					// No need to redraw if user is not at reject page anyway.
					return false;
				}
			}
		});
		/*************************************************************************************/

		/************************http-1201 bug #21 fix - Improved 12-15-22********************/
        flags.summary.table.on('draw', function() {
            setTimeout(() => {
                if ($('#summaryTbl_paginate>span>*').length == 0)
                {
                    $('#summaryTbl_paginate .paginate_button.previous').css({
                        'padding-left': '',
                        'padding-right': ''
                    });
                    $('#summaryTbl_paginate .paginate_button.next').css({
                        'padding-left': '',
                        'padding-right': ''
                    });
                }
                else
                {
                    if (($('#summaryTbl_paginate>span>a.paginate_button')[0].getBoundingClientRect().left
                        - $('#summaryTbl_paginate .paginate_button.previous')[0].getBoundingClientRect().right) > 16)
                    {
                        $('#summaryTbl_paginate .paginate_button.previous').css({
                            'padding-left': '',
                            'padding-right': ''
                        });
                        $('#summaryTbl_paginate .paginate_button.next').css({
                            'padding-left': '',
                            'padding-right': ''
                        });
                    }
                }
            }, 1);

            if ($('#summaryTbl_footer').length == 0)
            {
                // This added element is just for flexing the display of "Showing 1 of 9 entries" + buttons (previous, 1, 2,...,Next)
                $('#summaryTbl_info, #summaryTbl_paginate').wrapAll("<div id='summaryTbl_footer'></div>");
            }
			console.log('summary table was drawn');
		});
        /*************************************************************************************/
	}
}

function summaryUpdate() {
	var dateParam = getDateTimeNow('-');
	var isConsolidated =  $('#consolidate-btn').prop("checked") ? 'true' : 'false';
	var showAllJobs = $('#' + flags.currPage).find('.showJob-btn').hasClass('active') ? 1 : 0;
	var dateToUse = { 'fr': '', 'to': '' };

	if(flags.displayMode.others == 'today') {
		dateToUse.fr = 'none';
		dateToUse.to = 'none';
		$('#summary-view-btn').removeClass('active');
        $('#summary-view-btn').find('i').removeClass('text-success');
        $('#summary-today-btn').addClass('active');
        $('#summary-today-btn').find('i').addClass('kulayng-araw');
		if(showAllJobs) {
			query_stop();
		} else {
			query_start();
		}
	} else {
	// } else if (flags.displayMode.others == 'view' && flags.displayMode.page == 'summary') {
		dateToUse.fr = addStartTime({dateString: $('.dateFr:not(.schedDate .dbmDate)').eq(0).val()});
		dateToUse.to = addEndTime({dateString: $('.dateTo:not(.schedDate .dbmDate)').eq(0).val()});
		$('#summary-today-btn').removeClass('active');
        $('#summary-today-btn').find('i').removeClass('kulayng-araw');
		$('#summary-view-btn').addClass('active');
        $('#summary-view-btn').find('i').addClass('text-success');
		query_stop();
	}

	const hasFilters = hasSelectedFilters({filterArray: flags.summary.selectedFilter});
	if (!hasFilters && !flags.summary.isFiltered) {
		clearFilters();
	}

	if (hasFilters) {
		enableFilterLight();
	} else {
		disableFilterLight();
	}

	var filterObj = [];
	if (flags.summary.isFiltered) {
		for (var i = 0; i < 6; i++) {
			var tempData = flags.summary.selectedFilter[i], newData = [];
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

				case 4:
					if (!$.isEmptyObject(tempData)) {
						newData = tempData.map(items => '"' + items + '"');
						// console.log('filter ' + i + ': ' + newData.join());
						filterObj.push("'filter_e'");
						filterObj.push("'job_info.operator'");
						filterObj.push("'filterVal_e'");
						filterObj.push("'" + newData.join() + "'");
					}
					break;

				case 5:
					if (!$.isEmptyObject(tempData)) {
						newData = tempData.map(items => '"' + items + '"');
						// console.log('filter ' + i + ': ' + newData.join());
						filterObj.push("'filter_f'");
						filterObj.push("'list_jobstatus.name'");
						filterObj.push("'filterVal_f'");
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
		url: 'php/getSummary.php',
		data: {
			lang: flags.pref.lang, 
			start: dateToUse.fr, 
			end: dateToUse.to, 
			filter: JSON.stringify(filterObj),
			order: order,
			consolidated: isConsolidated,
			ongoing: (showAllJobs ? false : true),
		},
		dataType:'json',
		async: true,
		success: function(data) {
			console.log(data);
			if($.isEmptyObject(flags.summary.table)) {
				initSummary();
				showTableLoading();
			}
			flags.summary.table.clear().rows.add(
				updateFilterSelection(data, filters.summary, flags.summary.selectedFilter, flags.summary.isFiltered)
			).draw(false);
			enableDisplayButton();
			$('#' + flags.currPage +  ' .last-update').html(lang[flags.pref.lang].general.lastUpdate + ': ' + dateParam.dnt);
			flags.ajaxRequestStatus = null;
			if(!Array.isArray(data) || !data.length) {
				$('#summary-export-btn').prop('disabled', true);
			}
			else {
				$('#summary-export-btn').prop('disabled', false);
			}
		},
		fail: function(xhr, status, error) {
			if(flags.ajaxRequestStatus !== null) {
				flags.ajaxRequestStatus.abort();
				flags.ajaxRequestStatus = null;
			}
			query_stop();
			flags.summary.table.clear();
			showPrompt(lang[flags.pref.lang].errorprompt.datatoolarge, 'Failed');
		},
		statusCode: {
	        500: function() {
	        	if(flags.ajaxRequestStatus !== null) {
					flags.ajaxRequestStatus.abort();
					flags.ajaxRequestStatus = null;
				}
				query_stop();
				flags.summary.table.clear();
				showPrompt(lang[flags.pref.lang].errorprompt.datatoolarge, 'Failed');
	        }
	    }
	});
}

function summaryUpdate_old() {
	var dateParam = getDateTimeNow('-');
	var urlAddr =  !$('#consolidate-btn').prop("checked") ? 'php/josummary.php' : 'php/josummaryConsolidate.php';
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
			if($.isEmptyObject(flags.summary.table)) {
				initSummary();
				showTableLoading();
			}
			flags.summary.table.clear().rows.add(
				updateFilterSelection(data, filters.summary, flags.summary.selectedFilter, flags.summary.isFiltered)
			).draw(false);
			enableDisplayButton();
			$('#' + flags.currPage +  ' .last-update').html(lang[flags.pref.lang].general.lastUpdate + ': ' + dateParam.dnt);
			flags.ajaxRequestStatus = null;
		},
		// error: function(xhr, status, error) {
		// 	showPrompt('Server failed to respond, Data may be too large.', 'error');
		// 	if(flags.ajaxRequestStatus !== null) {
		// 		flags.ajaxRequestStatus.abort();
		// 		flags.ajaxRequestStatus = null;
		// 	}
		// },
		fail: function(xhr, status, error) {
			showPrompt('Server failed to respond, Data may be too large.', 'error');
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
				showPrompt('Data too large!', 'error');
	        }
	    }
	});
}

function manualValidation(elem) {
	/** allows alphanumeric, spaces, dash **/
	// var c = elem.selectionStart, r = /[^a-z0-9\s\-]/gi, v = $(elem).val();
	var c = elem.selectionStart, r = /([!@#$%^&*+=`"':;<>?\\{}\[\]]+)/gm, v = $(elem).val();
	if(r.test(v)) {
		$(elem).val(v.replace(r, ''));
	    c--;
	}
	elem.setSelectionRange(c, c);
}

/**
 * Description: Update the operator value of the datatable row.
 * Parameters: data - new operator name
 * Prereq: None
 * Return: None
**/
function updateOperatorValue(rowDevDid) {
	var a = $('#oprInput' + rowDevDid + '_').val();

	if(a == null || a == '' || a == ' ') {
		showPrompt('Please input a valid value.', 'error');
		return;
	}

	$.ajax({
		type: 'POST',
		url: 'php/joupdateoperator.php',
		data: { did: rowDevDid, val: a },
		dataType:'json',
		async: true,
		success: function(data) {
			/** Check if data is empty **/
			if(data == 'failed') {
				showPrompt('Failed to update operator value. Please try again.', 'failed');
			} else {
				showPrompt('Operator value was updated Successfully!', 'success');

				if(flags.displayMode.others == 'view' || $('#' + flags.currPage).find('.showJob-btn').hasClass('active')) {
					summaryUpdate();
				}
			}
		}
	});
}

function getKeyByValue(object, value) {
	return Object.keys(object).find(key => object[key] === value);
}