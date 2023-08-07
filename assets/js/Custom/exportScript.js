function exportRecord() {
	var filterObj = [];
	console.time("Duration");
	query_stop();
	if(flags.ajaxRequestStatus !== null) {
		flags.ajaxRequestStatus.abort();
		flags.ajaxRequestStatus = null;
	}

	var dateToUse = getDateTimeNow('-');
	if(flags.displayMode.others == 'today') {
		dateToUse.fr = 'none';
		dateToUse.to = 'none';
	} else {
		dateToUse.fr = addStartTime({dateString: $('.dateFr:not(.schedDate .dbmDate)').eq(0).val()});
		dateToUse.to = addEndTime({dateString: $('.dateTo:not(.schedDate .dbmDate)').eq(0).val()});
	}

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

	/* Get Summary table order */
	var tempOrderVal = flags.summary.table.order()[0];
	// Hanz: Uncommented getDataOrder for sorting.
	var order = getDataOrder(tempOrderVal);
	// var order = "job_info.timestampStart ASC, job_schedule.job ASC";
	const translation = {
		'title': [
			lang[flags.pref.lang].export.summary,
			lang[flags.pref.lang].export.downtime
		],
		'header': [
			[
				lang[flags.pref.lang].jobdetails.machine,
				lang[flags.pref.lang].jobdetails.joborder,
				lang[flags.pref.lang].jobdetails.prodstart,
				lang[flags.pref.lang].jobdetails.prodend,
				lang[flags.pref.lang].jobdetails.model,
				lang[flags.pref.lang].jobdetails.material,
				lang[flags.pref.lang].jobdetails.targetlong,
				lang[flags.pref.lang].jobdetails.prewarn,
				lang[flags.pref.lang].jobdetails.outputqty,
				lang[flags.pref.lang].jobdetails.rejectqty,
				lang[flags.pref.lang].jobdetails.yield,
				lang[flags.pref.lang].jobdetails.achievement,
				lang[flags.pref.lang].jobdetails.jobduration,
				lang[flags.pref.lang].jobdetails.prodduration,
				lang[flags.pref.lang].jobdetails.downduration,
				lang[flags.pref.lang].jobdetails.schedend,
				lang[flags.pref.lang].jobdetails.operator,
				lang[flags.pref.lang].jobdetails.nextjob,
				lang[flags.pref.lang].jobdetails.status,
				lang[flags.pref.lang].jobdetails.cycle,
				lang[flags.pref.lang].jobdetails.prescale,
				lang[flags.pref.lang].jobdetails.rejinput
			],
			[
				lang[flags.pref.lang].jobdetails.machine,
				lang[flags.pref.lang].jobdetails.joborder,
				lang[flags.pref.lang].jobdetails.model,
				lang[flags.pref.lang].jobdetails.material,
				lang[flags.pref.lang].jobdetails.operator,
				lang[flags.pref.lang].jobdetails.downstart,
				lang[flags.pref.lang].jobdetails.downend,
				lang[flags.pref.lang].jobdetails.duration,
				lang[flags.pref.lang].jobdetails.downsource,
				lang[flags.pref.lang].jobdetails.downinput
			]
		],
		'status': {
			'PRODUCTIVE': lang[flags.pref.lang].status['PRODUCTIVE'],
			'UNPRODUCTIVE': lang[flags.pref.lang].status['UNPRODUCTIVE'],
			'RUNNING': lang[flags.pref.lang].status['PRODUCTIVE'],
			'DOWN': lang[flags.pref.lang].status['UNPRODUCTIVE'],
			'COMPLETED': lang[flags.pref.lang].status['COMPLETED'],
			'COMPLETED*': lang[flags.pref.lang].status['COMPLETED*'],
			'CONTINUED': lang[flags.pref.lang].status['CONTINUED'],
			'OFFLINE': lang[flags.pref.lang].status['OFFLINE']
		},
		'misc': {
			'none': lang[flags.pref.lang].jotimechart.norecord
		}
	};

	$.ajax({
		type: 'POST',
		url: 'php/joexportTest.php',
		data: {
			lang: flags.pref.lang, 
            translation: translation,
			start: dateToUse.fr, 
			end: dateToUse.to, 
			filter: JSON.stringify(filterObj),
			order: order,
			consolidated: $('#consolidate-btn').prop("checked"), 
			ongoing: ($('#' + flags.currPage).find('.showJob-btn').hasClass('active') ? false : true)
		},
		dataType:'json',
		async: true,
		success: function(data) {
			if(data == '') {
				/** Put GIF or images here **/
				showPrompt(lang[flags.pref.lang].export.prompts.expTooLarge, 'failed');
			} else {
				downloadFile(data.file, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Gemba_Log_Records' + "_" + dateToUse.tms + ".xlsx");
				console.timeEnd("Duration");
			}
			$('#promptModal button').attr('disabled', false);
			$('#promptModal').modal('hide');
			$('#promptModal').off('keydown', ignore_escape);

			flags.ajaxRequestStatus = null;
			query_start();
		},
	    complete: function(jqXHR, textStatus){
    		if (jqXHR.status == 500) {
				showPrompt(lang[flags.pref.lang].export.prompts.errTooLarge, 'failed');
				$('#promptModal button').attr('disabled', false);
				$('#promptModal').off('keydown', ignore_escape);
				console.log("error download");

				if(flags.ajaxRequestStatus !== null) {
					flags.ajaxRequestStatus.abort();
					flags.ajaxRequestStatus = null;
				}
				query_start();
    		} else if (jqXHR.status == 400 || textStatus == "error" || textStatus == "failed") {
    			showPrompt(lang[flags.pref.lang].export.prompts.errRequestFailed, 'failed');
				$('#promptModal button').attr('disabled', false);
				$('#promptModal').off('keydown', ignore_escape);
				if(flags.ajaxRequestStatus !== null) {
					flags.ajaxRequestStatus.abort();
					flags.ajaxRequestStatus = null;
				}
				query_start();
    		}
	    }
	});
	return;
}

function exportDowntime() {
	var filterObj = [];

	query_stop();
	if(flags.ajaxRequestStatus !== null) {
		flags.ajaxRequestStatus.abort();
		flags.ajaxRequestStatus = null;
	}

	var dateToUse = getDateTimeNow('-');
	if(flags.displayMode.others == 'today') {
		dateToUse.fr = 'none';
		dateToUse.to = 'none';
	} else {
		dateToUse.fr = addStartTime({dateString: $('.dateFr:not(.schedDate .dbmDate)').eq(0).val()});
		dateToUse.to = addEndTime({dateString: $('.dateTo:not(.schedDate .dbmDate)').eq(0).val()});
	}

	if (flags.unproductive.isFiltered) {
		for (var i = 0; i < 6; i++) {
			var tempData = flags.unproductive.selectedFilter[i], newData = [];
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
						filterObj.push("'downtime_source_list.displayName'");
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
	var tempOrderVal = flags.unproductive.table.order()[0];
	// var order = getDataOrder(tempOrderVal);
	var order = "job_info.timestampStart ASC, job_schedule.job ASC";

	$.ajax({
		type: 'POST',
		url: 'php/joexportdt.php',
		data: {
			lang: flags.pref.lang, 
			start: dateToUse.fr, 
			end: dateToUse.to, 
			filter: JSON.stringify(filterObj),
			order: order,
			ongoing: ($('#' + flags.currPage).find('.showJob-btn').hasClass('active') ? false : true)
		},
		dataType:'json',
		async: true,
		success: function(data) {
			if(data == '') {
				/** Put GIF or images here **/
				showPrompt(lang[flags.pref.lang].export.prompts.expTooLarge, 'failed');
			} else {
				downloadFile(data.file, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Gemba_Downtime_Records' + "_" + dateToUse.tms + ".xlsx");
			}
			$('#promptModal button').attr('disabled', false);
			$('#promptModal').modal('hide');

			flags.ajaxRequestStatus = null;
			query_start();
		},
	    complete: function(jqXHR, textStatus){
    		if (jqXHR.status == 500) {
				showPrompt(lang[flags.pref.lang].export.prompts.errTooLarge, 'failed');
				$('#promptModal button').attr('disabled', false);
				console.log("error download");

				if(flags.ajaxRequestStatus !== null) {
					flags.ajaxRequestStatus.abort();
					flags.ajaxRequestStatus = null;
				}
				query_start();
    		} else if (jqXHR.status == 400 || textStatus == "error" || textStatus == "failed") {
    			showPrompt(lang[flags.pref.lang].export.prompts.errRequestFailed, 'failed');
				$('#promptModal button').attr('disabled', false);

				if(flags.ajaxRequestStatus !== null) {
					flags.ajaxRequestStatus.abort();
					flags.ajaxRequestStatus = null;
				}
				query_start();
    		}
	    }
	});
}

function exportDetailedDowntime() {
	var filterObj = [];

	query_stop();
	if(flags.ajaxRequestStatus !== null) {
		flags.ajaxRequestStatus.abort();
		flags.ajaxRequestStatus = null;
	}

	var dateToUse = getDateTimeNow('-');
	//  there is no "today" button in jotimechart tab
	// if(flags.displayMode.others == 'today') {
	// 	dateToUse.fr = dateToUse.date + ' 00:00:00';
	// 	dateToUse.to = dateToUse.date + ' 23:59:59';
	// } else {
		dateToUse.fr = addStartTime({dateString: $('.dateFr:not(.schedDate .dbmDate)').eq(0).val()});
		dateToUse.to = addEndTime({dateString: $('.dateTo:not(.schedDate .dbmDate)').eq(0).val()});
	// }

	/* Get Downtime table order */
	// var tempOrderVal = flags.detailedlog.table.order()[0];
	// var order = getDataOrder(tempOrderVal);
	var order = "downtime.startTime ASC, job_schedule.job ASC";
    const translation = {
        'title': lang[flags.pref.lang].export.event,
        'header': [
            lang[flags.pref.lang].jobdetails.machine,
            lang[flags.pref.lang].jobdetails.joborder,
            lang[flags.pref.lang].jobdetails.prodstart,
            lang[flags.pref.lang].jobdetails.model,
            lang[flags.pref.lang].jobdetails.material,
            lang[flags.pref.lang].jobdetails.operator,
            lang[flags.pref.lang].jobdetails.eventstart,
            lang[flags.pref.lang].jobdetails.eventend,
            lang[flags.pref.lang].jobdetails.eventduration,
            lang[flags.pref.lang].jobdetails.event,
            lang[flags.pref.lang].jobdetails.downcause,
            lang[flags.pref.lang].jobdetails.downinput
        ],
        'misc': lang[flags.pref.lang].jotimechart.norecord
    };

	$.ajax({
		type: 'POST',
		url: 'php/joexportdetaileddt.php',
		data: {
			lang: flags.pref.lang,
            translation: translation,
			dev: $('#detail-detailDevice').val(),
			sched_id: $('#detail-detailJobs').val(), 
			start: dateToUse.fr, 
			end: dateToUse.to, 
			filter: JSON.stringify(filterObj),
			order: order,
			daily: (flags.displayMode.others == 'today' ? true : false)
		},
		dataType:'json',
		async: true,
		success: function(data) {
			if(data == '') {
				/** Put GIF or images here **/
				showPrompt(lang[flags.pref.lang].export.prompts.expTooLarge, 'failed');
			} else {
				const eventrecordslbl = lang[flags.pref.lang].jotimechart.excelexportname;
				downloadFile(data.file, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', `Gemba_${eventrecordslbl}` + "_" + joTimeChart.timechartObjects.selectedJobLabel + ".xlsx");
			}
			$('#promptModal button').attr('disabled', false);
			$('#promptModal').modal('hide');
			$('#promptModal').off('keydown', ignore_escape);

			flags.ajaxRequestStatus = null;
			query_start();
		},
	    complete: function(jqXHR, textStatus){
    		if (jqXHR.status == 500) {
				showPrompt(lang[flags.pref.lang].export.prompts.errTooLarge, 'failed');
				$('#promptModal button').attr('disabled', false);
				$('#promptModal').off('keydown', ignore_escape);
				console.log("error download");

				if(flags.ajaxRequestStatus !== null) {
					flags.ajaxRequestStatus.abort();
					flags.ajaxRequestStatus = null;
				}
				query_start();
    		} else if (jqXHR.status == 400 || textStatus == "error" || textStatus == "failed") {
    			showPrompt(lang[flags.pref.lang].export.prompts.errRequestFailed, 'failed');
				$('#promptModal button').attr('disabled', false);
				$('#promptModal').off('keydown', ignore_escape);
				if(flags.ajaxRequestStatus !== null) {
					flags.ajaxRequestStatus.abort();
					flags.ajaxRequestStatus = null;
				}
				query_start();
    		}
	    }
	});
}

function exportRecord_old() {
	console.time("Duration");

	query_stop();
	if(flags.ajaxRequestStatus !== null) {
		flags.ajaxRequestStatus.abort();
		flags.ajaxRequestStatus = null;
	}

	var dateToUse = getDateTimeNow('-');
	if(flags.displayMode.others == 'today') {
		dateToUse.fr = 'none';
		dateToUse.to = 'none';
	} else {
		dateToUse.fr = addStartTime({dateString: $('.dateFr:not(.schedDate .dbmDate)').eq(0).val()});
		dateToUse.to = addEndTime({dateString: $('.dateTo:not(.schedDate .dbmDate)').eq(0).val()});
	}

	if(flags.summary.table.data().count() < 1) {
		showPrompt('No data to export.', 'Error');
		$('#promptModal button').attr('disabled', false);
		return;
	}

	if(flags.ajaxRequestStatus !== null) {
		flags.ajaxRequestStatus.abort();
		flags.ajaxRequestStatus = null;
	}

	var showAllJobs = $('#' + flags.currPage).find('.showJob-btn').hasClass('active') ? 0 : 1;
	var urlAddr;
	if(showAllJobs && flags.displayMode.others == 'today') {
		urlAddr = 'php/jounproductiveAll.php';
	} else {
		// urlAddr = 'php/jounproductive.php';
		urlAddr = 'php/jounproductiveExport.php';
	}

	flags.ajaxRequestStatus = $.ajax({
		type: 'POST',
		url: urlAddr,
		data: { start: dateToUse.fr, end: dateToUse.to, history: 1 }, //checkHistoryBtn() change to 1
		dataType:'json',
		async: true,
		success: function(retData) {
			/** Check if data is empty **/
			var realData = [], arrayForTally = [];

			/** Use datatable sorting before acquiring new data **/
			if($.isEmptyObject(flags.unproductive.table)) {
				initUnproductive();
			}
			arrayForTally = getAllScheduleId(flags.summary.table.rows().data());
			realData = relateSummaryAndUnproductiveData(arrayForTally, retData);
			flags.unproductive.table.clear().rows.add(realData).draw(false);

			/** Stringify the data **/
			// var jsonSummaryData = JSON.stringify(flags.summary.table.rows().data());
			// var jsonUnproductiveData = JSON.stringify(flags.unproductive.table.rows().data());

			// var formdata = new FormData();
			// formdata.append('lang', flags.pref.lang);
			// formdata.append('datatbl', jsonSummaryData);
			// formdata.append('dwntbl', jsonUnproductiveData);

			var test = [];
			$.each( flags.summary.table.rows().data(), function( key, value ) {
              test.push(value);
            });
            var jsonSummaryData = JSON.stringify(test);

            var test = [];
			$.each( flags.unproductive.table.rows().data(), function( key, value ) {
              test.push(value);
            });
            var jsonUnproductiveData = JSON.stringify(test);

			flags.ajaxRequestStatus = null;

			/** original single request query, turned to nested **/
			flags.ajaxRequestStatus = $.ajax({
				type: 'POST',
				url: 'php/joexportnew.php',
				data: {
					'lang': flags.pref.lang,
					'datatbl': jsonSummaryData,
					'dwntbl': jsonUnproductiveData,
				},
				// processData: false,
		  //  		contentType: false,
				dataType: 'json',
				success: function(data) {
					if(data == '') {
						/** Put GIF or images here **/
						showPrompt(lang[flags.pref.lang].export.prompts.expTooLarge, 'failed');
					} else {
						downloadFile(data.file, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Gemba_Log_Records' + "_" + dateToUse.tms + ".xlsx");
						// var $a = $("<a>");
					 //    $a.attr("href",data.file);
					 //    $("body").append($a);
					 //    $a.attr("download", 'Gemba_Log_Records' + "_" + dateToUse.tms + ".xlsx");
					 //    $a[0].click();
					 //    $a.remove();

						console.timeEnd("Duration");
					}
					$('#promptModal button').attr('disabled', false);
					$('#promptModal').modal('hide');

					flags.ajaxRequestStatus = null;
					query_start();
				},
			    complete: function(jqXHR, textStatus){
            		if (jqXHR.status == 500) {
						showPrompt(lang[flags.pref.lang].export.prompts.errTooLarge, 'failed');
						$('#promptModal button').attr('disabled', false);
						console.log("error download");

						if(flags.ajaxRequestStatus !== null) {
							flags.ajaxRequestStatus.abort();
							flags.ajaxRequestStatus = null;
						}
						query_start();
            		} else if (jqXHR.status == 400 || textStatus == "error" || textStatus == "failed") {
            			showPrompt(lang[flags.pref.lang].export.prompts.errRequestFailed, 'failed');
						$('#promptModal button').attr('disabled', false);

						if(flags.ajaxRequestStatus !== null) {
							flags.ajaxRequestStatus.abort();
							flags.ajaxRequestStatus = null;
						}
						query_start();
            		}
			    }
			});
		},
		complete: function(jqXHR, textStatus){
    		if (jqXHR.status == 500) {
				showPrompt(lang[flags.pref.lang].export.prompts.errTooLarge, 'failed');
				$('#promptModal button').attr('disabled', false);
				console.log("error download");

				if(flags.ajaxRequestStatus !== null) {
					flags.ajaxRequestStatus.abort();
					flags.ajaxRequestStatus = null;
				}
				query_start();
    		} else if (jqXHR.status == 400 || textStatus == "error" || textStatus == "failed") {
    			showPrompt(lang[flags.pref.lang].export.prompts.errRequestFailed, 'failed');
				$('#promptModal button').attr('disabled', false);

				if(flags.ajaxRequestStatus !== null) {
					flags.ajaxRequestStatus.abort();
					flags.ajaxRequestStatus = null;
				}
				query_start();
    		}
	    }
	});
}

function exportDowntime_old() {
	var dateToUse = getDateTimeNow('-');

	query_stop();
	if(flags.ajaxRequestStatus !== null) {
		flags.ajaxRequestStatus.abort();
		flags.ajaxRequestStatus = null;
	}

	/** Stringify the data **/
	var jsonUnproductiveData = JSON.stringify(flags.unproductive.table.rows().data());

	var formdata = new FormData();
	formdata.append('lang', flags.pref.lang);
	formdata.append('dwntbl', jsonUnproductiveData);

	/** original single request query, turned to nested **/
	flags.ajaxRequestStatus = $.ajax({
		type: 'POST',
		url: 'php/joexportdt.php',
		data: formdata,
		processData: false,
   		contentType: false,
		dataType:'json',
		success: function(data) {
			if(data == '') {
				/** Put GIF or images here **/
				showPrompt(lang[flags.pref.lang].export.prompts.expTooLarge, 'failed');
			} else {
				downloadFile(data.file, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Gemba_Downtime_Records' + "_" + dateToUse.tms + ".xlsx");

				// var $a = $("<a>");
			 //    $a.attr("href",data.file);
			 //    $("body").append($a);
			 //    $a.attr("download", 'Gemba_Downtime_Records' + "_" + dateToUse.tms + ".xlsx");
			 //    $a[0].click();
			 //    $a.remove();
			}
			$('#promptModal button').attr('disabled', false);
			$('#promptModal').modal('hide');

			flags.ajaxRequestStatus = null;
			query_start();
		},
		complete: function(jqXHR, textStatus){
    		if (jqXHR.status == 500) {
				showPrompt(lang[flags.pref.lang].export.prompts.errTooLarge, 'failed');
				$('#promptModal button').attr('disabled', false);
				console.log("error download");

				if(flags.ajaxRequestStatus !== null) {
					flags.ajaxRequestStatus.abort();
					flags.ajaxRequestStatus = null;
				}
				query_start();
    		} else if (jqXHR.status == 400 || textStatus == "error" || textStatus == "failed") {
    			showPrompt(lang[flags.pref.lang].export.prompts.errRequestFailed, 'failed');
				$('#promptModal button').attr('disabled', false);

				if(flags.ajaxRequestStatus !== null) {
					flags.ajaxRequestStatus.abort();
					flags.ajaxRequestStatus = null;
				}
				query_start();
    		}
	    }
	});
}

function exportTimechart() {
	
	var dateToUse = getDateTimeNow('-');
	flags.summary.chart.exportChart({
			format: 'png',
			fileName: `Summary_Chart_${dateToUse.tms}`
		});
	
	$('#promptModal button').attr('disabled', false);
	$('#promptModal').modal('hide');
	$('#promptModal').off('keydown', ignore_escape);

	// exportTimegraph();
	// var svgImg = $('#timechart').children('svg')[0];
	// var serialCode = new XMLSerializer();

	// String.prototype.replaceAll = function(search, replacement) {
	//     var target = this;
	//     return target.replace(new RegExp(search, 'g'), replacement);
	// };

	// try {
	// 	var str = serialCode.serializeToString(svgImg);
	// } catch (err) {
	// 	$('#promptModal button').attr('disabled', false);
	// 	$('#promptModal').modal('hide');
	// 	return;
	// }

	// var dateToUse = getDateTimeNow('-');
	// var image = new Image();
	// image.width = '1600';
	// image.height = '768';
	// image.src = 'data:image/svg+xml;utf8,' + escape(str);
	// if(flags.pref.lang != 'en') {
	// 	image.src = image.src.replace(toUnicode(lang[flags.pref.lang].timechart.legends['Unproductive']), lang[flags.pref.lang].timechart.legends['Unproductive']);
	// 	image.src = image.src.replace(toUnicode(lang[flags.pref.lang].timechart.legends['Productive']), lang[flags.pref.lang].timechart.legends['Productive']);
	// 	image.src = image.src.replace(toUnicode(lang[flags.pref.lang].timechart.pagetitle), lang[flags.pref.lang].timechart.pagetitle);
	// }
	// // image.src = image.src.replace('%u21AA', '\u21AA ');
	// image.src = image.src.replaceAll('%u21AA', '\u21AA ');
	// image.src = image.src.replaceAll('%u524D', '\u524D ');
	// image.src = image.src.replaceAll('%u6B21', '\u6B21 ');
	// image.style.backgroundColor = (flags.pref.theme == 'light' ? 'white' : 'black');
	// document.querySelector('body').appendChild(image);
	// image.onload = function() {
	//     image.onload = function() {};
	//     var canvas = document.createElement('canvas');
	//     canvas.width = image.width;
	//     canvas.height = image.height;
	//     canvas.style.backgroundColor = (flags.pref.theme == 'light' ? 'white' : 'black');
	//     var context = canvas.getContext('2d');
	//     context.drawImage(image, 0, 0);
	//     image.src = canvas.toDataURL();

	// 	var e = html2canvas(image);
	// 	e.then(canvas => {
	// 		var url = canvas.toDataURL('image/png');
	// 		var link = document.createElement("a");
	// 		link.href = url;
	// 		link.download = 'timechart_' + dateToUse.tms + '.png';
	// 		link.click(link);

	// 		$('canvas').remove();
	// 		$('body > img').remove();
	// 		$('#promptModal button').attr('disabled', false);
	// 		$('#promptModal').modal('hide');
	// 	});
	// }
}

function ignore_escape (e) {
	if (e.key == "Escape")
	{
		e.preventDefault();
        e.stopImmediatePropagation();
	}
}

function handleDownload() {
	$('#promptModal').on('keydown', ignore_escape);
	$('#promptModal button').attr('disabled', true);
	showPrompt('<span role="status" class="spinner-border spinner-border-sm text-primary"></span>&nbsp;' + lang[flags.pref.lang].general.loadexport, 'wait');

	$('#promptModal').on('shown.bs.modal', function() {
		$('#promptModal').off('shown.bs.modal');
		switch(flags.currPage) {
			case 'summary-tab':
				if(flags.summary.isChartMode) {
					exportTimechart();
				} else {
					exportRecord();
				}
				break;

			case 'unproductive-tab':
				exportDowntime();
				break;

			case 'detail-tab':
				if(flags.detailedlog.isGraphMode) {
					exportTimegraph();
				} else {
					exportDetailedDowntime();
				}
				break;

			case 'visual-tab':
				exportVisualization();
				break;

			default:
				$('#promptModal').modal('hide');
				return;
		}
	});
}

function exportTimegraph() {
	if (!$.isEmptyObject(joTimeChart.timechartObjects.chart)) {
		const jobLabel = joTimeChart.timechartObjects.selectedJobLabel;
		const excelnamelbl = lang[flags.pref.lang].jotimechart.excelexportname;
		joTimeChart.timechartObjects.chart.exportChart({ 
			format: 'png',
			fileName: `${excelnamelbl}_${jobLabel}`
		});
	}
	$('#promptModal button').attr('disabled', false);
	$('#promptModal').modal('hide');
	$('#promptModal').off('keydown', ignore_escape);
}

function exportDetailedDowntime_old() {
	var dateToUse = getDateTimeNow('-');

	if(flags.detailedlog.table.data().count() < 1) {
		showPrompt('No data to export.', 'Error');
		$('#promptModal button').attr('disabled', false);
		return;
	}

	query_stop();
	if(flags.ajaxRequestStatus !== null) {
		flags.ajaxRequestStatus.abort();
		flags.ajaxRequestStatus = null;
	}

	/** Stringify the data **/
	var jsonUnproductiveData = JSON.stringify(flags.detailedlog.table.rows().data());

	var formdata = new FormData();
	formdata.append('lang', flags.pref.lang);
	formdata.append('dwntbl', jsonUnproductiveData);

	/** original single request query, turned to nested **/
	flags.ajaxRequestStatus = $.ajax({
		type: 'POST',
		url: 'php/joexportdetaileddt.php',
		data: formdata,
		processData: false,
   		contentType: false,
		dataType:'json',
		success: function(data) {
			if(data == '') {
				/** Put GIF or images here **/
				showPrompt(lang[flags.pref.lang].export.prompts.expTooLarge, 'failed');
			} else {
				var $a = $("<a>");
			    $a.attr("href",data.file);
			    $("body").append($a);
			    $a.attr("download", 'Gemba_Detailed_Event_Records' + "_" + dateToUse.tms + ".xlsx");
			    $a[0].click();
			    $a.remove();
			}
			$('#promptModal button').attr('disabled', false);
			$('#promptModal').modal('hide');

			flags.ajaxRequestStatus = null;
			query_start();
		},
		complete: function(jqXHR, textStatus){
    		if (jqXHR.status == 500) {
				showPrompt(lang[flags.pref.lang].export.prompts.expTooLarge, 'failed');
				$('#promptModal button').attr('disabled', false);
				console.log("error download");

				if(flags.ajaxRequestStatus !== null) {
					flags.ajaxRequestStatus.abort();
					flags.ajaxRequestStatus = null;
				}
				query_start();
    		} else if (jqXHR.status == 400 || textStatus == "error" || textStatus == "failed") {
    			showPrompt(lang[flags.pref.lang].export.prompts.errRequestFailed, 'failed');
				$('#promptModal button').attr('disabled', false);

				if(flags.ajaxRequestStatus !== null) {
					flags.ajaxRequestStatus.abort();
					flags.ajaxRequestStatus = null;
				}
				query_start();
    		}
	    }
	});
}

function b64toBlob(b64Data, contentType, sliceSize) {
	contentType = contentType || '';
	sliceSize = sliceSize || 512;

	var byteCharacters = atob(b64Data);
	var byteArrays = [];

	for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		var slice = byteCharacters.slice(offset, offset + sliceSize);
		var byteNumbers = new Array(slice.length);
		for (var i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}
		var byteArray = new Uint8Array(byteNumbers);
		byteArrays.push(byteArray);
	}
	var blob = new Blob(byteArrays, {type: contentType});
	return blob;
}

function downloadFile(data, fileType, fileName) { 
	var blob = b64toBlob(data, fileType);
	var blobUrl = URL.createObjectURL(blob);

	var a = document.createElement('a');
	a.href = blobUrl;
	a.download = fileName;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

function getDataOrder(tempOrderVal) {
	var order = '';
	var prefix = "CASE WHEN ";
	var suffix = " REGEXP \\'^[0-9]+$\\' THEN 1 ELSE 0 END";
	var predefSuffix_1 = "job_info.timestampStart " + tempOrderVal[1];
	var predefSuffix_2 = prefix + 'devicename' + suffix + ", devicename " + tempOrderVal[1] + ", " + prefix + 'job_schedule.job' + suffix + ", job_schedule.job " + tempOrderVal[1];
	var predefSuffix_3 = "job_info.timestampStart " + tempOrderVal[1] + ", " + prefix + 'job_schedule.job' + suffix + ", job_schedule.job " + tempOrderVal[1];

	switch (parseInt(tempOrderVal[0])) {
		case 0:
			order = prefix + 'devicename' + suffix + ", devicename " + tempOrderVal[1] + ', ' + predefSuffix_3;
			break;

		case 1:
			order = prefix + 'job_schedule.job' + suffix + ", job_schedule.job " + tempOrderVal[1] + ', ' + predefSuffix_1;
			break;

		case 2:
			order = "job_info.timestampStart " + tempOrderVal[1] + ", " + predefSuffix_2;
			break;

		case 3:
			order = "job_info.timestampEnd " + tempOrderVal[1] + ", job_info.timestampStart " + tempOrderVal[1] + ", job_schedule.job+0 " + tempOrderVal[1];
			break;

		case 4:
			order = "job_schedule.model+0 " + tempOrderVal[1] + ", job_info.timestampStart " + tempOrderVal[1] + ", job_schedule.job+0 " + tempOrderVal[1];
			break;

		case 5:
			order = "job_schedule.material+0 " + tempOrderVal[1] + ", job_info.timestampStart " + tempOrderVal[1] + ", job_schedule.job+0 " + tempOrderVal[1];
			break;

		case 6:
			order = "job_schedule.target " + tempOrderVal[1] + ", job_info.timestampStart " + tempOrderVal[1] + ", job_schedule.job+0 " + tempOrderVal[1];
			break;

		case 7:
			order = "job_schedule.prewarn " + tempOrderVal[1] + ", job_info.timestampStart " + tempOrderVal[1] + ", job_schedule.job+0 " + tempOrderVal[1];
			break;

		case 8:
			order = "job_info.count " + tempOrderVal[1] + ", job_info.timestampStart " + tempOrderVal[1] + ", job_schedule.job+0 " + tempOrderVal[1];
			break;

		case 9:
			order = "job_info.reject " + tempOrderVal[1] + ", job_info.timestampStart " + tempOrderVal[1] + ", job_schedule.job+0 " + tempOrderVal[1];
			break;

		case 10:
			order = "runtime " + tempOrderVal[1] + ", job_info.timestampStart " + tempOrderVal[1] + ", job_schedule.job+0 " + tempOrderVal[1];
			break;

		case 11:
			order = "prodDur " + tempOrderVal[1] + ", job_info.timestampStart " + tempOrderVal[1] + ", job_schedule.job+0 " + tempOrderVal[1];
			break;

		case 12:
			order = "downtime " + tempOrderVal[1] + ", job_info.timestampStart " + tempOrderVal[1] + ", job_schedule.job+0 " + tempOrderVal[1];
			break;

		case 13:
			order = "schedEnd " + tempOrderVal[1] + ", job_info.timestampStart " + tempOrderVal[1] + ", job_schedule.job+0 " + tempOrderVal[1];
			break;

		case 14:
			order = "job_schedule.operator+0 " + tempOrderVal[1] + ", job_info.timestampStart " + tempOrderVal[1] + ", job_schedule.job+0 " + tempOrderVal[1];
			break;

		case 15:
			order = "nextItem+0 " + tempOrderVal[1] + ", job_info.timestampStart " + tempOrderVal[1] + ", job_schedule.job+0 " + tempOrderVal[1];
			break;

		case 16:
			order = "list_jobstatus.name " + tempOrderVal[1] + ", job_info.timestampStart " + tempOrderVal[1] + ", job_schedule.job+0 " + tempOrderVal[1];
			break;

		default:
			break;
	}

	return order;
}

function exportVisualization () {
	if (flags.productivity.isGraphMode) {
		if (!$.isEmptyObject(visualObjects.chart)) {
			const jobName = visualObjects.selectedJobLabel;
			const productivitylbl = lang[flags.pref.lang].productivity.pagetitle;
			const chartlbl = lang[flags.pref.lang].productivity.chart;
			let graphName = '';
			switch (visualObjects.graphType) {
				case 'Overview':
					graphName = lang[flags.pref.lang].productivity.view[0];
					break;
				case 'GoodQty':
					graphName = lang[flags.pref.lang].productivity.legends.good;
					break;
				case 'CycleTime':
					graphName = lang[flags.pref.lang].productivity.view[2];
					break;
			}

			visualObjects.chart.exportChart({ 
				format: 'png',
				fileName: `${productivitylbl}_${graphName}_${chartlbl}_${jobName}`,
			 });
		}
	} else {
		exportProductivity({
			data: flags.productivity.tableData,
			devName: flags.productivity.devName,
			jobName: flags.productivity.jobName
		});
	}
	$('#promptModal button').attr('disabled', false);
	$('#promptModal').modal('hide');
	$('#promptModal').off('keydown', ignore_escape);
}