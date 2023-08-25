/**
 * Description: Runs every 1 second. Holds function for running queries on every page.
 *				Handles autoscroll timing.
 * Parameters: None
 * Prereq: query_start()
 * Return: None
**/
var timer = {
	'failCnt': 0,
	'timeout': 0,
	'counter': 0,
	'scrollCounter': 0,
	'interval': 1000,
	'buttonTimer': {
		'enabled': false,
		'ticks': 0,
		'retries': 0,
	}
};

function query_timer() {
	if(flags.queryPause) {
		return;
	}

	/* Start and Stop timeout handler: blocks other time based query */
    // if(timer.buttonTimer.enabled) {
    // 	if (flags.control.startStopRequest == null) {
    // 		checkJobState();
    // 	}
    	
    // 	if(timer.buttonTimer.ticks >= startandstopTimeoutVal) {
    // 		/* Change the prompt! */
    // 		if(flags.control.startStopRequest != null) {
	// 			flags.control.startStopRequest.abort();
	// 			flags.control.startStopRequest = null;
	// 		}

    // 		if(flags.control.addNewSchedOnStart) {
	// 			deleteAddedSchedule(flags.control.currSchedId);
	// 			clearMobileDashboard();
	// 			getBlacklist('user');
	// 		}
			
	// 		flags.control.addNewSchedOnStart = false;
    // 		closesnsModal(lang[flags.pref.lang].control.prompts.startTimeout);
    // 	} else {
    // 		timer.buttonTimer.ticks++;
    // 	}
    // 	return;
    // }

    /* Overview sound */
    // alarmTimeoutTimer();

	if(flags.ajaxRequestStatus == null) {
		console.log(flags.currPage + " query executed.");
		timer.failCnt = 0;

		switch(flags.currPage) {
			// case 'control-tab':
			// 	controlDashboardUpdate();
			// 	break;

			case 'dashboard-tab':
				dashboardUpdate();
				break;

			// case 'duration-tab':
			// 	durationTabUpdate();
			// 	break;

			// case 'overview-tab':
			// 	overviewUpdate();
			// 	break;

			case 'summary-tab':
				summaryUpdate();
				break;

			// case 'reject-tab':
			// 	rejectUpdate();
			// 	break;

			// case 'unproductive-tab':
			// 	// unproductiveUpdate();
			// 	break;

			// case 'schedule-tab':
			// 	scheduleUpdate();
			// 	break;

			// case 'date-tab':
			// 	if(flags.system.pageIndex == 1) {
			// 		getDateAndTime();
			// 	}
			// 	break;

			default:
				break;
		}
	} else {
		console.log(flags.currPage + " query cancelled. waiting for previous call response.");
		timer.failCnt++;
		if(timer.failCnt > 30) {
			timer.failCnt = 0;
			if(flags.ajaxRequestStatus !== null) {
				flags.ajaxRequestStatus.abort();
				flags.ajaxRequestStatus = null;
			}
		}
	}

	/** autoscroll timer **/
	if((flags.currPage == 'dashboard-tab') && flags.pref.autoscroll) {
		if(timer.scrollCounter >= flags.pref.interval) {
			if(flags.dashboard.pageLimit == 1) {
				return;
			}

			if(flags.ajaxRequestStatus !== null) {
				flags.ajaxRequestStatus.abort();
				flags.ajaxRequestStatus = null;
			}

			flags.dashboard.currPage = pageMoveTo('right');
			clearDashboard();
			resetTimer();
			console.log('Execute page move.');
		} else {
			timer.scrollCounter++;
		}
	}

	/** Fullscreen checker **/
	// flags.pref.isFullscreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
 //    if(flags.camera.fullscreenPrevState != flags.pref.isFullscreen) {
 //        setTimeout(function() {
 //            executeFullscreenMode();
 //        }, 100);
 //    }
}	

/**
 * Description: Start to run the function at background.
 * Parameters: None
 * Prereq: None
 * Return: None
**/
function query_start() {
	if(timer.timeout > 0) {
		return;
	}

	timer.timeout = setInterval(query_timer, timer.interval);
	timer.failCnt = 0;
}

/**
 * Description: Stops and reset the function at background.
 * Parameters: None
 * Prereq: None
 * Return: None
**/
function query_stop() {
	clearInterval(timer.timeout);
	timer.counter = null;
	timer.timeout = 0;
}

function resetTimer() {
	timer.scrollCounter = 0;
}

function getDateTimeNow(separator) {
	var today = new Date();
	var retDate = today.getFullYear() + separator + appendZero(parseInt(today.getMonth())+1) + separator + appendZero(today.getDate());
	var retTime = appendZero(today.getHours()) + ':' + appendZero(today.getMinutes()) + ':' + appendZero(today.getSeconds());
	var retDnT = retDate + ' ' + retTime;
	var timestamp = today.getFullYear().toString() + (appendZero(parseInt(today.getMonth())+1)).toString() + (appendZero(today.getDate())).toString();
	timestamp += (appendZero(today.getHours())).toString() + (appendZero(today.getMinutes())).toString() + (appendZero(today.getSeconds())).toString();

	return { 'date': retDate, 'time': retTime, 'dnt': retDnT, 'tms': timestamp };
}

function appendZero(digit) {
	var a = parseFloat(digit);
	if(a < 10) {
		return '0' + a;
	} else {
		return a;
	}
}