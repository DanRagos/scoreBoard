var joTimeChart = '';

const joTimeChartSpecs = () => {
    const distBetweenInstance = 200;
    const htPerInstance = 100;
    let yAxisPt = [];
    for (let y = 0; y < 7; y++) {
        yAxisPt.push(distBetweenInstance * y);
    }

    return {
        distBetweenInstance: distBetweenInstance,
        htPerInstance: htPerInstance,
        yAxisPt: yAxisPt,
    };
};

const resetJOTimeChartPage = () => {
    const detailDeviceElement = $('#detail-detailDevice');
    const detailJobsElement = $('#detail-detailJobs');

    const nodevlbl = lang[flags.pref.lang].general.nodevlbl;
    const nojoblbl = lang[flags.pref.lang].general.nojoblbl;

    const noDevicesOption = `<option value="0" disabled selected hidden class="no-dev-lbl">${nodevlbl}</option>`;
    const noJobsOption = `<option value = "0" disabled selected hidden class="no-job-lbl>${nojoblbl}</option>`;

    detailDeviceElement.prop('disabled', true);
    detailJobsElement.prop('disabled', true);

    detailDeviceElement.html(noDevicesOption);
    detailJobsElement.html(noJobsOption);

    const viewBtn = $('#detail-tab.tab-pane .view-btn');
    viewBtn.removeClass('active');
    const i = $('#detail-tab.tab-pane .view-btn i');
    i.removeClass('text-success');

    // joTimeChart.displayNoData();
};

const labelFormat = (e) => {
    var suffixes = ['', 'K', 'M', 'B'];
    var order = Math.max(
        Math.floor(Math.log(Math.abs(e.value)) / Math.log(1000)),
        0
    );

    let newVal = parseFloat(parseFloat(e.value).toFixed(1));

    if (order > suffixes.length - 1) order = suffixes.length - 1;

    var suffix = suffixes[order];

    return `${newVal < 0 ? '-' : ''}${CanvasJS.formatNumber(
        Math.abs(newVal) / Math.pow(1000, order)
    )}${suffix}`;
};

class CustomTimechart {
    constructor(options) {
        /* If you change this order, please change also references inside toggleDataSeries function and defaultOption data object */
        this.timechartIndex = {
            JO: 6,
            WDT: 5,
            INH: 4,
            ST1: 3,
            ST2: 2,
            ST3: 1,
            ST4: 0,
        };

        this.defaultOptions = {
            animationEnabled: true,
            zoomEnabled: true,
            theme: 'light2',
            axisX: {
                stripLines: [
                    {
                        value: 0,
                        color: 'transparent',
                        label: 'Dummy Long Labellllllllllllll',
                        labelMaxWidth: 100,
                        labelPlacement: 'outside',
                        labelBackgroundColor: 'transparent',
                        labelFontColor: 'transparent',
                    },
                ],
                // interval: 10,
                labelFontSize: 12,
                minimum: 0,
                labelFormatter: labelFormat,
                titleFontSize: 16,
            },
            axisY: {
                labelFontSize: 18,
                titleFontSize: 16,
                margin: 100,
                minimum: 0,
                labelFormatter: (e) => {
                    return '';
                },
            },
            toolTip: {
                shared: false,
            },
            legend: {
                cursor: 'pointer',
                itemclick: (e) => {
                    if (
                        typeof e.dataSeries.visible === 'undefined' ||
                        e.dataSeries.visible
                    ) {
                        e.dataSeries.visible = false;
                    } else {
                        e.dataSeries.visible = true;
                    }
                    e.chart.render();
                },
                fontSize: 20,
            },
            rangeChanged: (e) => {
                this.renderTimechart(null, null, true);
            },
            rangeChanging: (e) => {
                this.zoomEventHandler(e);
                // this.renderTimechart(null, null, true, e);
            },
            data: [
                {
                    type: 'rangeArea',
                    name: 'STATE4',
                    color: 'red',
                    lineThickness: 0,
                    fillOpacity: 0.4,
                    showInLegend: false,
                    yValueFormatString: '#0',
                    dataPoints: [],
                },
                {
                    type: 'rangeArea',
                    name: 'STATE3',
                    color: 'yellow',
                    lineThickness: 0,
                    fillOpacity: 0.4,
                    showInLegend: false,
                    yValueFormatString: '#0',
                    dataPoints: [],
                },
                {
                    type: 'rangeArea',
                    name: 'STATE2',
                    color: 'green',
                    lineThickness: 0,
                    fillOpacity: 0.4,
                    showInLegend: false,
                    yValueFormatString: '#0',
                    dataPoints: [],
                },
                {
                    type: 'rangeArea',
                    name: 'STATE1',
                    color: 'aqua',
                    lineThickness: 0,
                    fillOpacity: 0.4,
                    showInLegend: false,
                    yValueFormatString: '#0',
                    dataPoints: [],
                },
                {
                    type: 'rangeArea',
                    name: 'INHIBIT',
                    color: 'tomato',
                    lineThickness: 0,
                    fillOpacity: 0.4,
                    showInLegend: false,
                    yValueFormatString: '#0',
                    dataPoints: [],
                },
                {
                    type: 'rangeArea',
                    name: 'WDT',
                    color: 'red',
                    lineThickness: 0,
                    fillOpacity: 0.4,
                    showInLegend: false,
                    yValueFormatString: '#0',
                    dataPoints: [],
                },
                {
                    type: 'rangeArea',
                    name: 'JO',
                    color: 'gray',
                    lineThickness: 0,
                    fillOpacity: 0.4,
                    showInLegend: false,
                    yValueFormatString: '#0',
                    dataPoints: [],
                },
            ],
        };

        this.timechartObjects = {
            selectedDevice: '',
            selectedJob: '',
            selectedJobLabel: '',
            chart: '',
            cachedData: {
                JO: [],
                WDT: [],
                INH: [],
                ST1: [],
                ST2: [],
                ST3: [],
                ST4: [],
            },
            fromProductivity: false,
        };

        this.loadOptions(options);
    }

    loadOptions = (options, callback) => {
        if (!$.isEmptyObject(options)) {
            Object.entries(options).map(([key, value]) => {
                try {
                    if (!$.isEmptyObject(this.timechartObjects.chart)) {
                        if (typeof value == 'string') {
                            this.timechartObjects.chart.options[key] = value;
                        } else {
                            this.timechartObjects.chart.options[key] = {
                                ...this.timechartObjects.chart.options[key],
                                ...value,
                            };
                        }
                    } else {
                        if (typeof value == 'string') {
                            this.defaultOptions[key] = value;
                        } else {
                            this.defaultOptions[key] = {
                                ...this.defaultOptions[key],
                                ...value,
                            };
                        }
                    }
                } catch (e) {
                    console.log(`Option ${key} does not exist`);
                }
            });
            if (!$.isEmptyObject(this.timechartObjects.chart)) {
                this.timechartObjects.chart.render();
                this.renderTimechart(null, null, true);
            }
            if (typeof callback == 'function') {
                return callback();
            }
        } else {
            if (!$.isEmptyObject(this.timechartObjects.chart)) {
                this.timechartObjects.chart.render();
            }
        }
    };

    initTimechartCustom = (options) => {
        setTimeout(() => {
            if ($.isEmptyObject(this.timechartObjects.chart)) {
                this.timechartObjects.chart = new CanvasJS.Chart(
                    'timegraph',
                    this.defaultOptions
                );
                this.loadOptions(options);
                this.eventHandlers();
            } else {
                this.loadOptions(options);
            }

            if (
                this.timechartObjects.selectedDevice != '' &&
                this.timechartObjects.selectedJob != ''
            ) {
                // console.log('jo timechart: data...');
                if (this.timechartObjects.fromProductivity) {
                    $('#detail-detailDevice').trigger('change');
                }
                this.getData(
                    {
                        devid: this.timechartObjects.selectedDevice,
                        schedid: this.timechartObjects.selectedJob,
                    },
                    () => {}
                );
            } else {
                this.getDevices()
                    .then((data) => {
                        enableDisplayButton();
                    })
                    .catch((err) => {
                        enableDisplayButton();
                        // showPrompt(err.msg, err.type);
                    });
            }
        }, 500);
    };

    getDeviceJobs = (deviceId) => {
        return new Promise((resolve, reject) => {
            var dataParam = { data: { id: deviceId } };
            //  do not check for today here, there is no today button in JO Time Chart tab.
            // if (flags.displayMode.others == 'today') {
            //     dataParam.url = 'php/getDeviceJOToday.php';
            // } else {
            if (!$('#detail-view-btn').hasClass('active')){
                return;
            } 
            dataParam.url = 'php/getDeviceJOView.php';
            dataParam.data.fr = addStartTime({
                dateString: $('.dateFr:not(.schedDate .dbmDate)').eq(0).val(),
            });
            dataParam.data.to = addEndTime({
                dateString: $('.dateTo:not(.schedDate .dbmDate)').eq(0).val(),
            });
            // }

            // console.log(dataParam.data);

            $.ajax({
                type: 'POST',
                url: dataParam.url,
                data: dataParam.data,
                dataType: 'json',
                async: true,
                success: function (data) {
                    /** Check if data is empty **/
                    if (!$.isEmptyObject(data)) {
                        const nojoblbl = lang[flags.pref.lang].general.nojoblbl;
                        var str = `<option value='0' disabled selected hidden class="no-job-lbl">${nojoblbl}</option>`;
                        for (var x = 0; x < data.length; x++) {
                            str += `<option value='${data[x].devdid}'>${data[x].devjob}</option>`;
                        }
                        resolve({ msg: str, type: 'Success' });
                    } else {
                        reject({
                            msg: lang[flags.pref.lang].timechart.prompts.nojob,
                            type: 'Error',
                        });
                    }
                },
                failed: function (err) {
                    reject({
                        msg: lang[flags.pref.lang].timechart.prompts.nosrv,
                        type: 'Failed',
                    });
                },
            });
        });
    };

    getDevices = () => {
        this.displayNoData(true);
        const nodevlbl = lang[flags.pref.lang].general.nodevlbl;
        const nojoblbl = lang[flags.pref.lang].general.nojoblbl;
        $('#detail-detailDevice').html(
            `<option value='0' hidden selected class="no-dev-lbl">${nodevlbl}</option>`
        );
        $('#detail-detailJobs').html(
            `<option value='0' hidden selected class="no-job-lbl">${nojoblbl}</option>`
        );
        $('#detail-detailJobs, #detail-detailDevice').prop('disabled', true);

        /* Clear Cached data */
        this.timechartObjects.cachedData = {
            ...this.timechartObjects.cachedData,
            JO: [],
            WDT: [],
            INH: [],
            ST1: [],
            ST2: [],
            ST3: [],
            ST4: [],
        };

        return new Promise((resolve, reject) => {
            let dateParam = getDateTimeNow('-');
            let dataParam = {};
            //  do not check for today here, there is no today button in JO Time Chart tab.
            // if(flags.displayMode.others == 'today') {
            //  dataParam.fr = dateParam.date + ' 00:00:00';
            //  dataParam.to = dateParam.date + ' 23:59:59';
            // } else {
            if (!$('#detail-view-btn').hasClass('active')){
                return;
            } 
            dataParam.fr = addStartTime({
                dateString: $('.dateFr:not(.schedDate .dbmDate)').eq(0).val(),
            });
            dataParam.to = addEndTime({
                dateString: $('.dateTo:not(.schedDate .dbmDate)').eq(0).val(),
            });
            // }

            // console.log(dataParam);

            $.ajax({
                type: 'POST',
                url: 'php/getDeviceByDate.php',
                data: dataParam,
                dataType: 'json',
                async: true,
                success: function (data) {
                    // console.log(data);
                    /** Check if data is empty **/
                    if (!$.isEmptyObject(data)) {
                        const nodevlbl = lang[flags.pref.lang].general.nodevlbl;
                        var str = `<option value="0" disabled selected hidden class="no-dev-lbl">${nodevlbl}</option>`;
                        for (var x = 0; x < data.length; x++) {
                            str += `<option value="${data[x].devdid}">${
                                data[x].devnme != '' && data[x].devnme != null
                                    ? data[x].devnme
                                    : data[x].devdid
                            }</option>`;
                        }
                        $('#detail-detailDevice').html(str);
                        $('#detail-detailDevice').prop('disabled', false);
                        resolve({ type: 'Success' });
                    } else {
                        reject({
                            msg: lang[flags.pref.lang].timechart.prompts.nodev,
                            type: 'Error',
                        });
                    }
                },
                failed: function () {
                    reject({
                        msg: lang[flags.pref.lang].timechart.prompts.nosrv,
                        type: 'Failed',
                    });
                },
            });
        });
    };

    resetJOTimeChartView = () => {
        // console.log('resetJOTimeChartView()');
        const resetBtn = $('button[state="reset"]');
        resetBtn.trigger('click');
    };

    getData = ({ devid, schedid }, callback) => {
        // console.log('getData');
        this.resetJOTimeChartView();

        var dateParam = getDateTimeNow('-');

        //  do not check for today here, there is no today button in JO Time Chart tab.
        let params = {
            devid: devid,
            schedid: schedid,
            interval: 1,
            intervalType: 'hour',
            // from:
            //     flags.displayMode.others == 'today'
            //         ? `${dateParam.date} 00:00:00`
            //         : $('.dateFr:not(.schedDate)').eq(0).val(),
            from: addStartTime({
                dateString: $('.dateFr:not(.schedDate .dbmDate)').eq(0).val(),
            }),
            // to:
            //     flags.displayMode.others == 'today'
            //         ? `${dateParam.date} 23:59:59`
            //         : $('.dateTo:not(.schedDate)').eq(0).val(),
            to: addEndTime({
                dateString: $('.dateTo:not(.schedDate .dbmDate)').eq(0).val(),
            }),
        };

        /* Always set to default - Axis x only */
        // this.timechartObjects.chart.axisX[0].set('interval', 10);
        params.interval =
            params.intervalType == 'hour'
                ? params.interval * 3600
                : params.interval * 60;

        /* Clear Cached data */
        this.timechartObjects.cachedData = {
            ...this.timechartObjects.cachedData,
            JO: [],
            WDT: [],
            INH: [],
            ST1: [],
            ST2: [],
            ST3: [],
            ST4: [],
        };

        let self = this;
        let objlink = { ...this.timechartObjects.cachedData };

        /* Loading Modal */
        //  05/10/2021 jacob: moved the loading modal to the change event handler
        // $('#graphModal .snsPrompt').html(lang[flags.pref.lang].general.loading);
        // $('#graphModal').modal('show');

        /* Downtime */
        const getUnproductiveData = (params, jobData, divisor) => {
            // console.log('getUnproductiveData()');
            $.ajax({
                type: 'POST',
                url: 'php/getUnproductivityData.php',
                data: params,
                dataType: 'json',
                async: true,
                success: function (data) {
                    // console.table(data);
                    // console.log(jobData);
                    $('#detail-tab label.last-update').html(
                        lang[flags.pref.lang].general.lastUpdate +
                            ': ' +
                            dateParam.dnt
                    );
                    if (!$.isEmptyObject(data)) {
                        data.map((item) => {
                            objlink[item.source].push(item);
                        });
                    }

                    objlink = { ...objlink, JO: jobData };
                    self.objlink = objlink;
                    self.divisor = divisor;
                    self.renderTimechart(objlink, divisor);

                    //  ***********************************************************************************
                    //  if we want to reuse the charting strategy found in Summary timechart,
                    //  comment out the self.renderTimeChart above, uncomment out the code inside this box.
                    //  also comment out the displayNoData method usages

                    // const processed = generateJOTimeChartData({rawData: objlink});
                    // const test = initializeJOTimeChart(
                    //     processed.xMinimum,
                    //     processed.xMaximum,
                    //     processed.test,
                    //     'dark2'
                    // );

                    // test.render();

                    //  ************************************************************************************

                    // get downtime table data
                    getDowntimeByDevIDSchedID(params.devid, params.schedid);
                },
                failed: function (err) {
                    if (typeof callback === 'function') {
                        callback();
                    }
                },
            });
        };

        const getUnproductiveDatav2 = (params, jobData, divisor) => {
            // console.log('getUnproductiveDatav2()');
            getDowntimeByDevIDSchedID(params.devid, params.schedid, (data) => {
                // console.table(data);
                // console.log(jobData);

                $('#detail-tab label.last-update').html(
                    lang[flags.pref.lang].general.lastUpdate +
                        ': ' +
                        dateParam.dnt
                );
                if (!$.isEmptyObject(data)) {
                    data.map((item) => {
                        let key = '';
                        switch (item.devdts) {
                            case 'INHIBIT':
                                key = 'INH';
                                break;
                            case 'WDT':
                                key = 'WDT';
                                break;
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
                        }
                        objlink[key].push({
                            job: item.devjob,
                            source: item.devdts,
                            start: item.devstt,
                            end: item.devend,
                            realend: item.realend,
                            duration: item.devdur * 60,
                        });
                    });
                }

                objlink = { ...objlink, JO: jobData };
                self.objlink = objlink;
                self.divisor = divisor;
                self.renderTimechart(objlink, divisor);
            });
        };

        /* CountA and CountB */
        $.ajax({
            type: 'POST',
            url: 'php/getProductiveJOTime.php',
            data: params,
            dataType: 'json',
            async: true,
            success: function (data) {
                if (!$.isEmptyObject(data)) {
                    // console.log('getProductiveJOTime');
                    // console.log(params);
                    /* Get the first timestamp for reference */
                    // getUnproductiveData(params, data, 60);
                    getUnproductiveDatav2(params, data, 60);
                    $('#detail-export-btn').prop('disabled',false);
                } else {
                    self.displayNoData();
                    $('#detail-export-btn').prop('disabled',true);
                }
                if (typeof callback === 'function') {
                    callback();
                }
            },
            failed: function (err) {
                self.displayNoData();
                if (typeof callback === 'function') {
                    callback();
                }
            },
        });
    };

    getGradientColor = (chart, key, ht) => {
        var gradient = chart.ctx.createLinearGradient(0, 0, 0, ht);

        switch (key) {
            case 'ST1':
                gradient.addColorStop(1, 'rgba(255,167,38,1)');
                gradient.addColorStop(0, 'rgba(255,167,38,0.1)');
                break;

            case 'ST2':
                gradient.addColorStop(1, 'rgba(33,150,243,1)');
                gradient.addColorStop(0, 'rgb(33,150,243,0.1)');
                break;

            case 'ST3':
                gradient.addColorStop(1, 'rgba(76,175,80,1)');
                gradient.addColorStop(0, 'rgba(76,175,80,0.1)');
                break;

            case 'ST4':
                gradient.addColorStop(1, 'rgba(194,24,91,1)');
                gradient.addColorStop(0, 'rgba(194,24,91,0.1)');
                break;

            case 'WDT':
                gradient.addColorStop(1, 'rgba(244,67,54,1)');
                gradient.addColorStop(0, 'rgba(244,67,54,0.1)');
                break;

            case 'INH':
                gradient.addColorStop(1, 'rgba(126,87,194,1)');
                gradient.addColorStop(0, 'rgba(126,87,194,0.1)');
                break;

            case 'JO':
                gradient.addColorStop(1, 'rgba(158,158,158,1)');
                gradient.addColorStop(0, 'rgba(158,158,158,0.1)');
                break;

            default:
                break;
        }

        return gradient;
    };

    getText = (key) => {
        switch (key) {
            case 'ST1':
                return 'STATE 1';

            case 'ST2':
                return 'STATE 2';

            case 'ST3':
                return 'STATE 3';

            case 'ST4':
                return 'STATE 4';

            case 'WDT':
                return 'WATCHDOG';

            case 'INH':
                return 'INHIBIT';

            case 'JO':
                return 'JOB';

            default:
                return;
        }
    };

    displayNoData = (forceRender = false) => {
        // console.log('displayNoData()');
        if (
            (this.timechartObjects.chart.options !== undefined &&
                this.timechartObjects.chart.options.data[0].dataPoints
                    .length === 0) ||
            forceRender
        ) {
            // No data is present
            var ctx = this.timechartObjects.chart.ctx;
            var width = this.timechartObjects.chart.width;
            var height = this.timechartObjects.chart.height;

            $('#detail-export-btn').prop('disabled',true);

            this.timechartObjects.cachedData = {
                JO: [],
                WDT: [],
                INH: [],
                ST1: [],
                ST2: [],
                ST3: [],
                ST4: [],
            };
            if (this.timechartObjects.chart.options === undefined) {
                this.timechartObjects.chart.render();
            }
            this.timechartObjects.chart.options.data.map((item) => {
                item.dataPoints = [];
            });
            this.timechartObjects.chart.options.axisX.title = '';
            // this.timechartObjects.chart.options.title = '';
            this.timechartObjects.chart.render();

            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '30px sans-serif';
            ctx.fillText('No data to display', width / 2, height / 2);
            ctx.restore();

            this.renderTimechart(null, null, true);
        }
    };

    eventHandlers = () => {
        let self = this;
        $('#detail-detailDevice').on('change', (e) => {
            this.detailDeviceChangeHandler(e.currentTarget.value);
        });

        $('#detail-detailJobs').on('change', (e) => {
            this.detailJobChangeHandler(e.currentTarget.value);
        });

        $(window).on('orientationchange, resize', () => {
            if (
                flags.currPage == 'detail-tab' &&
                flags.detailedlog.isGraphMode
            ) {
                setTimeout(() => {
                    self.renderTimechart(null, null, true);
                }, 250);
            }
        });

        $('#timegraph div.canvasjs-chart-toolbar button:eq(0)').on(
            'click',
            () => {
                self.renderTimechart(null, null, true);
            }
        );

        $('#detail-refresh-btn').on('click', () => {
            self.getData(
                {
                    devid: $('#detail-detailDevice').val(),
                    schedid: $('#detail-detailJobs').val(),
                },
                () => {}
            );
        });
    };

    textWithBg = (chart, text, instance, numOfInstances, offset, hasData) => {
        text = lang[flags.pref.lang].general[instance];
        const roundRect = (ctx, x, y, width, height, radius, fill, stroke) => {
            var cornerRadius = {
                upperLeft: 0,
                upperRight: 0,
                lowerLeft: 0,
                lowerRight: 0,
            };
            if (typeof stroke == 'undefined') {
                stroke = true;
            }
            if (typeof radius === 'object') {
                for (var side in radius) {
                    cornerRadius[side] = radius[side];
                }
            } else if (typeof radius === 'number') {
                cornerRadius = {
                    upperLeft: radius,
                    upperRight: radius,
                    lowerLeft: radius,
                    lowerRight: radius,
                };
            }

            ctx.beginPath();
            ctx.moveTo(x + cornerRadius.upperLeft, y);
            ctx.lineTo(x + width - cornerRadius.upperRight, y);
            ctx.quadraticCurveTo(
                x + width,
                y,
                x + width,
                y + cornerRadius.upperRight
            );
            ctx.lineTo(x + width, y + height - cornerRadius.lowerRight);
            ctx.quadraticCurveTo(
                x + width,
                y + height,
                x + width - cornerRadius.lowerRight,
                y + height
            );
            ctx.lineTo(x + cornerRadius.lowerLeft, y + height);
            ctx.quadraticCurveTo(
                x,
                y + height,
                x,
                y + height - cornerRadius.lowerLeft
            );
            ctx.lineTo(x, y + cornerRadius.upperLeft);
            ctx.quadraticCurveTo(x, y, x + cornerRadius.upperLeft, y);
            ctx.closePath();
            if (stroke) {
                ctx.stroke();
            }
            if (fill) {
                ctx.fill();
            }

            return ctx;
        };

        if (!$.isEmptyObject(chart)) {
            let ctx = chart.ctx;
            let width = chart.width;
            let height, labelOffset;

            if (hasData) {
                height = chart.height - 105;
                labelOffset =
                    this.timechartObjects.chart.axisX[0].labelFontSize -
                    (this.timechartObjects.chart.axisX[0].labelAngle == 0
                        ? 2
                        : 10);
            } else {
                height = chart.height - 73;
                labelOffset = 10;
            }

            let ht = height / (numOfInstances * 2),
                x = 15,
                y = ht * 2 * offset + labelOffset;

            ctx.save();
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.font = '12px sans-serif';
            ctx.fillStyle = this.getGradientColor(chart, instance, 100);
            ctx.strokeStyle = this.getGradientColor(chart, instance, 100);
            // ctx.fillRect(x, y, 80, ht);
            ctx = roundRect(ctx, x, y, 80, ht, 5, true, true);

            let w = ctx.measureText(text).width,
                h = parseInt(ctx.font.match(/\d+/), 10) / 2;

            x = x + 40 - w / 2;
            ctx.fillStyle = '#fff';
            ctx.fillText(text, x, y + ht / 2 - h / 2 - 1); // the minus 1 was i don't know just for me
            ctx.restore();
        }
    };

    originalInterval = -1;

    rerenderInfo = () => {
        if (this.dateRef === undefined) {
            return;
        }
        const jotimelbl = lang[flags.pref.lang].jotimechart.jotimeminutes;
        const jostartlbl = lang[flags.pref.lang].productivity.joStartTime;
        const joendlbl = lang[flags.pref.lang].productivity.joEndTime;
        this.timechartObjects.chart.options.axisX.title = `${jotimelbl} ( ${jostartlbl}: ${this.dateRef},   ${joendlbl}: ${this.endTime}`;

        if (this.isOnGoing === '1') {
            const lastupdatelbl = lang[flags.pref.lang].general.lastUpdate;
            this.timechartObjects.chart.options.axisX.title += `, ${lastupdatelbl}: ${moment().format(
                'YYYY-MM-DD HH:mm:ss'
            )} )`;
            $('#detail-refresh-btn').prop('disabled', false);
        } else {
            this.timechartObjects.chart.options.axisX.title += ` )`;
            $('#detail-refresh-btn').prop('disabled', true);
        }
    };

    renderTimechart = (dataRef, divisor, renderLabelOnly = false, e = null) => {
        // console.log('renderTimechart');
        let data,
            hasData = false;

        let minimum = 0;
        let maximum = 0;
        if (!$.isEmptyObject(dataRef)) {
            data = { ...dataRef };
            this.timechartObjects.cachedData = data;
            const JOData = dataRef['JO'];
            if (JOData.length !== 0) {
                minimum = 0;
                maximum = 0;
                JOData.forEach((j) => {
                    maximum += parseFloat(j.duration);
                });
                maximum = maximum / 60;
            }
        } else {
            data = { ...this.timechartObjects.cachedData };
        }

        let refParam = joTimeChartSpecs();

        if (!$.isEmptyObject(data.JO)) hasData = true;

        if (hasData && !renderLabelOnly) {
            let dateRef = data.JO[0].start;
            let endRef = data.JO[data.JO.length - 1].end;
            let isOnGoing = data.JO[data.JO.length - 1].ongoing;
            this.isOnGoing = isOnGoing;
            this.dateRef = dateRef;
            // console.table(data.JO);

            this.endTime = '';

            if (isOnGoing === '1') {
                const ongoinglbl = lang[flags.pref.lang].productivity.ongoing;
                this.endTime = ongoinglbl;
            } else {
                this.endTime = endRef;
            }

            // timechartIndex - for getting the right startpoint
            Object.entries(data).map(([key, value]) => {
                let index = this.timechartIndex[key];
                let yStartPt = refParam.yAxisPt[index];
                let ht = yStartPt + refParam.htPerInstance;
                let dataSeries = [];

                //  insertion of dummy data fixes the bug where the chart cannot be zoomed in.

                const dummy = {
                    x: 0,
                    y: [0, 0],
                    markerType: 'none',
                    toolTipContent: null,
                };
                dataSeries.push(dummy);

                value.map((item) => {
                    let startPoint = parseFloat(
                        (new Date(item.start) - new Date(dateRef)) /
                            (1000 * divisor)
                    );
                    if (startPoint < 0) {
                        // check end point
                        let endPoint = parseFloat(
                            (new Date(item.end) - new Date(dateRef)) /
                                (1000 * divisor)
                        );
                        if (endPoint > 0) {
                            //  modify startPoint so that it is 0.
                            startPoint = 0;
                        }
                    }
                    if (startPoint >= 0) {
                        let duration =
                            startPoint + parseFloat(item.duration) / divisor;

                        // pattern: x[0] = x[1], x[2] = x[3], y[0] = y[3] = [yStartPt, yStartPt], y[1] = y[2] = [yStartPt, ht]
                        const durationlbl = lang[flags.pref.lang].chart.duration;
                        const frlbl = lang[flags.pref.lang].chart.from;
                        const tolbl = lang[flags.pref.lang].chart.to;
                        const minlbl =
                            lang[flags.pref.lang].jotimechart.minplural;
                        [
                            { x: startPoint, y: [yStartPt, yStartPt] },
                            { x: startPoint, y: [yStartPt, ht] },
                            { x: duration, y: [yStartPt, ht] },
                            { x: duration, y: [yStartPt, yStartPt] },
                        ].map((pts) => {
                            const text = lang[flags.pref.lang].general[key];
                            dataSeries.push({
                                ...pts,
                                markerType: 'none',
                                toolTipContent: `${text}<br/>
                                    ${frlbl}: ${item.start}<br/>
                                    ${tolbl}: ${item.end}<br/>
                                    ${durationlbl}: ${
                                    item.duration != 0
                                            ? (parseFloat(item.duration) / divisor).toFixed(2)
                                        : parseFloat(item.duration).toFixed(2)
                                }${minlbl}`,
                            });
                        });
                    }
                });

                this.timechartObjects.chart.options.data[index] = {
                    ...this.timechartObjects.chart.options.data[index],
                    dataPoints: dataSeries,
                    color: this.getGradientColor(
                        this.timechartObjects.chart,
                        key,
                        refParam.htPerInstance
                    ),
                };
            });

            //  set max and min
            this.timechartObjects.chart.options.axisX.minimum = minimum;
            this.timechartObjects.chart.options.axisX.maximum = maximum;
            this.timechartObjects.chart.options.axisX.interval = null;
            // this.timechartObjects.chart.set('theme', `${flags.pref.theme}2`);
        }
        this.rerenderInfo();
        if (this.timechartObjects.chart !== '') {
            this.timechartObjects.chart.set('theme', `${flags.pref.theme}2`);
            this.timechartObjects.chart.render();
        }

        Object.entries(data).map(([key, value]) => {
            let index = this.timechartIndex[key];
            this.textWithBg(
                this.timechartObjects.chart,
                this.getText(key),
                key,
                refParam.yAxisPt.length - 1,
                refParam.yAxisPt.length - 1 - index,
                hasData
            );
        });
    };

    detailDeviceChangeHandler = (devID) => {
        console.log('detailDeviceChangeHandler()');
        this.timechartObjects.selectedDevice = devID;
        if (devID === '' || devID === null) {
            return;
        }
        this.getDeviceJobs(devID)
            .then((data) => {
                if (data.type != 'Success') showPrompt(data.msg, data.type);

                $('#detail-detailJobs').html(data.msg);
                $('#detail-detailJobs').prop('disabled', false);
                const devDropdown = $('#detail-detailDevice');
                devDropdown.val(devID);
            })
            .catch((err) => {
                showPrompt(err.msg, err.type);
                const nojoblbl = lang[flags.pref.lang].general.nojoblbl;
                $('#detail-detailJobs').html(
                    `<option value='0' hidden selected class="no-job-lbl">${nojoblbl}</option>`
                );
                $('#detail-detailJobs').prop('disabled', true);
            });
    };

    detailJobChangeHandler = (schedID, cb = () => {}) => {
        console.log('detailJobChangeHandler()');

        if (schedID === '' || schedID === null) {
            return;
        }

        this.timechartObjects.selectedJob = schedID;
        //  05/10/2021 jacob: loading modal moved here
        $('#graphModal .snsPrompt').html(lang[flags.pref.lang].general.loading);
        $('#graphModal').modal('show');

        setTimeout(() => {
            this.getData(
                {
                    devid: this.timechartObjects.selectedDevice,
                    schedid: schedID,
                },
                () => {
                    //  change value of dropdown on UI
                    const schedDropdown = $('#detail-detailJobs');
                    this.timechartObjects.selectedJobLabel = $(
                        '#detail-detailJobs option:selected'
                    ).html();
                }
            );
        }, 1000);
    };

    zoomEventHandler = (e) => {
        if (e.trigger === 'zoom') {
            const range =
                e.axisX[0].viewportMaximum - e.axisX[0].viewportMinimum;

            //  move the dummy data to the center, so that the padding is still in effect
            this.timechartObjects.chart.options.axisX.stripLines[0].value =
                (e.axisX[0].viewportMaximum + e.axisX[0].viewportMinimum) / 2;
            let interval = e.chart.axisX[0].interval;

            if (this.originalInterval === -1) {
                this.originalInterval = interval;
            }
            if (range <= 50) {
                const PIXEL_PER_LABEL = 70;
                const dataOnDisplay = $(window).width() / PIXEL_PER_LABEL;
                interval = Math.ceil(parseFloat(range) / dataOnDisplay);
            } else if (range <= 100) {
                interval = 10;
            } else if (range <= 200) {
                interval = 20;
            } else if (range <= 250) {
                interval = 25;
            } else if (range <= 500) {
                interval = 50;
            } else if (range <= 1500) {
                interval = 200;
            } else if (range <= 50000) {
                interval = 1500;
            } else if (range <= 150000) {
                interval = 25000;
            } else if (range <= 250000) {
                interval = 45000;
            } else if (range > 250000) {
                interval = 150000;
            }
            interval = Math.max(1, interval);

            const newInterval = interval;

            // console.log(`newInterval: ${newInterval}`);

            // const PIXEL_PER_LABEL = 70;
            // const dataOnDisplay = $(window).width() / PIXEL_PER_LABEL;

            this.timechartObjects.chart.axisX[0].set('interval', newInterval);

            if (range <= 500) {
                e.chart.axisX[0].set('labelFormatter', (e) => {
                    return e.value;
                });
            }
        } else if (e.trigger === 'reset') {
            this.timechartObjects.chart.axisX[0].set('interval', null);
            e.chart.axisX[0].set('labelFormatter', labelFormat);
        }
    };
}
