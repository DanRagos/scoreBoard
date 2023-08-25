var dashboardGroup = [];

function initDashboard() {
	dashboardBoards();
	clearDashboard();
	// addBacklogIcon();
}

function getDashboardGroup() {
	$.ajax({
		type: 'POST',
		url: 'php/getdashboardgroup.php',
		data: '',
		dataType:'json',
		async: true,
		success: function(data) {
			dashboardGroup = data;
			$(`#${flags.currPage} .headerspan > .groupName`).html(`&nbsp;(${dashboardGroup[flags.dashboard.currPage - 1]})`);
		},
	});
}

function dashboardBoards() {
	console.log('dashboardBoards()');
	flags.dashboard.prevGroup = '';

	flags.ajaxRequestStatus = $.ajax({
		type: 'POST',
		url: 'php/jogetboards.php',
		data: '',
		dataType:'json',
		async: true,
		success: function(data) {
			console.log(data);
			/** Check if data is empty **/
			if(!(data === null)) {
				var prevData = 0;
				for(var x = 0; x < data.length; x++) {
					if(parseInt(data[x].brdord) > prevData) {
						prevData = parseInt(data[x].brdord);
					}
				}

				if(prevData < 10) {
					flags.dashboard.maxDeviceCnt = 10;
				} else {
					flags.dashboard.maxDeviceCnt = prevData;
				}

				flags.dashboard.pageLimit = Math.ceil(flags.dashboard.maxDeviceCnt / flags.dashboard.maxDevicePerPage);
				$('#' + flags.currPage + ' .dash-paging').find('label').html(
					'<label>' + lang[flags.pref.lang].dashboard.page + flags.dashboard.currPage + ' of ' + flags.dashboard.pageLimit + '</label>'
				);
			}
			/** Update Group name of the page **/
			getDashboardGroup();
			flags.ajaxRequestStatus = null;
		},
		error: function() {
			if(flags.ajaxRequestStatus !== null) {
				flags.ajaxRequestStatus.abort();
				flags.ajaxRequestStatus = null;
			}
		}
	});
}

function pageMoveTo(direction) {
	var currIndex = flags.dashboard.currPage;

	if(direction == 'left') {
		if(currIndex > 1) {
			currIndex--;
		} else {
			currIndex = flags.dashboard.pageLimit;
		}
	} else if(direction == 'right') {
		if(currIndex < flags.dashboard.pageLimit) {
			currIndex++;
		} else {
			currIndex = 1;
		}
	}

	$(`#${flags.currPage} .headerspan > .groupName`).html(`&nbsp;(${dashboardGroup[currIndex - 1]})`);

	return currIndex;
}

// function addBacklogIcon() {
// 	for(var i = 1; i <= 10; i++) {
// 		var dashboardElem = '#' + flags.currPage + ' .dashboard-pane:nth-child(' + (i + 2) + ') > .dashboard-pane-frame > ';
// 		$(dashboardElem + '.dashboard-pane-subframe:nth-child(1) > div:nth-child(1)').find('.backlogIcon').remove();
// 		$(dashboardElem + '.dashboard-pane-subframe:nth-child(1) > div:nth-child(1)').find('span').after('<span class="backlogIcon" style="display: none;">&nbsp;<i class="fa fa-exclamation-circle text-secondary"></i></span>');
// 	}
// }

function dashboardUpdate() {
	console.log('dashboardUpdate()');
	var colorGrp = {}, defaultPwnClr = '';
	if(flags.pref.theme == 'dark') {
		colorGrp = flags.dashboard.colorGroup.dark;
	} else {
		colorGrp = flags.dashboard.colorGroup.light;
	}

	flags.ajaxRequestStatus = $.ajax({
		type: 'POST',
		url: 'php/jodashboard.php',
		data: { min: ((flags.dashboard.currPage - 1) * flags.dashboard.maxDevicePerPage) + 1, max: flags.dashboard.currPage * flags.dashboard.maxDevicePerPage },
		dataType:'json',
		async: true,
		success: function(data) {
			console.log('UPDATE DASHBOARD DATA!');
			console.log(data);
			/** Check if data is empty **/
			if(!(data === null)) {
				var offset = (flags.dashboard.currPage - 1) * flags.dashboard.maxDevicePerPage;
				var min = offset + 1;
				var max = offset + flags.dashboard.maxDevicePerPage;

				/** save current group so we can differentiate any changes in the order **/
				flags.dashboard.currGroup = '';
				for(var i = 0; i < data.length; i++) {
					/** access only the devices inside the range **/
					if(min > parseInt(data[i].brdord) || parseInt(data[i].brdord) > max) {
						continue;
					}
					flags.dashboard.currGroup += (data[i].brdord).toString();
				}
				/** Clear dashboard **/
				if(flags.dashboard.currGroup != flags.dashboard.prevGroup && flags.dashboard.prevGroup != '') {
					initDashboard();
				}
				flags.dashboard.prevGroup = flags.dashboard.currGroup;

				for(var i = 0; i < data.length; i++) {
					/** access only the devices inside the range **/
					if(min > parseInt(data[i].brdord) || parseInt(data[i].brdord) > max) {
						continue;
					}

					var dashboardElem = '#' + flags.currPage + ' .dashboard-pane:nth-child(' + (parseInt(data[i].brdord) - offset + 2) + ') > .dashboard-pane-frame > ';

					var tgt = parseFloat(data[i].brdtgt);
					if(isNaN(tgt)) {
						tgt = '--';
					}

					var cnt = parseFloat(data[i].brdcnt);
					if(isNaN(cnt)) {
						cnt = 0;
					}

					var diff = tgt - cnt;
					if(isNaN(diff)) {
						diff = '--';
					}

					var pVal = (cnt / (tgt == '--' ? 0 : tgt)) * 100;
					if(isNaN(pVal)) {
						pVal = '0%';
					} else if(pVal == Number.POSITIVE_INFINITY || pVal == Number.NEGATIVE_INFINITY) {
						pVal = '100%';
					} else {
						pVal = pVal.toFixed(1) + '%';
					}

					/** LINE ID **/
					$(dashboardElem + '.dashboard-pane-subframe:nth-child(1) > div:nth-child(2)').find('span').html(data[i].brdname);
					/** TARGET **/
					$(dashboardElem + '.dashboard-pane-subframe:nth-child(2) > div:nth-child(2)').find('span').html(tgt);
					/** COUNT **/
					$(dashboardElem + '.dashboard-pane-subframe:nth-child(3) > div:nth-child(2)').find('span').html(cnt);
					/** DIFF **/
					$(dashboardElem + '.dashboard-pane-subframe:nth-child(4) > div:nth-child(2)').find('span').html(diff);
					// 
					if($(document.body).hasClass('dark-bg')){
						$(dashboardElem).css('color', 'rgba(255, 255,255,0.9) !important');
						$(dashboardElem + '.dashboard-pane-subframe:nth-child(4) > div:nth-child(3)').find('.progress-bar-title').css('color', 'rgba(255, 255,255,0.9) !important');
						$(dashboardElem + '.dashboard-pane-subframe').css('backgroundColor', 'initial');
						$(dashboardElem + '.dashboard-pane-subframe:nth-child(4) > div:nth-child(3)').find('.progress').css('backgroundColor', 'rgba(49,55,58,0.4)');
					}else{
						$(dashboardElem).css('color', '#212529 !important');
						$(dashboardElem + '.dashboard-pane-subframe:nth-child(4) > div:nth-child(3)').find('.progress-bar-title').css('color', '#212529 !important');
						$(dashboardElem + '.dashboard-pane-subframe').css('backgroundColor', 'initial');
					}
					$(dashboardElem + '.dashboard-pane-subframe:nth-child(4) > div:nth-child(3)').find('.progress').css('border', 'none');
					

					
					// No running JO
					if(data[i].jiid == '') {
						$(dashboardElem + '.dashboard-pane-subframe:nth-child(1)').css('backgroundColor', grey);
					}
					/** Offline State **/
					if(data[i].lnsta == '0') {
						// $(dashboardElem + '.dashboard-pane-subframe:nth-child(2) > div:nth-child(2)').find('span').html(lang[flags.pref.lang].status['OFFLINE']);
						$(dashboardElem + '.dashboard-pane-subframe').css('color', 'inherit');
						/** Backlog Icon **/
						// $(dashboardElem + '.dashboard-pane-subframe:nth-child(1) > div:nth-child(1)').find('.backlogIcon').hide();
					} else {
						/** Status Color **/
						switch(data[i].lnsta) {
							case 'PRODUCTIVE':
								$(dashboardElem + '.dashboard-pane-subframe:nth-child(1)').css('backgroundColor', colorGrp[data[i].lnsta]);
								break;
								
							case 'UNPRODUCTIVE':
								$(dashboardElem + '.dashboard-pane-subframe:nth-child(1)').css('backgroundColor', colorGrp[data[i].lnsta]);
								break;
								
							case 'COMPLETED':
								$(dashboardElem + '.dashboard-pane-subframe:nth-child(1)').css('backgroundColor', colorGrp[data[i].lnsta]);
								break;
								
							// case 'COMPLETED*':
							// 	$(dashboardElem + '.dashboard-pane-subframe:nth-child(2) > div:nth-child(2)').css('color', colorGrp[data[i].devmst]);
							// 	break;

							default:
								$(dashboardElem + '.dashboard-pane-subframe:nth-child(1)').css('backgroundColor', 'inherit');
								break;
						}
					// 	/** Backlog Icon **/
					// 	if(data[i].devbck == '1') {
					// 		$(dashboardElem + '.dashboard-pane-subframe:nth-child(1) > div:nth-child(1)').find('.backlogIcon').show();
					// 	} else {
					// 		$(dashboardElem + '.dashboard-pane-subframe:nth-child(1) > div:nth-child(1)').find('.backlogIcon').hide();
					// 	}
					// }
					/** Prewarn Color **/
					// if(cnt >= pwn && pwn != 0) {
					// 	$(dashboardElem + '.dashboard-pane-subframe:nth-child(3)').css({
					// 		'background-color': 'rgba(247,124,46,0.9)',
					// 		'color': 'black'
					// 	});
					// } else {
					// 	$(dashboardElem + '.dashboard-pane-subframe:nth-child(3)').css({
					// 		'background-color': 'initial',
					// 		'color': defaultPwnClr
					// 	});
					}
					/** Progress length & value **/
					$(dashboardElem + '.dashboard-pane-subframe:nth-child(4) > div:nth-child(3)').find('.progress-bar').css('width', pVal);
					$(dashboardElem + '.dashboard-pane-subframe:nth-child(4) > div:nth-child(3)').find('.progress-bar-title').html(pVal);
				}
				$('#' + flags.currPage + ' .last-update label').html('<span>' + lang[flags.pref.lang].general.lastUpdate + '</span>: ' + getDateTimeNow('-').dnt);
			}
			flags.ajaxRequestStatus = null;
		},
		fail: function() {
			$('#' + flags.currPage + ' .last-update label').html('<i>Check network connection...</i>');

			if(flags.ajaxRequestStatus !== null) {
				flags.ajaxRequestStatus.abort();
				flags.ajaxRequestStatus = null;
			}
		}
	});
}

function clearDashboard() {
	var defaultColor = '';
	if(flags.pref.theme == 'dark') {
		defaultColor = 'rgba(255,255,255,0.9)';
	} else {
		defaultColor = 'black';
	}
	var offset = (flags.dashboard.currPage - 1) * flags.dashboard.maxDevicePerPage;
	for(var i = 1; i <= 10; i++) {
		var dashboardElem = '#' + flags.currPage + ' .dashboard-pane:nth-child(' + (i + 2) + ') > .dashboard-pane-frame > ';
		/** LINE ID **/
		$(dashboardElem + '.dashboard-pane-subframe:nth-child(1) > div:nth-child(2)').find('span').html(i + offset);
		/** Target **/
		$(dashboardElem + '.dashboard-pane-subframe:nth-child(2) > div:nth-child(2)').find('span').html('--');
		/** Count **/
		$(dashboardElem + '.dashboard-pane-subframe:nth-child(3) > div:nth-child(2)').find('span').html('--');
		/** Differece **/
		$(dashboardElem + '.dashboard-pane-subframe:nth-child(4) > div:nth-child(2)').find('span').html('--');
		
		/** Backlog Icon **/
		// $(dashboardElem + '.dashboard-pane-subframe:nth-child(1) > div:nth-child(1)').find('.backlogIcon').hide();
		/** Prewarn Color **/
		// $(dashboardElem + '.dashboard-pane-subframe:nth-child(3)').css({'background-color': 'initial', 'color': defaultColor});
		/** Status Color **/
		// $(dashboardElem + '.dashboard-pane-subframe:nth-child(2) > div:nth-child(2)').css('color', 'inherit');
		
		// LINE ID color
		$(dashboardElem + '.dashboard-pane-subframe:nth-child(1)').css('backgroundColor', 'initial');
		/** Progress length & value **/
		$(dashboardElem + '.dashboard-pane-subframe:nth-child(4) > div:nth-child(3)').find('.progress-bar').css('width', '0%');
		$(dashboardElem + '.dashboard-pane-subframe:nth-child(4) > div:nth-child(3)').find('.progress-bar-title').html('0%');
		
	
		if($(document.body).hasClass('dark-bg')){
			$(dashboardElem).css('color', '#5C636E');
			$(dashboardElem + '.dashboard-pane-subframe:nth-child(4) > div:nth-child(3)').find('.progress-bar-title').css('color', '#5C636E');
			$(dashboardElem + '.dashboard-pane-subframe').css('backgroundColor', '#393E46');
			$(dashboardElem + '.dashboard-pane-subframe:nth-child(4) > div:nth-child(3)').find('.progress').css('border', '1px solid #5C636E');
			$(dashboardElem + '.dashboard-pane-subframe:nth-child(4) > div:nth-child(3)').find('.progress').css('backgroundColor', '#393E46');
		}else{
			$(dashboardElem).css('color', '#B2B1B9');
			$(dashboardElem + '.dashboard-pane-subframe:nth-child(4) > div:nth-child(3)').find('.progress-bar-title').css('color', '#B2B1B9');
			$(dashboardElem + '.dashboard-pane-subframe').css('backgroundColor', '#d7d9de');
			$(dashboardElem + '.dashboard-pane-subframe:nth-child(4) > div:nth-child(3)').find('.progress').css('border', '1px solid #d7d9de');
			$(dashboardElem + '.dashboard-pane-subframe:nth-child(4) > div:nth-child(3)').find('.progress').css('backgroundColor', '#c5c7c9');
		}
	}
}