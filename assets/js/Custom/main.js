const startandstopTimeoutVal = 30; //10; // in seconds
//$.fn.dataTable.ext.errMode = 'none';

/*************************************************************************************/
// Hanz: Bug #27 fix
// Hanz: For vertical page resize problem using library: detect-element-resize
var schedule_resize_handler = function () {
    console.log("Schedule table resize detected!");
    
    if (flags.currPage == 'schedule-tab')
    {
        if (!$.isEmptyObject(flags.schedule.table))
        {
            if ($('#scheduleTbl tr.child').length != 0)
            {
                // If a child row is currently displayed, do not update number of rows display.
                // Let the y-scroll do its thing.
                return;
            }
            if (flags.currPage == 'schedule-tab')
            {
                // No need to redraw if user is not at schedule page anyway.
                flags.schedule.table.draw();
            }
        }
    }
};
/*************************************************************************************/

/*************************************************************************************/
/* Hanz: Code modification to make summary table behavior similar with
schedule table (bug #27 fix) */
var summary_resize_handler = function () {
    console.log("Summary table resize detected!");
    
    if (flags.currPage == 'summary-tab')
    {
        if (!$.isEmptyObject(flags.summary.table))
        {
            if ($('#summaryTbl tr.child').length != 0)
            {
                // If a child row is currently displayed, do not update number of rows display.
                // Let the y-scroll do its thing.
                return;
            }
            if (flags.currPage == 'summary-tab')
            {
                // No need to redraw if user is not at summary page anyway.
                flags.summary.table.draw();
            }
        }
    }
};
/*************************************************************************************/

/*************************************************************************************/
/* Hanz: Code modification to make reject table behavior similar with
schedule table (bug #27 fix) */
var reject_resize_handler = function () {
    console.log("Reject table resize detected!");
    
    if (flags.currPage == 'reject-tab')
    {
        if (!$.isEmptyObject(flags.reject.table))
        {
            if ($('#rejectTbl tr.child').length != 0)
            {
                // If a child row is currently displayed, do not update number of rows display.
                // Let the y-scroll do its thing.
                return;
            }
            if (flags.currPage == 'reject-tab')
            {
                // No need to redraw if user is not at reject page anyway.
                flags.reject.table.draw();
            }
        }
    }
};
/*************************************************************************************/

/************Hanz: Productivity page resize handler***********************************/
// Fix for http-1201 bug #5 and #7
var productivity_resize_handler = function () {
    console.log("Productivity table resize detected!");
    
    if (flags.currPage == 'visual-tab')
    {
        if (!$.isEmptyObject(flags.productivity.table))
        {
            if ($('#productivityTbl tr.child').length != 0)
            {
                // If a child row is currently displayed, do not update number of rows display.
                // Let the y-scroll do its thing.
                return;
            }
            if (flags.currPage == 'visual-tab')
            {
                // No need to redraw if user is not at productivity page anyway.
                flags.productivity.table.draw();
            }
        }
    }
};
/*************************************************************************************/

/*************************************************************************************/
// Hanz: Bug #27 fix (similar) for JO Timechart page
// Hanz: For vertical page resize problem using library: detect-element-resize
var jotimechart_resize_handler = function () {
    console.log("JO timechart table resize detected!");
    
    if (flags.currPage == 'detail-tab')
    {
        if (!$.isEmptyObject(flags.downtime.table))
        {
            if ($('#unproductiveTbl tr.child').length != 0)
            {
                // If a child row is currently displayed, do not update number of rows display.
                // Let the y-scroll do its thing.
                return;
            }
            if (flags.currPage == 'detail-tab')
            {
                // No need to redraw if user is not at schedule page anyway.
                flags.downtime.table.draw();
            }
        }
    }
};
/*************************************************************************************/

/*************************************************************************************/
// Hanz: Bug #27 fix (similar) for datetime page (http-1201 bug #26)
// Hanz: For vertical page resize problem using library: detect-element-resize
var usermanagement_resize_handler = function () {
    console.log("User management table resize detected!");

    if ((flags.currPage == 'date-tab') && ($('#usr-config-page').hasClass('active')))
    {
        if (!$.isEmptyObject(flags.system.table))
        {
            if ($('#usrMngmt tr.child').length != 0)
            {
                // If a child row is currently displayed, do not update number of rows display.
                // Let the y-scroll do its thing.
                return;
            }
            if ((flags.currPage == 'date-tab') && ($('#usr-config-page').hasClass('active')))
            {
                // No need to redraw if user is not at schedule page anyway.
                flags.system.table.draw();
            }
        }
    }
};
/*************************************************************************************/

var flags = {
    pref: {
        theme: 'dark',
        interval: 10,
        chartItems: 6,
        autoscroll: false,
        showHelp: true,
        kioskMode: false,
        tableColWrap: false,
        audioEnabled: false,
        isFullscreen: false,
        lang: 'en',
    },
    summary: {
        isFiltered: false,
        selectedFilter: [],
        table: {},
        pageIndex: 1,
        consolidated: false,
        showSchedEnd: false,
        showProdEnd: true,
        isChartMode: false,
        instanceNames: [],
        chart: {},
        data: {}
    },
    reject: {
        isFiltered: false,
        selectedFilter: [],
        table: {},
        pageIndex: 1,
        disableInput: false,
        table2: {},
    },
    unproductive: {
        isFiltered: false,
        selectedFilter: [],
        table: {},
        pageIndex: 1,
        disableInput: false,
    },
    schedule: {
        isFiltered: false,
        selectedFilter: [],
        table: {},
        pageIndex: 1,
        recentAddedId: '',
        loadedDeviId: '',
        loadedTgt: '',
        isGraphMode: false,
        data: [],
        dateToUse: {},
        chartObject: null,
        chartCurrentPage: null,
    },
    config: {
        table: {},
        pageIndex: 1,
        clusterOnEdit: '',
    },
    system: {
        table: {},
        pageIndex: 1,
        causeRegPage: 1,
        mobileView: false,
        currentTz: '',
        prevUserInput: '',
        prevPassInput: '',
        userandpass: [false, false],
    },
    displayMode: {
        schedule: 'today',
        others: 'today',
        initLoad: false,
        page: 'summary',
    },
    dashboard: {
        currPage: 1,
        pageLimit: 1,
        maxDeviceCnt: 10,
        maxDevicePerPage: 10,
        currGroup: '',
        prevGroup: '',
        colorGroup: {
            dark: {
                PRODUCTIVE: '#00da73',
                UNPRODUCTIVE: '#ff597b',
                COMPLETED: '#00a3dd',
                'COMPLETED*': '#51b5e0',
            },
            light: {
                PRODUCTIVE: '#009e60',
                UNPRODUCTIVE: '#f12a52',
                COMPLETED: '#0072c6',
                'COMPLETED*': '#00a3dd',
            },
        },
    },
    overview: {
        initialized: false,
        alarmPaused: false,
        alarmTimer: 0,
        alarmEnabled: false,
        alarmTimeoutVal: 300, // 5mins
        dtInstance: 0,
        colorGroup: {
            dark: {
                PRODUCTIVE: 'rgba(0,218,115,0.8)',
                UNPRODUCTIVE: 'rgba(255,89,123,0.8',
                COMPLETED: '#00a3dd',
                'COMPLETED*': '#51b5e0',
            },
            light: {
                PRODUCTIVE: 'rgba(0,218,115,0.8)',
                UNPRODUCTIVE: 'rgba(255,89,123,0.8',
                COMPLETED: '#00a3dd',
                'COMPLETED*': '#51b5e0',
            },
        },
        dtCollection: [],
        dtCauseListBoxEnabled: false,
        worker: undefined,
    },
    control: {
        currSchedId: '',
        blacklist: false,
        blacklistJob: '',
        blacklistSched: '',
        blacklistState: '',
        triggerMachineChange: false,
        triggerJobChange: false,
        deviceOnbacklog: false,
        pendingBtnCmd: '',
        addNewSchedOnStart: false,
        addNewBypass: false,
        startStopRequest: null,
    },
    camera: {
        isActive: false,
        fullscreenPrevState: false,
    },
    detailedlog: {
        table: {},
        isGraphMode: true,
        selectedDevice: '',
        selectedJob: '',
    },
    productivity: {
        isGraphMode: true,
        table: {},
        tableData: [],
        devName: '',
        jobName: '',
    },
    sidebar: {
        timeout: 10,
        timerEnable: false,
        timer: 0,
        cycle: 0,
    },
    downtime: {
        table: {},
        tableData: [],
    },
    tableResponsive: false,
    viewModeOnly: false,
    currPage: null,
    queryPause: false,
    selectedFilterChanged: false,
    ajaxRequestStatus: null,
    isMobileAccnt: false,
};

var filters = {
    schedule: [
        'Machine',
        'Job Order',
        'Model',
        'Material',
        'Target Qty',
        'Operator',
    ],
    unproductive: [
        'Machine',
        'Job Order',
        'Model',
        'Material',
        'Operator',
        'Source',
    ],
    reject: [
        'Machine',
        'Job Order',
        'Model',
        'Material',
        'Output Qty',
        'Reject Qty',
    ],
    summary: [
        'Machine',
        'Job Order',
        'Target',
        'Actual',
        'Difference',
        'Status',
    ],
};

var filterKeys = {
    Machine: 'devnme',
    'Job Order': 'devjob',
    Job: 'devjob',
    Model: 'devmod',
    Material: 'devmat',
    'Target Qty': 'devtgt',
    Target: 'devtgt',
    Operator: 'devopr',
    Source: 'devdts',
    Reject: 'devrej',
    Output: 'devout',
    Status: 'devsts',
    //Status: 'devsta',
    SchedId: 'devsid',
    Actual: 'devact',
    Difference: 'devdif',
    
};

// var cachedDate = {
//     schedule: {
//         fr: null,
//         to: null,
//     },
//     others: {
//         fr: null,
//         to: null,
//     },
// };

var userNotAllowedPages = {
    viewer: ['cluster-tab', 'date-tab', 'update-tab'],
    user: ['cluster-tab', 'date-tab', 'update-tab'],
    admin: [
        'control-tab',
        'dashboard-tab',
        'duration-tab',
        'overview-tab',
        'summary-tab',
        'reject-tab',
        'unproductive-tab',
        'schedule-tab',
    ],
    desktop: ['control-tab', 'cluster-tab', 'date-tab', 'update-tab'],
    mobile: ['schedule-tab', 'cluster-tab', 'date-tab', 'update-tab'],
};

var circleProgressBars = {
    reject: {},
    count: {},
};

var text_compilation = {};
var timechart = {};

const addStartTime = ({dateString}) => {
    return `${dateString} 00:00:00`;
};

const addEndTime = ({dateString}) => {
    return `${dateString} 23:59:59`;
};

$(document).ready(function () {
    var initPage;
    /** if mobile do not implement the scrollbar design, please just dont! **/
    if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        )
    ) {
        $('body').addClass('mobile');
    }

    /* Page caching */
    let accnt = $('#accntInfo').data('role');
    let cachedPage = localStorage.getItem('pageCached');
    // let cachedLang = localStorage.getItem('langCached');

    var local = {};
    local.theme = localStorage.getItem('themeCached');
    if (local.theme === undefined || local.theme === null) {
        local.theme = 'dark';
    }
    local.interval = localStorage.getItem('intervalCached');
    if (local.interval === undefined || local.interval === null) {
        local.interval = 10;
    }
    local.chartItems = localStorage.getItem('chartCached');
    if (local.chartItems === undefined || local.chartItems === null) {
        local.chartItems = 6;
    }
    local.scroll = localStorage.getItem('scrollCached');
    if (local.scroll === undefined || local.scroll === null) {
        local.scroll = false;
    }
    local.help = localStorage.getItem('helpCached');
    if (local.help === undefined || local.help === null) {
        local.help = true;
    }
    local.kiosk = localStorage.getItem('kioskCached');
    if (local.kiosk === undefined || local.kiosk === null) {
        local.kiosk = false;
    }
    local.wrap = localStorage.getItem('wrapCached');
    if (local.wrap === undefined || local.wrap === null) {
        local.wrap = false;
    }
    local.audio = localStorage.getItem('audioCached');
    if (local.audio === undefined || local.audio === null) {
        local.audio = false;
    }
    local.lang = localStorage.getItem('langCached');
    if (
        local.lang === undefined ||
        local.lang === null ||
        local.lang == 'null'
    ) {
        local.lang = 'en';
    }

    $('#themeSel').val(local.theme);
    $('#interval-btn').val(local.interval);
    $('#chartitem-btn').val(local.chartItems);
    $('#autoscroll-btn').prop('checked', local.scroll == 'true' ? true : false);
    $('#helper-btn').prop('checked', local.help == 'true' ? true : false);
    $('#kiosk-btn').prop('checked', local.kiosk == 'true' ? true : false);
    $('#colWrap-btn').prop('checked', local.wrap == 'true' ? true : false);
    $('#audio-btn').prop('checked', local.audio == 'true' ? true : false);
    $('#langSel').val(local.lang);

    preferencesSetting();

    userPermissionAndAccess(accnt, cachedPage, function (cachedPage) {
        /** Restore page based on cache **/
        if (cachedPage != undefined) {
            initPage = $('#sidebar > .tablist-container').find(
                'button.btn-tab[data-target="#' + cachedPage + '"]'
            );
        } else {
            initPage = $('#sidebar > .tablist-container').find(
                'button.btn-tab[data-target="#dashboard-tab"]'
            );
        }

        // This will return true or false depending on if it's full screen or not
        flags.pref.isFullscreen =
            document.fullScreen ||
            document.mozFullScreen ||
            document.webkitIsFullScreen;
        if (accnt != 'admin') {
            audioHandler();
        }

        /** Tab selection handler **/
        $('#sidebar > .tablist-container button.btn-tab').on(
            'click',
            function () {
                /** Page Initialization **/
                flags.currPage = $(this).data('target').replace('#', '');
                localStorage.setItem('pageCached', flags.currPage);
                console.log('tab selected: ' + flags.currPage);

                loadPageResources();
            }
        );

        fullscreenHandler();

        documentHandlers();

        preferenceHandlers();

        tableFilterHandlers();

        tablePageHandlers();

        dashboardTabHandlers();

        controlTabHandlers();

        clusterTabHandlers();

        systemTabHandlers();

        userActionHandlers();

        buttonPanelHandler();

        chartHandlers();

        shortcutKeyHandlers();

        softwareUpdateHandlers();

        detailTabHandlers();

        bsScanHandler();

        $('#sched-show-data-btn').on('click', () => {
            const schedTableContentDiv = $('#schedule-content');
            const schedTableView = $('.tbl-container.schedTable');
            const schedChartView = $('#schedchart-container');
            const sidePanel = $('#schedule-tab .sidepanel');
            const schedShowDataBtnLabel = $('#sched-show-data-btn .showdatalbl');
            const schedShowDataBtn = $('#sched-show-data-btn');
            const schedShowDataBtnIcon = $('#sched-show-data-btn > i');
            const todayBtn = $('#schedule-grp .schedToday');
            const isTodayQuery = todayBtn.hasClass('active');
            const addSchedBtn = $('#add-sched-btn');
            const qrSchedBtn = $('#schedQR-btn-secured');
            if (flags.schedule.isGraphMode) {
                if (isTodayQuery) {
                    query_start();
                }
                addSchedBtn.prop('disabled', flags.viewModeOnly ? true : false);
                qrSchedBtn.prop('disabled', flags.viewModeOnly ? true : false);
                schedShowDataBtnLabel.html(lang[flags.pref.lang].general.showchartlbl);
                schedShowDataBtnIcon.removeClass('fa-table').addClass('fa-chart-bar');
                schedChartView.hide();
                schedTableContentDiv.show();
                schedTableView.show();
                sidePanel.show();
                
                forceResizeTable();
            } else {
                if (isTodayQuery) {
                    query_stop();
                }
                addSchedBtn.prop('disabled', true);
                qrSchedBtn.prop('disabled', true);
                schedShowDataBtnLabel.html(lang[flags.pref.lang].general.showdatalbl);
                schedShowDataBtnIcon.removeClass('fa-chart-bar').addClass('fa-table');
                schedTableView.hide();
                sidePanel.hide();
                schedTableContentDiv.hide();
                schedChartView.show();
                schedChartView.css('visibility', 'hidden');
                //  console.log(schedChartView);
                flags.schedule.chartData = getScheduleChartData();
                
                flags.schedule.chartPagination = createNewPaginationInstance();
                flags.schedule.chartCurrentPage = 0;
                flags.schedule.chartPagination.create({numberOfPages: Object.keys(flags.schedule.chartData).length});
                
                $('#schedchart-pagination-container').html(flags.schedule.chartPagination.getHtml());
                const chart = initScheduleChart($('#themeSel').val() + '2', flags.schedule.chartData[0]);
                scheduleChartPageChecker();
                flags.schedule.chartObject = chart;
                setTimeout(() => {
                    schedChartView.css('visibility', 'visible');
                }, 250)
            }
            flags.schedule.isGraphMode = !flags.schedule.isGraphMode;
        });

        const prodShowDataBtn = $('#productivity-show-data-btn');


        prodShowDataBtn.on('click', () => {
            console.log('visual-show-data-btn clicked!');
            const visualTableContainer = $('#visual-table-container');
            const visualContainer = $('#visual-container');

            const visualShowDataBtnLabel = $('#productivity-show-data-btn span');
            const visualShowDataBtnIcon = $('#productivity-show-data-btn > i');
            const visualAddlBtn = $('#visual-addl-btn');
            const visualBtnGroup = $('#productivity-chart-btn-group');
            const visualPage = $('#visual-page');
            console.log(flags.productivity.isGraphMode);

            if (flags.productivity.isGraphMode) {
                //  switch to table
                console.log('switch to table!');
                visualShowDataBtnLabel.html(lang[flags.pref.lang].general.showchartlbl);
                visualShowDataBtnIcon.removeClass('fa-table');
                visualShowDataBtnIcon.addClass('fa-chart-bar');
                visualPage.removeClass('graph-view');
                visualPage.addClass('table-view');
                visualContainer.hide();
                // visualAddlBtn.hide();
                visualBtnGroup.children().prop('disabled', true);
                visualTableContainer.show();
                if ($.isEmptyObject(flags.productivity.table)) {
                    initProductivityTable();
                    rerenderProductivityTable();
                    // flags.productivity.table.columns.adjust().draw();
                    const visualDiv = $('#visual-table-container > div');
                    // visualDiv.removeClass('table-responsive');
                    // setTimeout(() => {
                    //  visualDiv.addClass('table-responsive');
                    // }, 5);
                } else {
                    // initProductivityTable();
                    setTimeout(() => {
                        // rerenderProductivityTable();
                    }, 1000);
                    getData({
                        devid: visualObjects.selectedDevice,
                        schedid: visualObjects.selectedJob,
                    });
                }

                setTimeout(() => {
                    // visualTableContainer.find('div').addClass('table-responsive');
                }, 1000);

            } else {
                //  switch back to graph
                console.log('switch to graph!');
                visualShowDataBtnLabel.html(lang[flags.pref.lang].general.showdatalbl);
                visualShowDataBtnIcon.removeClass('fa-chart-bar');
                visualShowDataBtnIcon.addClass('fa-table');
                visualPage.addClass('graph-view');
                visualPage.removeClass('table-view');
                visualTableContainer.hide();
                visualBtnGroup.children().prop('disabled', false);
                // visualAddlBtn.show();
                visualContainer.show();
                reload();
            }

            flags.productivity.isGraphMode = !flags.productivity.isGraphMode;
        });

        $('#switch-detail-data-btn').on('click', () => {
            console.log('#switch-detail-data-btn clicked');
            
            // $('#switch-productivity-data-btn').prop('disabled', false);

            const btn = $('#detail-tab-btn');
            btn.trigger('click');

            //  get current dev id and sched id
            let devID = visualObjects.selectedDevice;
            let schedID = visualObjects.selectedJob;
            if (devID === '') {
                devID = null;
            }
            if (schedID === '') {
                schedID = null;
            }
            console.log(`devID: ${devID}`);
            console.log(`schedID: ${schedID}`);

            //  change dropdown to these values, trigger dropdown on change
            const devDropdown = $('#detailDevice');
            const schedDropdown = $('#detailJobs');
            resetJOTimeChartPage();

            setTimeout(() => {
                if (devID !== null && schedID !== null) {
                    
                joTimeChart.getDevices().then(() => {
                    joTimeChart.detailDeviceChangeHandler(devID);
                    joTimeChart.detailJobChangeHandler(schedID);
    
                    devDropdown.val(devID);

                    const viewBtn = $('.tab-pane.show .view-btn');
                    viewBtn.addClass('active');
                    const i = $('.tab-pane.show .view-btn i');
                    i.addClass('text-success');
                });
                    //  schedDropdown value changed in detailJobChangeHandler()
                    // schedDropdown.val(schedID);
                } else {
                    resetJOTimeChartPage();
                }
            }, 1000)


        });

        $('#switch-productivity-data-btn').on('click', () => {
            const btn = $('#visual-tab-btn');
            btn.trigger('click');

            // $('#switch-detail-data-btn').prop('disabled', false);

            //  get current dev id and sched id
            let devID = joTimeChart.timechartObjects.selectedDevice;
            let schedID = joTimeChart.timechartObjects.selectedJob;

            if (devID === '') {
                devID = null;
            }
            if (schedID === '') {
                schedID = null;
            }

            
            const visualContainer = $('#visual-container');
            visualContainer.css('visibility', 'hidden');

            if (devID !== null && schedID !== null) {
                const devDropdown = $('#visualDevice');
                const jobDropdown = $('#visualJobs');

                //  should refactor this
                // setTimeout(() => {
                    getVisualDevices().then(() => {
                        getVisualDeviceJobs(devID)            
                        .then((data) => {
                            if (data.type != 'Success') showPrompt(data.msg, data.type);
                            console.log('data');
                            console.log(data);
                            jobDropdown.html(data.msg);
                            jobDropdown.prop('disabled', false);
                            devDropdown.val(devID);
                            jobDropdown.val(schedID);
    
                            visualObjects.selectedDevice = devID;
                            visualObjects.selectedJob = schedID;
                            setTimeout(() => {
                                jobDropdown.trigger('change');
                                setTimeout(() => {
                                    visualContainer.css('visibility', 'visible');
                                }, 100);
                            }, 100);
    
    
                        })
                        .catch((err) => {
                            showPrompt(err.msg, err.type);
                            jobDropdown.html(
                                `<option value='0' hidden selected>No Job Selected</option>`
                            );
                            jobDropdown.prop('disabled', true);
                        });
                    });

                // }, 1000);
            } else {
                // reset 
                resetVisualizationPage();
                rerenderProductivityTable();
            }
        });

        /** Module Initialization **/
        initDates();

        /*********************************************************************************/
        $('#schedto').on('focus', function () {
            add_sched_end_clear_btn();
        });
        $('body').on('focus', 'input.hasDatepicker', function () {
            setTimeout(() => {
                $("#ui-datepicker-div .ui-datepicker-buttonpane").addClass("clearfix");
                $("#ui-datepicker-div .ui-datepicker-buttonpane").css({
                    "display": "block"
                });
                if ($(window).outerHeight() < 431)
                {
                    $('#ui-datepicker-div').find('*').css({"font-weight": "700"});
                    updateDatepickerDisplay();
                }
            }, 1);
        });
        $('body').on('change', 'input.hasDatepicker', function () {
            setTimeout(() => {
                if ($(window).outerHeight() < 431)
                {
                    $('#ui-datepicker-div').find('*').css({"font-weight": "700"});
                    updateDatepickerDisplay();
                }
            }, 1);
        });
        /*********************************************************************************/

        loadClusters('#viewDevicesTab select');
        initPage.click();

        $(
            '.tbl-container:not(.schedTable):not(.detailTable):not(.unprodTable) .table-responsive'
        ).after(
            '<div class="text-center text-sm-center text-md-left text-lg-left text-xl-left table-btn-addon showButton-container" style="position: relative;"><button class="btn btn-dark btn-sm mr-2 showJob-btn" type="button"><i class="fa fa-caret-down"></i> <span>' +
                lang[flags.pref.lang].general.showAllJobs +
                '</span></button><button class="btn btn-dark btn-sm mr-2 refresh-btn" type="button" hidden><i class="fa fa-undo"></i> <span>' +
                lang[flags.pref.lang].general.refreshlbl +
                '</span></button><label class="last-update table-update"><span>' +
                lang[flags.pref.lang].general.lastUpdate +
                '</span>: yyyy-mm-dd hh:mm:ss</label></div>'
        );
        $('.showJob-btn').on('click', function () {
            var elem = $(this).parent().find('.refresh-btn');
            if (elem.attr('hidden')) {
                $(this).html(
                    '<i class="fa fa-caret-up"></i> <span>' +
                        lang[flags.pref.lang].general.showOngJobs +
                        '</span>'
                );
                $(this).addClass('active');
                elem.attr('hidden', false);
            } else {
                $(this).html(
                    '<i class="fa fa-caret-down"></i> <span>' +
                        lang[flags.pref.lang].general.showAllJobs +
                        '</span>'
                );
                $(this).removeClass('active');
                elem.attr('hidden', true);
            }

            if (flags.ajaxRequestStatus !== null) {
                flags.ajaxRequestStatus.abort();
                flags.ajaxRequestStatus = null;
            }

            if ($(this).hasClass('active')) {
                query_stop();
            } else {
                query_start();
            }

            showTableLoading();
            switch (flags.currPage) {
                case 'summary-tab':
                    summaryUpdate();
                    break;

                case 'reject-tab':
                    currentRejectButton.id = '';
                    rejectUpdate();
                    break;

                case 'unproductive-tab':
                    // unproductiveUpdate();
                    break;

                case 'schedule-tab':
                    scheduleUpdate();
                    break;

                case 'detail-tab':
                    // handleDetailedLogUpdate();
                    break;

                default:
                    break;
            }
        });
        $('.refresh-btn, #productivity-refresh-btn, #reject-refresh-btn').on('click', function () {
            if (flags.ajaxRequestStatus !== null) {
                flags.ajaxRequestStatus.abort();
                flags.ajaxRequestStatus = null;
            }

            showTableLoading();
            switch (flags.currPage) {
                case 'summary-tab':
                    if (flags.summary.isChartMode) {
                        $('#graphModal .snsPrompt').html(
                            lang[flags.pref.lang].general.loading
                        );
                        $('#graphModal').modal('show');
                        $('#cancelLoading').prop('disabled', true);

                        setTimeout(function () {
                            // getTimechartData();
                            // 03/26/2021 Jacob New Timechart method
                            getTimeChartDataNew();
                        }, 500);
                    } else {
                        summaryUpdate();
                    }
                    break;

                case 'reject-tab':
                    rejectUpdate();
                    break;

                case 'unproductive-tab':
                    // unproductiveUpdate();
                    break;

                case 'schedule-tab':
                    scheduleUpdate();
                    break;

                case 'detail-tab':
                    // handleDetailedLogUpdate();
                    break;

                default:
                    break;
            }
        });
    });
});

function initCircleProgress() {
    if ($.isEmptyObject(circleProgressBars.reject)) {
        circleProgressBars.reject = new CircleBar({
            id: 'rejectProgress',
            height: 'auto',
            width: 'auto',
            progressStrokeWd: 4,
            progressTip: 'round',
            showBase: true,
            showSubText: false,
            subtextPlaceholder: '-- / --',
            progressColor: 'rgb(0,220,0,0.7)',
            baseColor: 'rgba(255,255,255,0.8)',
            textColor: 'rgba(255,255,255,0.95)',
        });
        circleProgressBars.reject.setProgress(0, 2, '0 / 0');
    } else {
        if (circleProgressBars.reject.checkError() == '1') {
            circleProgressBars.reject = new CircleBar({
                id: 'rejectProgress',
                height: 'auto',
                width: 'auto',
                progressStrokeWd: 4,
                progressTip: 'round',
                showBase: true,
                showSubText: false,
                subtextPlaceholder: '-- / --',
                progressColor: 'rgb(0,220,0,0.7)',
                baseColor: 'rgba(255,255,255,0.8)',
                textColor: 'rgba(255,255,255,0.95)',
            });
            circleProgressBars.reject.setProgress(0, 2, '0 / 0');
        }
    }

    if ($.isEmptyObject(circleProgressBars.count)) {
        circleProgressBars.count = new CircleBar({
            id: 'countProgress',
            height: 'auto',
            width: 'auto',
            progressStrokeWd: 4,
            progressTip: 'round',
            showBase: true,
            showSubText: false,
            subtextPlaceholder: '-- / --',
            progressColor: 'rgb(0,135,255,0.9)',
            baseColor: 'rgba(255,255,255,0.8)',
            textColor: 'rgba(255,255,255,0.95)',
        });
        circleProgressBars.count.setProgress(0, 2, '0 / 0');
    } else {
        if (circleProgressBars.count.checkError() == '1') {
            circleProgressBars.count = new CircleBar({
                id: 'countProgress',
                height: 'auto',
                width: 'auto',
                progressStrokeWd: 4,
                progressTip: 'round',
                showBase: true,
                showSubText: false,
                subtextPlaceholder: '-- / --',
                progressColor: 'rgb(0,135,255,0.9)',
                baseColor: 'rgba(255,255,255,0.8)',
                textColor: 'rgba(255,255,255,0.95)',
            });
            circleProgressBars.count.setProgress(0, 2, '0 / 0');
        }
    }
}


let previousFrDate = '';
let previousToDate = '';

$('.dateFr').on('focus', (e) => {
    if (e.isTrigger) {
        return;
    }
    const val = $('.tab-pane.show .dateFr').val();
    previousFrDate = val;
});

$('.dateTo').on('focus', (e) => {
    if (e.isTrigger) {
        return;
    }
    const val = $('.tab-pane.show .dateTo').val();
    previousToDate = val;
});


function initDates() {
    // if(text_compilation['language'] == 'cn') {
    //  $('.dateFr').datetimepicker($.timepicker.setLanguage("cn"));
    //  $('.dateTo').datetimepicker($.timepicker.setLanguage("cn"));
    // }
    $('.dateFr, .dateTo').datepicker('destroy');

    $('#inputdt, #schedfr, #schedto').datetimepicker('destroy');

    $('#inputdt').datetimepicker({
        controlType: 'select',
        dateFormat: 'yy-mm-dd',
        timeFormat: 'HH:mm:ss',
        changeYear: true,
        yearRange: 'c-25:c+25',
        closeText: lang[flags.pref.lang].general.datepicker.done,
        currentText: lang[flags.pref.lang].general.datepicker.now,
        monthNames: lang[flags.pref.lang].general.datepicker.monthNames,
        monthNamesShort: lang[flags.pref.lang].general.datepicker.monthNamesShort,
        dayNames: lang[flags.pref.lang].general.datepicker.dayNames,
        dayNamesShort: lang[flags.pref.lang].general.datepicker.dayNamesShort,
        dayNamesMin: lang[flags.pref.lang].general.datepicker.dayNamesMin,
        weekHeader: lang[flags.pref.lang].general.datepicker.weekHeader,
        yearSuffix: lang[flags.pref.lang].general.datepicker.yearSuffix,
        timeText: lang[flags.pref.lang].general.datepicker.timeText,
        hourText: lang[flags.pref.lang].general.datepicker.hourText,
        minuteText: lang[flags.pref.lang].general.datepicker.minuteText,
        secondText: lang[flags.pref.lang].general.datepicker.secondText,
        showMonthAfterYear: flags.pref.lang != 'en' ? true : false,
    });

    const disableDeviceAndJobDropdowns = () => {
        const nodevlbl = lang[flags.pref.lang].general.nodevlbl;
        const nojoblbl = lang[flags.pref.lang].general.nojoblbl;
        var str = `<option value="0" disabled selected hidden class="no-dev-lbl">${nodevlbl}</option>`;
        $('#visualDevice').html(str);
        $('#visualDevice').prop('disabled', true);
        const noJobsOption = `<option value = "0" disabled selected hidden class="no-job-lbl">${nojoblbl}</option>`;
        $('#visualJobs').html(noJobsOption);
        $('#visualJobs').prop('disabled', true);

        $('#detail-detailDevice').html(str);
        $('#detail-detailDevice').prop('disabled', true);
        $('#detail-detailJobs').html(noJobsOption);
        $('#detail-detailJobs').prop('disabled', true);

        
        // $('#switch-detail-data-btn').prop('disabled', true);
        // $('#switch-productivity-data-btn').prop('disabled', true);
    };

    $('.dateFr').datepicker({
        controlType: 'select',
        dateFormat: 'yy-mm-dd',
        changeYear: true,
        yearRange: 'c-25:c+25',
        closeText: lang[flags.pref.lang].general.datepicker.done,
        currentText: lang[flags.pref.lang].general.datepicker.now,
        monthNames: lang[flags.pref.lang].general.datepicker.monthNames,
        monthNamesShort: lang[flags.pref.lang].general.datepicker.monthNamesShort,
        dayNames: lang[flags.pref.lang].general.datepicker.dayNames,
        dayNamesShort: lang[flags.pref.lang].general.datepicker.dayNamesShort,
        dayNamesMin: lang[flags.pref.lang].general.datepicker.dayNamesMin,
        weekHeader: lang[flags.pref.lang].general.datepicker.weekHeader,
        yearSuffix: lang[flags.pref.lang].general.datepicker.yearSuffix,
        showMonthAfterYear: flags.pref.lang != 'en' ? true : false,
        onClose: (dateText) => {
            if (previousFrDate !== dateText) {
                const viewBtn = $('.tab-pane.show .view-btn, .tab-pane.show .schedView, #productivity-view-btn, #summary-view-btn');
                viewBtn.removeClass('active');
                viewBtn.prop('disabled', false);
                const i = $('.tab-pane.show .view-btn i, #productivity-view-btn i, #summary-view-btn i');
                i.removeClass('text-success');
                previousFrDate = dateText;
                disableDeviceAndJobDropdowns();
            }
        }
    });

    $('#schedfr').datetimepicker({
        controlType: 'select',
        dateFormat: 'yy-mm-dd',
        timeFormat: 'HH:mm:ss',
        changeYear: true,
        yearRange: 'c-25:c+25',
        closeText: lang[flags.pref.lang].general.datepicker.done,
        currentText: lang[flags.pref.lang].general.datepicker.now,
        monthNames: lang[flags.pref.lang].general.datepicker.monthNames,
        monthNamesShort: lang[flags.pref.lang].general.datepicker.monthNamesShort,
        dayNames: lang[flags.pref.lang].general.datepicker.dayNames,
        dayNamesShort: lang[flags.pref.lang].general.datepicker.dayNamesShort,
        dayNamesMin: lang[flags.pref.lang].general.datepicker.dayNamesMin,
        weekHeader: lang[flags.pref.lang].general.datepicker.weekHeader,
        yearSuffix: lang[flags.pref.lang].general.datepicker.yearSuffix,
        timeText: lang[flags.pref.lang].general.datepicker.timeText,
        hourText: lang[flags.pref.lang].general.datepicker.hourText,
        minuteText: lang[flags.pref.lang].general.datepicker.minuteText,
        secondText: lang[flags.pref.lang].general.datepicker.secondText,
        showMonthAfterYear: flags.pref.lang != 'en' ? true : false,
        onClose: (dateText) => {
            if (previousFrDate !== dateText) {
                const viewBtn = $('.tab-pane.show .view-btn, .tab-pane.show .schedView');
                viewBtn.removeClass('active');
                const i = $('.tab-pane.show .view-btn i');
                i.removeClass('text-success');
                previousFrDate = dateText;
                disableDeviceAndJobDropdowns();
            }
        }
    });

    $('.dateTo').datepicker({
        controlType: 'select',
        dateFormat: 'yy-mm-dd',
        changeYear: true,
        yearRange: 'c-25:c+25',
        closeText: lang[flags.pref.lang].general.datepicker.done,
        currentText: lang[flags.pref.lang].general.datepicker.now,
        monthNames: lang[flags.pref.lang].general.datepicker.monthNames,
        monthNamesShort: lang[flags.pref.lang].general.datepicker.monthNamesShort,
        dayNames: lang[flags.pref.lang].general.datepicker.dayNames,
        dayNamesShort: lang[flags.pref.lang].general.datepicker.dayNamesShort,
        dayNamesMin: lang[flags.pref.lang].general.datepicker.dayNamesMin,
        weekHeader: lang[flags.pref.lang].general.datepicker.weekHeader,
        yearSuffix: lang[flags.pref.lang].general.datepicker.yearSuffix,
        showMonthAfterYear: flags.pref.lang != 'en' ? true : false,
        onClose: (dateText) => {
            if (previousToDate !== dateText) {
                const viewBtn = $('.tab-pane.show .view-btn, .tab-pane.show .schedView, #productivity-view-btn, #summary-view-btn');

                viewBtn.removeClass('active');
                viewBtn.prop('disabled', false);
                const i = $('.tab-pane.show .view-btn i, #productivity-view-btn i, #summary-view-btn i');
                i.removeClass('text-success');
                previousToDate = dateText;
                disableDeviceAndJobDropdowns();
            }
        }
    });

    $('#schedto').datetimepicker({
        controlType: 'select',
        dateFormat: 'yy-mm-dd',
        timeFormat: 'HH:mm:ss',
        changeYear: true,
        yearRange: 'c-25:c+25',
        hour: 23,
        minute: 59,
        second: 59,
        closeText: lang[flags.pref.lang].general.datepicker.done,
        currentText: lang[flags.pref.lang].general.datepicker.now,
        monthNames: lang[flags.pref.lang].general.datepicker.monthNames,
        monthNamesShort: lang[flags.pref.lang].general.datepicker.monthNamesShort,
        dayNames: lang[flags.pref.lang].general.datepicker.dayNames,
        dayNamesShort: lang[flags.pref.lang].general.datepicker.dayNamesShort,
        dayNamesMin: lang[flags.pref.lang].general.datepicker.dayNamesMin,
        weekHeader: lang[flags.pref.lang].general.datepicker.weekHeader,
        yearSuffix: lang[flags.pref.lang].general.datepicker.yearSuffix,
        timeText: lang[flags.pref.lang].general.datepicker.timeText,
        hourText: lang[flags.pref.lang].general.datepicker.hourText,
        minuteText: lang[flags.pref.lang].general.datepicker.minuteText,
        secondText: lang[flags.pref.lang].general.datepicker.secondText,
        showMonthAfterYear: flags.pref.lang != 'en' ? true : false,
        onClose: (dateText) => {
            if (previousToDate !== dateText) {
                const viewBtn = $('.tab-pane.show .view-btn, .tab-pane.show .schedView');
                viewBtn.removeClass('active');
                const i = $('.tab-pane.show .view-btn i');
                i.removeClass('text-success');
                previousToDate = dateText;
                disableDeviceAndJobDropdowns();
            }
        },
        showButtonPanel: true
    });

    $('#ui-datepicker-div').on('click', '#sched_end_clear', function () {
        $('#schedto').datepicker('setDate', null);
    });
    /***************************************************************************/
    /** Get values from the cache **/
    // cachedDate.others.fr =
    //     localStorage.getItem('currentFrom') == undefined
    //         ? ''
    //         : localStorage.getItem('currentFrom');
    // cachedDate.others.to =
    //     localStorage.getItem('currentTo') == undefined
    //         ? ''
    //         : localStorage.getItem('currentTo');
    // cachedDate.schedule.fr =
    //     localStorage.getItem('schedFrom') == undefined
    //         ? ''
    //         : localStorage.getItem('schedFrom');
    // cachedDate.schedule.to =
    //     localStorage.getItem('schedTo') == undefined
    //         ? ''
    //         : localStorage.getItem('schedTo');
    /** Check if the values are valid **/
    // $('.dateFr:not(.schedDate)').val(cachedDate.others.fr);
    // $('.dateTo:not(.schedDate)').val(cachedDate.others.to);
    // $('.dateFr.schedDate').val(cachedDate.schedule.fr);
    // $('.dateTo.schedDate').val(cachedDate.schedule.to);
}

const updateVersionElement = () => {
    $.getJSON('/assets/version/version.json', (data) => {
        $('#about-tab > h3').html(`Gemba Reporter ${data.versionString}`)
        // console.log('updateVersionElement()');
        // console.log(data);
    });
}

/**
 * Put all preferences setting to be save and apply here
 **/
function preferencesSetting() {
    updateVersionElement();
    // var chartAttrChanged = false;

    if ($('#themeSel').val() == 'light') {
        $('body').removeClass('dark-bg');
        if (
            !$.isEmptyObject(circleProgressBars.reject) &&
            !$.isEmptyObject(circleProgressBars.count)
        ) {
            circleProgressBars.reject.setBaseColor('rgba(0, 0, 0, 0.65)');
            circleProgressBars.count.setBaseColor('rgba(0, 0, 0, 0.65)');
            circleProgressBars.reject.setTextColor('#000000a6');
            circleProgressBars.count.setTextColor('#000000a6');
        }
        if (!$.isEmptyObject(timechart)) {
            timechart.set("theme", "light2", false);
            // chartAttrChanged = true;
        }
        var aboutElem = $('#about-tab');
        aboutElem.find('h6').css({ color: 'rgba(0,0,0,0.8)' });
        aboutElem.find('h3').css({ color: 'black' });
        aboutElem.find('span').css({ color: 'rgba(0,0,0,0.8)' });

        const pageSubheaderDiv = $('.page-subheader-tbl > div');
        pageSubheaderDiv.addClass('light');
        console.log(pageSubheaderDiv);

    } else {
        $('body').addClass('dark-bg');
        if (
            !$.isEmptyObject(circleProgressBars.reject) &&
            !$.isEmptyObject(circleProgressBars.count)
        ) {
            circleProgressBars.reject.setBaseColor('rgba(255,255,255,0.8)');
            circleProgressBars.count.setBaseColor('rgba(255,255,255,0.8)');
            circleProgressBars.reject.setTextColor('rgba(255, 255, 255, 0.95)');
            circleProgressBars.count.setTextColor('rgba(255, 255, 255, 0.95)');
        }
        if (!$.isEmptyObject(timechart)) {
            timechart.set("theme", "dark2", false);
            // chartAttrChanged = true;
        }
        var aboutElem = $('#about-tab');
        aboutElem.find('h6').css({ color: 'rgba(255,255,255,0.8)' });
        aboutElem.find('h3').css({ color: 'white' });
        aboutElem.find('span').css({ color: 'rgba(255,255,255,0.6)' });
        
        const pageSubheaderDiv = $('.page-subheader-tbl > div');
        pageSubheaderDiv.removeClass('light');
        console.log(pageSubheaderDiv);
    }

    if (parseInt($('#chartitem-btn').val()) != flags.pref.chartItems) {
        if (
            $('#chartitem-btn').val() == '' ||
            $('#chartitem-btn').val() === undefined
        ) {
            flags.pref.chartItems = 1;
        } else {
            flags.pref.chartItems = parseInt($('#chartitem-btn').val());
        }
        if (!$.isEmptyObject(timechart)) {
            timechart.attr({
                pageItems: flags.pref.chartItems,
            });
            // chartAttrChanged = true;
        }
    }

    flags.pref.theme = $('#themeSel').val();
    flags.pref.showHelp = $('#helper-btn').prop('checked');
    flags.pref.tableColWrap = $('#colWrap-btn').prop('checked');
    flags.pref.audioEnabled = $('#audio-btn').prop('checked');
    flags.pref.interval = parseInt($('#interval-btn').val());
    flags.pref.autoscroll = $('#autoscroll-btn').prop('checked');
    flags.pref.kioskMode = $('#kiosk-btn').prop('checked');
    flags.pref.lang = $('#langSel').val();

    /* Preference caching */
    localStorage.setItem('themeCached', flags.pref.theme);
    localStorage.setItem('kioskCached', flags.pref.kioskMode.toString());
    localStorage.setItem('helpCached', flags.pref.showHelp.toString());
    localStorage.setItem('scrollCached', flags.pref.autoscroll.toString());
    localStorage.setItem('wrapCached', flags.pref.tableColWrap.toString());
    localStorage.setItem('audioCached', flags.pref.audioEnabled.toString());
    localStorage.setItem('intervalCached', flags.pref.interval);
    localStorage.setItem('langCached', flags.pref.lang);
    localStorage.setItem('chartCached', flags.pref.chartItems);

    $('#donotshow').prop('checked', !flags.pref.showHelp);
    $('#donotshow-1').prop('checked', !flags.pref.showHelp);

    // if (
    //     flags.summary.isChartMode &&
    //     flags.currPage == 'summary-tab' &&
    //     chartAttrChanged
    // ) {
    //     // timechart.refresh();
    // }

    if (flags.detailedlog.isGraphMode && flags.currPage == 'detail-tab') {
        // handleDetailedLogUpdate()
        joTimeChart.loadOptions({ theme: `${flags.pref.theme}2` }, () => {
            if (!$.isEmptyObject(joTimeChart.timechartObjects.chart))
                joTimeChart.displayNoData();
        });
    }

    if (flags.pref.kioskMode) {
        /** Enlarge dashboard text properties **/
        $('#dashboard-container, #duration-container').addClass('kiosk');
    } else {
        $('#dashboard-container, #duration-container').removeClass('kiosk');
    }

    if (!flags.pref.audioEnabled) {
        $('#alarm').remove();
    } else {
        // try {
        //  $('#alarm')[0].play();
        // } catch(e) {
        //  console.log(e);
        // }
    }

    /** Translate pages **/
    
    translatePages();

    if (flags.pref.tableColWrap) {
        $('table.dataTable, table').removeClass('nowrap');
    } else {
        $('table.dataTable, table').addClass('nowrap');
    }

    switch (flags.currPage) {
        case 'dashboard-tab':
            clearDashboard();
            break;

        case 'duration-tab':
            clearDashboard();
            break;

        case 'overview-tab':
            // initOverview();
            break;

        case 'summary-tab':
            showTableLoading();
            if (
                flags.displayMode.others == 'view' ||
                $('#' + flags.currPage)
                    .find('.showJob-btn')
                    .hasClass('active')
            ) {
                summaryUpdate();
            }
            break;

        case 'reject-tab':
            showTableLoading();
            if (
                flags.displayMode.others == 'view' ||
                $('#' + flags.currPage)
                    .find('.showJob-btn')
                    .hasClass('active')
            ) {
                rejectUpdate();
            }
            break;

        case 'unproductive-tab':
            showTableLoading();
            if (
                flags.displayMode.others == 'view' ||
                $('#' + flags.currPage)
                    .find('.showJob-btn')
                    .hasClass('active')
            ) {
                // unproductiveUpdate();
            }
            break;

        case 'schedule-tab':
            showTableLoading();
            /** Au: Close side panel **/
            if($('#schedule-tab .tbl-container.schedTable').hasClass('sidepanel')) {
                $('#schedule-tab .tbl-container.schedTable').removeClass('sidepanel');
                $('#schedule-tab .sidepanel').css('z-index', -1);
            }
            if (flags.displayMode.schedule == 'view') {
                scheduleUpdate();
            }
            break;

        case 'visual-tab':
            initVisualization({ theme: `${flags.pref.theme}2` });
            initProductivityTable();
            rerenderProductivityTable();
            break;
        case 'detail-tab':
            initDowntimeTable();
            showTableLoading();
            unproductiveUpdateNew();
        default:
            break;
    }

    if (visualObjects.chart !== '') {
        changeVisualizationTheme({theme: `${flags.pref.theme}2`});
    }


    if ($('#fs-btn').prop('checked') && !flags.pref.isFullscreen) {
        $('#prefModal').one('hidden.bs.modal', function () {
            $('#prefModal').off();
            setTimeout(function () {
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen();
                }
                $('#' + flags.currPage).offsetHeight;
                flags.pref.isFullscreen = true;
                flags.camera.fullscreenPrevState = true;
            }, 100);
        });
    } else if (!$('#fs-btn').prop('checked') && flags.pref.isFullscreen) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        $('#' + flags.currPage).offsetHeight;
        flags.pref.isFullscreen = false;
        flags.camera.fullscreenPrevState = false;
    }
}

function showPrompt(text, category) {
    var icon, header;
    switch (category.toLowerCase()) {
        case 'success':
            icon = '<i class="fa fa-check-circle text-success"></i>&nbsp;';
            header =
                `<label>${lang[flags.pref.lang].general.successlbl}</label>`;
            break;
        case 'failed':
            icon = '<i class="fa fa-times-circle text-danger"></i>&nbsp;';
            header = `<label>${lang[flags.pref.lang].general.fail}</label>`;
            break;
        case 'error':
            icon = '<i class="fa fa-ban text-danger"></i>&nbsp;';
            header = `<label>${lang[flags.pref.lang].general.error}</label>`;
            break;
        case 'wait':
            icon = '<i class="fa fa-download text-success"></i>&nbsp;';
            header =
                `<label>${lang[flags.pref.lang].general.exportreclbl}</label>`;
            break;
        case 'info':
            icon = '<i class="fa fa-info-circle text-info"></i>&nbsp';
            header = `<label>${lang[flags.pref.lang].general.infolbl}</label>`;
            break;
        default:
            icon = '<i class="fa fa-question-circle text-secondary"></i>&nbsp;';
            header = '<label>Unknown Status</label>';
            break;
    }
    $('#promptModal .modal-title').html(icon + header);
    $('#promptModal .modal-body > h6').html(text);
    $('#promptModal').modal('show');
}

function showWarning(text, topic) {
    $('#warnYes').data('topic', topic);
    $('#warningModal .modal-body > h6').html(text);
    $('#warningModal').modal('show');
}

function showTableLoading() {
    /** Make the display load **/
    if (flags.ajaxRequestStatus !== null) {
        flags.ajaxRequestStatus.abort();
        flags.ajaxRequestStatus = null;
    }
    /** Prevent data change **/
    flags.queryPause = false;
    /** autoreadjustment of datatable **/
    flags.displayMode.initLoad = true;
    switch (flags.currPage) {
        case 'summary-tab':
            if (!$.isEmptyObject(flags.summary.table)) {
                flags.summary.table.clear().draw();
            }
            break;

        case 'reject-tab':
            if (!$.isEmptyObject(flags.reject.table)) {
                flags.reject.table.clear().draw();
            }
            break;

        case 'unproductive-tab':
            if (!$.isEmptyObject(flags.unproductive.table)) {
                flags.unproductive.table.clear().draw();
            }
            break;

        case 'schedule-tab':
            if (!$.isEmptyObject(flags.schedule.table)) {
                flags.schedule.table.clear().draw();
            }
            break;

        case 'date-tab':
            if (!$.isEmptyObject(flags.system.table)) {
                flags.system.table.clear().draw();
            }
            break;

        case 'detail-tab':
            // if (!$.isEmptyObject(flags.detailedlog.table)) {
            //  flags.detailedlog.table.clear().draw();
            // }
            if (!$.isEmptyObject(flags.downtime.table)) {
                flags.downtime.table.clear().draw();
            }
            break;

        default:
            break;
    }

    $('#' + flags.currPage + ' tbody tr td.dataTables_empty').html(
        '<span role="status" class="spinner-border spinner-border-sm text-primary"></span> <i>' +
            lang[flags.pref.lang].general.loading +
            '...</i>'
    );
}

function enableDisplayButton() {
    switch (flags.currPage) {
        case 'summary-tab':
            $('#summary-today-btn').attr('disabled', false);
            $('#summary-view-btn').attr('disabled', false);
            break;
        case 'reject-tab':
            $('#reject-today-btn').attr('disabled', false);
            $('#reject-view-btn').attr('disabled', false);
            break;
        case 'unproductive-tab':
        case 'detail-tab':
        case 'visual-tab':
            $('.today-btn:not(.schedToday)').attr('disabled', false);
            $('.view-btn:not(.schedView)').attr('disabled', false);
            break;

        case 'schedule-tab':
            $('.schedToday').attr('disabled', false);
            $('.schedView').attr('disabled', false);
            break;

        default:
            break;
    }

    if (flags.displayMode.initLoad) {
        forceResizeTable();
        flags.displayMode.initLoad = false;
    }
}

function datatableExtension(refreshTable) {
    var wd = $(window).width();
    if (wd <= 460) {
        $('.tbl-container table').addClass('dt-responsive nowrap');
        flags.tableResponsive = true;
        $.fn.DataTable.ext.pager.numbers_length = 5;
    } else {
        $('.tbl-container table').removeClass('dt-responsive');
        flags.tableResponsive = false;
        $.fn.DataTable.ext.pager.numbers_length = 7;
    }
}

function forceResizeTable() {
    if (flags.currPage === 'summary-tab' || flags.currPage === 'reject-tab' || flags.currPage === 'detail-tab' || flags.currPage === 'schedule-tab') return;
    var tableMainContainer = $('#' + flags.currPage + ' .tbl-container');
    var tableSubContainer = $(
        '#' + flags.currPage + ' .tbl-container .table-responsive'
    );
    var containerHt;

    tableMainContainer.css({ 'overflow-y': 'hidden' });
    containerHt = tableMainContainer.height() * 0.9;
    tableSubContainer.height(containerHt + 1);
    setTimeout(function () {
        tableSubContainer.height(containerHt);
        tableMainContainer.css({ 'overflow-y': 'auto' });
        /* Recalculate headers */
        switch (flags.currPage) {
            case 'summary-tab':
                initSummary();
                flags.summary.table.columns.adjust().draw();
                break;

            case 'reject-tab':
                initReject();
                flags.reject.table.columns.adjust().draw();
                break;

            case 'unproductive-tab':
                // initUnproductive();
                // flags.unproductive.table.columns.adjust().draw();
                break;

            case 'schedule-tab':
                //  console.log('redraw schedule!');
                initSchedule();
                flags.schedule.table.columns.adjust().draw();
                break;

            case 'detail-tab':
                // initDetail();
                // flags.detailedlog.table.columns.adjust().draw();
                //  when uncommented, the pagination does not work
                // initDowntimeTable();
                if (!$.isEmptyObject(flags.downtime.table)) {
                    flags.downtime.table.columns.adjust().draw();
                }
                break;
        }
    }, 50);
}

function defaultToDaily() {
    switch (flags.currPage) {
        case 'summary-tab':
        case 'reject-tab':
        case 'unproductive-tab':
            if (flags.displayMode.others == 'today') {
                $('#' + flags.currPage + ' .table-btn-addon').removeClass(
                    'supress'
                );
            } else {
                $('#' + flags.currPage + ' .table-btn-addon').addClass(
                    'supress'
                );
            }
            break;

        case 'schedule-tab':
            break;

        default:
            break;
    }
}

function setProgressBaseColor() {
    if (flags.pref.theme == 'light') {
        if (
            !$.isEmptyObject(circleProgressBars.reject) &&
            !$.isEmptyObject(circleProgressBars.count)
        ) {
            circleProgressBars.reject.setBaseColor('rgba(0, 0, 0, 0.65)');
            circleProgressBars.count.setBaseColor('rgba(0, 0, 0, 0.65)');
            circleProgressBars.reject.setTextColor('#000000a6');
            circleProgressBars.count.setTextColor('#000000a6');
        }
    } else {
        if (
            !$.isEmptyObject(circleProgressBars.reject) &&
            !$.isEmptyObject(circleProgressBars.count)
        ) {
            circleProgressBars.reject.setBaseColor('rgba(255,255,255,0.8)');
            circleProgressBars.count.setBaseColor('rgba(255,255,255,0.8)');
            circleProgressBars.reject.setTextColor('rgba(255, 255, 255, 0.95)');
            circleProgressBars.count.setTextColor('rgba(255, 255, 255, 0.95)');
        }
    }
}

function documentHandlers() {
    // Hanz: Bug #27 fix
    $('#schedule-content .tbl-container.schedTable').resize(schedule_resize_handler);

    /* Hanz: Code modification to make summary table behavior similar with
    schedule table (bug #27 fix) */
    $('#summary-content div.table-responsive').resize(summary_resize_handler);

    /* Hanz: Code modification to make reject table behavior similar with
    schedule table (bug #27 fix) */
    $('#reject-content div.table-responsive').resize(reject_resize_handler);

    /* Hanz: Fix for http-1201 bug #5 and #7*/
    $('#visual-table-container').resize(productivity_resize_handler);

    // Hanz: Bug #27 fix for JO timechart page
    $('#detail-tab #detail-table-content .tbl-container.unprodTable').resize(jotimechart_resize_handler);

    // Hanz: Bug #27 fix for User management table (http-1201 bug #26)
    $('#date-tab .config-content').resize(usermanagement_resize_handler);

    /* Resize handlers */
    window.addEventListener('resize', function () {
        $('.hasDatepicker').datepicker('hide');
        $('.hasDatepicker').trigger('blur');
        switch (flags.currPage) {
            case 'summary-tab':
                if (flags.summary.isChartMode) {
                    // getTimechartData();
                    getTimeChartDataNew();
                }
                break;

            case 'date-tab':
                checkIfMobileScreen();
                break;

            case 'detail-tab':
                // if (flags.detailedlog.isGraphMode) {
                //  getTimeGraphData(true);
                // }
                // if (!flags.detailedlog.isGraphMode) {
                //  initUnproductive();
                // }
                break;
            case 'schedule-tab':
                if (flags.schedule.isGraphMode) {
                    const chart = initScheduleChart($('#themeSel').val() + '2', flags.schedule.chartData[flags.schedule.chartCurrentPage]);
                    scheduleChartPageChecker();
                    flags.schedule.chartObject = chart;
                }
                break;
        }    
    });
    /** Orientation change handler **/
    window.addEventListener('orientationchange', function () {
        setTimeout(function () {
            forceResizeTable();
            datatableExtension();

            if (
                !$.isEmptyObject(timechart) &&
                flags.summary.isChartMode &&
                flags.currPage == 'summary-tab'
            ) {
                // getTimechartData();
                getTimeChartDataNew();
            }

            switch (flags.currPage) {
                case 'summary-tab':
                    if (flags.summary.isChartMode) {
                        getChartInstances(function () {
                            // getTimechartData();
                            getTimeChartDataNew();
                        });
                    } else {
                        initSummary();
                        showTableLoading();
                        resetTimer();
                        query_start();
                    }
                    break;

                case 'reject-tab':
                    initReject();
                    showTableLoading();
                    resetTimer();
                    query_start();
                    break;

                case 'unproductive-tab':
                    // initUnproductive();
                    // showTableLoading();
                    // resetTimer();
                    // query_start();
                    break;

                case 'schedule-tab':
                    initSchedule();
                    showTableLoading();
                    resetTimer();
                    if (flags.schedule.isGraphMode) {
                        const chart = initScheduleChart($('#themeSel').val() + '2', flags.schedule.chartData[flags.schedule.chartCurrentPage]);
                        scheduleChartPageChecker();
                        flags.schedule.chartObject = chart;
                    } else {
                        query_start();
                    }
                    break;

                case 'detail-tab':
                    if (flags.detailedlog.isGraphMode) {
                        $(
                            '#' + flags.currPage + ' .manualUpdate-footer'
                        ).show();
                        // getAvailableDevice();
                        resetTimer();
                        query_start();
                    } else {
                        // initUnproductive();
                        // showTableLoading();
                        // resetTimer();
                        // query_start();
                    }

                    break;
            }
        }, 500);
    });
    /** Auto close sidepanl when clicked outside **/
    $('#page-content, #headerShadow').on('click', function () {
        if ($('#sidebar').hasClass('active')) {
            $('#sidebar').removeClass('active').addClass('inactive');
            sidebarTimerStop();
        }
    });
    /** Log out **/
    $('#logout-btn').on('click', function () {
        if ($('#sidebar').hasClass('active')) {
            $('#sidebar').removeClass('active').addClass('inactive');
            sidebarTimerStop();
        }
        $('#logoutModal').modal('show');
    });
    /** Mobile datatable extra button **/
    $(document).on(
        'click.dtr',
        'string' === typeof e ? e : 'td, th',
        function (c) {
            if (!flags.tableResponsive && flags.currPage != 'date-tab') {
                return;
            }

            /** collapse button pressed **/
            if (flags.ajaxRequestStatus !== null) {
                flags.ajaxRequestStatus.abort();
                flags.ajaxRequestStatus = null;
            }

            setTimeout(function () {
                var elem;

                switch (flags.currPage) {
                    case 'summary-tab':
                    case 'reject-tab':
                    case 'unproductive-tab':
                    case 'schedule-tab':
                        elem = $(
                            '#' + flags.currPage + ' .tbl-container table tbody'
                        ).find('tr.child');
                        break;

                    case 'date-tab':
                        if (document.documentElement.clientWidth > 768) {
                            mobileTableChild('desktop');
                        } else {
                            mobileTableChild('mobile');
                        }
                        break;

                    default:
                        return;
                }

                if (elem !== undefined) {
                    if ($.isEmptyObject(elem[0])) {
                        query_start();
                    } else {
                        query_stop();
                    }
                }
            }, 100);
        }
    );

    $('input[type=text]:not(.ipInput),textarea').on('input', function () {
        /** allows alphanumeric, spaces, dash **/
        // var c = this.selectionStart, r = /[^a-z0-9\s\-]/gi, v = $(this).val();
        /** allows everything other than stated **/
        var c = this.selectionStart,
            r = /([!@#$%^&*+=`"':;<>?\\{}\[\]]+)/gm,
            v = $(this).val();
        if (r.test(v)) {
            $(this).val(v.replace(r, ''));
            c--;
        }
        this.setSelectionRange(c, c);
    });

    $('form').submit(function (e) {
        e.preventDefault();
    });

    $('#chartitem-btn').on('input', function () {
        if (parseInt($(this).val()) > 24) {
            $(this).val(24);
        } else if (parseInt($(this).val()) < 1) {
            $(this).val(1);
        }
    });

    $('.decimal1').on('keyup', function () {
        var val = $(this)
            .val()
            .replace(/(\d*\.?\d?).*/g, '$1');
        $(this).val(val);
    });

    $('.decimal0').on('keyup', function () {
        var val = $(this)
            .val()
            .replace(/(\d*).*/g, '$1');
        $(this).val(val);
    });

}

function preferenceHandlers() {
    $('#donotshow').on('change', function () {
        flags.pref.showHelp = !$(this).prop('checked');
    });
    $('#donotshow-1').on('change', function () {
        flags.pref.showHelp = !$(this).prop('checked');
    });
    $('#pref-btn').on('click', function () {
        if ($('#sidebar').hasClass('active')) {
            $('#sidebar').removeClass('active').addClass('inactive');
            sidebarTimerStop();
        }
        $('#themeSel').val(flags.pref.theme);
        $('#kiosk-btn').prop('checked', flags.pref.kioskMode);
        $('#helper-btn')
            .prop('checked', flags.pref.showHelp)
            .parent()
            .find('label')
            .html(flags.pref.showHelp ? 'ON' : 'OFF');
        $('#autoscroll-btn').prop('checked', flags.pref.autoscroll);
        $('#colWrap-btn').prop('checked', flags.pref.tableColWrap);
        $('#audio-btn')
            .prop('checked', flags.pref.audioEnabled)
            .parent()
            .find('label')
            .html(flags.pref.audioEnabled ? 'ON' : 'OFF');
        $('#fs-btn')
            .prop('checked', flags.pref.isFullscreen)
            .parent()
            .find('label')
            .html(flags.pref.isFullscreen ? 'ON' : 'OFF');
        $('#chartitem-btn').val(flags.pref.chartItems);
        $('#interval-btn').val(flags.pref.interval);
        $('#langSel').val(flags.pref.lang);
        $('#prefModal').modal('show');
    });
    $('#pref-save-btn').on('click', function () {
        preferencesSetting();
        $('#prefModal').modal('hide');
    });
    $('#helper-btn, #audio-btn, #autoscroll-btn, #colWrap-btn, #fs-btn').on(
        'change',
        function () {
            $(this)
                .parent()
                .find('label')
                .html($(this).prop('checked') ? 'ON' : 'OFF');
        }
    );
    $('#kiosk-btn').on('change', function (e) {
        e.preventDefault();
        if ($(this).prop('checked')) {
            lgDisplayModePrompt('show');
        } else {
            $('#kiosk-btn')
                .prop('checked', false)
                .parent()
                .find('label')
                .html('OFF');
        }
    });
    $('#lgDispModal .yeslbl').on('click', function () {
        lgDisplayModePrompt('hide');
        $('#kiosk-btn').prop('checked', true).parent().find('label').html('ON');
    });
    $('#lgDispModal .nolbl').on('click', function () {
        lgDisplayModePrompt('hide');
        $('#kiosk-btn')
            .prop('checked', false)
            .parent()
            .find('label')
            .html('OFF');
    });
}

const hasSelectedFilters = ({filterArray}) => {
    let noSelectedFilters = false;
    for(let i = 0; i < filterArray.length; i++) {
        if (filterArray[i].length !== 0) {
            noSelectedFilters = true;
            break;
        }
    }
    return noSelectedFilters;
};

/** Clear filters **/
const clearFilters = () => {
    var elem = $('#apply-filter-btn');
    if ($(elem).find('input').attr('checked')) {
        $(elem).click();
    }

    switch (flags.currPage) {
        case 'summary-tab':
            flags.summary.selectedFilter = [];
            break;

        case 'reject-tab':
            flags.reject.selectedFilter = [];
            break;

        case 'unproductive-tab':
            flags.unproductive.selectedFilter = [];
            break;

        case 'schedule-tab':
            flags.schedule.selectedFilter = [];
            break;

        default:
            break;
    }

    $('#filterModal .modal-body .itemSel > .value').html(0);
};

function tableFilterHandlers() {
    let t =
        '<input type="checkbox"><div class="slider round"><span class="on">ON</span><span class="off">OFF</span></div>';
    $('#apply-filter-btn').html(t);

    $('.selectpicker').selectpicker({});
    $('.selectpicker').on('change', function () {
        getSelectedItems(this);
        flags.selectedFilterChanged = true;
    });


    $('#clear-filter-btn').on('click', clearFilters);

    /** Apply filters **/
    $('#apply-filter-btn').on('click', function () {
        var filterState;
        if ($(this).find('input').attr('checked')) {
            $(this).find('input').removeClass('active');
            $(this).find('input').attr('checked', false);
            $('#' + flags.currPage + ' .filter-btn, #' + flags.currPage + ' #schedule-filter').removeClass('icon-active');
            /** disable filter here **/
            filterState = false;
            clearFilters();
        } else {
            $(this).find('input').addClass('active');
            $(this).find('input').attr('checked', true);
            $('#' + flags.currPage + ' .filter-btn, #' + flags.currPage + ' #schedule-filter').addClass('icon-active');
            /** enable filter here **/
            filterState = true;
        }

        if (flags.ajaxRequestStatus !== null) {
            flags.ajaxRequestStatus.abort();
            flags.ajaxRequestStatus = null;
        }

        showTableLoading();
        switch (flags.currPage) {
            case 'summary-tab':
                flags.summary.isFiltered = filterState;
                summaryUpdate();
                break;

            case 'reject-tab':
                flags.reject.isFiltered = filterState;
                rejectUpdate();
                break;

            case 'unproductive-tab':
                flags.unproductive.isFiltered = filterState;
                // unproductiveUpdate();
                break;

            case 'schedule-tab':
                flags.schedule.isFiltered = filterState;
                /** Au: Close side panel **/
                // if($('#schedule-tab .tbl-container.schedTable').hasClass('sidepanel')) {
                //     $('#schedule-tab .tbl-container.schedTable').removeClass('sidepanel');
                //     $('#schedule-tab .sidepanel').css('z-index', -1);
                // }
                scheduleUpdate();
                break;

            default:
                break;
        }
    });
    /** Filter modal show handler **/
    $('.filter-btn, #schedule-filter, #summary-filter-btn, #reject-filter-btn').on('click', function () {
        //  if current page has filter on, dont trigger apply filter
        const applyBtn = $('#apply-filter-btn');
        const btnState = applyBtn.find('input').attr('checked');
        if (btnState === undefined || btnState === false) {
            $('#apply-filter-btn').click();
        }
        // $('#apply-filter-btn').find('input').attr('checked', true);
        var elem = $('#filterModal .modal-body').find('label');
        var selElem = $('#filterModal .modal-body').find('.row');
        $(selElem[4]).show();
        $(selElem[5]).show();
        $('.summary-checkbox').hide();
        switch (this.id) {
            case 'schedule-filter':
                elem.each(function (index) {
                    // $(this).html(filters.schedule[index]);
                    $(this).html(lang[flags.pref.lang].schedule.filters[index]);
                });
                break;

            case 'unproductive-filter':
                elem.each(function (index) {
                    // $(this).html(filters.unproductive[index]);
                    $(this).html(
                        lang[flags.pref.lang].unproductive.filters[index]
                    );
                });
                break;

            case 'reject-filter-btn':
                elem.each(function (index) {
                    // $(this).html(filters.reject[index]);
                    $(this).html(lang[flags.pref.lang].reject.filters[index]);
                    if (index >= 4) {
                        $(selElem[index]).hide();
                    }
                });
                break;

            case 'summary-filter-btn':
                elem.each(function (index) {
                    // $(this).html(filters.summary[index]);
                    $(this).html(lang[flags.pref.lang].summary.filters[index]);
                });
                $('.summary-checkbox').show();
                $('.summary-checkbox .row').show();
                $('#consolidate-btn').prop(
                    'checked',
                    flags.summary.consolidated
                );
                $('#show-schedend').prop('checked', flags.summary.showSchedEnd);
                $('#show-prodend').prop('checked', flags.summary.showProdEnd);
                $('#show-prodend')
                .parent()
                .find('label')
                .html(flags.summary.showProdEnd ? 'ON' : 'OFF');
                break;

            default:
                break;
        }
        $('#filterModal').modal('show');
    });
    $('#filterModal .selectpicker')
        .on('shown.bs.select', function () {
            flags.queryPause = true;
        })
        .on('hide.bs.select', function () {
            flags.queryPause = false;
            if (!flags.selectedFilterChanged) {
                return;
            }
            flags.selectedFilterChanged = false;

            switch (flags.currPage) {
                case 'summary-tab':
                    if (flags.summary.isFiltered) {
                        showTableLoading();
                        summaryUpdate();
                    }
                    break;

                case 'reject-tab':
                    if (flags.reject.isFiltered) {
                        showTableLoading();
                        rejectUpdate();
                    }
                    break;

                case 'unproductive-tab':
                    if (flags.unproductive.isFiltered) {
                        // showTableLoading();
                        // unproductiveUpdate();
                    }
                    break;

                case 'schedule-tab':
                    if (flags.schedule.isFiltered) {
                        showTableLoading();
                        scheduleUpdate();
                    }
                    break;

                default:
                    break;
            }
        });
    $('#consolidate-btn').on('click', function () {
        flags.summary.consolidated = $(this).prop('checked');
        $(this)
            .parent()
            .find('label')
            .html(flags.summary.consolidated ? 'ON' : 'OFF');

        showTableLoading();
        summaryUpdate();
    });
    $('#show-schedend').on('click', function () {
        flags.summary.showSchedEnd = $(this).prop('checked');
        $(this)
            .parent()
            .find('label')
            .html(flags.summary.showSchedEnd ? 'ON' : 'OFF');

        var col = flags.summary.table.column(5);
        col.visible(!col.visible());
    });
    $('#show-prodend').on('click', function () {
        flags.summary.showProdEnd = $(this).prop('checked');
        $(this)
            .parent()
            .find('label')
            .html(flags.summary.showProdEnd ? 'ON' : 'OFF');

        var col = flags.summary.table.column(2);
        col.visible(!col.visible());
    });
}

function tablePageHandlers() {
    // var actinfocontent = '<p>' + text_compilation['acttitle'] + '.<br><br>';
    // actinfocontent += '<i class="fas fa-layer-group text-warning"></i>&nbsp;' + text_compilation['actinfo1'] + '<br>';
    // actinfocontent += '<i class="fas fa-check-circle text-primary"></i>&nbsp;' + text_compilation['actinfo2'] + '<br>';
    // actinfocontent += '<i class="fas fa-play-circle text-success"></i>&nbsp;' + text_compilation['actinfo3'] + '<br>';
    // actinfocontent += '<i class="fas fa-lock text-secondary"></i>&nbsp;' + text_compilation['actinfo4'] + '</p>';
    // $("#action-info").popover({
    //        html: true,
    //        trigger: 'click hover focus',
    //        content: actinfocontent
    //    });
    /** New schedule **/
    $('#add-sched-btn').on('click', function () {
        clearScheduleInfo();
        if (
            !$('#schedule-tab .tbl-container.schedTable').hasClass('sidepanel')
        ) {
            $('#schedule-tab .tbl-container.schedTable').addClass('sidepanel');
        }
        // $(this).attr('disabled', true);
        
        setTimeout(() => {
            if (
                $('#schedule-tab .tbl-container.schedTable').hasClass('sidepanel')
            ) {
                $('#schedule-tab .sidepanel').css('z-index', 0);
            }
        }, 1000);
        updateMachineOptions();
    });
    /** Open inner sidepanel **/
    $('.tbl-container').on('click', '.edit-btn', function () {
        console.log('edit button clicked!');
        console.log(`current page: ${flags.currPage}`);

        if (flags.currPage === 'schedule-tab') {
            if (
                !$('#schedule-tab .tbl-container.schedTable').hasClass('sidepanel')
            ) {
                $('#schedule-tab .tbl-container.schedTable').addClass('sidepanel');
            }
            setTimeout(() => {
                if (
                    $('#schedule-tab .tbl-container.schedTable').hasClass('sidepanel')
                ) {
                    $('#schedule-tab .sidepanel').css('z-index', 0);
                }
            }, 1000);
            // $('#add-sched-btn').attr('disabled', true);
        } else if (flags.currPage === 'unproductive-tab') {
            if (
                !$('#unproductive-tab .tbl-container.unprodTable').hasClass('sidepanel')
            ) {
                $('#unproductive-tab .tbl-container.unprodTable').addClass('sidepanel');
            }
        } else if (flags.currPage === 'detail-tab') {
            //  added this else if block to make edit button in downtime table on JO Time Chart display the sidepanel
            if ($('#detail-subheader').hasClass('active')) {
                $('#toggle-detail').trigger('click');
            }
            if (
                !$('#detail-tab .tbl-container.unprodTable').hasClass('sidepanel')
            ) {
                $('#detail-tab .tbl-container.unprodTable').addClass('sidepanel');
            }
            //  adjust the headers so they fit with the new width
            setTimeout(() => {
                if (
                    $('#detail-tab .tbl-container.unprodTable').hasClass('sidepanel')
                ) {
                    flags.downtime.table.columns.adjust().draw(false);
                    $('#detail-table-content .sidepanel').css('z-index', 0);
                }
            }, 500);
        }
    });

    /** Close inner sidepanel **/
    $('#unproductive-tab .sidepanel-close').on('click', function () {
        $('#' + flags.currPage + ' .tbl-container').removeClass('sidepanel');
        $('#' + flags.currPage + ' .tbl-container').one(
            'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
            function () {
                flags.unproductive.table.columns.adjust().draw(false);
            }
        );
    });
    //  04/15/2021 added this function to make the side panel close on the downtime table in JO Time Chart Tab
    $('#detail-tab .sidepanel-close').on('click', () => {
        closeDowntimeSidePanel();
        $('#detail-table-content .sidepanel').css('z-index', -1);
    });
    /** Close inner sidepanel with unlock schedule **/
    $('#schedule-tab .sidepanel-close').on('click', function () {
        $('#' + flags.currPage + ' .tbl-container').removeClass('sidepanel');
        $('#' + flags.currPage + ' .tbl-container').one(
            'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
            function () {
                flags.schedule.table.columns.adjust().draw(false);
            }
        );
        $('#schedule-tab .sidepanel').css('z-index', -1);
        $('#add-sched-btn').attr('disabled', false);
        console.log('close inner sidepanel action');
        setScheduleLockState(
            null,
            null,
            localStorage.getItem('schedlockedId'),
            0,
            function () {
                if (flags.displayMode.schedule == 'view') {
                    scheduleUpdate();
                }
            }
        );
    });

    $('#toggle-summary').on('click', () => {
        const toggleGroupButton = $('#toggle-summary span');
        const toggleGroupIcon = $('#toggle-summary i');
        const toggleView = $('#summary-subheader');
        if (toggleView.hasClass('active')) {
            toggleGroupButton.html(lang[flags.pref.lang].general.option);
            toggleGroupIcon.removeClass('fa-caret-up').addClass('fa-caret-down');
            
        } else {
            toggleGroupButton.html(lang[flags.pref.lang].general.hideoption);
            toggleGroupIcon.removeClass('fa-caret-down').addClass('fa-caret-up');
        }

        toggleView.toggleClass('active');
        setTimeout(() => {
            if (!$.isEmptyObject(flags.summary.chart)) {
                flags.summary.chart.render();
            }    
        }, 250);

    });

    $('#summary-content, #reject-content, #visual-page, #schedule-content, #schedchart-container, #detail-table-content, #timegraph-page, #page-header').on('click', (e) => {
        console.log(flags.currPage);
        switch (flags.currPage) {
            case 'schedule-tab':
                if ($('#schedule-grp').hasClass('active')) {
                    $('#toggle-sched').trigger('click');
                }
                break;
            case 'summary-tab':        
                if ($('#summary-subheader').hasClass('active')) {
                    $('#toggle-summary').trigger('click');
                }
                break;
            case 'reject-tab':
                if ($('#reject-subheader').hasClass('active')) {
                    $('#toggle-reject').trigger('click');
                }
                break;
            case 'visual-tab':
                if ($('#productivity-subheader').hasClass('active')) {
                    $('#toggle-productivity').trigger('click');
                }
                break;
            case 'detail-tab':
                const element = $(e.target);
                if (element.attr('title') === 'Reset') {
                    return;
                }
                if ($('#detail-subheader').hasClass('active')) {
                    $('#toggle-detail').trigger('click');
                } 
                break;    
        }
    });

    $('#toggle-reject').on('click', () => {
        const toggleGroupButton = $('#toggle-reject span');
        const toggleGroupIcon = $('#toggle-reject i');
        const toggleView = $('#reject-subheader');
        if (toggleView.hasClass('active')) {
            toggleGroupButton.html(lang[flags.pref.lang].general.option);
            toggleGroupIcon.removeClass('fa-caret-up').addClass('fa-caret-down');
        } else {
            toggleGroupButton.html(lang[flags.pref.lang].general.hideoption);
            toggleGroupIcon.removeClass('fa-caret-down').addClass('fa-caret-up');
        }

        toggleView.toggleClass('active');
    });

    $('#toggle-productivity').on('click', () => {
        const toggleGroupButton = $('#toggle-productivity span');
        const toggleGroupIcon = $('#toggle-productivity i');
        const toggleView = $('#productivity-subheader');
        /*************Hanz: Part of fix for http-1201 bug #8******************/
        const parent = $('#productivity-subheader-parent');
        /*********************************************************************/
        if (toggleView.hasClass('active')) {
            toggleGroupButton.html(lang[flags.pref.lang].general.option);
            toggleGroupIcon.removeClass('fa-caret-up').addClass('fa-caret-down');
            
            $('#productivity-chart-btn-group').toggleClass('active');
            $('#productivity-interval-btn-group').toggleClass('active');
            $('#productivity-interval').toggleClass('active');
        } else {
            toggleGroupButton.html(lang[flags.pref.lang].general.hideoption);
            toggleGroupIcon.removeClass('fa-caret-down').addClass('fa-caret-up');
            setTimeout(() => {
                $('#productivity-chart-btn-group').toggleClass('active');
                $('#productivity-interval-btn-group').toggleClass('active');
                $('#productivity-interval').toggleClass('active');
            }, 250)
        }

        parent.toggleClass('active');
        toggleView.toggleClass('active');
        setTimeout(() => {
            visualObjects.chart.render();
        }, 250);

    });

    $('#toggle-sched').on('click', () => {
        console.log('sched tab clicked!');
        const toggleGroupBtn = $('#toggle-sched');
        const toggleGroupButton = $('#toggle-sched span');
        const toggleGroupIcon = $('#toggle-sched i');
        const scheduleGroup = $('#schedule-grp');
        const schedChart = $('#schedchart');
        const schedFooter = $('#schedchart-footer');
        const schedTable = $('.tbl-container.schedTable');
        if (scheduleGroup.hasClass('active')) {
            toggleGroupButton.html(lang[flags.pref.lang].general.option);
            toggleGroupIcon.removeClass('fa-caret-up').addClass('fa-caret-down');
        } else {
            toggleGroupBtn.css('visibility', 'hidden');
            schedFooter.css('visibility', 'hidden');
            setTimeout(() => {
                toggleGroupBtn.css('visibility', 'visible');
                schedFooter.css('visibility', 'visible');
            }, 250)
            toggleGroupButton.html(lang[flags.pref.lang].general.hideoption);
            toggleGroupIcon.removeClass('fa-caret-down').addClass('fa-caret-up');
        }
        scheduleGroup.toggleClass('active');

        $('#schedule-subheader-table').toggleClass('active');

        schedChart.toggleClass('active');
        schedTable.toggleClass('active');
        setTimeout(() => {
            let currentChartPage;
            //  check if the view on display is the graph
            if (flags.schedule.isGraphMode) {
                //  save current pagination
                currentChartPage = flags.schedule.chartCurrentPage;
                flags.schedule.chartObject.render();
                overlayLabels(flags.schedule.chartObject, flags.schedule.chartData[flags.schedule.chartCurrentPage]);
            }
            // scheduleUpdate();
            // if (flags.schedule.isGraphMode) {
            //     flags.schedule.chartPagination.navigateToPage(currentChartPage);
            //     flags.schedule.chartCurrentPage = currentChartPage;
            // }

            // flags.schedule.table.columns.adjust().draw(false);
            // toggleGroupButton.css('visibility', 'visible');
        }, 250)
    });

    $('#toggle-detail').on('click', () => {
        const toggleGroupButton = $('#toggle-detail span');
        const toggleGroupIcon = $('#toggle-detail i');
        const toggleView = $('#detail-subheader');
        if (toggleView.hasClass('active')) {
            toggleGroupButton.html(lang[flags.pref.lang].general.option);
            toggleGroupIcon.removeClass('fa-caret-up').addClass('fa-caret-down');
        } else {
            toggleGroupButton.html(lang[flags.pref.lang].general.hideoption);
            toggleGroupIcon.removeClass('fa-caret-down').addClass('fa-caret-up');
            // setTimeout(() => {
            //     $('#productivity-chart-btn-group').toggleClass('active');
            //     $('#productivity-interval-btn-group').toggleClass('active');
            //     $('#productivity-interval').toggleClass('active');
            // }, 250)
        }

        toggleView.toggleClass('active');
        setTimeout(() => {
            console.log(joTimeChart.timechartObjects.chart);
            if (!$.isEmptyObject(joTimeChart.timechartObjects.chart)) {
                joTimeChart.timechartObjects.chart.render();
                joTimeChart.renderTimechart(null, null, true);
            }    
        }, 250);

    });

    /** Today button handler **/

    $('.today-btn, .schedToday, #summary-today-btn, #reject-today-btn').on('click', function () {
        var viewBtn, todayBtn;
        const elementId = $(this).attr('id');

        if ($(this).hasClass('schedToday')) {
            todayBtn = $('.schedToday');
            viewBtn = $('.schedView');
            flags.displayMode.schedule = 'today';
        } else if (elementId === 'summary-today-btn') {
            todayBtn = $('#summary-today-btn');
            viewBtn = $('#summary-view-btn');
            flags.displayMode.others = 'today';  
        } else if (elementId === 'reject-today-btn') {
            todayBtn = $('#reject-today-btn');
            viewBtn = $('#reject-view-btn');
            flags.displayMode.others = 'today';
        } else {
            todayBtn = $('.today-btn:not(.schedToday)');
            viewBtn = $('.view-btn:not(.schedView)');
            flags.displayMode.others = 'today';
        }
        viewBtn.removeClass('active');
        viewBtn.find('i').removeClass('text-success');
        todayBtn.addClass('active');
        todayBtn.find('i').addClass('kulayng-araw');
        /** button debounce **/
        todayBtn.attr('disabled', true);
        viewBtn.attr('disabled', true);

        $('#' + flags.currPage + ' .table-btn-addon').removeClass('supress');

        if (flags.summary.isChartMode && flags.currPage == 'summary-tab') {
            $('#graphModal .snsPrompt').html(
                lang[flags.pref.lang].general.loading
            );
            $('#graphModal').modal('show');
            $('#cancelLoading').prop('disabled', true);

            setTimeout(function () {
                // getTimechartData();
                getTimeChartDataNew();
            }, 500);
            return;
        }

        // if (!flags.detailedlog.isGraphMode && flags.currPage === 'detail-tab') {
        //  initUnproductive();
        // }

        /** data call here **/
        showTableLoading();
        switch (flags.currPage) {
            case 'summary-tab':
                summaryUpdate();
                break;

            case 'reject-tab':
                rejectUpdate();
                break;

            case 'unproductive-tab':
                // unproductiveUpdate();
                break;

            case 'schedule-tab':
                scheduleUpdate();
                break;

            case 'detail-tab':
                // handleDetailedLogUpdate();
                joTimeChart
                    .getDevices()
                    .then((data) => {
                        enableDisplayButton();
                    })
                    .catch((err) => {
                        enableDisplayButton();
                        showPrompt(err.msg, err.type);
                    });
                break;

            case 'visual-tab':
                handleVisualDate();
                break;

            default:
                break;
        }
    });

    /** View button handler **/
    $('.view-btn, .schedView, #productivity-view-btn, #summary-view-btn, #reject-view-btn, #detail-view-btn').on('click', function () {
        console.log('view button pressed!');
        console.log(flags.currPage);
        var todayBtn, viewBtn;

        //  reset options
        if (this.getAttribute('id') == 'detail-view-btn')
        {
            joTimeChart.timechartObjects.selectedDevice = null;
            joTimeChart.timechartObjects.selectedJob = null;
        }
        else if (this.getAttribute('id') == 'productivity-view-btn')
        {
            visualObjects.selectedDevice = null;
            visualObjects.selectedJob = null;
        }

        // if(flags.pref.showHelp && !flags.summary.isChartMode) {
        //  $('#helpModal').modal('show');
        // }


        let frVal;
        let toVal;

        if ($(this).hasClass('schedView')) {
            frVal = $('.dateFr.schedDate').eq(0).val();
            toVal = $('.dateTo.schedDate').eq(0).val();
            if (
                frVal === '' ||
                toVal === '' ||
                Date.parse(frVal) >
                Date.parse(toVal)
            ) {
                showPrompt(lang[flags.pref.lang].general.datepicker.invalid, 'error');
                return;
            }
            viewBtn = $('.schedView');
            todayBtn = $('.schedToday');
            flags.displayMode.schedule = 'view';
        } else {
            const elementId = $(this).attr('id');
            if (elementId === 'productivity-view-btn') {
                frVal = $('#productivity-fr input').eq(0).val();
                toVal = $('#productivity-to input').eq(0).val();
                viewBtn = $('#productivity-view-btn');
                flags.displayMode.page = 'productivity';
            } else if (elementId === 'summary-view-btn') {
                frVal = $('#summary-fr input').eq(0).val();
                toVal = $('#summary-to input').eq(0).val();
                viewBtn = $('#summary-view-btn');
                // todayBtn = $('#summary-today-btn');
                flags.displayMode.page = 'summary';
            } else if (elementId === 'reject-view-btn') {
                frVal = $('#reject-fr input').eq(0).val();
                toVal = $('#reject-to input').eq(0).val();
                viewBtn = $('#reject-view-btn');
                // todayBtn = $('#reject-today-btn');
                flags.displayMode.page = 'reject';
            } else if (elementId === 'detail-view-btn') {
                frVal = $('#detail-fr input').eq(0).val();
                toVal = $('#detail-to input').eq(0).val();
                viewBtn = $('#detail-view-btn');
                flags.displayMode.page = 'jotimechart';
            } else {
                //  everything else
                frVal = $('.dateFr:not(.schedDate .dbmDate)').eq(0).val();
                toVal = $('.dateTo:not(.schedDate .dbmDate)').eq(0).val();
                viewBtn = $('.view-btn:not(.schedView)');
            }
            if (
                frVal === '' ||
                toVal === '' ||
                Date.parse(frVal) >
                Date.parse(toVal)
            ) {
                showPrompt(lang[flags.pref.lang].general.datepicker.invalid, 'error');
                return;
            }
            todayBtn = $('.today-btn:not(.schedToday)');
            flags.displayMode.others = 'view';
        }

        // if (
        //     frVal === '' ||
        //     toVal === '' ||
        //     Date.parse(frVal) >
        //     Date.parse(toVal)
        // ) {
        //     showPrompt(lang[flags.pref.lang].general.datepicker.invalid, 'error');
        //     return;
        // }

        todayBtn.removeClass('active');
        todayBtn.find('i').removeClass('kulayng-araw');
        viewBtn.addClass('active');
        viewBtn.find('i').addClass('text-success');
        /** button debounce **/
        todayBtn.attr('disabled', true);
        // viewBtn.attr('disabled', true);

        $('#' + flags.currPage + ' .table-btn-addon').addClass('supress');

        // if(flags.summary.isChartMode && flags.currPage == 'summary-tab') {
        //  getTimechartData();
        //  return;
        // }

        /** data call here **/
        showTableLoading();
        switch (flags.currPage) {
            case 'summary-tab':
                if (flags.summary.isChartMode) {
                    $('#graphModal .snsPrompt').html(
                        lang[flags.pref.lang].general.loading
                    );
                    $('#graphModal').modal('show');
                    $('#cancelLoading').prop('disabled', true);

                    setTimeout(function () {
                        // getTimechartData();
                        getTimeChartDataNew();
                    }, 500);
                } else {
                    if (flags.pref.showHelp) {
                        $('#helpModal').modal('show');
                    }
                    summaryUpdate();
                }
                break;

            case 'reject-tab':
                if (flags.pref.showHelp) {
                    $('#helpModal').modal('show');
                }
                rejectUpdate();
                break;

            case 'unproductive-tab':
                if (flags.pref.showHelp) {
                    $('#helpModal').modal('show');
                }
                // unproductiveUpdate();
                break;

            case 'schedule-tab':
                scheduleUpdate();
                break;

            case 'detail-tab':
                if (flags.pref.showHelp && !flags.detailedlog.isGraphMode) {
                    $('#helpModal').modal('show');
                }
                // handleDetailedLogUpdate();
                joTimeChart
                    .getDevices()
                    .then((data) => {
                        enableDisplayButton();
                        //  hide the loading indicator in table
                        Object.keys(flags.downtime.table).length > 0 ? flags.downtime.table.clear().draw() : null;
                    })
                    .catch((err) => {
                        enableDisplayButton();
                        showPrompt(err.msg, err.type);
                    });
                break;

            case 'visual-tab':
                handleVisualDate();
                break;

            default:
                break;
        }
    });

    /** date change handler **/
    $('.dateFr').on('change', function () {
        var id = $('#page-content > .tab-pane.active.show')[0].id;

        if ($(this).val() == '') {
            return;
        }

        const dateVal = $(this).val();

        switch (id) {
            case 'schedule-tab':
                localStorage.setItem('schedFrom', dateVal);
                break;

            case 'summary-tab':
            case 'reject-tab':
                localStorage.setItem('summaryRejectFrom', dateVal);
                break;

            case 'detail-tab': // JO TIME CHART
            case 'visual-tab': // PRODUCTIVITY
                localStorage.setItem('visual-detailTabFrom', dateVal);
                break;
            case 'date-tab': //CONFIG->SYSTEM
                localStorage.setItem('dbmFrom', dateVal);
                break;
            default:
                localStorage.setItem('currentFrom', dateVal);
                $('.dateFr:not(.schedDate .dbmDate)').val($(this).val());
                break;
        }

        $('.dateFr').eq(0).val($(this).val());
    });
    $('.dateTo').on('change', function () {
        var id = $('#page-content > .tab-pane.active.show')[0].id;
        if ($(this).val() == '') {
            return;
        }

        const dateVal = $(this).val();

        switch (id) {
            case 'schedule-tab':
                localStorage.setItem('schedTo', dateVal);
                break;

            case 'summary-tab':
            case 'reject-tab':
                localStorage.setItem('summaryRejectTo', dateVal);
                break;

            case 'detail-tab':
            case 'visual-tab':
                localStorage.setItem('visual-detailTabTo', dateVal);
                break;
            case 'date-tab': //CONFIG->SYSTEM
                localStorage.setItem('dbmTo', dateVal);
                break;
            default:
                localStorage.setItem('currentTo', dateVal);
                $('.dateTo:not(.schedDate .dbmDate)').val($(this).val());
                break;
        }

        $('.dateTo').eq(0).val($(this).val());
    });
    /** Buttons inside the table **/
    $('.tbl-container')
        .on('focusin', '.oprInputElem', function () {
            if (flags.ajaxRequestStatus !== null) {
                flags.ajaxRequestStatus.abort();
                flags.ajaxRequestStatus = null;
            }

            switch (flags.currPage) {
                case 'summary-tab':
                case 'reject-tab':
                case 'unproductive-tab':
                    if (flags.displayMode.others == 'today') {
                        query_stop();
                    }
                    break;

                case 'schedule-tab':
                    if (flags.displayMode.schedule == 'today') {
                        query_stop();
                    }
                    break;
            }

            flags.queryPause = true;
        })
        .on('focusout', '.oprInputElem', function () {
            if (flags.ajaxRequestStatus !== null) {
                flags.ajaxRequestStatus.abort();
                flags.ajaxRequestStatus = null;
            }

            switch (flags.currPage) {
                case 'summary-tab':
                case 'reject-tab':
                case 'unproductive-tab':
                    if (flags.displayMode.others == 'today') {
                        query_start();
                    }
                    break;

                case 'schedule-tab':
                    if (flags.displayMode.schedule == 'today') {
                        query_start();
                    }
                    break;
            }
            flags.queryPause = false;
        })
        .on('mouseenter touchstart', 'button.edit-btn', function () {
            if (flags.ajaxRequestStatus !== null) {
                flags.ajaxRequestStatus.abort();
                flags.ajaxRequestStatus = null;
            }
            flags.queryPause = true;
        })
        .on('mouseleave touchmove', 'button.edit-btn', function () {
            flags.queryPause = false;
        });
    $('#unprodRem').on('input', function () {
        $('#unprodChr').html(
            lang[flags.pref.lang].unproductive.chars +
                ': ' +
                $(this).val().length +
                '/200'
        );
    });
    $('#unprodClr').on('click', function () {
        clearRemarks();
    });
    $('#unprodSave').on('click', function () {
        updateRemarks();
    });
    $(
        '#unprod-export-btn, #export-btn, #detail-export-btn, #productivity-export-btn, #summary-export-btn'
    ).on('click', function () {
        handleDownload();
    });
    $('#del-sidepanel-btn').on('click', function () {
        showWarning(
            lang[flags.pref.lang].schedule.prompts.schedDelWarn,
            'deleteSchedule'
        );
    });
    $('#add-sidepanel-btn').on('click', function () {
        addNewSchedule();
    });
    $('#upd-sidepanel-btn').on('click', function () {
        userVerificationOnTgt();
    });
    $('#clr-sidepanel-btn').on('click', function () {
        clearScheduleInfo();
    });
    $('#schedID').on('change', function () {
        var schedId = $('#schedLogID').val();
        if ($('#schedLogID').data('state') == 'running') {
            $('#upd-sidepanel-btn').attr('disabled', true);
        }

        getScheduleInfo(schedId, function (retData) {
            if (
                flags.schedule.loadedDeviId != $('#schedID').val() &&
                retData.devsta == '1'
            ) {
                $('#upd-sidepanel-btn').attr('disabled', true);
            } else {
                if (!$('#lockIcon').is(':visible')) {
                    $('#upd-sidepanel-btn').attr('disabled', false);
                }
            }
        });
    });
    $('#cancelLoading').on('click', function () {
        // if (typeof(_workerProd) != "undefined") {
        //  _workerProd.terminate();
        // }
        // if (typeof(_workerUnprod) != "undefined") {
        //  _workerUnprod.terminate();
        // }
        if (typeof _workerDown != 'undefined') {
            _workerDown.terminate();
        }
        if (typeof _workerDraw != 'undefined') {
            _workerDraw.terminate();
        }
        /** Thread cleanup **/
        if (typeof _workerProd != 'undefined') {
            _workerProd.map((val) => {
                val.terminate();
            });
        }
        if (typeof _workerUnprod != 'undefined') {
            _workerUnprod.map((val) => {
                val.terminate();
            });
        }
        $('#graphModal').modal('hide');
    });
}

function controlTabHandlers() {
    $('.mobMachine')
        .on('change', function () {
            if (flags.ajaxRequestStatus !== null) {
                flags.ajaxRequestStatus.abort();
                flags.ajaxRequestStatus = null;
            }
            if (flags.control.startStopRequest != null) {
                flags.control.startStopRequest.abort();
                flags.control.startStopRequest = null;
            }
            $('.dash-input').attr('disabled', true);
            flags.control.currSchedId = '';
            clearMobileDashboard();
            unsetRealtimeInfo(flags.control.blacklistState);
            getBlacklist('user');
        })
        .on('show.bs.select', function (e) {
            query_stop();
            if (flags.ajaxRequestStatus !== null) {
                flags.ajaxRequestStatus.abort();
                flags.ajaxRequestStatus = null;
            }
            if ($('#sidebar').hasClass('active')) {
                $('#sidebar').removeClass('active').addClass('inactive');
                sidebarTimerStop();
            }
            updateMachineOptionsControlOnclick();
        })
        .on('hidden.bs.select', function (e) {
            var val = $(this).find('option:selected').val();
            $('select.mobMachine').not(this).selectpicker('val', val);
        });
    $('.mobJob')
        .on('change', function (e) {
            if (flags.ajaxRequestStatus !== null) {
                flags.ajaxRequestStatus.abort();
                flags.ajaxRequestStatus = null;
            }
            if ($('#sidebar').hasClass('active')) {
                $('#sidebar').removeClass('active').addClass('inactive');
                sidebarTimerStop();
            }
            flags.control.addNewBypass = false;
            if ($(this).val() == lang[flags.pref.lang].control.new) {
                enableDashboardEdit();
            } else {
                updateDashboardDisplay();
            }
        })
        .on('show.bs.select', function (e) {
            query_stop();
            if (flags.ajaxRequestStatus !== null) {
                flags.ajaxRequestStatus.abort();
                flags.ajaxRequestStatus = null;
            }
            getBlacklist('special');
        })
        .on('hidden.bs.select', function () {
            if (flags.ajaxRequestStatus !== null) {
                flags.ajaxRequestStatus.abort();
                flags.ajaxRequestStatus = null;
            }
            var val = $(this).find('option:selected').val();
            $('select.mobJob').not(this).selectpicker('val', val);
            updateDashboardDisplay();
        });
    $('.snsBtn').on('click', function (e) {
        startRecord();
        // getBSbacklogState(startRecord, $('.snsBtn').eq(0).text());
    });
    $('.mobEndTgt').on('change', function () {
        var state = $(this).prop('checked');
        $('.mobEndTgt').prop('checked', state);
    });
    $('.control-wdt-input').on('change', function () {
        var state = $(this).prop('checked');
        $('.control-wdt-input').prop('checked', state);
    });
    $('.mobModel').on('input', function () {
        var val = $(this).val();
        $('.mobModel').not(this).val(val);
    });
    $('.mobMaterial').on('input', function () {
        var val = $(this).val();
        $('.mobMaterial').not(this).val(val);
    });
    $('.mobOperator').on('input', function () {
        var val = $(this).val();
        $('.mobOperator').not(this).val(val);
    });
    $('.mobCycle')
        .on('input', function () {
        var val = $(this).val();
        $('.mobCycle').not(this).val(val);
        })
        .on('change', function () {
            var val = $(this).val();
            if (val == 0) {
                $('.control-wdt-input').prop('checked', false);
            } else {
                $('.control-wdt-input').prop('checked', true);
            }
    });
    $('.mobPrescale').on('input', function () {
        var val = $(this).val();
        $('.mobPrescale').not(this).val(val);
    });
    $('.mobTarget').on('input', function () {
        var val = $(this).val();
        $('.mobTarget').not(this).val(val);
    });
    $('.mobPrewarn').on('input', function () {
        var val = $(this).val();
        $('.mobPrewarn').not(this).val(val);
    });
    $('.qr-container').on('click', function () {
        flags.camera.isActive = true;
    });
    $('#schedQR-btn-secured').on('click', function () {
        $('#schedQR-input').click();
    });
}

function dashboardTabHandlers() {
    /** Dashboard paging **/
    $('.dash-page-btn.dash-page-left').on('click', function () {
        if (flags.dashboard.pageLimit == 1) {
            return;
        }
        flags.dashboard.currPage = pageMoveTo('left');

        $('#' + flags.currPage + ' .dash-paging')
            .find('label')
            .html(
                '<label>' +
                    lang[flags.pref.lang].dashboard.page +
                    flags.dashboard.currPage +
                    ' of ' +
                    flags.dashboard.pageLimit +
                    '</label>'
            );
        clearDashboard();
    });
    $('.dash-page-btn.dash-page-right').on('click', function () {
        if (flags.dashboard.pageLimit == 1) {
            return;
        }
        flags.dashboard.currPage = pageMoveTo('right');

        $('#' + flags.currPage + ' .dash-paging')
            .find('label')
            .html(
                '<label>' +
                    lang[flags.pref.lang].dashboard.page +
                    flags.dashboard.currPage +
                    ' of ' +
                    flags.dashboard.pageLimit +
                    '</label>'
            );
        clearDashboard();
    });
}

function clusterTabHandlers() {
    /** cluster configuration handlers **/
    $('#viewClusterBtn').on('click', function () {
        flags.config.pageIndex = 1;
        tabSwitcherHandler();
        clusterViewOnly();
    });
    $('#viewDevicesBtn').on('click', function () {
        flags.config.pageIndex = 2;
        tabSwitcherHandler();
        loadClusters('#viewDevicesTab select');
    });
    $('#mngDevicesBtn').on('click', function () {
        flags.config.pageIndex = 3;
        tabSwitcherHandler();
        createDraggableDashboard();
    });
    $('#viewDevicesTab select').on('change', function () {
        devClusterViewQuery(this, null);
    });
    $('#refreshDevicesOrderBtn').on('click', function () {
        createDraggableDashboard();
    });
    $('#applyDeviceOrderBtn').on('click', function () {
        updateDraggableDashboardOrder();
    });
    $('#deleteDeviceBtn').on('click', function () {
        listInputDevices();
    });
}

function systemTabHandlers() {
    /** system config handlers **/
    newSystemHandler();
}

function userActionHandlers() {
    $('#warnYes').on('click', function () {
        var topic = $(this).data('topic');
        switch (topic) {
            case 'clusterDel':
                addDeviceToCluster('remove', true);
                break;

            case 'remDevFrCluster':
                removeDevice();
                break;

            case 'updateSchedule':
                updateScheduleInfo();
                break;

            case 'deleteSchedule':
                actDeleteSchedInfo();
                break;

            case 'endjob':
                endJob();
                break;

            case 'remCluster':
                executeDeleteCluster();
                break;

            default:
                break;
        }

        $('#warningModal').modal('hide');
    });
    $('#warnNo').on('click', function () {
        $('#warnYes').data('topic', '');
    });
    $('#audioYes').on('click', function () {
        flags.pref.audioEnabled = true;
    });
    $('#audioNo').on('click', function () {
        flags.pref.audioEnabled = false;
    });
    $('#logoutYes').on('click', function () {
        $.ajax({
            type: 'POST',
            url: 'php/signin/logout.php',
            data: {},
            dataType: 'json',
            async: true,
            success: function (data) {
                console.log(data);
                if (!$.isEmptyObject(data)) {
                    window.location.replace(data);
                }
            },
            fail: function () {},
        });
    });
}

function checkDecimal(elem) {
    var temp = elem.value;
    elem.value =
        temp.indexOf('.') >= 0
            ? temp.substr(0, temp.indexOf('.')) +
              temp.substr(temp.indexOf('.'), 2)
            : temp;
}

function overviewTabHandlers() {
    $('.overview-pane > div:nth-child(2)')
        .off()
        .on('click', function (e) {
            if (!flags.overview.dtCauseListBoxEnabled) {
                return;
            }

            var name = $(e.currentTarget).attr('data-nme');
            // if(name != '' && name !== undefined) {
            if (
                e.currentTarget.innerText ==
                lang[flags.pref.lang].status['UNPRODUCTIVE']
            ) {
                /* Fucntion wrapper */
                getDowntimeById(
                    $(e.currentTarget).attr('data-jid'),
                    function (args) {
                        const { devlid, devcus } = args;

                        downCauseAttr.uid_old = devcus; //devcus
                        downCauseAttr.lid = devlid; //devlid
                        downCauseAttr.selElem = e.currentTarget;

                        alarmPaused(true);
                        $('#alarm').remove();
                        $('#downModalBox').find('.machineName').html(name);
                        $('#downModalBox')
                            .find('#registerBtn')
                            .attr(
                                'data-lid',
                                $(e.currentTarget).attr('data-did')
                            );

                        getUnproductiveList();
                    }
                );

                // downCauseAttr.uid_old = $(e.currentTarget).attr('data-uid'); //devcus
                // downCauseAttr.lid = $(e.currentTarget).attr('data-lid'); //devlid
                // downCauseAttr.selElem = e.currentTarget;

                // alarmPaused(true);
                // $('#alarm').remove();
                // $('#downModalBox').find('.machineName').html(name);
                // $('#downModalBox').find('#registerBtn').attr('data-lid', $(e.currentTarget).attr('data-did'));

                // getUnproductiveList();
            } else {
                /* Ui responsiveness, tell the user we are doing something on it */
                $(e.currentTarget)
                    .find('label')
                    .html(
                        '<p class="text-center mb-0 px-3"><span role="status" class="spinner-border spinner-border-sm text-primary"></p>'
                    );
                flags.overview.worker.postMessage({
                    cmd: 'update',
                    min: $(e.currentTarget).attr('data-did'),
                });
            }
        });
    $('#registerClose')
        .off()
        .on('click', function () {
            alarmTimeoutEnabled();
            flags.ajaxRequestStatus = null;
        });
    $('#registerBtn')
        .off()
        .on('click', function () {
            setDowntimeCause();
            // alert("Cause id: " + downCauseAttr.uid + " Log id: " + downCauseAttr.lid);
        });
}

function buttonPanelHandler() {
    $('#downModalBox')
        .on(
            'click',
            '.button-panel .panel-container > div:not(.disabled)',
            function () {
                var parent = $(this).parent();
                $(parent).find('div').removeClass('active');
                $(this).addClass('active');
            }
        )
        .on('click', '.modal-body button.btn-left', function () {
            changeDownCausePage('left');
        })
        .on('click', '.modal-body button.btn-right', function () {
            changeDownCausePage('right');
        });

    $(
        '#downModalBox .modal-body button.btn-left, #downModalBox .modal-body button.btn-right'
    ).attr('disabled', true);
}

function expandMiniTabsOnSmScreen() {
    if (screen.width <= 440) {
        $('.minitabs').addClass('nav-fill');
    } else {
        $('.minitabs').removeClass('nav-fill');
    }
}

function chartHandlers() {
    $('#summary-show-data-btn').on('click', function () {
        if (flags.ajaxRequestStatus !== null) {
            flags.ajaxRequestStatus.abort();
            flags.ajaxRequestStatus = null;
        }

        const summaryShowDataBtnLabel = $('#summary-show-data-btn > span');
        const summaryShowDataBtnIcon = $('#summary-show-data-btn > i');

        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            summaryShowDataBtnIcon.removeClass('fa-table');
            summaryShowDataBtnIcon.addClass('fa-bar-chart');
            summaryShowDataBtnLabel.html(`&nbsp;${lang[flags.pref.lang].general.showchartlbl}`);    
            $(
                '#' + flags.currPage + ' .tbl-container > .table-responsive'
            ).show();
            $(
                '#' + flags.currPage + ' .tbl-container > .showButton-container'
            ).show();
            $('#' + flags.currPage + ' .filter-btn, #' + flags.currPage + ' #schedule-filter').attr('disabled', false);
            $('#summary-filter-btn').attr('disabled', false);
            $('#' + flags.currPage + ' .manualUpdate-footer').hide();
            $('#timechart').hide();
            flags.summary.isChartMode = false;
            showTableLoading();
            query_start();
        } else {
            $('#graphModal .snsPrompt').html(
                lang[flags.pref.lang].general.loading
            );
            $('#graphModal').modal('show');
            $('#cancelLoading').prop('disabled', true);
            $(this).addClass('active');
            summaryShowDataBtnIcon.removeClass('fa-bar-chart');
            summaryShowDataBtnIcon.addClass('fa-table');
            summaryShowDataBtnLabel.html(`&nbsp;${lang[flags.pref.lang].general.showdatalbl}`);
            $(
                '#' + flags.currPage + ' .tbl-container > .table-responsive'
            ).hide();
            $(
                '#' + flags.currPage + ' .tbl-container > .showButton-container'
            ).hide();
            $('#' + flags.currPage + ' .filter-btn, #' + flags.currPage + ' #schedule-filter').attr('disabled', true);
            $('#summary-filter-btn').attr('disabled', true);
            $('#timechart').show();
            $('#timechart').css('visibility', 'hidden');
            $('#' + flags.currPage + ' .manualUpdate-footer').show();
            flags.summary.isChartMode = true;
            query_stop();

            getChartInstances(function () {
                if ($.isEmptyObject(timechart)) {
                    console.log('1st chart instances')
                    setTimeout(function () {
                        $('#graphModal').modal('hide');
                        getTimeChartDataNew();
                    }, 500);
                } else {
                    setTimeout(function () {
                        console.log('2nd chart instances')
                        $('#graphModal').modal('hide');
                        getTimeChartDataNew();
                    }, 500);
                }
                setTimeout(() => {
                    $('#timechart').css('visibility', 'visible');
                }, 750);
            });
        }

        if (flags.pref.lang == 'en') {
            $('#chart-btn label, #export-btn label').css({
                'font-size': '0.875rem',
            });
        } else {
            $('#chart-btn label, #export-btn label').css({
                'font-size': '0.55rem',
            });
        }
    });
    
    /************************http-1201 bug #18******************************/
    $('body').on('click', '#timechart-content, #visual-container, #timegraph, #schedchart', function () {
        if (this.getAttribute('id') == 'timechart-content')
        {
            $('#summary-tab input.hasDatepicker').trigger('blur');
        }
        else if (this.getAttribute('id') == 'visual-container')
        {
            $('#visual-tab input.hasDatepicker').trigger('blur');
        }
        else if (this.getAttribute('id') == 'timegraph')
        {
            $('#detail-tab input.hasDatepicker').trigger('blur');
        }
        else if (this.getAttribute('id') == 'schedchart')
        {
            $('#schedule-tab input.hasDatepicker').trigger('blur');
        }
    });
    /***********************************************************************/
}

let processedData2;
let processedData2Keys;
let processedData2CurrentIndex;
let timechartMomentFr;
let timechartMomentTo;
let timechartOriginalInterval;

let test;
let testKeys;
let testCurrentIndex;

const getTimeChartDataNew = () => {
    console.log('getTimeChartDataNew()');

    const dateParam = getDateTimeNow('-');
    const dateToUse = { fr: '', to: '' };

    if (flags.displayMode.others === 'today') {
        dateToUse.fr = dateParam.date + ' 00:00:00';
        dateToUse.to = dateParam.date + ' 23:59:59';
    } else {
        dateToUse.fr = addStartTime({dateString: $('.dateFr:not(.schedDate .dbmDate)').eq(0).val()});
        dateToUse.to = addEndTime({dateString: $('.dateTo:not(.schedDate .dbmDate)').eq(0).val()});
    }
    console.log(dateToUse.fr);
    $.ajax({
        type: 'POST',
        url: 'php/timechart.php',
        data: {
            start: dateToUse.fr,
            end: dateToUse.to,
            limitMin: 1,
            limiMax: 4,
        },
        dataType: 'json',
        async: true,
        success: (data) => {
           
            console.log('from timechart.php');
            console.log(data);
            if (!$.isEmptyObject(data)) {
                //  TEST: MAC 1 AND 2 ONLY
                const newData0 = data[0].filter((d) => {
                    return d.devnme === 'MAC 2';
                });
                const newData1 = data[1].filter((d) => {
                    return d.devnme === 'MAC 2';
                });
                test = generateTimechartData({
                    productive: data[0],
                    unproductive: data[1],
                    startDate: dateToUse.fr,
                    endDate: dateToUse.to
                });
                // console.log('TEST');
                // console.log(test);
                
                testKeys = Object.keys(test);
                testCurrentIndex = 0;
                // console.log(processedData2[processedData2Keys.length - 1]);
                timechartMomentFr = moment(dateToUse.fr, 'YYYY-MM-DD HH:mm:ss');
                timechartMomentTo = moment(dateToUse.to, 'YYYY-MM-DD HH:mm:ss');
                //  get amount of days between from and to
                const diff =
                    timechartMomentTo.diff(timechartMomentFr, 'days') + 1;
                if (diff === 1) {
                    timechartOriginalInterval = 1 * 60 * 60 * 1000;
                } else if (diff <= 7) {
                    timechartOriginalInterval = 1 * 60 * 60 * 1000 * 6;
                } else if (diff <= 14) {
                    timechartOriginalInterval = 1 * 60 * 60 * 1000 * 12;
                } else if (diff <= 31) {
                    timechartOriginalInterval = 1 * 60 * 60 * 1000 * 24;
                }

                // timechart = initTimeGraphNew(timechartMomentFr.valueOf(), timechartMomentTo.valueOf(), processedData2[processedData2Keys[processedData2CurrentIndex]].data, timechartOriginalInterval);
                timechart = initTimeGraphNew(
                    timechartMomentFr.valueOf(),
                    timechartMomentTo.valueOf(),
                    test[testKeys[testCurrentIndex]].data,
                    $('#themeSel').val() + '2'
                );
                flags.summary.chart = timechart;
                // timechart = initTimeGraphNew(timechartMomentFr.valueOf(), timechartMomentTo.valueOf(), processedData, timechartOriginalInterval);
                timechart.render();
                timechart.data[1].set("legendText", lang[flags.pref.lang].timechart.legends['Productive'], false);
                timechart.data[2].set("legendText", lang[flags.pref.lang].timechart.legends['Unproductive']);

                if(!test[testKeys[testCurrentIndex]].data.length) {
                    $('#summary-export-btn').prop('disabled', true);
                }
                else {
                    $('#summary-export-btn').prop('disabled', false);
                }

                // console.log('timechart');
                // console.log(timechart.axisX[0].bounds.height);
                // console.log('label count');
                // console.log(Object.keys(test[testKeys[testCurrentIndex]].labels).length);


                $('#timechart-prev-btn').prop('disabled', true);

                if (testKeys.length === 1) {
                    $('#timechart-next-btn').prop('disabled', true);
                } else {
                    $('#timechart-next-btn').prop('disabled', false);
                }

                timechartPagination = createNewPaginationInstance();
                timechartPagination.create({numberOfPages: testKeys.length});
                $('#timechart-pagination-container').html(timechartPagination.getHtml());

                addBorderToDataPoint(timechart, 2);
            }
            enableDisplayButton();
            $('#graphModal').modal('hide');

            //  update Last Update string
            $('#summary-tab label.last-update').html(
                lang[flags.pref.lang].general.lastUpdate +
                    ': ' +
                    getDateTimeNow('-').dnt
            );
        },
    });
};

const updateTimechartLabels = () => {
    console.log('updateTimechartLabels()');
    const range =
        timechart.axisY[0].viewportMaximum - timechart.axisY[0].viewportMinimum;
    const dataOnDisplay = $(window).width() / 80;
    const newInterval = Math.max(1, Math.round(range / dataOnDisplay));
    timechartOriginalInterval = newInterval;
    timechart.options.axisY.interval = newInterval;
    timechart.options.rangeChanging = (e) => {
        if (e.trigger === 'zoom') {
            const range =
                e.axisY[0].viewportMaximum - e.axisY[0].viewportMinimum;
            const dataOnDisplay = $(window).width() / 75;
            const newInterval = Math.max(1, Math.round(range / dataOnDisplay));
            e.chart.options.axisY.interval = newInterval;
        } else if (e.trigger === 'reset') {
            e.chart.options.axisY.interval = timechartOriginalInterval;
        }
    };

    timechart.render();
};

$('timechart-next-btn').off('click');

$('#timechart-pagination-container').on('click', 'button', (e) => {
    console.log('item clicked!');
    const val = e.currentTarget.innerHTML;
    if (val === '...') {
        return;
    }

    testCurrentIndex = parseInt(val) - 1;
    timechartPagination.navigateToPage(parseInt(val));
    $('#timechart-pagination-container').html(timechartPagination.getHtml());
    timechart = initTimeGraphNew(
        timechartMomentFr.valueOf(),
        timechartMomentTo.valueOf(),
        test[testKeys[testCurrentIndex]].data,
        $('#themeSel').val() + '2'
    );
    timechart.render();
    timechart.data[1].set("legendText", lang[flags.pref.lang].timechart.legends['Productive'], false);
    timechart.data[2].set("legendText", lang[flags.pref.lang].timechart.legends['Unproductive']);
    summaryTimechartNextPageChecker();

    addBorderToDataPoint(timechart, 2);
});

//  next button handler in timechart
$('#timechart-next-btn').on('click', function () {
    testCurrentIndex++;
    // timechart = initTimeGraphNew(timechartMomentFr.valueOf(), timechartMomentTo.valueOf(), processedData2[processedData2Keys[processedData2CurrentIndex]].data, timechartOriginalInterval);
    timechart = initTimeGraphNew(
        timechartMomentFr.valueOf(),
        timechartMomentTo.valueOf(),
        test[testKeys[testCurrentIndex]].data,
        $('#themeSel').val() + '2'
    );
    timechart.render();
    timechart.data[1].set("legendText", lang[flags.pref.lang].timechart.legends['Productive'], false);
    timechart.data[2].set("legendText", lang[flags.pref.lang].timechart.legends['Unproductive']);
    addBorderToDataPoint(timechart, 2);
    flags.summary.chart = timechart;
    timechartPagination.next();
    $('#timechart-pagination-container').html(timechartPagination.getHtml());
    // updateTimechartLabels();
    summaryTimechartNextPageChecker();
});

//  previous button handler in timechart
$('#timechart-prev-btn').on('click', function () {
    testCurrentIndex--;
    // timechart = initTimeGraphNew(timechartMomentFr.valueOf(), timechartMomentTo.valueOf(), processedData2[processedData2Keys[processedData2CurrentIndex]].data, timechartOriginalInterval);
    timechart = initTimeGraphNew(
        timechartMomentFr.valueOf(),
        timechartMomentTo.valueOf(),
        test[testKeys[testCurrentIndex]].data,
        $('#themeSel').val() + '2'
    );
    timechart.render();
    timechart.data[1].set("legendText", lang[flags.pref.lang].timechart.legends['Productive'], false);
    timechart.data[2].set("legendText", lang[flags.pref.lang].timechart.legends['Unproductive']);
    addBorderToDataPoint(timechart, 2);
    flags.summary.chart = timechart;
    timechartPagination.previous();
    $('#timechart-pagination-container').html(timechartPagination.getHtml());

    // updateTimechartLabels();
    summaryTimechartNextPageChecker();
});

const scheduleChartPageChecker = () => {
    const prevBtn = $('#sched-prev-btn');
    const nextBtn = $('#sched-next-btn');
    const currentLength = Object.keys(flags.schedule.chartData).length - 1;
    if (flags.schedule.chartCurrentPage === currentLength || currentLength <= 0) {
        //  disable next
        nextBtn.prop('disabled', true);
    } else {
        nextBtn.prop('disabled', false);
    }
    if (flags.schedule.chartCurrentPage === 0) {
        //  disable prev
        prevBtn.prop('disabled', true);
    } else {
        prevBtn.prop('disabled', false);
    }
}

$('#schedchart-pagination-container').on('click', 'button', (e) => {
    const val = e.currentTarget.innerHTML;
    if (val === '...') {
        return;
    }
    flags.schedule.chartCurrentPage = parseInt(val) - 1;
    flags.schedule.chartPagination.navigateToPage(parseInt(val));
    $('#schedchart-pagination-container').html(flags.schedule.chartPagination.getHtml());
    const chart = initScheduleChart($('#themeSel').val() + '2', flags.schedule.chartData[flags.schedule.chartCurrentPage]);
    scheduleChartPageChecker();
    flags.schedule.chartObject = chart;
});

$('#sched-prev-btn').on('click', function () {
    flags.schedule.chartCurrentPage--;
    const chart = initScheduleChart($('#themeSel').val() + '2', flags.schedule.chartData[flags.schedule.chartCurrentPage]);
    flags.schedule.chartPagination.previous();
    $('#schedchart-pagination-container').html(flags.schedule.chartPagination.getHtml());
    scheduleChartPageChecker();
    flags.schedule.chartObject = chart;
});

$('#sched-next-btn').on('click', function() {
    flags.schedule.chartCurrentPage++;
    const chart = initScheduleChart($('#themeSel').val() + '2', flags.schedule.chartData[flags.schedule.chartCurrentPage]);
    flags.schedule.chartPagination.next();
    $('#schedchart-pagination-container').html(flags.schedule.chartPagination.getHtml());
    scheduleChartPageChecker();
    flags.schedule.chartObject = chart;
});


const summaryTimechartNextPageChecker = () => {
    if (testCurrentIndex === testKeys.length - 1) {
        $('#timechart-next-btn').prop('disabled', true);
    } else {
        $('#timechart-next-btn').prop('disabled', false);
    }

    if (testCurrentIndex === 0) {
        $('#timechart-prev-btn').prop('disabled', true);
    } else {
        $('#timechart-prev-btn').prop('disabled', false);
    }
}

function getTimechartData() {
    var dateParam = getDateTimeNow('-');
    var dateToUse = { fr: '', to: '' };
    var devicenames = [];

    if (flags.displayMode.others == 'today') {
        dateToUse.fr = dateParam.date + ' 00:00:00';
        dateToUse.to = dateParam.date + ' 23:59:59';
    } else {
        dateToUse.fr = addStartTime({dateString: $('.dateFr:not(.schedDate .dbmDate)').eq(0).val()});
        dateToUse.to = addEndTime({dateString: $('.dateTo:not(.schedDate .dbmDate)').eq(0).val()});
    }

    const limits = timechart.getPageProperties();

    $.ajax({
        type: 'POST',
        url: 'php/timechart.php',
        data: {
            start: dateToUse.fr,
            end: dateToUse.to,
            limitMin: limits.min,
            limitMax: limits.max,
        },
        dataType: 'json',
        async: true,
        success: function (data) {
            if (!$.isEmptyObject(data)) {
                var testDataMulti = [];
                for (var i = 0; i < data.length; i++) {
                    testDataMulti[i] = [];
                    for (var j = 0; j < data[i].length; j++) {
                        /** <start>,<end>,<logid>,<jobid> **/
                        temp = [
                            data[i][j].devstt,
                            data[i][j].devend,
                            data[i][j].devlog,
                            data[i][j].devdid,
                            data[i][j].devsid,
                            data[i][j].devjob,
                        ];
                        testDataMulti[i].push(temp);
                    }
                }

                var fr = moment(dateToUse.fr);
                var to = moment(dateToUse.to);
                timechart.attr({
                    instance: flags.summary.instanceNames,
                    minDate: dateToUse.fr.split(' ')[0],
                    maxDate: dateToUse.to.split(' ')[0],
                    start: Math.floor(fr.format('HH')),
                    length: Math.ceil(to.diff(fr, 'minutes') / 60),
                    dateRange: dateToUse.fr + ',' + dateToUse.to,
                });
                timechart.refresh();
                timechart.plotMultiGraph(testDataMulti, function (e) {
                    $('#graphModal').modal('hide');
                });
            } else {
                var fr = moment(dateToUse.fr);
                var to = moment(dateToUse.to);
                timechart.attr({
                    instance: flags.summary.instanceNames,
                    minDate: dateToUse.fr.split(' ')[0],
                    maxDate: dateToUse.to.split(' ')[0],
                    start: Math.floor(fr.format('HH')),
                    length: Math.ceil(to.diff(fr, 'minutes') / 60),
                    dateRange: dateToUse.fr + ',' + dateToUse.to,
                });
                timechart.clearData();
                timechart.refresh(function () {
                    $('#graphModal').modal('hide');
                });
            }
            enableDisplayButton();
            $('.manualUpdate-footer label.last-update').html(
                lang[flags.pref.lang].general.lastUpdate + ': ' + dateParam.dnt
            );
        },
        fail: function (xhr, status, error) {
            enableDisplayButton();
            $('#graphModal').modal('hide');
        },
    });
}

function getChartInstances(callback) {
    $.ajax({
        type: 'POST',
        url: 'php/jogetLineDevices.php',
        data: '',
        dataType: 'json',
        async: true,
        success: function (data) {
            console.log(data);
            /** Check if data is empty **/
            flags.summary.instanceNames = [];
            if (!$.isEmptyObject(data)) {
                var maxVal = 0;
                for (var i = 0; i < data.length; i++) {
                    maxVal =
                        parseInt(data[i].devord) > maxVal
                            ? parseInt(data[i].devord)
                            : maxVal;
                }
                flags.summary.instanceNames = new Array(maxVal).fill(undefined);
                for (var i = 0; i < data.length; i++) {
                    var idx = parseInt(data[i].devord) - 1;
                    flags.summary.instanceNames[idx] = data[i].devnme;
                }
                callback();
            }
        },
        fail: function () {
            enableDisplayButton();
        },
    });
}

function audioHandler() {
    if (!flags.overview.initialized && flags.isMobileAccnt) {
        flags.overview.initialized = true;
        if ($('#sidebar').hasClass('active')) {
            $('#sidebar').removeClass('active').addClass('inactive');
            sidebarTimerStop();
        }
        $('#audioModal').modal('show');
    }
}

function fullscreenHandler() {
    $(document).on(
        'mozfullscreenchange webkitfullscreenchange fullscreenchange',
        function () {
            flags.pref.isFullscreen =
                document.fullScreen ||
                document.mozFullScreen ||
                document.webkitIsFullScreen;
        }
    );
    $('#fsYes').on('click', function () {
        $('#audioModal').one('hidden.bs.modal', function () {
            $('#audioModal').off();
            setTimeout(function () {
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen();
                }
                $('#' + flags.currPage).offsetHeight;
                flags.pref.isFullscreen = true;
                flags.camera.fullscreenPrevState = true;
            }, 100);
        });
    });
    $('#fsNo').on('click', function () {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        $('#' + flags.currPage).offsetHeight;
        flags.pref.isFullscreen = false;
        flags.camera.fullscreenPrevState = false;
    });
    $('#fsModal').on('hidden.bs.modal', function () {
        audioHandler();
    });
}

const setTime = ({ from, to }) => {
    $('.dateFr').val(from);
    $('.dateTo').val(to);
};

function loadPageResources() {
    
    // console.log('loadPageResources()');
    flags.queryPause = false;
    $('.systemContent input[data-toggle="popover"]').popover('dispose');
    $('#add-sched-btn').attr('disabled', flags.viewModeOnly ? true : false);
    $('#' + flags.currPage + ' .tbl-container').removeClass('sidepanel');
    $('#' + flags.currPage + ' .sidepanel').css('z-index', -1);
    sidebarTimerReset();
    defaultToDaily();
    datatableExtension();
    setFilterAttributes();
    expandMiniTabsOnSmScreen();

    const viewBtn = $('.tab-pane.show .view-btn, .tab-pane.show .schedView');
    viewBtn.removeClass('active');
    const i = $('.tab-pane .view-btn i');
    i.removeClass('text-success');

    if (flags.control.startStopRequest != null) {
        flags.control.startStopRequest.abort();
        flags.control.startStopRequest = null;
    }

    if (typeof flags.overview.worker != 'undefined') {
        flags.overview.worker.terminate();
        flags.overview.worker = undefined;
    }

    /** Thread cleanup **/
    if (typeof _workerProd != 'undefined') {
        _workerProd.map((val) => {
            val.terminate();
        });
    }
    if (typeof _workerUnprod != 'undefined') {
        _workerUnprod.map((val) => {
            val.terminate();
        });
    }
    if (flags.currPage !== 'schedule-tab') {
        $('#schedule-tab').css('display', 'none');
    }
    if (flags.currPage !== 'visual-tab') {
        $('#visual-tab').css('display', 'none');
    }
    if (flags.currPage !== 'summary-tab') {
        $('#summary-tab').css('display', 'none');
    }
    if (flags.currPage !== 'reject-tab') {
        $('#reject-tab').css('display', 'none');
    }
    if (flags.currPage !== 'detail-tab') {
        $('#detail-tab').css('display', 'none');
    }
    
    
    const visualContainer = $('#visual-container');
    visualContainer.css('visibility', 'hidden');

    switch (flags.currPage) {
        case 'control-tab':
            /** we rely on the container width, without delay the calcualtion for the dimension of container could be zero **/
            setTimeout(function () {
                initCircleProgress();
                setProgressBaseColor();
                clearMobileDashboard();
                updateMachineOptionsControl(null);
            }, 550);
            break;

        case 'dashboard-tab':
            initDashboard();
            resetTimer();
            query_start();
            break;

        case 'duration-tab':
            initDurationTab();
            resetTimer();
            query_start();
            break;

        case 'overview-tab':
            initOverview();
            resetTimer();
            query_start();
            overviewTabHandlers();
            break;

        case 'summary-tab':
            const timechartDivElement = $('#timechart');
            console.log('timechartdiv');
            console.log(timechartDivElement);

            $('#summary-tab').css('display', 'flex');
                timechartDivElement.css('visibility', 'hidden');
                setTimeout(() => {
                    if (flags.summary.isChartMode) {
                        $('#graphModal .snsPrompt').html(
                            lang[flags.pref.lang].general.loading
                        );
                        $('#graphModal').modal('show');
                        $('#cancelLoading').prop('disabled', true);
    
                        getChartInstances(function () {
                            console.log('getChartInstances');
                            setTimeout(() => {
                                getTimeChartDataNew();
                            }, 500);
                            setTimeout(() => {
                                timechartDivElement.css('visibility', 'visible');
                            }, 1000);
                            // setTimeout(function () {
                            //     // getTimechartData();
                            //     getTimeChartDataNew();
                            // }, 500);
                        });
                    } else {
                        initSummary();
                        showTableLoading();
                        resetTimer();
                        query_start();
                        setTimeout(() => {
                            setTime({
                                from: localStorage.getItem('summaryRejectFrom'),
                                to: localStorage.getItem('summaryRejectTo'),
                            });
                        }, 500);

                    }    
                }, 500);

            break;

        case 'reject-tab':
            $('#reject-tab').css('display', 'flex');
            setTimeout(() => {
                setTime({
                    from: localStorage.getItem('summaryRejectFrom'),
                    to: localStorage.getItem('summaryRejectTo'),
                });
            }, 250);
            setTimeout(function () {
                initReject();
                showTableLoading();
                resetTimer();
                query_start();
            }, 500);
            break;

        case 'unproductive-tab':
            // setTimeout(function () {
            //     initUnproductive();
            //     showTableLoading();
            //     resetTimer();
            //     query_start();
            // }, 500);
            break;

        case 'schedule-tab':
            $('#schedule-tab').css('display', 'flex');
            if (flags.schedule.isGraphMode) {
                //  hide schedChartView for now
                const schedChartView = $('#schedchart-container');
                schedChartView.css('visibility', 'hidden');
                //  disable "add new schedule" button
                const addSchedBtn = $('#add-sched-btn');
                addSchedBtn.prop('disabled', true);
            }
            setTimeout(function () {
                initSchedule();
                showTableLoading();
                resetTimer();
                query_start();
            }, 500);
            setTimeout(() => {
                setTime({
                    from: localStorage.getItem('schedFrom'),
                    to: localStorage.getItem('schedTo'),
                });
            }, 250);
            break;

        case 'cluster-tab':
            switch (flags.config.pageIndex) {
                case 1:
                    // clusterViewOnly();
                    viewClusterHandler();
                    break;

                case 2:
                    setTimeout(function () {
                        initClusterTbl();
                    }, 500);
                    break;

                case 3:
                    createDraggableDashboard();
                    break;

                default:
                    flags.config.pageIndex = 1;
                    break;
            }
            break;

        case 'date-tab':
            $('.systemContent > div > span')
                .eq(0)
                .html($('.system-route.active').text());
            switch (flags.system.pageIndex) {
                case 1:
                    getAllTimezone();
                    query_start();
                    break;

                case 2:
                    ethernetInfo('getInfo');
                    break;

                default:
                    flags.system.pageIndex = 1;
                    break;
            }
            setTimeout(() => {
                setTime({
                    // from: localStorage.getItem('dbmFrom'),
                    // to: localStorage.getItem('dbmTo'),
                    from: null,
                    to: null,
                });
            }, 250);
            break;

        case 'detail-tab':
            // $('#' + flags.currPage + ' .manualUpdate-footer').show();
            // setTimeout(function() {
            //  getAvailableDevice();
            //  resetTimer();
            //  query_start();
            // }, 500);
            $('#detail-tab').css('display', 'flex');

            setTimeout(() => {
                setTime({
                    // from: localStorage.getItem('detailTabFrom'),
                    // to: localStorage.getItem('detailTabTo'),
                    from: localStorage.getItem('visual-detailTabFrom'),
                    to: localStorage.getItem('visual-detailTabTo'),
                });
                if (flags.detailedlog.isGraphMode) {
                    joTimeChart.initTimechartCustom({
                        theme: `${flags.pref.theme}2`,
                    });
                } else {
                    // initUnproductive();
                }
            }, 250);

            break;

        case 'visual-tab':
            // const visualContainer = $('#visual-container');
            // visualContainer.css('visibility', 'hidden');
            //  refresh if there is data
            const visualJobsElem = $('#visualJobs');
            console.log('visualJobElem');
            console.log(visualJobsElem.prop('disabled'));

            
            $('#visual-tab').css('display', 'flex');

            // setTimeout(() => {
                // if (!visualJobsElem.prop('disabled')) {
                //     $(window).trigger('resize');
                // }
                setTime({
                    // from: localStorage.getItem('visualTabFrom'),
                    // to: localStorage.getItem('visualTabTo'),
                    from: localStorage.getItem('visual-detailTabFrom'),
                    to: localStorage.getItem('visual-detailTabTo'),
                });
            // }, 250);
            setTimeout(() => {
                initVisualization({ theme: `${flags.pref.theme}2` });
                changeVisualizationTheme({theme: `${flags.pref.theme}2`});
                // translateProductivity();
                visualContainer.css('visibility', 'visible');
            }, 250);
            break;

        case 'about-tab':
            console.log('about tab getInfo');
            $.ajax({
                type: 'POST',
                url: 'php/config/getEthernetInfo.php',
                data: { 
                    command: 'getInfo',
                },
                dataType:'json',
                async: true,
                success: function(retData) {
                    console.log('about tab result');
                    console.log(retData);
                    if (retData !== null) {
                        if (typeof retData === 'object') {
                            if (retData.ip === '') {
                                console.log('ip is blank')
                                retData.ip = '127.0.0.1';
                            }
                            $('#about-ip-content').html(retData.ip);
                        } else {
                            showPrompt('Options are disabled. Server currently provides the routing for the network.', 'Error');
                            // $('#systemBtn-2').attr('disabled', true);
                        }
                    }
                },
                fail: function(errThrown) {
                    console.log('Failed: ' + errThrown);
                }
            });
            break;

        default:
            break;
    }
}

function executeFullscreenMode() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
    }
    $('#' + flags.currPage).offsetHeight;
    flags.pref.isFullscreen = true;
}

function toUnicode(str) {
    return str
        .split('')
        .map(function (value, index, array) {
            var temp = value.charCodeAt(0).toString(16).toUpperCase();
            if (temp.length > 2) {
                return '%u' + temp;
            }
            return value;
        })
        .join('');
}

function shortcutKeyHandlers() {
    var isCtrl = false;
    document.onkeyup = function (e) {
        if (e.keyCode == 17) isCtrl = false;
    };

    document.onkeydown = function (e) {
        var panelOpen = $('#schedule-tab .schedTable').hasClass('sidepanel');
        if (e.keyCode == 17) {
            isCtrl = true;
        }
        if (e.keyCode == 83 && isCtrl == true) {
            if (panelOpen) {
                $('#add-sidepanel-btn').click();
            }
            return false;
        } else if (e.keyCode == 69 && isCtrl == true) {
            if (panelOpen) {
                $('#upd-sidepanel-btn').click();
            }
            return false;
        } else if (e.which == 27 || e.which == 13) {
            if ($('#promptModal').hasClass('show')) {
                $('#promptModal').modal('hide');
            }
            if ($('#filterModal').hasClass('show')) {
                $('#filterModal').modal('hide');
            }
        }
    };
}

function softwareUpdateHandlers() {
    $('#software-update-btn').on('click', function () {
        showPrompt(
            'This feature is currently not available. Sorry for the inconvenience.',
            'Error'
        );
    });
}

function disablePages(data, cachedPage) {
    /* Role
     * Admin - Full access
     * User - All access except admin page
     *
     * Permission
     * perm_1 - JO Dashboard (control-tab, dashboard, overview)
     * perm_2 - Schedule page (schedule-tab)
     * perm_3 - Rejects Remarks (inputs on reject-tab)
     * perm_4 - Data Amendment (All inputs except page preferences)
     */
    var page = cachedPage;
    // $('#cluster-tab-btn').attr('disabled', true);
    $('#users-mgmt-side-btn').attr('disabled', true);
    if (data.perm_1 == '1') {
        $('#control-tab-btn').attr('disabled', false);
        flags.isMobileAccnt = true;
        flags.overview.dtCauseListBoxEnabled = true;
    } else {
        if (cachedPage == 'control-tab') {
            page = 'dashboard-tab';
        }
        $('#control-tab-btn').attr('disabled', true);
        flags.isMobileAccnt = false;
        flags.overview.dtCauseListBoxEnabled = false;
    }

    if (data.perm_2 == '1') {
        $('#schedule-tab-btn').attr('disabled', false);
    } else {
        $('#schedule-tab-btn').attr('disabled', true);
    }

    if (data.perm_3 == '1') {
        flags.reject.disableInput = false;
        // $('#cluster-tab-btn').attr('disabled', false);
    } else {
        flags.reject.disableInput = true;
        // $('#cluster-tab-btn').attr('disabled', true);
    }

    if (data.perm_4 == '1') {
        flags.isMobileAccnt = true;
        // flags.reject.disableInput = false;
        flags.unproductive.disableInput = false;
        flags.viewModeOnly = false;
        $('#schedQR-btn-secured').prop('disabled', false);
        $('.qr-container > input').prop('disabled', false);
        $('.qr-container').show();
    } else {
        flags.isMobileAccnt = false;
        // flags.reject.disableInput = true;
        flags.unproductive.disableInput = true;
        flags.viewModeOnly = true;
        $('#schedQR-btn-secured').prop('disabled', true);
        $('.qr-container > input').prop('disabled', true);
        $('.qr-container').hide();
    }

    localStorage.setItem('pageCached', page);
    return page;
}

function userPermissionAndAccess(accnt, cachedPage, callback) {
    /* Role
     * Admin - Full access
     * User - All access except admin page
     *
     * Permission
     * perm_1 - JO Dashboard (control-tab, dashboard, overview)
     * perm_2 - Schedule page (schedule-tab)
     * perm_3 - Rejects Remarks (inputs on reject-tab)
     * perm_4 - Data Amendment (All inputs except page preferences)
     */
    switch (accnt) {
        case 'admin':
            $.ajax({
                type: 'POST',
                url: 'php/config/getAccountPermission.php',
                data: { id: $('#accntInfoHolder').attr('data-aid') },
                dataType: 'json',
                success: function (data) {
                    if (!$.isEmptyObject(data)) {
                        callback(disablePages(data[0], cachedPage));
                    } else {
                        showPrompt(
                            'Failed to read account permission. Please refresh the page.',
                            'Error'
                        );
                    }
                },
                fail: function () {
                    showPrompt(
                        'Failed to read account permission. Please refresh the page.',
                        'Error'
                    );
                },
            });
            break;

        case 'mobile':
        case 'desktop':
        case 'viewer':
        case 'user':
            $.ajax({
                type: 'POST',
                url: 'php/config/getAccountPermission.php',
                data: { id: $('#accntInfoHolder').attr('data-aid') },
                dataType: 'json',
                success: function (data) {
                    if (!$.isEmptyObject(data)) {
                        $('#sidepanel-config-btn').attr('disabled', true);
                        var restrictedPages = [
                            'cluster-tab',
                            'date-tab',
                            'update-tab',
                        ];
                        const isRestricted =
                            restrictedPages.indexOf(cachedPage);
                        // const isRestricted = restrictedPages.map(function (a) {
                        //  if (a == cachedPage) {
                        //      return true;
                        //  }
                        // });

                        if (isRestricted > -1) {
                            cachedPage = 'control-tab';
                        }
                        callback(disablePages(data[0], cachedPage));
                    } else {
                        showPrompt(
                            'Failed to read account permission. Please refresh the page.',
                            'Error'
                        );
                    }
                },
                fail: function () {
                    showPrompt(
                        'Failed to read account permission. Please refresh the page.',
                        'Error'
                    );
                },
            });
            break;

        default:
            showPrompt(
                'Failed to read account information. Please try another account.',
                'Error'
            );
            break;
    }
}

const closeDowntimeSidePanel = () => {
    // console.log('close downtime');
    $('#' + flags.currPage + ' .tbl-container').removeClass('sidepanel');
    $('#' + flags.currPage + ' .tbl-container').one(
        'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
        function () {
            flags.downtime.table.columns.adjust().draw(false);
        }
    );
};

function detailTabHandlers() {
    // $('#graph-btn').on('click', function () {
    //  if ($(this).hasClass('active')) {
    //      $(this).removeClass('active');
    //      $(this).html('<i class="fa fa-chart-area"></i><label class="m-0">&nbsp;<span class="graphlbl">' + lang[flags.pref.lang].general.graphlbl + '</span></label>');
    //      $('#detailLogContent').show();
    //      // $('#detail-tab .table-btn-addon').show();
    //      $('#timegraph').hide();
    //      flags.detailedlog.isGraphMode = false;
    //  } else {
    //      $(this).addClass('active');
    //      $(this).html('<i class="fa fa-arrow-left"></i><label class="m-0">&nbsp;<span class="graphlbl">' + lang[flags.pref.lang].general.tablelbl + '</span></label>');
    //      $('#detailLogContent').hide();
    //      // $('#detail-tab .table-btn-addon').hide();
    //      $('#timegraph').show();
    //      flags.detailedlog.isGraphMode = true;
    //  }
    //  handleDetailedLogUpdate();
    // });

    // $('#detailDevice').on('change', function () {
    //  flags.detailedlog.selectedDevice = $(this).val();
    //  handleDetailedLogUpdate();
    // });
    const unprodTableElement = $('.tbl-container.unprodTable');
    const tableContent = $('#detail-table-content');
    const timeGraphElement = $('#timegraph-container');
    const unproductiveTable = $('.tbl-container.unprodTable');
    const detailShowDataBtnLabel = $('#detail-show-data-btn > span');
    const detailShowDataBtnIcon = $('#detail-show-data-btn > i');
    $('#detail-show-data-btn').on('click', () => {
        // console.log('detail-show-data-btn clicked!');
        //  display downtime table if not visible, otherwise hide it
        if (timeGraphElement.is(':visible')) {
            detailShowDataBtnLabel.html(lang[flags.pref.lang].general.showchartlbl);
            detailShowDataBtnIcon.removeClass('fa-table');
            detailShowDataBtnIcon.addClass('fa-chart-bar');
            flags.detailedlog.isGraphMode = false;
            // console.log('graphMode set to false');
            // console.log(flags.detailedlog.isGraphMode);
            tableContent.show();
            unprodTableElement.show();
            timeGraphElement.hide();
            setTimeout(() => {
                if (!$.isEmptyObject(flags.downtime.table)) {
                    flags.downtime.table.columns.adjust().draw();
                } else {
                    initDowntimeTable();
                }
            }, 250);
        } else {
            if (unproductiveTable.is(':visible')) {
                closeDowntimeSidePanel();
            }
            flags.detailedlog.isGraphMode = true;
            // console.log('graphMode set to true');
            detailShowDataBtnLabel.html(lang[flags.pref.lang].general.showdatalbl);
            detailShowDataBtnIcon.removeClass('fa-chart-bar');
            detailShowDataBtnIcon.addClass('fa-table');
            // console.log(flags.detailedlog.isGraphMode);
            unprodTableElement.hide();
            tableContent.hide();
            rerenderJOTimeChart();
        }
    });

    let refParam = joTimeChartSpecs();
    joTimeChart = new CustomTimechart({
        theme: `${flags.pref.theme}2`,
        axisY: { maximum: refParam.yAxisPt[refParam.yAxisPt.length - 1] + 100 },
    });
}

const rerenderJOTimeChart = () => {
    // console.log('rerenderJOTimeChart()');
    //  get machine id, dev id
    const detailDeviceElement = $('#detailDevice').val();
    const detailJobsElement = $('#detailJobs').val();
    // console.log(detailDeviceElement);
    // console.log(detailJobsElement);
    // console.log(joTimeChart);
    const timeGraphElement = $('#timegraph-container');
    const unprodTableSideBar = $('#detail-tab > .sidepanel');
    unprodTableSideBar.hide();
    $('#graphModal .snsPrompt').html(lang[flags.pref.lang].general.loading);
    $('#graphModal').modal('show');
    setTimeout(() => {
        // $('#detail-tab button.refresh-btn').trigger('click');
        $('#detail-refresh-btn').trigger('click');
        timeGraphElement.show();
        unprodTableSideBar.show();
        setTimeout(() => {
            $('#graphModal').modal('hide');
        }, 250);
    }, 250);
    // if (flags.currPage == 'detail-tab') {
    //  setTimeout(() => {
    //      joTimeChart.timechartObjects.chart.render();
    //  }, 250);
    // }
};

function lgDisplayModePrompt(state) {
    if (state == 'show') {
        $('#prefModal').modal('hide');
        $('#lgDispModal').modal('show');
    } else {
        $('#lgDispModal').modal('hide');
        $('#prefModal').modal('show');
    }
}

function tabSwitcherHandler() {
    switch (flags.config.pageIndex) {
        case 1:
            $('#viewDevicesTab').removeClass('active show');
            $('#mngDevicesTab').removeClass('active show');
            break;

        case 2:
            $('#viewClusterTab').removeClass('active show');
            $('#mngDevicesTab').removeClass('active show');
            break;

        case 3:
            $('#viewClusterTab').removeClass('active show');
            $('#viewDevicesTab').removeClass('active show');
            break;

        default:
            $('#viewDevicesTab').removeClass('active show');
            $('#mngDevicesTab').removeClass('active show');
            break;
    }
}
// old
const invalidChars = ['+', '-', 'e'];

const preventInvalidChars = (e) => {
    if (invalidChars.includes(e.key.toLowerCase())) {
        e.preventDefault();
    }
};

$('.num-input').on('keydown', preventInvalidChars);


function add_sched_end_clear_btn () {
    setTimeout(() => {
        if ($('#sched_end_clear').length == 0)
        {
            $('#ui-datepicker-div button.ui-datepicker-close').after("<button id=\"sched_end_clear\" class=\"ui-state-default ui-priority-primary ui-corner-all\">Clear</button>");
        }
    }, 1);
}

function updateDatepickerDisplay () {
    if (($(window).outerHeight() > 430) || ($(window).outerWidth() < 555))
    {
        return;
    }
    setTimeout(() => {
        // return;
        var position = {
            parent: {
                x: 0,
                y: 0
            }
        };
        var x = 0;
        var y = 0;
        var x_px;
        var y_px;
        var parent_width = $('#ui-datepicker-div').eq(0).outerWidth();
        var parent_height = $('#ui-datepicker-div').eq(0).outerHeight();
        var header_height = $('#ui-datepicker-div .ui-datepicker-header').eq(0).outerHeight();
    
        position.parent.x = $('#ui-datepicker-div').eq(0).offset().left;
        position.parent.y = $('#ui-datepicker-div').eq(0).offset().top;
    
        // Set position of timepicker
        // time picker is to be placed to right of calendar for schedule datetimepickers

        // console.log($('#ui-datepicker-div .ui-timepicker-div').outerWidth());
        // Set position to fixed first because it affects the width/height of #ui-timepicker-div
        $('#ui-datepicker-div .ui-timepicker-div').css({
            "position": "fixed",
        });
        // console.log($('#ui-datepicker-div .ui-timepicker-div').outerWidth());

        // Set heights
        $('#ui-datepicker-div .ui-datepicker-buttonpane').css({
            "height": "fit-content"
        });
        var buttonpane_height = $('#ui-datepicker-div .ui-datepicker-buttonpane').outerHeight();
        var timepicker_height = parent_height - header_height - buttonpane_height;
        var y_px = timepicker_height + "px";
        $('#ui-datepicker-div .ui-timepicker-div').css({
            "height": y_px
        });

        // var timepicker_height = $('#ui-datepicker-div .ui-timepicker-div').eq(0).outerHeight();
        var timepicker_width = $('#ui-datepicker-div .ui-timepicker-div').eq(0).outerWidth();
        x = position.parent.x + parent_width;
        y = position.parent.y + header_height;
        x_px = x + "px";
        y_px = y + "px";
        $('#ui-datepicker-div .ui-timepicker-div').css({
            "left": x_px,
            "top": y_px,
            "background-color": "white"
        });

        // Set position of buttonpane
        x = position.parent.x + parent_width;
        y = position.parent.y + timepicker_height + header_height;
        x_px = x + "px";
        y_px = y + "px";
        $('#ui-datepicker-div .ui-datepicker-buttonpane').css({
            "left": x_px,
            "top": y_px,
            "position": "fixed",
            "margin-top": 0
        });

        var x_px = timepicker_width + "px";
        $('#ui-datepicker-div .ui-datepicker-buttonpane').css({
            "width": x_px
        });

        // For date-tab datetimepicker, the position of timepicker and buttons are on left of
        // calendar instead.
        if (flags.currPage == 'date-tab')
        {
            x = position.parent.x - timepicker_width;
            x_px = x + "px";
            $('#ui-datepicker-div .ui-timepicker-div').css({
                "left": x
            });

            $('#ui-datepicker-div .ui-datepicker-buttonpane').css({
                "left": x
            });
        }


        // .ui-timepicker-div padding
        var timepicker_innerdl_height = $('#ui-datepicker-div .ui-timepicker-div dl').outerHeight();
        var padding_top = ((timepicker_height - timepicker_innerdl_height)/2) + "px";
        $('#ui-datepicker-div .ui-timepicker-div dl').css({
            "padding-top": padding_top
        });
    }, 1);
}
