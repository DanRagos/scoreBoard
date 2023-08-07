var downCause = {
	'page': 1,
	'pagelen': 1,
	'itemPerPage': 15,
	'data': {},
	'schedid': '',
	'rsnId': ''
};

function getDownReason(schedid) {
	downCause.schedid = '';
	downCause.rsnId = '';

	$.ajax({
		type: 'POST',
		url: 'php/getDowntimeReason.php',
		data: { id: schedid },
		dataType:'json',
		async: true,
		success: function(data) {
			/** Check if data is empty **/
			if(!$.isEmptyObject(data)) {
				downCause.page = 1;
				downCause.data = data.list;
				downCause.pagelen = Math.ceil(data.list.length / downCause.itemPerPage);
				downCause.schedid = data.id[0].dtdid;

				var parent = $('#downModalBox .panel-container');
				var items = '';
				for(var i = 0; i < downCause.itemPerPage; i++) {
					items += '<div><label class="mx-auto text-center" data-rid="' + downCause.data[i].dtrid + '">' + downCause.data[i].dtrsn + '</label></div>';
				}
				$(parent).html(items);

				if(downCause.pagelen > 1) {
					$('#downModalBox .modal-body').find('button').attr('disabled', false);
				} else {
					$('#downModalBox .modal-body').find('button').attr('disabled', true);
				}

				$('#downModalBox').modal('show');
			}
		}
	});
}

function changeDownPanelPage(direction) {
	var page = downCause.page;
	page += direction == 'right' ? 1 : -1;

	if(page <= 0) {
		page = downCause.pagelen;
	} else if(page > downCause.pagelen) {
		page = 1;
	}

	var offset = (page - 1) * downCause.itemPerPage;
	var items = '', parent = $('#downModalBox .panel-container');
	for(var i = 0 + offset; i < (offset + downCause.itemPerPage); i++) {
		if(downCause.data[i] !== undefined) {
			items += '<div';
			if(downCause.rsnId == downCause.data[i].dtrid) {
				items += ' class="active"';
			}
			items += '><label class="mx-auto text-center" data-rid="' + downCause.data[i].dtrid + '">' + downCause.data[i].dtrsn + '</label></div>';
		} else {
			items += '<div class="disabled"><label class="mx-auto text-center" data-id="">--</label></div>';
		}
	}
	$(parent).html(items);

	downCause.page = page;
}

function setDownReason() {
	var element = $('#downModalBox .panel-container').find('div.active');
	var reason = $(element).find('label').data('rid');
	var remarks = $('#remarks-input').val();

	if(reason == '' || reason === null || reason === undefined) {
		showPrompt(lang[flags.pref.lang].overview.prompts.noCause, 'Failed');
		return;
	}

	$.ajax({
		type: 'POST',
		url: 'php/setDowntimeReason.php',
		data: { sched: downCause.schedid, rsn: reason, rem: remarks },
		dataType:'json',
		async: true,
		success: function(data) {
			/** Check if data is empty **/
			$('#downModalBox').modal('hide');
			if(data == 'failed') {
				showPrompt(lang[flags.pref.lang].overview.prompts.saveFail, 'Failed');
			} else {
				showPrompt(lang[flags.pref.lang].overview.prompts.saveSuccess, 'Success');

				if($('#viewBtn').hasClass('active') || checkHistoryBtn()) {
					//manual update
					refreshTable();
					resetPageIndex();
				}
			}
		}
	});
}