function initDurationTab() {
	dashboardDevices();
	clearDashboard();
	addBacklogIcon();
}

function durationTabUpdate() {
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
		url: 'php/joduration.php',
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
					initDurationTab();
				}
				flags.dashboard.prevGroup = flags.dashboard.currGroup;

				for(var i = 0; i < data.length; i++) {
					/** access only the devices inside the range **/
					if(min > parseInt(data[i].devdid) || parseInt(data[i].devdid) > max) {
						continue;
					}

					var dashboardElem = '#' + flags.currPage + ' .dashboard-pane:nth-child(' + (parseInt(data[i].devdid) - offset + 2) + ') > .dashboard-pane-frame > ';

					/** Machine ID **/
					$(dashboardElem + '.dashboard-pane-subframe:nth-child(1) > div:nth-child(2)').find('span').html(data[i].devnme);
					// /** Job duration **/
					// $(dashboardElem + '.dashboard-pane-subframe:nth-child(3) > div:nth-child(2)').find('span').html(data[i].devjbd);
					// /** Downtime duration **/
					// $(dashboardElem + '.dashboard-pane-subframe:nth-child(4) > div:nth-child(2)').find('span').html(data[i].devdtd);
					/** Offline State **/
					if(data[i].devsta == '0') {
						/** Job duration **/
						$(dashboardElem + '.dashboard-pane-subframe:nth-child(3) > div:nth-child(2)').find('span').html('<i class="fas fa-question-circle"></i>');
						/** Downtime duration **/
						$(dashboardElem + '.dashboard-pane-subframe:nth-child(4) > div:nth-child(2)').find('span').html('<i class="fas fa-question-circle"></i>');
						$(dashboardElem + '.dashboard-pane-subframe:nth-child(2) > div:nth-child(2)').find('span').html(lang[flags.pref.lang].status['OFFLINE']);
						$(dashboardElem + '.dashboard-pane-subframe:nth-child(2) > div:nth-child(2)').css('color', 'inherit');
						/** Backlog Icon **/
						$(dashboardElem + '.dashboard-pane-subframe:nth-child(1) > div:nth-child(1)').find('.backlogIcon').hide();
					} else {
						/** Job duration **/
						$(dashboardElem + '.dashboard-pane-subframe:nth-child(3) > div:nth-child(2)').find('span').html(data[i].devjbd);
						/** Downtime duration **/
						$(dashboardElem + '.dashboard-pane-subframe:nth-child(4) > div:nth-child(2)').find('span').html(data[i].devdtd);
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