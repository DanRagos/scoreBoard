var downCauseAttr = {
	'page': 1,
	'pagelen': 1,
	'itemPerPage': 15,
	'data': {},
	'uid_old': '',
	'lid': '',
	'selElem': '',
};
var deviceCollection = {};
var startTime, endTime;

function initOverview() {
	if (flags.pref.showHelp) {
		$('#overviewHelp').modal('show');
		$('#donotshow-1').prop('checked', !flags.pref.showHelp);
	}

	//** FOR LARGE SYSTEM: 120, SMALL SYSTEM: 10 */
	for(var i = 1; i <= 10; i++) { 
		var overviewElem = '#' + flags.currPage + ' .overview-pane:nth-child(' + i + ')';
		/** Device name **/
		$(overviewElem + ' > div:nth-child(1)').find('span').html(i);
		$(overviewElem + ' > div:nth-child(1)').addClass('text-truncate');
		$(overviewElem + ' > div:nth-child(1)').attr('data-toggle', 'tooltip');
		/** Prewarn Status **/
		$(overviewElem + ' > div:nth-child(1)').css('background-image', 'none');
		$(overviewElem + ' > div:nth-child(1)').css('background-color', 'rgba(0,0,0,0.4)');
		/** Device Status **/
		$(overviewElem + ' > div:nth-child(2)').css('background-color', 'initial');
		$(overviewElem + ' > div:nth-child(2)').find('.overview-body-lbl').addClass('defaultClr').html('--');
		/* bug fix: Containers are still clickable despite being reset */
		$(overviewElem + ' > div:nth-child(2)').attr({'data-did': i, 'data-nme': '', 'data-lid': '', 'data-uid': '', 'data-jid': ''});

		deviceCollection[i] = 0;
	}
	$('[data-toggle="tooltip"]').tooltip();
}

function playSound (filename) {
	var mp3Source = '<source id="audioSrc" src="' + filename + '.mp3" type="audio/mpeg">';
	var embedSource = '<embed hidden="true" autostart="true" loop="true" src="' + filename +'.mp3">';
	document.getElementById("sound").innerHTML='<audio id="alarm" autoplay loop>' + mp3Source + embedSource + '</audio>';
}

function getUnproductiveList () {
	query_stop();

	if(flags.ajaxRequestStatus !== null) {
		flags.ajaxRequestStatus.abort();
		flags.ajaxRequestStatus = null;
	}

	flags.ajaxRequestStatus = $.ajax({
		type: 'POST',
		url: 'php/getUnproductiveList.php',
		data: '',
		dataType:'json',
		async: true,
		success: function(data) {
			if(!$.isEmptyObject(data)) {
				downCauseAttr.page = 1;
				downCauseAttr.data = data;
				downCauseAttr.pagelen = Math.ceil(data.length / downCauseAttr.itemPerPage);

				var format = '';
				for(var i = 0; i < downCauseAttr.itemPerPage; i++) {
					format += '<div';
					try {
						if (downCauseAttr.uid_old == downCauseAttr.data[i].dtucs) {
							format += ' class="active"';
						}
						format += '><div class="row no-gutters"><div class="col align-self-center"><label class="col-form-label text-truncate" data-uid="' +  downCauseAttr.data[i].dtucs /*downCauseAttr.data[i].dtuid*/ + '">';
						format += (downCauseAttr.data[i].dtucs.replace(':', '<br>')).toUpperCase();
					} catch (e) {
						format += ' class="disabled"><div class="row no-gutters"><div class="col align-self-center"><label class="col-form-label text-truncate" data-uid="">';
						format += '--';
					}
					format += '</label></div></div></div>';
				}
				if(downCauseAttr.pagelen > 1) {
					$('#downModalBox .modal-body').find('button').attr('disabled', false);
				} else {
					$('#downModalBox .modal-body').find('button').attr('disabled', true);
				}

				$('#downModalBox .button-panel > .panel-container').html(format);
				$('#downModalBox').modal('show');
			} else {
				downCauseAttr = {
					'page': 1,
					'pagelen': 1,
					'itemPerPage': 15,
					'data': {},
				};
				showPrompt(lang[flags.pref.lang].overview.prompts.noList, 'Failed');
			}

			query_start();
		},
		error: function() {
			if(flags.ajaxRequestStatus !== null) {
				flags.ajaxRequestStatus.abort();
				flags.ajaxRequestStatus = null;
			}
			query_start();
		}
	});
}

function changeDownCausePage (direction) {
	var page = downCauseAttr.page;
	page += direction == 'right' ? 1 : -1;

	if(page <= 0) {
		page = downCauseAttr.pagelen;
	} else if(page > downCauseAttr.pagelen) {
		page = 1;
	}

	var offset = (page - 1) * downCauseAttr.itemPerPage;
	var format = '', parent = $('#downModalBox .panel-container');
	for(var i = 0 + offset; i < (offset + downCauseAttr.itemPerPage); i++) {
		if(downCauseAttr.data[i] !== undefined) {
			format += '<div';
			// if(downCauseAttr.uid_old == downCauseAttr.data[i].dtuid) {
			if (downCauseAttr.uid_old == downCauseAttr.data[i].dtucs) {
				format += ' class="active"';
			}
			format += '><div class="row no-gutters"><div class="col align-self-center"><label class="col-form-label text-truncate" data-uid="' + downCauseAttr.data[i].dtucs /*downCauseAttr.data[i].dtuid*/ + '">';
			format += (downCauseAttr.data[i].dtucs.replace(':', '<br>')).toUpperCase();
			format += '</label></div></div></div>';
		} else {
			format += '<div class="disabled"><div class="row no-gutters"><div class="col align-self-center"><label class="col-form-label text-truncate" data-uid=""><br>--</label></div></div></div>';
		}
	}
	$(parent).html(format);

	downCauseAttr.page = page;
}

function revertToDefault (data) {
	data.map((item, i) => {
		if (item.length <= 0) {
			var overviewElem = '#' + flags.currPage + ' .overview-pane:nth-child(' + (i+1) + ')';
			/** Device name **/
			$(overviewElem + ' > div:nth-child(1)').find('span').html(i+1);
			$(overviewElem + ' > div:nth-child(1)').addClass('text-truncate');
			$(overviewElem + ' > div:nth-child(1)').attr('data-toggle', 'tooltip');
			/** Prewarn Status **/
			$(overviewElem + ' > div:nth-child(1)').css('background-image', 'none');
			$(overviewElem + ' > div:nth-child(1)').css('background-color', 'rgba(0,0,0,0.4)');
			/** Device Status **/
			$(overviewElem + ' > div:nth-child(2)').css('background-color', 'initial');
			$(overviewElem + ' > div:nth-child(2)').find('.overview-body-lbl').addClass('defaultClr').html('--');
			/* bug fix: Containers are still clickable despite being reset */
			$(overviewElem + ' > div:nth-child(2)').attr({'data-did': (i+1), 'data-nme': '', 'data-lid': '', 'data-uid': ''});

			deviceCollection[(i + 1)] = 0;
		}
	});
}

function overviewUpdate() {
	if (typeof(flags.overview.worker) == "undefined") {
		/** initialize **/
		flags.overview.worker = new Worker("/assets/js/Custom/overviewWorker.js?version=3");
		// flags.overview.worker.postMessage({ cmd: 'start', min: 0, max: 120 });	//** FOR LARGE SYSTEM */
		flags.overview.worker.postMessage({ cmd: 'start', min: 0, max: 10 });		//** FOR SMALL SYSTEM */
		/* Event listener */
		flags.overview.worker.onmessage = function(event) {
			if (event.data.isCompleted) {
				const dur = getDuration();
				if (dur >= 1 || dur == 0) {
					startTime = new Date();
					/* Start cycle again when last device is reached */
					// flags.overview.worker.postMessage({ cmd: 'start', min: 0, max: 120 });	//** FOR LARGE SYSTEM */
					flags.overview.worker.postMessage({ cmd: 'start', min: 0, max: 10 });		//** FOR SMALL SYSTEM */
					/* Check for empty blocks */
					revertToDefault(JSON.parse(event.data.data));
				}
			} else {
				startTimer();
			}
			if (event.data.data != '[]' && event.data.data !== undefined) {
				overviewDataHandler(JSON.parse(event.data.data));
			}
		}
	} else {
		/** Fetch current data **/
		flags.overview.worker.postMessage({ cmd: 'get', });
	}
}

function overviewDataHandler(data) {
	var elem = '', colorGrp = flags.overview.colorGroup.dark;
	const _tempCollection = JSON.parse(JSON.stringify(deviceCollection));
	/** Check if data is empty **/
	if(!(data === null)) {
		var darkBg = $('body').hasClass('dark-bg');
		
		for(var i = 0; i < data.length; i++) {
			if ($.isEmptyObject(data[i])) continue;
			/* Map device id and it state */
			deviceCollection[data[i].devdid] = 0;

			var overviewElem = '#' + flags.currPage + ' .overview-pane:nth-child(' + data[i].devdid + ')';

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

			/** Device name **/
			$(overviewElem + ' > div:nth-child(1)').find('label').html(data[i].devnme);
			$(overviewElem + ' > div:nth-child(1)').find('label').attr('title', data[i].devnme);
			$(overviewElem + ' > div:nth-child(1)').find('span').hide();
			/** Prewarn Status **/
			if(cnt >= pwn && pwn != 0) {
				if(flags.pref.theme == 'dark') {
					$(overviewElem + ' > div:nth-child(1)').css('background-image', 'linear-gradient(to right bottom, rgba(221,89,0,0.9), transparent');
				} else {
					$(overviewElem + ' > div:nth-child(1)').css('background-image', 'linear-gradient(to right bottom, rgba(221,89,0,0.9), var(--gray)');
				}
			} else {
				$(overviewElem + ' > div:nth-child(1)').css('background-image', 'none');
				$(overviewElem + ' > div:nth-child(1)').css('background-color', 'rgba(0,0,0,0.4)');
			}
			/** Device Status **/
			elem = $(overviewElem + ' > div:nth-child(2)');
			if(data[i].devsta == '0') {
				elem.css('background-color', 'initial').attr({'data-did': data[i].devdid, 'data-nme': '', 'data-lid': '', 'data-uid': '', 'data-jid': ''}).removeClass('pulse-animate');
				elem.find('.overview-body-lbl').addClass('defaultClr').html(lang[flags.pref.lang].status['OFFLINE']);
			} else {
				switch(data[i].devmst) {
					case 'PRODUCTIVE':
						elem.css('background-color', colorGrp[data[i].devmst]).attr({'data-did': data[i].devdid, 'data-nme': '', 'data-lid': '', 'data-uid': '', 'data-jid': ''}).removeClass('pulse-animate');
						elem.find('.overview-body-lbl').removeClass('defaultClr').html(lang[flags.pref.lang].status[data[i].devmst]).css('color', 'black');
						break;
						
					case 'UNPRODUCTIVE':
						elem.css('background-color', colorGrp[data[i].devmst]).attr({'data-did': data[i].devdid, 'data-nme': data[i].devnme, 'data-lid': data[i].devlid, 'data-uid': data[i].devcus, 'data-jid': data[i].devjid});
						elem.find('.overview-body-lbl').removeClass('defaultClr').html(lang[flags.pref.lang].status[data[i].devmst]).css('color', 'black');

						if(data[i].devcus == '--' || data[i].devcus == '' || data[i].devcus == '0') {
							deviceCollection[data[i].devdid] = 1;
						} else {
							deviceCollection[data[i].devdid] = 0;
						}
						break;
						
					case 'COMPLETED':
						elem.css('background-color', colorGrp[data[i].devmst]).attr({'data-did': data[i].devdid, 'data-nme': '', 'data-lid': '', 'data-uid': '', 'data-jid': ''}).removeClass('pulse-animate');
						elem.find('.overview-body-lbl').removeClass('defaultClr').html(lang[flags.pref.lang].status[data[i].devmst]).css('color', 'black');
						break;
						
					case 'COMPLETED*':
						elem.css('background-color', colorGrp[data[i].devmst]).attr({'data-did': data[i].devdid, 'data-nme': '', 'data-lid': '', 'data-uid': '', 'data-jid': ''}).removeClass('pulse-animate');
						elem.find('.overview-body-lbl').removeClass('defaultClr').html(lang[flags.pref.lang].status[data[i].devmst]).css('color', 'black');
						break;

					default:
						elem.css('background-color', 'initial').attr({'data-did': data[i].devdid, 'data-nme': '', 'data-lid': '', 'data-uid': '', 'data-jid': ''}).removeClass('pulse-animate');
						elem.find('.overview-body-lbl').addClass('defaultClr').html(lang[flags.pref.lang].status[data[i].devmst]);
						break;
				}
			}
		}
		$('#' + flags.currPage + ' .last-update label').html('<span>' + lang[flags.pref.lang].general.lastUpdate + '</span>: ' + getDateTimeNow('-').dnt);

		/* Compare the difference between previous collection to the current collection */
		var result = {
			isEqual: true,
			hasActive: false,
		};
		Object.entries(deviceCollection).map(([key, value]) => {
			console.log (value);
			console.log (key);
			try {
				var elem = $(`#${flags.currPage} .overview-pane:nth-child(${key}) > div:nth-child(2)`);
				if (value != _tempCollection[key]) {
					result.isEqual = false;
				}
				if (value) {
					elem.addClass('add-blinking');
					result.hasActive = true;

					var alarm = $('#alarm');
					if (flags.pref.audioEnabled && !flags.overview.alarmPaused) {
						if(alarm.length <= 0) {
							playSound('assets/audio/alarm');
						} else {
							if(alarm[0].currentTime == 0) {
								alarm[0].play()
								.catch ((err) => {
									/* Check if another modal exist */
									if (!$('#overviewHelp').hasClass('show')) {
										$('#audioModal').modal('show');
									}
								});
							}
						}
					} else if(flags.overview.alarmPaused && !result.isEqual) {
						alarmTimeoutDisabled();
						alarmPaused(false);
						console.log ("ALARM PLAYED! #1");
					} else {
						// alarm.remove();
					}
				} else {
					elem.removeClass('add-blinking pulse-animate');
				}
			} catch (err) {
				console.error(err);
			}
		});

		/* Set or Unset blinking and alarm here */
		if (!result.isEqual) {
			if (result.hasActive) {
				/* Sync blink (Reset animation) */
				/* Remove all blinking animation */
				var syncItems = $('#overview-container').find('.pulse-animate');
				for(var i = 0; i < syncItems.length; i++) {
					$(syncItems[i]).removeClass('pulse-animate');
					/* Forces Redraw function */
					syncItems[i].offsetHeight;
				}
				/* Activate all blinking animation */
				var syncItems = $('#overview-container').find('.add-blinking');
				console.log(`Found unproductive devices: ${syncItems.length}`)
				for(var i = 0; i < syncItems.length; i++) {
					$(syncItems[i]).addClass('pulse-animate');
				}
			} else {
				/* Remove all blinking animation and sound */
				$('#alarm').remove();
				var syncItems = $('#overview-container').find('.pulse-animate');
				for(var i = 0; i < syncItems.length; i++) {
					$(syncItems[i]).removeClass('pulse-animate add-blinking');
				}
			}
		}
	}
	flags.ajaxRequestStatus = null;
}

function setDowntimeCause () {
	var element = $('#downModalBox .panel-container').find('div.active');
	var newcause = $(element).find('label').data('uid');

	if(newcause == '' || newcause === null || newcause === undefined) {
		$('#downModalBox').modal('hide');
		showPrompt(lang[flags.pref.lang].overview.prompts.noCause, 'Failed');
		return;
	}

	$.ajax({
		type: 'POST',
		url: 'php/setDowntimeCause.php',
		data: { 
			schedid: downCauseAttr.lid, 
			cause: newcause,
			jobid: $(downCauseAttr.selElem).attr('data-jid'), 
		},
		dataType:'json',
		async: true,
		success: function(data) {
			/** Check if data is empty **/
			$('#downModalBox').modal('hide');
			if(data == 'failed') {
				showPrompt(lang[flags.pref.lang].overview.prompts.saveFail, 'Failed');
			} else {
				showPrompt(lang[flags.pref.lang].overview.prompts.saveSuccess, 'Success');

				/* clean up */
				// $(downCauseAttr.selElem).removeClass('pulse-animate add-blinking');
				$('#alarm').remove();

				/* Update UI */
				const did = $(downCauseAttr.selElem).attr('data-did');
				deviceCollection[did] = 0;
				flags.overview.worker.postMessage({ cmd: 'update', min: did });
			}
			downCauseAttr.selElem = '';
			alarmPaused(true);
			alarmTimeoutEnabled();
		},
		error: function() {
			downCauseAttr.selElem = '';
			alarmPaused(false);
			console.log ("ALARM PLAYED! #2");
			alarmTimeoutEnabled();
		}
	});
}

function alarmPaused(state) {
	flags.overview.alarmPaused = state;
}

function alarmTimeoutEnabled() {
	flags.overview.alarmTimer = 0;
	flags.overview.alarmEnabled = true;
}

function alarmTimeoutDisabled() {
	flags.overview.alarmEnabled = false;
}

function alarmTimeoutTimer() {
	if (!flags.overview.alarmEnabled) {
		return;
	}

	if (flags.overview.alarmTimer < flags.overview.alarmTimeoutVal) {
		flags.overview.alarmTimer++;
	} else {
		alarmTimeoutDisabled();
		alarmPaused(false);
		console.log ("ALARM PLAYED! #3");
	}
}

function startTimer() {
	if (startTime !== undefined) return;

  	startTime = new Date();
};

function getDuration() {
	if (startTime === undefined) return 0;

	endTime = new Date();
	var timeDiff = endTime - startTime; //in ms
	// strip the ms
	timeDiff /= 1000;

	// get seconds 
	var seconds = Math.round(timeDiff);
	// console.log(seconds + " seconds");  //Au
	return seconds;
}

function getDowntimeById (id, callback) {
	$.ajax({
		type: 'POST',
		url: 'php/getDowntimeById.php',
		data: { job_id: id },
		dataType:'json',
		async: true,
		success: function(data) {
			callback(data);
		}
	});
}