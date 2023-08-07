function initDetail() {
	if($.isEmptyObject(flags.detailedlog.table)) {
		flags.detailedlog.table = $('#detailTbl').DataTable({
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
			"order": [ 
				[ 7, 'desc' ]
			],
			"columnDefs": [
		        { "type": 'natural', "targets": [0, 1, 3, 4, 5, 6, 10] },
		        { targets: 0, orderData: [0, 2, 1] },
	            { targets: 1, orderData: [1, 2] },
	            { targets: 2, orderData: [2, 0, 1] },
	            { targets: 3, orderData: [3, 2, 1] },
	            { targets: 4, orderData: [4, 2, 1] },
	            { targets: 5, orderData: [5, 2, 1] },
	            { targets: 6, orderData: [6, 2, 1] },
	            { targets: 7, orderData: [7, 2, 1] },
	            { targets: 8, orderData: [8, 2, 1] },
	            { targets: 9, orderData: [9, 2, 1] },
	            { targets: 9, orderData: [10, 2, 1] },
		    ],
		    "columns": [
		    	{ data: "devnme" },
				{ data: "devjob" },
				{ data: "devpde" },
				{ data: "devmod" },
				{ data: "devmat" },
				{ data: "devopr" },
				{ data: "devdts" },
				{ data: "devucs" },
				{ data: "devstt" },
				{ data: "devend" },
				{ data: "devdur" },
			],
			"destroy": true,
			"pageResize": true,
			"scrollX": true,
			"scrollCollapse": true,
		});
	}
}

function detailedUpdateTbl() {
	var dateParam = getDateTimeNow('-');
	var urlAddr = 'php/unproductiveDetail.php';
	// var showAllJobs = $('#' + flags.currPage).find('.showJob-btn').hasClass('active') ? 1 : 0;
	var dateToUse = { 'fr': '', 'to': '' };
	var isToday = 0;

	if(flags.displayMode.others == 'today') {
		dateToUse.fr = dateParam.date + ' 00:00:00';
		dateToUse.to = dateParam.date + ' 23:59:59';
		isToday = 1;
		//if(showAllJobs) {
			query_stop();
		//} else {
		//	query_start();
		//}
	} else {
		dateToUse.fr = addStartTime({dateString: $('.dateFr:not(.schedDate .dbmDate)').eq(0).val()});
		dateToUse.to = addEndTime({dateString: $('.dateTo:not(.schedDate .dbmDate)').eq(0).val()});
		query_stop();
	}

	flags.ajaxRequestStatus = $.ajax({
		type: 'POST',
		url: urlAddr,
		data: { start: dateToUse.fr, end: dateToUse.to, id: $('#detailDevice').val(), today: isToday },
		dataType:'json',
		async: true,
		success: function(data) {
			if($.isEmptyObject(flags.detailedlog.table)) {
				initDetail();
				showTableLoading();
			}
			flags.detailedlog.table.clear().rows.add(data).draw(false);
			enableDisplayButton();
			$('#' + flags.currPage +  ' .last-update').html(lang[flags.pref.lang].general.lastUpdate + ': ' + dateParam.dnt);
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

function getAvailableDevice() {
	$.ajax({
		type: 'POST',
		url: 'php/jogetavaildevices.php',
		data: '',
		dataType:'json',
		async: true,
		success: function(data) {
			/** Check if data is empty **/
			if(!(data === null)) {
				var str = '';
				for(var x = 0; x < data.length; x++) {
					str += '<option value="' + data[x].devdid + '"';
					if (x == 0 && flags.detailedlog.selectedDevice == '') {
						str += ' selected>';
					} else {
						str += '>';
					}
					if (data[x].devnme != '' && data[x].devnme != null) {
						str += data[x].devnme;
					} else {
						str += data[x].devdid;
					}
					str += '</option>';
				}
				$('#detailDevice').html(str);

				initDetail();
				showTableLoading();
				handleDetailedLogUpdate();
			} else {
				showPrompt(lang[flags.pref.lang].timechart.prompts.nodev, "Error");
			}
		}
	});
}

function handleDetailedLogUpdate() {
	if (flags.detailedlog.isGraphMode) {
		$('#graphModal .snsPrompt').html(lang[flags.pref.lang].general.loading);
		$('#graphModal').modal('show');
		$('#cancelLoading').prop('disabled', true);

		if ($.isEmptyObject(timegraph)) {
			setTimeout(function () {
				initDetailLogsGraph();
				getTimeGraphData();
			}, 500);	
		} else {
			setTimeout(function () {
				getTimeGraphData();
			}, 500);
		}
	} else {
		showTableLoading();
		if (flags.detailedlog.selectedDevice != '') {
			$(this).val(flags.detailedlog.selectedDevice);
		}
		detailedUpdateTbl();
	}
}

var timegraph;
function initDetailLogsGraph() {
	timegraph = new initTimegraph({
		'bg': flags.pref.theme == 'light' ? 'default' : 'dark',
		'element': '#detailGraph',
		'dimension': 'auto',
		'instance': [ 'JO', 'WDT', 'STATE 1', 'STATE 2', 'STATE 3', 'STATE 4', 'Downtime' ],
		'labelPosition': 'bottom',
		'minDate': '2019-01-01',
		'maxDate': '2019-01-01',
		'chartColors': [ "rgba(0, 204, 0, 0.6)", "rgba(200, 0, 0, 0.8)" ],
		'title': lang[flags.pref.lang].timechart.pagetitle,
		'legend': [ lang[flags.pref.lang].timechart.legends['Productive'], lang[flags.pref.lang].timechart.legends['Unproductive'] ],
		'pageItems': 7,
		'chartoffset-lft': 100,
		'chartoffset-rth': 10,
		'chartoffset-top': 10,
		'chartoffset-bot': 50,
	});
}

function getTimeGraphData(reinit) {
	var dateParam = getDateTimeNow('-');
	var dateToUse = { 'fr': '', 'to': '' };
	var devicenames = [];

	if(flags.displayMode.others == 'today') {
		dateToUse.fr = dateParam.date + ' 00:00:00';
		dateToUse.to = dateParam.date + ' 23:59:59';
	} else {
		dateToUse.fr = addStartTime({dateString: $('.dateFr:not(.schedDate .dbmDate)').eq(0).val()});
		dateToUse.to = addEndTime({dateString: $('.dateTo:not(.schedDate .dbmDate)').eq(0).val()});
	}

	$.ajax({
		type: 'POST',
		url: 'php/unproductiveDetailGraph.php',
		data: { start: dateToUse.fr, end: dateToUse.to, id: $('#detailDevice').val() },
		dataType:'json',
		async: true,
		success: function(data) {
			if(!$.isEmptyObject(data)) {
				var testDataMulti = [];
				for(var i = 0; i < data.length; i++) {
					testDataMulti[i] = [];
					for(var j = 0; j < data[i].length; j++) {
						/** <start>,<end>,<logid>,<jobid> **/
						temp = [
							data[i][j].devstt,
							data[i][j].devend == '--' ? dateParam.dnt : data[i][j].devend,
							data[i][j].devlog,
							data[i][j].devsid,
							data[i][j].devnme,
							data[i][j].devsrc,
							data[i][j].devjob,
							data[i][j].devcus,
						];
						testDataMulti[i].push(temp);
					}
				}
				var fr = moment(dateToUse.fr);
				var to = moment(dateToUse.to);
				timegraph.attr({
					'instance': [ 'JO', 'WDT', 'STATE 1', 'STATE 2', 'STATE 3', 'STATE 4', 'Downtime' ],
					'minDate': (dateToUse.fr).split(' ')[0],
					'maxDate': (dateToUse.to).split(' ')[0],
					'start': Math.floor(fr.format('HH')),
					'length': Math.ceil(to.diff(fr, 'minutes') / 60),
					'dateRange': dateToUse.fr + ',' + dateToUse.to,
				});
				timegraph.clearData();
				timegraph.reinitialize();
				timegraph.plotMultiGraph(testDataMulti, function() {
					$('#graphModal').modal('hide');
				});
			} else {
				var fr = moment(dateToUse.fr);
				var to = moment(dateToUse.to);
				timegraph.attr({
					'instance': flags.summary.instanceNames,
					'minDate': (dateToUse.fr).split(' ')[0],
					'maxDate': (dateToUse.to).split(' ')[0],
					'start': Math.floor(fr.format('HH')),
					'length': Math.ceil(to.diff(fr, 'minutes') / 60),
					'dateRange': dateToUse.fr + ',' + dateToUse.to,
				});
				timegraph.clearData();
				timegraph.refresh(function() { 
					$('#graphModal').modal('hide'); 
				});
			}
			enableDisplayButton();
			$('#' + flags.currPage +  ' .last-update').html(lang[flags.pref.lang].general.lastUpdate + ': ' + dateParam.dnt);
		},
		fail: function(xhr, status, error) {
			enableDisplayButton();
			$('#graphModal').modal('hide');
		}
	});
}