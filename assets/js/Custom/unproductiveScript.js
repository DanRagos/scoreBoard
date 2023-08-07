function initUnproductive() {
	console.log('initUnproductive()');
	// if ($.isEmptyObject(flags.unproductive.table)) {
		// flags.unproductive.table = $('#unproductiveTbl').DataTable({
		// 	"dom": 'tip',
		// 	"language": {
		// 		"paginate": {
		// 			"previous": lang[flags.pref.lang].general.datatable.prev,
		// 			"next": lang[flags.pref.lang].general.datatable.next,
		// 		},
		// 		"info": lang[flags.pref.lang].general.datatable.info,
		// 		"emptyTable": lang[flags.pref.lang].general.datatable.empty,
		// 		"infoEmpty": lang[flags.pref.lang].general.datatable.infoempty,
		// 	},
		// 	// "columnDefs": [
		// 	// 	{
		// 	// 		"targets": [6],
		// 	// 		"visible": false
		// 	// 	},
		// 	// 	{ "orderable": false, "targets": 11 },
		// 	// 	{ "type": 'natural', "targets": [0, 1, 3, 4, 5, 6] },
		// 	// 	{ targets: 0, orderData: [0, 7, 1] },
		// 	// 	{ targets: 1, orderData: [1, 7] },
		// 	// 	{ targets: 2, orderData: [2, 7, 1] },
		// 	// 	{ targets: 3, orderData: [3, 7, 1] },
		// 	// 	{ targets: 4, orderData: [4, 7, 1] },
		// 	// 	{ targets: 5, orderData: [5, 7, 1] },
		// 	// 	{ targets: 6, orderData: [6, 7, 1] },
		// 	// 	{ targets: 9, orderData: [9, 7, 1] }
		// 	// ],
		// 	// "columns": [
		// 	// 	{
		// 	// 		data: "devnme",
		// 	// 		render: function (data, type, row) {
		// 	// 			return row.devnme == null ? row.devdid : row.devnme;
		// 	// 		}
		// 	// 	},
		// 	// 	{ data: "devjob" },
		// 	// 	{ data: "devpde" },
		// 	// 	{ data: "devmod" },
		// 	// 	{ data: "devmat" },
		// 	// 	{ data: "devopr" },
		// 	// 	{ data: "devdts" },
		// 	// 	{ data: "devstt" },
		// 	// 	{ data: "devend" },
		// 	// 	{ data: "devdur" },
		// 	// 	{
		// 	// 		data: "devucs",
		// 	// 		render: function (data, type, row) {
		// 	// 			var retval;
		// 	// 			if (row.devucs == '' || row.devucs === null) {
		// 	// 				retval = 'No Record';
		// 	// 			} else {
		// 	// 				retval = row.devucs.replace(':', '<br>');
		// 	// 			}
		// 	// 			return retval;
		// 	// 		}
		// 	// 	},
		// 	// 	{
		// 	// 		data: "--",
		// 	// 		render: function (data, type, row) {
		// 	// 			var form = "";
		// 	// 			if (row.devrem != "--" && row.devrem != null) {
		// 	// 				form = '<i class="fas fa-comment fa-flip-horizontal text-warning"></i>&nbsp';
		// 	// 			} else {
		// 	// 				form = '<i class="fas fa-comment fa-flip-horizontal"></i>&nbsp';
		// 	// 			}
		// 	// 			form += "<button type='btn' class='btn btn-sm btn-dark edit-btn' ";
		// 	// 			form += "onclick='editBtn(" + row.rowCnt + ")'";
		// 	// 			if (flags.unproductive.disableInput) {
		// 	// 				form += " disabled";
		// 	// 			}
		// 	// 			form += ">" + lang[flags.pref.lang].general.editlbl + "</button>";
		// 	// 			return form;
		// 	// 		}
		// 	// 	}
		// 	// ],
		// 	"destroy": true,
		// 	"pageResize": true,
		// 	"scrollX": true,
		// 	"scrollCollapse": true,
		// });
	// }
}

const unproductiveUpdateNew = () => {
	const devid = $('#detail-detailDevice').val();
	const schedid = $('#detail-detailJobs').val();

	getDowntimeByDevIDSchedID(devid, schedid);
};

const getDowntimeByDevIDSchedID = (devID, schedID, callback=() => {}) => {
	var filterObj = [];
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
						filterObj.push("'operator'");
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
	flags.ajaxRequestStatus = $.ajax({
		type: 'POST',
		url: 'php/getDowntimeByDevIDSchedID.php',
		data: {
			dev_id: devID,
			sched_id: schedID
		},
		dataType: 'json',
		async: true,
		success: (data) => {
			// console.log('getDowntimeByDevIDSchedID');
			// console.log(data);
			if ($.isEmptyObject(flags.downtime.table)) {
				initDowntimeTable();
			}
			showTableLoading();
			const processedRows = updateFilterSelection(data, filters.unproductive, flags.unproductive.selectedFilter, false);
			// console.log('%cUNPROD DATA', 'background-color: black; color: white');
			// console.log(data);
			testDowntimeTable(data);
			flags.ajaxRequestStatus = null;
			
			//  05/10/2021  jacob: loading modal hidden after php request
			$('#graphModal').modal('hide');
			callback(data);
		},
		fail: function (xhr, status, error) {
			if (flags.ajaxRequestStatus !== null) {
				flags.ajaxRequestStatus.abort();
				flags.ajaxRequestStatus = null;
			}
			query_stop();
			flags.unproductive.table.clear();

			//  05/10/2021  jacob: loading modal hidden after php request
			$('#graphModal').modal('hide');
			showPrompt(lang[flags.pref.lang].errorprompt.datatoolarge, 'Failed');
			callback([]);
		},
		statusCode: {
			500: function () {
				if (flags.ajaxRequestStatus !== null) {
					flags.ajaxRequestStatus.abort();
					flags.ajaxRequestStatus = null;
				}
				query_stop();
				flags.unproductive.table.clear();
				showPrompt(lang[flags.pref.lang].errorprompt.datatoolarge, 'Failed');
				callback([]);
			}
		}
	});
};

function unproductiveUpdate() {
	console.log('unproductiveUpdate()');
	var dateParam = getDateTimeNow('-');
	var showAllJobs = $('#' + flags.currPage).find('.showJob-btn').hasClass('active') ? 1 : 0;
	var dateToUse = { 'fr': '', 'to': '' };
	if (flags.displayMode.others == 'today') {
		dateToUse.fr = 'none';
		dateToUse.to = 'none';
		if (showAllJobs) {
			query_stop();
		} else {
			query_start();
		}
	} else {
		dateToUse.fr = addStartTime({dateString: $('.dateFr:not(.schedDate .dbmDate)').eq(0).val()});
		dateToUse.to = addEndTime({dateString: $('.dateTo:not(.schedDate .dbmDate)').eq(0).val()});
		query_stop();
	}
	var filterObj = [];
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
						filterObj.push("'operator'");
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
	console.log('unproductive update called!');
	console.log('filterObj:');
	console.log(JSON.stringify(filterObj));
	/* Get Downtime table order */
	var order = "job_info.timestampStart ASC, job_schedule.job ASC";

	flags.ajaxRequestStatus = $.ajax({
		type: 'POST',
		url: 'php/jofilterdt.php',
		data: {
			lang: flags.pref.lang,
			start: dateToUse.fr,
			end: dateToUse.to,
			filter: JSON.stringify(filterObj),
			order: order,
			ongoing: (showAllJobs ? false : true)
		},
		dataType: 'json',
		async: true,
		success: function (data) {
			if ($.isEmptyObject(flags.unproductive.table)) {
				initUnproductive();
				showTableLoading();
			}
			flags.unproductive.table.clear().rows.add(
				updateFilterSelection(data, filters.unproductive, flags.unproductive.selectedFilter, flags.unproductive.isFiltered)
			).draw(false);
			enableDisplayButton();
			$('#' + flags.currPage + ' .last-update').html('<span>' + lang[flags.pref.lang].general.lastUpdate + '</span>: ' + dateParam.dnt);
			flags.ajaxRequestStatus = null;
		},
		fail: function (xhr, status, error) {
			if (flags.ajaxRequestStatus !== null) {
				flags.ajaxRequestStatus.abort();
				flags.ajaxRequestStatus = null;
			}
			query_stop();
			flags.unproductive.table.clear();
			showPrompt(lang[flags.pref.lang].errorprompt.datatoolarge, 'Failed');
		},
		statusCode: {
			500: function () {
				if (flags.ajaxRequestStatus !== null) {
					flags.ajaxRequestStatus.abort();
					flags.ajaxRequestStatus = null;
				}
				query_stop();
				flags.unproductive.table.clear();
				showPrompt(lang[flags.pref.lang].errorprompt.datatoolarge, 'Failed');
			}
		}
	});
}

function unproductiveUpdate_old() {
	var dateParam = getDateTimeNow('-');
	var urlAddr = 'php/jounproductive.php';
	var showAllJobs = $('#' + flags.currPage).find('.showJob-btn').hasClass('active') ? 1 : 0;
	var dateToUse = { 'fr': '', 'to': '' };

	if (flags.displayMode.others == 'today') {
		dateToUse.fr = 'none';
		dateToUse.to = 'none';
		if (showAllJobs) {
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
		dataType: 'json',
		async: true,
		success: function (data) {
			if ($.isEmptyObject(flags.unproductive.table)) {
				initUnproductive();
				showTableLoading();
			}
			flags.unproductive.table.clear().rows.add(
				updateFilterSelection(data, filters.unproductive, flags.unproductive.selectedFilter, flags.unproductive.isFiltered)
			).draw(false);
			enableDisplayButton();
			$('#' + flags.currPage + ' .last-update').html('<span>' + lang[flags.pref.lang].general.lastUpdate + '</span>: ' + dateParam.dnt);
			flags.ajaxRequestStatus = null;
		},
		fail: function (xhr, status, error) {
			$('#' + flags.currPage + ' .last-update').html('Check network connection...');

			if (flags.ajaxRequestStatus !== null) {
				flags.ajaxRequestStatus.abort();
				flags.ajaxRequestStatus = null;
			}
		},
		statusCode: {
			500: function () {
				if (flags.ajaxRequestStatus !== null) {
					flags.ajaxRequestStatus.abort();
					flags.ajaxRequestStatus = null;
				}
				/** Data too large **/
				showPrompt('Data too large!', 'error');
			}
		}
	});
}
/** Displays Log Information Pane **/
function editBtn(rowId) {
	var rowData = flags.downtime.table.rows('#unprodRow' + rowId + '_').data();

	$('#unprodMch').html(rowData[0].devnme);
	$('#unprodJob').html(rowData[0].devjob);
	$('#unprodOpr').html(rowData[0].devopr);
	$('#unprodStr').html(rowData[0].devstt);
	$('#unprodEnd').html(rowData[0].devend);
	$('#unprodRem').val(rowData[0].devrem);
	$('#unprodRid').val(rowData[0].devdid);
    const key = getDowntimeIndex(rowData[0].devdts);
    $('#unprodEvt').html(lang[flags.pref.lang].general[key]);
	if (rowData[0].devucs !== null) {
		$('#unprodDcs').html(rowData[0].devucs);
	} else {
		$('#unprodDcs').html(lang[flags.pref.lang].jotimechart.norecord);
	}
	$('#unprodChr').html(lang[flags.pref.lang].unproductive.chars + ': ' + (rowData[0].devrem).length + '/200');

	query_start();
}

function clearLogInfo() {
	$('#unprodMch').html('--');
	$('#unprodJob').html('--');
	$('#unprodOpr').html('--');
	$('#unprodStr').html('--');
	$('#unprodEnd').html('--');
	$('#unprodRem').val('--');
	$('#unprodChr').html(lang[flags.pref.lang].unproductive.chars + ': 0/200');
}

function clearRemarks() {
	$('#unprodRem').val('--');
	$('#unprodChr').html(lang[flags.pref.lang].unproductive.chars + ': 2/200');
}

/**
 * Description: Submit the sidepanel textarea data to the Server. 
 * Parameters: None
 * Prereq: None
 * Return: None
**/
function updateRemarks() {
	console.log('updateRemarks()');
	var a = $('#unprodRid').val();
	var b = $('#unprodRem').val();

	$.ajax({
		type: 'POST',
		url: 'php/joremarks.php',
		data: { did: a, rem: b },
		dataType: 'json',
		async: true,
		success: function (data) {
			/** Check if data is empty **/
			if (data == 'failed') {
				showPrompt(lang[flags.pref.lang].unproductive.prompts.remFailed, 'Failed');
			} else {
				showPrompt(lang[flags.pref.lang].unproductive.prompts.remSuccess, 'Success');

				// if (flags.displayMode.others == 'view' || $('#' + flags.currPage).find('.showJob-btn').hasClass('active')) {
				// 	unproductiveUpdate();
				// }
				if (flags.displayMode.others == 'view' || $('#' + flags.currPage).find('.showJob-btn').hasClass('active')) {
					const devID = $('#detail-detailDevice').val();
					const schedID = $('#detail-detailJobs').val();
					getDowntimeByDevIDSchedID(devID, schedID);
				}
				
			}
		}
	});
}

function getDowntimeIndex(dtString) {
    switch (dtString) {
        case 'STATE 1': 
            return 'ST1';
        case 'STATE 2':
            return 'ST2';
        case 'STATE 3':
            return 'ST3';
        case 'STATE 4':
            return 'ST4';
        case 'INHIBIT':
            return 'INH';
        case 'WDT':
        	return 'WDT';
    }
}