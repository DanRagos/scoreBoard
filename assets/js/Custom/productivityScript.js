const initProductivityTable = () => {
    console.log('initProductivityTable()');

    // if (flags.productivity.table !== undefined && flags.productivity.table.fnDestroy !== undefined) {
    //     console.log(flags.productivity.table);
    //     flags.productivity.table.fnDestroy();
    // }

    flags.productivity.table = $('#productivityTbl').DataTable({
        dom: 'tip',
        retrieve: true,
        language: {
            paginate: {
                previous: lang[flags.pref.lang].general.datatable.prev,
                next: lang[flags.pref.lang].general.datatable.next,
            },
            info: lang[flags.pref.lang].general.datatable.info,
            emptyTable: lang[flags.pref.lang].general.datatable.empty,
            infoEmpty: lang[flags.pref.lang].general.datatable.infoempty,
        },
        responsive: true,
        pageResize: true,
        columns: [
            {
                data: 'timestamp',
                render: (data, type, row) => {
                    return row.extraStart;
                },
            },
            {
                data: 'devqty',
                render: (data, type, row) => {
                    return (row.extraCntA - row.extraCntB).toFixed(2);
                },
            },
            {
                data: 'count',
                render: (data, type, row) => {
                    return row.extraCntA.toFixed(2);
                },
            },
            {
                data: 'reject',
                render: (data, type, row) => {
                    return row.extraCntB.toFixed(2);
                },
            },
            {
                data: 'devfrq',
                render: (data, type, row) => {
                    // const cycleTime =
                    //   row.count == 0
                    //     ? 0
                    //     : parseFloat(
                    //         (row.interval * (row.intervalType == "hour" ? 3600 : 60)) /
                    //           (parseFloat(row.extraCntA) - parseInt(row.extraCntB))
                    //       ); //compute for cycle time
                    return row.extraCycleTime.toFixed(2);
                    // return cycleTime.toFixed(2);
                },
            },
        ],
        "scrollX": true         // Hanz: Fix for http-1201 bug #4
    });

    /*********Hanz: Fix for http-1201 bug #5 and #7*************************************************/
		flags.productivity.table.on('preDraw', function() {
			// console.log("Productivity table pre-draw!");
			if (!$.isEmptyObject(flags.productivity.table))
			{
				if ($('#productivityTbl tr.child').length != 0)
				{
					// If a child row is currently displayed, do not update number of rows display.
					// Let the y-scroll do its thing.
					return;
				}

				var available_height = 0;

				if ($('#visual-tab .dataTables_info').css('float') == 'none')
				{
					// .dataTables_info and .dataTables_paginate are on two separate lines.
					available_height = $('#visual-page').outerHeight() -
					$('#visual-page .dataTables_scrollHead').outerHeight() -
					$('#productivityTbl_info').outerHeight() - 
					$('#productivityTbl_paginate').outerHeight();
				}
				else
				{
					// .dataTables_info and .dataTables_paginate are both on single line.
					var larger_info_paginate = 0;
					if ($('#productivityTbl_info').outerHeight() > $('#productivityTbl_paginate').outerHeight())
					{
						larger_info_paginate = $('#productivityTbl_info').outerHeight();
					}
					else
					{
						larger_info_paginate = $('#productivityTbl_paginate').outerHeight();
					}
					available_height = $('#visual-page').outerHeight() -
					$('#visual-page .dataTables_scrollHead').outerHeight() -
					larger_info_paginate;
				}
                var no_of_rows = Math.trunc(available_height/37 - 1);
				// console.log(`Can fit this number of rows:${no_of_rows}`);
				if (no_of_rows > 4)
				{
					flags.productivity.table.page.len(no_of_rows);
				}
				else
				{
					flags.productivity.table.page.len(5);
				}
				if (flags.currPage != 'visual-tab')
				{
					// No need to redraw if user is not at productivity page anyway.
					return false;
				}
			}
		});
		/*************************************************************************************/

        /************************http-1201 bug #21: For flex implementation*******************/
        flags.productivity.table.on('draw', function() {
            setTimeout(() => {
                if ($('#productivityTbl_paginate>span>*').length == 0)
                {
                    $('#productivityTbl_paginate .paginate_button.previous').css({
                        'padding-left': '',
                        'padding-right': ''
                    });
                    $('#productivityTbl_paginate .paginate_button.next').css({
                        'padding-left': '',
                        'padding-right': ''
                    });
                }
                else
                {
                    if (($('#productivityTbl_paginate>span>a.paginate_button')[0].getBoundingClientRect().left
                        - $('#productivityTbl_paginate .paginate_button.previous')[0].getBoundingClientRect().right) > 16)
                    {
                        $('#productivityTbl_paginate .paginate_button.previous').css({
                            'padding-left': '',
                            'padding-right': ''
                        });
                        $('#productivityTbl_paginate .paginate_button.next').css({
                            'padding-left': '',
                            'padding-right': ''
                        });
                    }
                }
            }, 1);

            if ($('#productivityTbl_footer').length == 0)
            {
                $('#productivityTbl_info, #productivityTbl_paginate').wrapAll("<div id='productivityTbl_footer'></div>");
            }
			console.log('productivity table was drawn');
		});
        /*************************************************************************************/
};

const rerenderProductivityTable = () => {
    if (flags.productivity.table === undefined || $.isEmptyObject(flags.productivity.table) || flags.productivity.table === null) {
        return;
    }
    if (flags.productivity.processedTableData === undefined) {
        flags.productivity.processedTableData = null;
    }
    flags.productivity.table.clear();
    if (flags.productivity.processedTableData !== null) {
        flags.productivity.table.clear().rows.add(flags.productivity.processedTableData);
    }
    flags.productivity.table.draw();
}

const renderData = (data) => {
    const interval = $('#visual-addl-btn input').val();
    const intervalType = $('.interval-input > .active').attr('id') === 'hrlbl' ? 'hour' : 'minute';
    console.log('productivity table renderData()');
    console.log(intervalType);

    //  add intervalType variable to all data
    data.forEach((d) => {
        d.interval = interval;
        d.intervalType = intervalType;
    });

    flags.productivity.processedTableData = data;

    if (!flags.productivity.isGraphMode) {
        if ($.isEmptyObject(flags.productivity.table)) {
            console.log('instantiate productivity table');
            initProductivityTable();
        }

        // initProductivityTable();
        flags.productivity.table.clear().rows.add(data).draw(false);
    }

    const visualTableDiv = $('#visual-table-container > div');
    
    
    // visualTableDiv.removeClass('table-responsive');

    // visualTableDiv.addClass('table-responsive');
    // setTimeout(() => {
    //     visualTableDiv.addClass('table-responsive');
    // }, 5)
};
