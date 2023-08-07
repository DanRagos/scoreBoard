const initDowntimeTable = () => {
    console.log("initDowntimeTable()");

    flags.downtime.table = $('#unproductiveTbl').DataTable({
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
        "columnDefs": [
            // {
            //     "targets": [6],
            //     "visible": false
            // },
            // { "orderable": false, "targets": 11 },
            // { "type": 'natural', "targets": [0, 1, 3, 4, 5, 6] },
            // { targets: 0, orderData: [0, 7, 1] },
            // { targets: 1, orderData: [1, 7] },
            // { targets: 2, orderData: [2, 7, 1] },
            // { targets: 3, orderData: [3, 7, 1] },
            // { targets: 4, orderData: [4, 7, 1] },
            // { targets: 5, orderData: [5, 7, 1] },
            // { targets: 6, orderData: [6, 7, 1] },
            // { targets: 9, orderData: [9, 7, 1] }
        ],
        "columns": [
            {
                data: "devnme",
                render: function (data, type, row) {
                    return row.devnme == null ? row.devdid : row.devnme;
                }
            },
            { data: "devjob" },
            { data: "devpde" },
            { data: "devmod" },
            { data: "devmat" },
            { data: "devopr" },
            { data: "devstt" },
            { data: "devend" },
            { data: "devdur" },
            { 
                data: "devdts",
                render: (data, type, row) => {
                    if (row.devdts === 'WDT') {
                        let rowVal = '';
                        if (row.devucs === '' || row.devucs === null) {
                            rowVal = `${lang[flags.pref.lang].general[row.devdts]}`;
                        } else {
                            rowVal = `${lang[flags.pref.lang].general[row.devdts]}-${row.devucs}`;
                        }
                        return rowVal;
                    }
                    let key = '';
                    switch (row.devdts) {
                        case 'STATE 1': 
                            key = 'ST1';
                            break;
                        case 'STATE 2':
                            key = 'ST2';
                            break;
                        case 'STATE 3':
                            key = 'ST3';
                            break;
                        case 'STATE 4':
                            key = 'ST4';
                            break;
                        case 'INHIBIT':
                            key = 'INH';
                            break;
                    }
                    return lang[flags.pref.lang].general[key];
                }    
            },
            // {
            //     data: "devucs",
            //     render: function (data, type, row) {
            //         var retval;
            //         // retval = row.devdts;
            //         // return retval;
            //         if (row.devucs == '' || row.devucs === null) {
            //             // if (row.devdts === '' || row.devdts === null) {

            //                 retval = lang[flags.pref.lang].jotimechart.norecord;
            //             // } else {
            //             //     retval = row.devdts;
            //             // }
                        
            //         } else {
            //             retval = row.devucs.replace(':', '<br>');
            //         }
            //         return retval;
            //     }
            // },
            {
                data: "--",
                render: function (data, type, row) {
                    var form = "";
                    if (row.devrem != "--" && row.devrem != null) {
                        form = '<i class="fas fa-comment fa-flip-horizontal text-warning"></i>&nbsp';
                    } else {
                        form = '<i class="fas fa-comment fa-flip-horizontal"></i>&nbsp';
                    }
                    form += "<button type='btn' class='btn btn-sm btn-dark edit-btn' ";
                    form += "onclick='editBtn(" + row.rowCnt + ")'";
                    if (flags.unproductive.disableInput) {
                        form += " disabled";
                    }
                    form += ">" + lang[flags.pref.lang].general.editlbl + "</button>";
                    return form;
                }
            }
        ],
        "destroy": true,
        // "pageResize": true,
        "scrollX": true,
        "scrollCollapse": true,
        "paging": true,
        // "responsive": true
    });

    /*************************************************************************************/
		// Hanz: Bug #27 (generic list) fix or http-1201 bug #22 fix
		flags.downtime.table.on('preDraw', function() {
			// console.log("Downtime table pre-draw!");
			if (!$.isEmptyObject(flags.downtime.table))
			{
				if ($('#unproductiveTbl tr.child').length != 0)
				{
					// If a child row is currently displayed, do not update number of rows display.
					// Let the y-scroll do its thing.
					return;
				}

				var available_height =  $('#detail-tab #detail-table-content .tbl-container.unprodTable').outerHeight() -
                                        $('#detail-tab .dataTables_scrollHead').outerHeight() -
                                        $('#unproductiveTbl_footer').outerHeight();

				if (flags.downtime.table.responsive.hasHidden())
				// if ($('body').width() < 461)
				{
					/* This evaluates to true if datatable extra button (+) is present
					because responsive plug in will show the extra button whenever
					there are hidden columns. This is better than using experimentally 
					determined pixel widths because breakpt for hiding of + button
					is also affected by long values (job order names example) or changing
					font size in the future).*/
					var no_of_rows = Math.trunc(available_height/37) - 1;
				}
				else
				{
					var no_of_rows = Math.trunc(available_height/47) - 1;
				}
				console.log(`Can fit this number of rows:${no_of_rows}`);
				if (no_of_rows > 4)
				{
					flags.downtime.table.page.len(no_of_rows);
				}
				else
				{
					flags.downtime.table.page.len(5);
				}
				if (flags.currPage != 'detail-tab')
				{
					// No need to redraw if user is not at schedule page anyway.
					return false;
				}
			}
		});
		/*************************************************************************************/

    /************************http-1201 bug #21 fix - Improved 12-15-22********************/
    flags.downtime.table.on('draw', function() {
        setTimeout(() => {
            if ($('#unproductiveTbl_paginate>span>*').length == 0)
            {
                $('#unproductiveTbl_paginate .paginate_button.previous').css({
                    'padding-left': '',
                    'padding-right': ''
                });
                $('#unproductiveTbl_paginate .paginate_button.next').css({
                    'padding-left': '',
                    'padding-right': ''
                });
            }
            else
            {
                if (($('#unproductiveTbl_paginate>span>a.paginate_button')[0].getBoundingClientRect().left
                    - $('#unproductiveTbl_paginate .paginate_button.previous')[0].getBoundingClientRect().right) > 16)
                {
                    $('#unproductiveTbl_paginate .paginate_button.previous').css({
                        'padding-left': '',
                        'padding-right': ''
                    });
                    $('#unproductiveTbl_paginate .paginate_button.next').css({
                        'padding-left': '',
                        'padding-right': ''
                    });
                }
            }
        }, 1);

        if ($('#unproductiveTbl_footer').length == 0)
        {
            // This added element is just for flexing the display of "Showing 1 of 9 entries" + buttons (previous, 1, 2,...,Next)
            $('#unproductiveTbl_info, #unproductiveTbl_paginate').wrapAll("<div id='unproductiveTbl_footer'></div>");
        }
        console.log('unproductive table was drawn');
    });
    /*************************************************************************************/
};

const testDowntimeTable = (data) => {
    flags.downtime.tableData = data;
    if ($.isEmptyObject(flags.downtime.table)) {
        console.log('instantiate downtime table');
        initDowntimeTable();
    }
    flags.downtime.table.clear().rows.add(
        data
    ).draw(false);
}
