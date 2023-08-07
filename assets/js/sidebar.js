$(function() {
	$('#open-sidebar').on('click', function() {
		setTimeout(() => {
			$('#sidebar').removeClass('inactive').addClass('active');
			sidebarTimerStart();
		}, 5);
	});
	
	$('#close-sidebar').on('click', function() {
		$('#sidebar').removeClass('active').addClass('inactive');
		sidebarTimerStop();
	});
	
	$('.btn-tab').on('click', function() {
		$('.btn-tab').not(this).removeClass('active');
		$('#sidebar').removeClass('active').addClass('inactive');
		sidebarTimerStop();
	});
});

function sidebarHandler() {
	// console.log("sidebar routine active");
	if (flags.sidebar.timerEnable) {
		flags.sidebar.cycle++;
		if (flags.sidebar.cycle == flags.sidebar.timeout) {
			$('#close-sidebar').click();
		}
	}
}

function sidebarTimerStart() {
	sidebarTimerStop();
	// console.log("sidebar routine started");

	flags.sidebar.timerEnable = true;
	flags.sidebar.cycle = 0;
	flags.sidebar.timer = setInterval(sidebarHandler, 1000);
}

function sidebarTimerStop() {
	// console.log("sidebar routine stopped");
	clearInterval(flags.sidebar.timer);
	flags.sidebar.timerEnable = false;
	flags.sidebar.cycle = 0;
}

function sidebarTimerReset() {
	if (flags.sidebar.timer > 0 && flags.sidebar.timerEnable) {
		sidebarTimerStart();
	}
}