function initSchedule() {
	if($.isEmptyObject(flags.schedule.table)) {
		flags.schedule.table = $('#scheduleTbl').DataTable({
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
				{
		            "targets": [ 2 ],
		            "visible": prendvisible,
		        },
		        {
		            "targets": [ 13 ],
		            "visible": scendvisible,
		        },
	  			{ "orderable": false, "targets": 11 },
	  			{ type: 'natural', targets: [0, 1, 4, 5, 10] },
	  			{ targets: 0, orderData: [0, 2, 1] },
	            { targets: 1, orderData: [1, 2] },
	            { targets: 2, orderData: [2, 0, 1] },
	            { targets: 3, orderData: [3, 0, 1] },
	            { targets: 4, orderData: [4, 2, 1] },
	            { targets: 5, orderData: [5, 2, 1] },
	            { targets: 6, orderData: [6, 2, 1] },
	            { targets: 7, orderData: [7, 2, 1] },
	            { targets: 8, orderData: [8, 2, 1] },
	            { targets: 9, orderData: [9, 2, 1] },
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
				{ data: "devtgt" },
				{ data: "devpwn" },
				{ data: "devcyc" },
				{ data: "devpre" },
				{ data: "devopr" },
				{ data: null,
					render: function(data, type, row) {
						var form = '';
						if(row.devlck == '1') {
							if (flags.pref.lang == 'en') {
								form = '<i class="fas fa-lock text-secondary" data-toggle="tooltip" title="' + lang[flags.pref.lang].schedule.tooltip.locked + ' ';
								form += row.devusr;
							} else {
								form = '<i class="fas fa-lock text-secondary" data-toggle="tooltip" title="' + row.devusr + ' ';
								form += lang[flags.pref.lang].schedule.tooltip.locked;
							}
							form += '"></i>&nbsp;';
						} else if(row.devflg == '0') {
							//Pending
							form = '<i class="fas fa-layer-group text-warning" data-toggle="tooltip" title="' + lang[flags.pref.lang].schedule.tooltip.idle + '"></i>&nbsp;';
						} else {
							if(row.devsta == 'completed') {
								//Completed
								form = '<i class="fas fa-check-circle text-primary" data-toggle="tooltip" title="' + lang[flags.pref.lang].schedule.tooltip.complete + '"></i>&nbsp;';
							} else {
								//Running
								form = '<i class="fas fa-play-circle text-success" data-toggle="tooltip" title="' + lang[flags.pref.lang].schedule.tooltip.running + '"></i>&nbsp;';
							}
						}
						form += "<button type='btn' class='btn btn-sm btn-dark edit-btn' ";
						form += "onclick='requestScheduleInfo(" + row.rowCnt + ")'";
						if(flags.viewModeOnly) {
							form += " disabled";
						}
						form += ">" + lang[flags.pref.lang].general.editlbl + "</button>";
						return form;
					}
				},
			],
			"destroy": true,
			"pageResize": false,
			"scrollX": true,
			"scrollCollapse": true,
			// "pageLength": 10
		});

		/*************************************************************************************/
		// Hanz: Bug #27 fix
		flags.schedule.table.on('preDraw', function() {
			// console.log("Schedule table pre-draw!");
			if (!$.isEmptyObject(flags.schedule.table))
			{
				if ($('#scheduleTbl tr.child').length != 0)
				{
					// If a child row is currently displayed, do not update number of rows display.
					// Let the y-scroll do its thing.
					return;
				}

				var available_height = 0;

				// Original code
				// available_height = $('#schedule-tab #schedule-content .tbl-container.schedTable').outerHeight() -
				// $('#schedule-tab .dataTables_scrollHead').outerHeight() -
				// $('#schedule-tab #scheduleTbl_info').outerHeight() - 
				// $('#schedule-tab #scheduleTbl_paginate').outerHeight();

				if ($('#schedule-tab .dataTables_info').css('float') == 'none')
				{
					// .dataTables_info and .dataTables_paginate are on two separate lines.
					available_height = $('#schedule-tab #schedule-content .tbl-container.schedTable').outerHeight() -
					$('#schedule-tab .dataTables_scrollHead').outerHeight() -
					$('#schedule-tab #scheduleTbl_info').outerHeight() - 
					$('#schedule-tab #scheduleTbl_paginate').outerHeight();
				}
				else
				{
					// .dataTables_info and .dataTables_paginate are both on single line.
					var larger_info_paginate = 0;
					if ($('#schedule-tab #scheduleTbl_info').outerHeight() > $('#schedule-tab #scheduleTbl_paginate').outerHeight())
					{
						larger_info_paginate = $('#schedule-tab #scheduleTbl_info').outerHeight();
					}
					else
					{
						larger_info_paginate = $('#schedule-tab #scheduleTbl_paginate').outerHeight();
					}
					available_height = $('#schedule-tab #schedule-content .tbl-container.schedTable').outerHeight() -
					$('#schedule-tab .dataTables_scrollHead').outerHeight() -
					larger_info_paginate;
				}

				if (flags.schedule.table.responsive.hasHidden())
				// if ($('body').width() < 461)
				{
					/* This evaluates to true if datatable extra button (+) is present
					because responsive plug in will show the extra button whenever
					there are hidden columns. This is better than using experimentally 
					determined pixel widths because breakpt for hiding of + button
					is also affected by long values (job order names example) or changing
					font size in the future).*/
					var no_of_rows = Math.trunc(available_height/37 - 1);
				}
				else
				{
					var no_of_rows = Math.trunc(available_height/47 - 1);
				}
				// console.log(`Can fit this number of rows:${no_of_rows}`);
				if (no_of_rows > 4)
				{
					flags.schedule.table.page.len(no_of_rows);
				}
				else
				{
					flags.schedule.table.page.len(5);
				}
				if (flags.currPage != 'schedule-tab')
				{
					// No need to redraw if user is not at schedule page anyway.
					return false;
				}
			}
		});
		/*************************************************************************************/

		/************************http-1201 bug #21 fix - Improved 12-15-22********************/
        flags.schedule.table.on('draw', function() {
            setTimeout(() => {
                if ($('#scheduleTbl_paginate>span>*').length == 0)
                {
                    $('#scheduleTbl_paginate .paginate_button.previous').css({
                        'padding-left': '',
                        'padding-right': ''
                    });
                    $('#scheduleTbl_paginate .paginate_button.next').css({
                        'padding-left': '',
                        'padding-right': ''
                    });
                }
                else
                {
                    if (($('#scheduleTbl_paginate>span>a.paginate_button')[0].getBoundingClientRect().left
                        - $('#scheduleTbl_paginate .paginate_button.previous')[0].getBoundingClientRect().right) > 16)
                    {
                        $('#scheduleTbl_paginate .paginate_button.previous').css({
                            'padding-left': '',
                            'padding-right': ''
                        });
                        $('#scheduleTbl_paginate .paginate_button.next').css({
                            'padding-left': '',
                            'padding-right': ''
                        });
                    }
                }
            }, 1);

            if ($('#scheduleTbl_footer').length == 0)
            {
                // This added element is just for flexing the display of "Showing 1 of 9 entries" + buttons (previous, 1, 2,...,Next)
                $('#scheduleTbl_info, #scheduleTbl_paginate').wrapAll("<div id='scheduleTbl_footer'></div>");
            }
			console.log('schedule table was drawn');
		});
        /*************************************************************************************/
	}
	// console.log('initSchedule()');
	if(localStorage.getItem('schedlockedId') === null || localStorage.getItem('schedlockedId') == '') {}
	else {
		setScheduleLockState(null, null, localStorage.getItem('schedlockedId'), 0, function() {});
	}
}

function scheduleUpdate() {
	var dateParam = getDateTimeNow('-');
	var urlAddr = 'php/jofilterschedule.php';
	var dateToUse = { 'fr': '', 'to': '' };

	if(flags.displayMode.schedule == 'today') {
		dateToUse.fr = addStartTime({dateString: moment().format('YYYY-MM-DD')});
		dateToUse.to = addEndTime({dateString: moment().format('YYYY-MM-DD')});
		query_start();
	} else {
		dateToUse.fr = addStartTime({dateString: $('.dateFr.schedDate').eq(0).val()});
		dateToUse.to = addEndTime({dateString: $('.dateTo.schedDate').eq(0).val()});
		query_stop();
	}

	// console.log(dateToUse);

	flags.schedule.dateToUse = dateToUse;

	const hasFilters = hasSelectedFilters({filterArray: flags.schedule.selectedFilter});
	if (!hasFilters && !flags.schedule.isFiltered) {
		clearFilters();
	}

	if (hasFilters) {
		enableFilterLight();
	} else {
		disableFilterLight();
	}

	// console.log(hasFilters);
	// console.log(flags.schedule.selectedFilter);

	var filterObj = [];

	if (flags.schedule.isFiltered) {
		for (var i = 0; i < 6; i++) {
			var tempData = flags.schedule.selectedFilter[i], newData = [];
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
						filterObj.push("'target'");
						filterObj.push("'filterVal_e'");
						filterObj.push("'" + newData.join() + "'");
					}
					break;

				case 5:
					if (!$.isEmptyObject(tempData)) {
						newData = tempData.map(items => '"' + items + '"');
						// console.log('filter ' + i + ': ' + newData.join());
						filterObj.push("'filter_f'");
						filterObj.push("'operator'");
						filterObj.push("'filterVal_f'");
						filterObj.push("'" + newData.join() + "'");
					}
					break;

				default:
					break;
			}
		}
	}

	// console.table(filterObj);

	var order = "schedStart ASC, devicename ASC";

	flags.ajaxRequestStatus = $.ajax({
		type: 'POST',
		url: urlAddr,
		data: {
			lang: flags.pref.lang, 
			start: dateToUse.fr, 
			end: dateToUse.to, 
			filter: JSON.stringify(filterObj),
			order: order,
		},
		dataType:'json',
		async: true,
		success: function(data) {
			flags.schedule.data = data;
			if($.isEmptyObject(flags.schedule.table)) {
				initSchedule();
				showTableLoading();
			}
			flags.schedule.table.clear().rows.add(
				updateFilterSelection(data, filters.schedule, flags.schedule.selectedFilter, flags.schedule.isFiltered)
			).draw(false);
			enableDisplayButton();

			if (flags.schedule.isGraphMode && $('#schedule-grp .schedToday').hasClass('active')) {
				query_stop();
			}
			
			$('#schedchart').html('');
			flags.schedule.chartData = getScheduleChartData();
			flags.schedule.chartPagination = createNewPaginationInstance();
			flags.schedule.chartPagination.create({numberOfPages: Object.keys(flags.schedule.chartData).length});
			flags.schedule.chartCurrentPage = 0;
			
			$('#schedchart-pagination-container').html(flags.schedule.chartPagination.getHtml());
			const chart = initScheduleChart($('#themeSel').val() + '2', flags.schedule.chartData[0]);
			scheduleChartPageChecker();
			$('#' + flags.currPage +  ' .last-update').html('<span>' + lang[flags.pref.lang].general.lastUpdate + '<span>: ' + dateParam.dnt);
			flags.ajaxRequestStatus = null;
			flags.schedule.chartObject = chart;
			if (flags.schedule.isGraphMode) {
				//  show the chart view
                const schedChartView = $('#schedchart-container');
                schedChartView.css('visibility', 'visible');
			}
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

function addNewSchedule(callback) {
	// console.log('addNewSchedule()');
	var a = $('#schedID').val();
	var b = $('#schedJOB').val();
	var c = $('#schedMOD').val();
	var d = $('#schedMAT').val();
	var e = $('#schedTGT').val() == '' ? 0 : $('#schedTGT').val();
	var f = $('#schedPWN').val() == '' ? 0 : $('#schedPWN').val();
	var g = $('#schedPRE').val();
	var h = $('#schedCYC').val();
	var i = $('#schedfr').val();
	var j = $('#schedto').val();
	var k = $('#schedOPR').val();
	$('#schedLogID').data('state', 'completed');
	$('#schedLogID').data('flg', '0');

	if(b == '' || i == '' || h == '' || g == '') {
		showPrompt(lang[flags.pref.lang].schedule.prompts.schedFillReq, "Error");
		return;
	}

	if(b.toUpperCase() == "NONE" || b.toUpperCase() == "NEW") {
		showPrompt(lang[flags.pref.lang].schedule.prompts.schedInvalidJob, "Error");
		return;
	}

	if(parseFloat(g) < 0.1 || parseInt(h) < 0) { //allow 0 on CT as advised by Eiji-san, 10/26
	// if(parseFloat(g) <= 0 || parseInt(h) <= 0) {
		showPrompt(lang[flags.pref.lang].schedule.prompts.schedNegVal, "Error");
		return;
	}

	if(parseFloat(f) < 0 || parseFloat(e) < 0) {
		showPrompt(lang[flags.pref.lang].schedule.prompts.schedZeroVal, "Error");
		return;
	}

	if((parseFloat(e) > 1000000000) || (parseFloat(f) > 1000000000)) {
		showPrompt(lang[flags.pref.lang].schedule.prompts.schedTgtMaxVal, "Error");
		return;
	}

	if(parseInt(h) > 999999) {
		showPrompt(lang[flags.pref.lang].schedule.prompts.schedCycleMaxVal, "Error");
		return;
	}

	if(parseFloat(g) > 100) {
		showPrompt(lang[flags.pref.lang].schedule.prompts.schedPrescaleMaxVal, "Error");
		return;
	}

	var fr = Date.parse(i);
	var to = Date.parse(j);
	if(fr > to) {
		showPrompt(lang[flags.pref.lang].schedule.prompts.schedInvalidDate, "Error");
		return;
	}

	if(parseFloat(f) > parseFloat(e)) {
		showPrompt(lang[flags.pref.lang].schedule.prompts.schedPrewarnExceed, "Error");
		return;
	}

	$.ajax({
		type: 'POST',
		url: 'php/joaddschedule.php',
		data: {
			devid: a,
			devjb: b,
			devmd: c,
			devmt: d,
			devtg: parseFloat(e).toFixed(1),
			devpw: parseFloat(f).toFixed(1),
			devps: parseFloat(g).toFixed(1),
			devcc: parseInt(h),
			devst: i,
			deven: j,
			devop: k
		},
		dataType:'json',
		async: true,
		// timeout:5000,
		success: function(data) {
			/** Check if data is empty **/
			if(data == 'failed') {
				showPrompt(lang[flags.pref.lang].schedule.prompts.schedAddFailed, 'Failed');
			} else {
				showPrompt(lang[flags.pref.lang].schedule.prompts.schedAddSuccess, 'Success');

				flags.schedule.recentAddedId = data;
				setScheduleLockState(null, null, localStorage.getItem('schedlockedId'), 0, function() {
					setScheduleLockState(null, null, flags.schedule.recentAddedId, 1, function() {});
				});

				if(flags.displayMode.schedule == 'view') {
					scheduleUpdate();
					// console.log("this should update the displayed schedule on view mode");
				}
				
				$('#lockIcon').hide();
				$('#del-sidepanel-btn').attr('disabled', false);
				$('#upd-sidepanel-btn').attr('disabled', false);
				$('#schedPRE').attr('disabled', false);
				$('#schedPWN').attr('disabled', false);
				$('#schedCYC').attr('disabled', false);
				$('#schedTGT').attr('disabled', false);

				flags.schedule.loadedTgt = parseFloat(e);

				if (callback && typeof callback === "function") {
					callback();
				}
			}
		}
	});
}

function actDeleteSchedInfo() {
	var l = $('#schedLogID').val();

	$.ajax({
		type: 'POST',
		url: 'php/jodeleteschedule.php',
		data: { scdid: l },
		dataType:'json',
		async: true,
		success: function(data) {
			/** Check if data is empty **/
			if(data == 'failed') {
				showPrompt(lang[flags.pref.lang].schedule.prompts.schedDelFailed, 'Failed');
			} else {
				showPrompt(lang[flags.pref.lang].schedule.prompts.schedDelSuccess, 'Success');
				clearScheduleInfo();

				if(flags.displayMode.schedule == 'view') {
					scheduleUpdate();
				}
			}
		}
	});
}

function updateScheduleInfo() {
	// console.log('updateScheduleInfo()');
	var a = $('#schedID').val();
	var b = $('#schedJOB').val();
	var c = $('#schedMOD').val();
	var d = $('#schedMAT').val();
	var e = $('#schedTGT').val() == '' ? 0 : $('#schedTGT').val();
	var f = $('#schedPWN').val() == '' ? 0 : $('#schedPWN').val();
	var g = $('#schedPRE').val();
	var h = $('#schedCYC').val();
	var i = $('#schedfr').val();
	var j = $('#schedto').val();
	var k = $('#schedOPR').val();
	var l = $('#schedLogID').val();
	var logState = $('#schedLogID').data('state');

	if(b == '' || i == '' || h == '' || g == '') {
		showPrompt(lang[flags.pref.lang].schedule.prompts.schedFillReq, "Error");
		return;
	}

	if(b.toUpperCase() == "NONE" || b.toUpperCase() == "NEW") {
		showPrompt(lang[flags.pref.lang].schedule.prompts.schedInvalidJob, "Error");
		return;
	}

	if(parseFloat(g) < 0.1 || parseInt(h) < 0) { //allow 0 on CT as advised by Eiji-san, 10/26
	// if(parseFloat(g) <= 0 || parseInt(h) <= 0) {
		showPrompt(lang[flags.pref.lang].schedule.prompts.schedNegVal, "Error");
		return;
	}

	if(parseFloat(f) < 0 || parseFloat(e) < 0) {
		showPrompt(lang[flags.pref.lang].schedule.prompts.schedZeroVal, "Error");
		return;
	}

	if((parseFloat(e) > 1000000000) || (parseFloat(f) > 1000000000)) {
		showPrompt(lang[flags.pref.lang].schedule.prompts.schedTgtMaxVal, "Error");
		return;
	}

	if(parseInt(h) > 999999) {
		showPrompt(lang[flags.pref.lang].schedule.prompts.schedCycleMaxVal, "Error");
		return;
	}

	if(parseFloat(g) > 100) {
		showPrompt(lang[flags.pref.lang].schedule.prompts.schedPrescaleMaxVal, "Error");
		return;
	}

	var fr = Date.parse(i);
	var to = Date.parse(j);
	if(fr > to) {
		showPrompt(lang[flags.pref.lang].schedule.prompts.schedInvalidDate, "Error");
		return;
	}

	if(parseFloat(f) > parseFloat(e)) {
		showPrompt(lang[flags.pref.lang].schedule.prompts.schedPrewarnExceed, "Error");
		return;
	}

	$.ajax({
		type: 'POST',
		url: 'php/joupdateschedule.php',
		data: {
			scdid: l,
			devid: a,
			devjb: b,
			devmd: c,
			devmt: d,
			devtg: parseFloat(e).toFixed(1),
			devpw: parseFloat(f).toFixed(1),
			devps: parseFloat(g).toFixed(1),
			devcc: parseInt(h),
			devst: i,
			deven: j,
			devop: k,
			logst: logState,
			ongoing: $('#schedLogID').data('state'),
			status: $('#schedLogID').data('flg')
		},
		dataType:'json',
		async: true,
		// timeout:5000,
		success: function(data) {
			/** Check if data is empty **/
			if(data == 'failed') {
				showPrompt(lang[flags.pref.lang].schedule.prompts.schedUpdFailed, 'Failed');
			} else if(data == 'failedsend') {
				showPrompt(lang[flags.pref.lang].schedule.prompts.schedUpdInc, 'Failed');

				if(flags.displayMode.schedule == 'view') {
					scheduleUpdate();
				}
				flags.schedule.loadedTgt = parseFloat(e);
			} else if(data == 'failstatus') {
				showPrompt(lang[flags.pref.lang].schedule.prompts.statuschanged, 'Failed');
			} else if(data == 'success') {
				showPrompt(lang[flags.pref.lang].schedule.prompts.schedUpdSuccess, "Success");

				if(flags.displayMode.schedule == 'view') {
					scheduleUpdate();
				}
				flags.schedule.loadedTgt = parseFloat(e);
			} else {
				showPrompt(data, 'Failed');
			}
		}
	});
}

function requestScheduleInfo(rowId) {
	//  console.log('requestScheduleInfo()');
	loadScheduleInfo(rowId);
	flags.schedule.recentAddedId = '';
	setScheduleLockState(null, null, localStorage.getItem('schedlockedId'), 0, function() {
		setScheduleLockState(rowId, flags.schedule.table.rows('#schedRow' + rowId + '_').data()[0], null, 1, function() {});
		query_start();
	});
}

function loadScheduleInfo(rowId) {
	// console.log('loadScheduleInfo()');
	var data = flags.schedule.table.rows('#schedRow' + rowId + '_').data()[0];

	flags.schedule.loadedDeviId = data.devdid;
	flags.schedule.loadedTgt = data.devtgt;
	$('#schedID').val(data.devdid);
	$('#schedJOB').val(data.devjob);
	$('#schedMOD').val(data.devmod);
	$('#schedPRE').val(data.devpre);
	$('#schedPWN').val(data.devpwn);
	$('#schedCYC').val(data.devcyc);
	$('#schedOPR').val(data.devopr);
	$('#schedTGT').val(data.devtgt);
	$('#schedMAT').val(data.devmat);
	$('#schedfr').val(data.devstt);
	var testBlank = data.devend == "--" ? '' : data.devend;
	$('#schedto').val(testBlank);
	$('#schedLogID').val(data.devrid);
	$('#schedLogID').data('state', data.devsta);
	$('#schedLogID').data('flg', data.devflg);
	//var userId = $('#accntInfoHolder').data('aid');
	var userId = $('#accntInfoHolder').html();

	$('#upd-sidepanel-btn').removeAttr('disabled');
	if(data.devlck == '1' && data.devusr != userId) {
		$('#del-sidepanel-btn').attr('disabled', true);
		$('#upd-sidepanel-btn').attr('disabled', true);
		$('#lockIcon').show();
	} else if(data.devflg == '1') {
		$('#lockIcon').hide();
		$('#del-sidepanel-btn').attr('disabled', true);
		if(data.devsta == 'completed') {
			$('#schedPRE').attr('disabled', true);
			$('#schedPWN').attr('disabled', true);
			$('#schedCYC').attr('disabled', true);
			$('#schedTGT').attr('disabled', true);
		} else {
			$('#schedPRE').attr('disabled', true);
			$('#schedPWN').attr('disabled', false);
			$('#schedCYC').attr('disabled', true);
			$('#schedTGT').attr('disabled', false);
		}
	} else {
		$('#lockIcon').hide();
		$('#del-sidepanel-btn').attr('disabled', false);
		$('#schedPRE').attr('disabled', false);
		$('#schedPWN').attr('disabled', false);
		$('#schedCYC').attr('disabled', false);
		$('#schedTGT').attr('disabled', false);
	}
}

function updateMachineOptions(rowId) {
	$.ajax({
		type: 'POST',
		url: 'php/jogetdevices.php',
		data: '',
		dataType:'json',
		async: true,
		success: function(data) {
			/** Check if data is empty **/
			if(!(data === null)) {
				var str = '';
				for(var x = 0; x < data.length; x++) {
					str += '<option value="' + data[x].devdid + '">';
					if(data[x].devnme != '' && data[x].devnme != null) {
						str += data[x].devnme;
					} else {
						str += data[x].devdid;
					}
				}
				$('#schedID').html(str);

				if(rowId !== null && rowId != '' && rowId !== undefined) {
					loadScheduleInfo(rowId);
				}
				$('#schedule-tab .tbl-container').addClass('sidepanel');

				if(flags.displayMode.schedule == 'view') {
					scheduleUpdate();
				}
			} else {
				showPrompt(lang[flags.pref.lang].control.prompts.failedIdNo, "Error");
			}
		}
	});
}

function setScheduleLockState(rowId, tableData, savedSid, state, callback) {
	// console.log('setScheduleLockState');
	// console.log(`${rowId}, ${tableData}, ${savedSid}, ${state}`);
	// console.log(tableData);
	if($.isEmptyObject(flags.schedule.table)) {
		return;
	}

	var userId = $('#accntInfoHolder').data('aid');

	$.ajax({
		type: 'POST',
		url: 'php/joschedlock.php',
		data: { 
			cmd: 'write', 
			sid: (!state ? savedSid : (tableData !== null ? tableData.devrid : savedSid)), 
			val: state, 
			pid: userId 
		},
		dataType:'json',
		async: true,
		success: function(data) {
			/** Check if data is empty **/
			if(data != 'failed') {
				if(state) {
					if(tableData === null || tableData == '') {
						localStorage.setItem('schedlockedId', savedSid);
						$('#schedLogID').val(savedSid);
					} else {
						localStorage.setItem('schedlockedId', tableData.devrid);
						updateMachineOptions(rowId);
						// console.log("updateMachineOptions");
					}
				} else {
					callback();
				}
			} else {
				// console.log("Failed to set the lock status!");
				callback();
			}
		},
		fail: function() {
			// console.log("Transaction failed on setting schedule lock");
			callback();
		}
	});
}

function userVerificationOnTgt() {
	var logState = $('#schedLogID').data('state');
	var e = $('#schedTGT').val() == '' ? 0 : $('#schedTGT').val();

	if(parseFloat(e) < flags.schedule.loadedTgt && logState == 'running') {
		showWarning(lang[flags.pref.lang].schedule.prompts.schedTgtLower, 'updateSchedule');
	} else {
		updateScheduleInfo();
	}
}

function getScheduleInfo(scheduleId, callback) {
	if(scheduleId == '' || scheduleId === undefined) {
		return;
	}

	$.ajax({
		type: 'POST',
		url: 'php/jogetschedulebyjob.php',
		data: { sid: scheduleId },
		dataType:'json',
		async: true,
		success: function(data) {
			/** Check if data is empty **/
			if(!(data === null)) {
				callback(data);
			} else {
				showPrompt(lang[flags.pref.lang].schedule.prompts.schedAlreadyDel, 'Error');
			}
		},
		fail: function() {
			showPrompt(lang[flags.pref.lang].schedule.prompts.scheduleDataFail, 'Failed');
		}
	});
}

function clearScheduleInfo() {
	$('#schedID option').removeAttr("selected");
	$('#schedJOB').val('');
	$('#schedMOD').val('');
	$('#schedPRE').val('');
	$('#schedPWN').val('');
	$('#schedCYC').val('');
	$('#schedOPR').val('');
	$('#schedTGT').val('');
	$('#schedMAT').val('');
	$('#schedfr').val('');
	$('#schedto').val('');
	$('#schedLogID').val('');
	$('#schedPRE').attr('disabled', false);
	$('#schedPWN').attr('disabled', false);
	$('#schedCYC').attr('disabled', false);
	$('#schedTGT').attr('disabled', false);
	$('#upd-sidepanel-btn').attr('disabled', true);
	$('#del-sidepanel-btn').attr('disabled', true);
	$('#schedLogID').data('state', '');
	$('#schedLogID').data('flg', '');
	$('#lockIcon').hide();
	
	setScheduleLockState(null, null, localStorage.getItem('schedlockedId'), 0, function() {});
	if(flags.displayMode.schedule == 'view') {
		scheduleUpdate();
	}

}