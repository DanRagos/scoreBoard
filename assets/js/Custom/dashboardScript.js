var dashboardGroup = [];

function initDashboard() {
	dashboardDevices();
	clearDashboard();
	addBacklogIcon();
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

function dashboardDevices() {
	flags.dashboard.prevGroup = '';

	flags.ajaxRequestStatus = $.ajax({
		type: 'POST',
		url: 'php/jogetdevices.php',
		data: '',
		dataType:'json',
		async: true,
		success: function(data) {
			/** Check if data is empty **/
			if(!(data === null)) {
				var prevData = 0;
				for(var x = 0; x < data.length; x++) {
					if(parseInt(data[x].devord) > prevData) {
						prevData = parseInt(data[x].devord);
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

function addBacklogIcon() {
	for(var i = 1; i <= 10; i++) {
		var dashboardElem = '#' + flags.currPage + ' .dashboard-pane:nth-child(' + (i + 2) + ') > .dashboard-pane-frame > ';
		$(dashboardElem + '.dashboard-pane-subframe:nth-child(1) > div:nth-child(1)').find('.backlogIcon').remove();
		$(dashboardElem + '.dashboard-pane-subframe:nth-child(1) > div:nth-child(1)').find('span').after('<span class="backlogIcon" style="display: none;">&nbsp;<i class="fa fa-exclamation-circle text-secondary"></i></span>');
	}
}

function dashboardUpdate() {
	var colorGrp = {}, defaultPwnClr = '';
	if(flags.pref.theme == 'dark') {
		colorGrp = flags.dashboard.colorGroup.dark;
		defaultPwnClr = 'rgba(255,255,255,0.9)';
	} else {
		colorGrp = flags.dashboard.colorGroup.light;
		defaultPwnClr = 'black';
	}

	flags.ajaxRequestStatus = $.ajax({
		type: 'POST',
		url: 'php/jodashboard.php',
		data: { min: ((flags.dashboard.currPage - 1) * flags.dashboard.maxDevicePerPage) + 1, max: flags.dashboard.currPage * flags.dashboard.maxDevicePerPage },
		dataType:'json',
		async: true,
		success: function(data) {
			/** Check if data is empty **/
			if(!(data === null)) {
				var offset = (flags.dashboard.currPage - 1) * flags.dashboard.maxDevicePerPage;
				var min = offset + 1;
				var max = offset + flags.dashboard.maxDevicePerPage;

				/** save current group so we can differentiate any changes in the order **/
				flags.dashboard.currGroup = '';
				for(var i = 0; i < data.length; i++) {
					/** access only the devices inside the range **/
					if(min > parseInt(data[i].devdid) || parseInt(data[i].devdid) > max) {
						continue;
					}
					flags.dashboard.currGroup += (data[i].devdid).toString();
				}
				/** Clear dashboard **/
				if(flags.dashboard.currGroup != flags.dashboard.prevGroup && flags.dashboard.prevGroup != '') {
					initDashboard();
				}
				flags.dashboard.prevGroup = flags.dashboard.currGroup;

				for(var i = 0; i < data.length; i++) {
					/** access only the devices inside the range **/
					if(min > parseInt(data[i].devdid) || parseInt(data[i].devdid) > max) {
						continue;
					}

					var dashboardElem = '#' + flags.currPage + ' .dashboard-pane:nth-child(' + (parseInt(data[i].devdid) - offset + 2) + ') > .dashboard-pane-frame > ';

					var tgt = parseFloat(data[i].devtgt);
					if(isNaN(tgt)) {
						tgt = '--';
					}

					var pwn = parseFloat(data[i].devpwn);
					if(isNaN(pwn)) {
						pwn = 0;
					}

					var cnt = parseFloat(data[i].devcnt);
					if(isNaN(cnt)) {
						cnt = 0;
					}

					var pVal = (cnt / (tgt == '--' ? 0 : tgt)) * 100;
					if(isNaN(pVal)) {
						pVal = '0%';
					} else if(pVal == Number.POSITIVE_INFINITY || pVal == Number.NEGATIVE_INFINITY) {
						pVal = '100%';
					} else {
						pVal = pVal.toFixed(1) + '%';
					}

					/** Machine ID **/
					$(dashboardElem + '.dashboard-pane-subframe:nth-child(1) > div:nth-child(2)').find('span').html(data[i].devnme);
					/** Prewarn **/
					$(dashboardElem + '.dashboard-pane-subframe:nth-child(3) > div:nth-child(2)').find('span').html(pwn);
					/** Progress **/
					$(dashboardElem + '.dashboard-pane-subframe:nth-child(4) > div:nth-child(2)').find('span').html(cnt  + ' / ' + tgt);
					/** Offline State **/
					if(data[i].devsta == '0') {
						$(dashboardElem + '.dashboard-pane-subframe:nth-child(2) > div:nth-child(2)').find('span').html(lang[flags.pref.lang].status['OFFLINE']);
						$(dashboardElem + '.dashboard-pane-subframe:nth-child(2) > div:nth-child(2)').css('color', 'inherit');
						/** Backlog Icon **/
						$(dashboardElem + '.dashboard-pane-subframe:nth-child(1) > div:nth-child(1)').find('.backlogIcon').hide();
					} else {
						/** Status **/
						$(dashboardElem + '.dashboard-pane-subframe:nth-child(2) > div:nth-child(2)').find('span').html(lang[flags.pref.lang].status[data[i].devmst]);
						/** Status Color **/
						switch(data[i].devmst) {
							case 'PRODUCTIVE':
								$(dashboardElem + '.dashboard-pane-subframe:nth-child(2) > div:nth-child(2)').css('color', colorGrp[data[i].devmst]);
								break;
								
							case 'UNPRODUCTIVE':
								$(dashboardElem + '.dashboard-pane-subframe:nth-child(2) > div:nth-child(2)').css('color', colorGrp[data[i].devmst]);
								break;
								
							case 'COMPLETED':
								$(dashboardElem + '.dashboard-pane-subframe:nth-child(2) > div:nth-child(2)').css('color', colorGrp[data[i].devmst]);
								break;
								
							case 'COMPLETED*':
								$(dashboardElem + '.dashboard-pane-subframe:nth-child(2) > div:nth-child(2)').css('color', colorGrp[data[i].devmst]);
								break;

							default:
								$(dashboardElem + '.dashboard-pane-subframe:nth-child(2) > div:nth-child(2)').css('color', 'inherit');
								break;
						}
						/** Backlog Icon **/
						if(data[i].devbck == '1') {
							$(dashboardElem + '.dashboard-pane-subframe:nth-child(1) > div:nth-child(1)').find('.backlogIcon').show();
						} else {
							$(dashboardElem + '.dashboard-pane-subframe:nth-child(1) > div:nth-child(1)').find('.backlogIcon').hide();
						}
					}
					/** Prewarn Color **/
					if(cnt >= pwn && pwn != 0) {
						$(dashboardElem + '.dashboard-pane-subframe:nth-child(3)').css({
							'background-color': 'rgba(247,124,46,0.9)',
							'color': 'black'
						});
					} else {
						$(dashboardElem + '.dashboard-pane-subframe:nth-child(3)').css({
							'background-color': 'initial',
							'color': defaultPwnClr
						});
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
		/** Machine ID **/
		$(dashboardElem + '.dashboard-pane-subframe:nth-child(1) > div:nth-child(2)').find('span').html(i + offset);
		/** Status **/
		$(dashboardElem + '.dashboard-pane-subframe:nth-child(2) > div:nth-child(2)').find('span').html('--');
		if(flags.currPage == 'dashboard-tab') {
			/** Prewarn **/
			$(dashboardElem + '.dashboard-pane-subframe:nth-child(3) > div:nth-child(2)').find('span').html('--');
			/** Progress **/
			$(dashboardElem + '.dashboard-pane-subframe:nth-child(4) > div:nth-child(2)').find('span').html('-- / --');
		} else {
			/** Job duration **/
			$(dashboardElem + '.dashboard-pane-subframe:nth-child(3) > div:nth-child(2)').find('span').html('-- : -- : --');
			/** downtime duration **/
			$(dashboardElem + '.dashboard-pane-subframe:nth-child(4) > div:nth-child(2)').find('span').html('-- : -- : --');
		}
		/** Backlog Icon **/
		$(dashboardElem + '.dashboard-pane-subframe:nth-child(1) > div:nth-child(1)').find('.backlogIcon').hide();
		/** Prewarn Color **/
		$(dashboardElem + '.dashboard-pane-subframe:nth-child(3)').css({'background-color': 'initial', 'color': defaultColor});
		/** Status Color **/
		$(dashboardElem + '.dashboard-pane-subframe:nth-child(2) > div:nth-child(2)').css('color', 'inherit');
		/** Progress length & value **/
		$(dashboardElem + '.dashboard-pane-subframe:nth-child(4) > div:nth-child(3)').find('.progress-bar').css('width', '0%');
		$(dashboardElem + '.dashboard-pane-subframe:nth-child(4) > div:nth-child(3)').find('.progress-bar-title').html('0%');
	}
}