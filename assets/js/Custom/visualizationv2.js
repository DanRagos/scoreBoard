const graphIndex = {
    ST1: 0,
    ST2: 1,
    ST3: 2,
    ST4: 3,
    WDT: 4,
    INH: 5,
    GOODQTY: 6,
    CNTA: 7,
    CNTB: 8,
    CYCLE: 9,
    JOTIME: 10,
};

let originalInterval;

const visualObjects = {
    selectedDevice: '',
    selectedJob: '',
    selectedJobLabel: '',
    chart: '',
    graphType: '',
    cachedData: {
        productive: [],
        unproductive: [],
        maxX: 0,
        unproductiveInfo: {},
        joStart: '',
        joEnd: '',
        onGoingJob: false,
        lastUpdate: '',
        originalDataPointWidth: 0,
    },
    baseDate: '',
    intervalType: '',
    interval: 0,
    workingInterval: 0,
    dateTimeInterval: 0,
    zoomedInterval: 0,
    originalInterval: 0,
    originalIntervalMultiples: [],
    originalIntervalFactors: [],
};

const findFactors = ({number}) => {
    const factorsArray = [];
    for (let i = 1; i <= number; i++) {
        if (number % i === 0) {
            factorsArray.push(i);
        }
    }
    return factorsArray;
};

const divisibleByTwoFactors = ({number}) => {
    let currentNumber = number;
    const divisibleByTwoFactorsArray = [];
    while (currentNumber <= number && currentNumber >= 2) {
        currentNumber /= 2;
        if (currentNumber >= 2) {
            divisibleByTwoFactorsArray.push(currentNumber);
        }
    }
    return divisibleByTwoFactorsArray;
};

const findClosestNumber = ({number, numberList}) => {
    let closestVal = {number: 0, diff: -1};
    for (let i = 0; i < numberList.length; i++) {
        if (numberList[i] === number) {
            closestVal.number = number;
            break;
        }
        const diff = Math.abs(numberList[i] - number);
        if (closestVal.diff !== -1 && closestVal.diff < diff) {
            break;
        }
        closestVal.number = numberList[i];
        closestVal.diff = diff;
    }

    return closestVal.number;
};

const findMultiples = ({base, upTo}) => {
    if (base >= upTo) {
        return [upTo];
    }

    let multiplier = 1;
    let result = 0;

    const multiples = [];
    while (result < upTo) {
        result = base * multiplier++;
        if (result < upTo) {
            multiples.push(result);
        }
    }
    return multiples;
};


const changeInterval = (({viewportMin, viewportMax}) => {
    console.log('changeInterval');
    console.log(`viewportMin: ${viewportMin}`);
    console.log(`viewportMax: ${viewportMax}`);
    const range = viewportMax - viewportMin;
    //  move the dummy data to the cener, so that the padding is still in effect.
    visualObjects.chart.options.axisX[1].stripLines[0].value = (viewportMax + viewportMin) / 2;

    let interval = parseFloat(visualObjects.interval);
    const PIXEL_PER_LABEL = 70;
    const dataOnDisplay = $(window).width() / PIXEL_PER_LABEL;
    let newInterval = Math.max(1, parseFloat(range) / dataOnDisplay);

    //  format
    newInterval = Math.floor((newInterval / interval) * interval);
    if (newInterval === 0) {
        newInterval = interval;
    } else if (newInterval < visualObjects.originalInterval) {
        newInterval = parseFloat(visualObjects.originalInterval);
    }

    newInterval = findClosestNumber({number: newInterval, numberList: visualObjects.originalIntervalMultiples});

    visualObjects.chart.options.axisX[0].interval = newInterval;
    visualObjects.chart.options.axisX[1].interval = newInterval;

    visualObjects.zoomedInterval = newInterval;

    visualObjects.chart.render();

    if (visualObjects.graphType === 'GoodQty' || visualObjects.graphType === 'CycleTime') {
        const res = visualObjects.originalInterval / range;
        visualObjects.chart.set('dataPointWidth', Math.ceil(visualObjects.chart.axisX[0].bounds.width * res * 0.8), true);
    }

    return newInterval;
});


const zoomEventHandler = (e) => {
    // console.log('zoomEventHandler()');
    if (e.trigger === 'zoom') {
        let newIntervalInUse = changeInterval({viewportMin: e.axisX[0].viewportMinimum, viewportMax: e.axisX[0].viewportMaximum});
        newIntervalInUse = adjustLabels(visualObjects.cachedData.maxX, newIntervalInUse);

        // visualObjects.workingInterval = newIntervalInUse;
        // visualObjects.dateTimeInterval = newIntervalInUse;
    }

    if (e.trigger === 'reset') {
        console.log('reset');
        console.log(visualObjects.workingInterval);
        e.chart.options.axisX[0].interval = parseFloat(
            visualObjects.workingInterval
        );
        e.chart.options.axisX[1].interval = parseFloat(
            visualObjects.dateTimeInterval
        );
        visualObjects.zoomedInterval = visualObjects.workingInterval;


        if (visualObjects.graphType === 'GoodQty' || visualObjects.graphType === 'CycleTime') {
            visualObjects.chart.set('dataPointWidth', visualObjects.cachedData.originalDataPointWidth * 0.8 , true);
        }

        // let newIntervalInUse = changeInterval({viewportMin: e.axisX[0].viewportMinimum, viewportMax: e.axisX[0].viewportMaximum});
        // newIntervalInUse = adjustLabels(visualObjects.cachedData.maxX, newIntervalInUse);

        // visualObjects.workingInterval = newIntervalInUse;
        // visualObjects.dateTimeInterval = newIntervalInUse;

        // e.chart.render();

        let newIntervalInUse = changeInterval({viewportMin: visualObjects.chart.axisX[0].viewportMinimum, viewportMax: visualObjects.chart.axisX[0].viewportMaximum});
        newIntervalInUse = adjustLabels(visualObjects.cachedData.maxX, newIntervalInUse);

        visualObjects.workingInterval = newIntervalInUse;
        visualObjects.dateTimeInterval = newIntervalInUse;
    }
};

const toggleDataSeries = (e) => {
    // console.log('toggleDataSeries()');
    const nextIndex = e.dataSeriesIndex < 12 ? e.dataSeriesIndex : '';
    if (typeof e.dataSeries.visible === 'undefined' || e.dataSeries.visible) {
        e.dataSeries.visible = false;
        if (nextIndex !== '') {
            visualObjects.chart.options.data[nextIndex].visible = false;
        }
    } else {
        e.dataSeries.visible = true;
        if (nextIndex !== '') {
            visualObjects.chart.options.data[nextIndex].visible = true;
        }
    }
    e.chart.render();
};

const addSymbols = (e) => {
    const suffixes = ['', 'K', 'M', 'B'];
    const order = Math.max(
        Math.floor(Math.log(Math.abs(e.value)) / Math.log(1000)),
        0
    );

    if (order > suffixes.length - 1) order = suffixes.length - 1;

    const suffix = suffixes[order];

    return `${e.value < 0 ? '-' : ''}${CanvasJS.formatNumber(
        Math.abs(e.value) / Math.pow(1000, order)
    )}${suffix}`;
};

const defaultOptions = {
    animationEnabled: false,
    zoomEnabled: true,
    theme: 'light2',
    zoomType: 'xy',
    // title: {
    //     text: "Title docked inside the plot area",
    //     dockInsidePlotArea: true,
    //     fontSize: 16,
    //     padding: 25,
    //     fontWeight: "bold",
    //     fontColor: "#d3d3d3",
    //     backgroundColor: "#000",
    // },
    axisX: [
        {
            labelFontSize: 14,
            titleFontSize: 14,
            minimum: 0,
            labelFormatter: (e) => {
                //  hide tick label if greater than max data
                if (e.value > visualObjects.cachedData.maxX) {
                    return '';
                }
                return parseFloat(e.value.toFixed(1));
            },
            // labelFormatter: addSymbols,
        },
        {
            /** this adds spacing between the axis line/labels and title */
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
            labelFontSize: 10,
            titleFontSize: 14,
            /**Au: commented to remove timestamp - by LSJ 12.15 
             * Additional lines follow to remove xaxis line and ticks
             * uncomment to enable timestamp on x-axis then comment out the following lines
            */
            // minimum: 0,
            // labelFormatter: (e) => {
            //     let dateTimeLabel = xPositionToDate({
            //         startDate: visualObjects.baseDate,
            //         xPosition: e.value,
            //         unit: visualObjects.intervalType,
            //     }).format('HH:mm');

            //     //  hide tick label if greater than max data
            //     if (e.value > visualObjects.cachedData.maxX) {
            //         return '';
            //     }
            //     return dateTimeLabel || '';
            // },
            tickLength: 0,
            lineThickness: 0,
            labelFormatter: function(){
            return " ";
            },
        },
    ],
    axisY: {
        labelFontSize: 14,
        titleFontSize: 14,
        labelFormatter: addSymbols,
    },
    toolTip: {
        shared: true,
        borderColor: 'black',
        contentFormatter: function (e) {
            var content = ' ';
            let dataPointX;
            let hasProductive = false;

            for (var i = 0; i < e.entries.length; i++) {
                const name = e.entries[i].dataSeries.name;
                dataPointX = e.entries[i].dataPoint.x;

                const prodColor = e.entries[i].dataSeries.color;
                if (
                    name === 'cnt' ||
                    name === 'rej' ||
                    name === 'good' ||
                    name === 'cyc'
                ) {
                    const namelbl = lang[flags.pref.lang].productivity.legends[name];
                    hasProductive = true;
                    if (name === 'cyc') {
                        content +=
                            `<span style='color: ${prodColor}'>` +
                            namelbl +
                            `</span>` +
                            ' ' +
                            '<strong>' +
                            e.entries[i].dataPoint.y.toFixed(2) +
                            ' sec' + 
                            '</strong>';
                        content += '<br/>';
                    } else {
                        content +=
                            `<span style='color: ${prodColor}'>` +
                            namelbl +
                            `</span>` +
                            ' ' +
                            '<strong>' +
                            e.entries[i].dataPoint.y +
                            '</strong>';
                        content += '<br/>';
                    }
                }
            }

            const unprodLabels = {};

            const startlbl = lang[flags.pref.lang].productivity.start;
            const endlbl = lang[flags.pref.lang].productivity.end;
            const durationlbl = lang[flags.pref.lang].productivity.duration;
            if (hasProductive) {
                if (
                    visualObjects.cachedData.productiveInfo !== undefined &&
                    `${dataPointX}` in visualObjects.cachedData.productiveInfo
                ) {
                    const unprodArr =
                        visualObjects.cachedData.productiveInfo[
                            `${dataPointX}`
                        ];
                    // console.log('unprodArr');
                    // console.log(unprodArr);
                    unprodArr.forEach((i) => {
                        if (
                            visualObjects.chart.options.data[
                                graphIndex[`${i.label}`]
                            ].visible
                        ) {
                            if (!(i.label in unprodLabels)) {
                            //  should change to date comparison
                                if (
                                    dataPointX >= i.xStartPoint &&
                                    dataPointX <= i.xEndPoint
                                ) {
                                    unprodLabels[i.label] = i.label;
                                    const unprodlbl = lang[flags.pref.lang].general[i.label];
                                    const color =
                                        visualObjects.chart.options.data[
                                            graphIndex[`${i.label}`]
                                        ].color;
                                    content +=
                                        `<span style='color: ${color}'>` +
                                        unprodlbl +
                                        `</span>` +
                                        '<br />' +
                                        `<span style="margin-left: 5px"> ${startlbl}: ` +
                                        i.start +
                                        '</span>' +
                                        '<br />' +
                                        `<span style="margin-left: 5px"> ${endlbl}: ` +
                                        i.end +
                                        '</span>' +
                                        '<br />' +
                                        `<span style="margin-left: 5px"> ${durationlbl}: ` +
                                        i.duration +
                                        '</span>';
                                    content += '<br/>';
                                }
                            }
                        }
                    });
                }
            } else {
                if (
                    visualObjects.cachedData.unproductive !== undefined &&
                    `${dataPointX}` in visualObjects.cachedData.unproductiveInfo
                ) {
                    const unprodArr =
                        visualObjects.cachedData.unproductiveInfo[
                            `${dataPointX}`
                        ];
                    // console.log(unprodArr);
                    unprodArr.forEach((i) => {
                        
                            if (
                                visualObjects.chart.options.data[
                                    graphIndex[`${i.label}`]
                                ].visible
                            ) {
                                
                                if (!(i.label in unprodLabels)) {
                                    unprodLabels[i.label] = i.label;
                                    const unprodlbl = lang[flags.pref.lang].general[i.label];
                                    const color =
                                        visualObjects.chart.options.data[
                                            graphIndex[`${i.label}`]
                                        ].color;
                                    content +=
                                        `<span style='color: ${color}'>` +
                                        unprodlbl +
                                        `</span>` +
                                        '<br />' +
                                        `<span style="margin-left: 5px"> ${startlbl}: ` +
                                        i.start +
                                        '</span>' +
                                        '<br />' +
                                        `<span style="margin-left: 5px"> ${endlbl}: ` +
                                        i.end +
                                        '</span>' +
                                        '<br />' +
                                        `<span style="margin-left: 5px"> ${durationlbl}: ` +
                                        i.duration +
                                        '</span>';
                                    content += '<br/>';

                                    const inRange = i.inRange;
                                    // console.log(inRange);
                                    inRange.forEach((r) => {
                                        const d =
                                            visualObjects.cachedData.unproductiveInfo[
                                                `${r}`
                                            ];

                                        d.forEach((dd, index) => {
                                            
                                            if (!(dd.label in unprodLabels)) {
                                                unprodLabels[dd.label] = dd.label;
                                                const unprodlbl2 = lang[flags.pref.lang].general[dd.label];
                                                const color =
                                                    visualObjects.chart.options.data[
                                                        graphIndex[`${dd.label}`]
                                                    ].color;
                                                content +=
                                                `<span style='color: ${color}'>` +
                                                unprodlbl2 +
                                                `</span>` +
                                                '<br />' +
                                                `<span style="margin-left: 5px"> ${startlbl}: ` +
                                                dd.start +
                                                '</span>' +
                                                '<br />' +
                                                `<span style="margin-left: 5px"> ${endlbl}: ` +
                                                dd.end +
                                                '</span>' +
                                                '<br />' +
                                                `<span style="margin-left: 5px"> ${durationlbl}: ` +
                                                dd.duration +
                                                '</span>';
                                                content += '<br/>';
                                            }    
                                        });
                                        // console.log(unprodLabels)
                                    });
                                }
                            }
                    });
                }
            }
            
            if (content === ' ') {
                return null;
            }
            return content;
        },
    },
    legend: {
        cursor: 'pointer',
        itemclick: toggleDataSeries,
        fontSize: 16,
        fontWeight: 'normal',
    },
    rangeChanging: (e) => {
        zoomEventHandler(e);
    },
    data: [
        {
            type: 'rangeArea',
            name: 'STATE1',
            legendText: lang[flags.pref.lang].productivity.legends.st1,
            color: 'yellow',
            lineThickness: 0,
            fillOpacity: 0.4,
            markerType: 'none',
            showInLegend: true,
            yValueFormatString: '#0',
            dataPoints: [],
            minimum: 0,
            visible: true,
            toolTipContent: null,
            extraIndex: 0,
        },
        // {
        //     type: 'rangeArea',
        //     name: 'STATE1',
        //     legendText: 'STATE1',
        //     color: 'yellow',
        //     lineThickness: 0,
        //     fillOpacity: 0.4,
        //     markerType: 'none',
        //     showInLegend: false,
        //     yValueFormatString: '#0',
        //     dataPoints: [],
        //     minimum: 0,
        //     toolTipContent: null,
        // },
        {
            type: 'rangeArea',
            name: 'STATE2',
            legendText: lang[flags.pref.lang].productivity.legends.st2,
            color: 'blue',
            lineThickness: 0,
            fillOpacity: 0.4,
            markerType: 'none',
            showInLegend: true,
            yValueFormatString: '#0',
            dataPoints: [],
            minimum: 0,
            visible: true,
            toolTipContent: null,
            extraIndex: 1,
        },
        // {
        //     type: 'rangeArea',
        //     name: 'STATE2',
        //     legendText: 'STATE2',
        //     color: 'blue',
        //     lineThickness: 0,
        //     fillOpacity: 0.4,
        //     markerType: 'none',
        //     showInLegend: false,
        //     yValueFormatString: '#0',
        //     dataPoints: [],
        //     minimum: 0,
        //     toolTipContent: null,
        // },
        {
            type: 'rangeArea',
            name: 'STATE3',
            legendText: lang[flags.pref.lang].productivity.legends.st3,
            color: 'blue',
            lineThickness: 0,
            fillOpacity: 0.4,
            markerType: 'none',
            showInLegend: true,
            yValueFormatString: '#0',
            dataPoints: [],
            minimum: 0,
            visible: true,
            toolTipContent: null,
            extraIndex: 2,
        },
        // {
        //     type: 'rangeArea',
        //     name: 'STATE3',
        //     legendText: 'STATE3',
        //     color: 'blue',
        //     lineThickness: 0,
        //     fillOpacity: 0.4,
        //     markerType: 'none',
        //     showInLegend: false,
        //     yValueFormatString: '#0',
        //     dataPoints: [],
        //     minimum: 0,
        //     toolTipContent: null,
        // },
        {
            type: 'rangeArea',
            name: 'STATE4',
            legendText: 'STATE4',
            color: 'blue',
            lineThickness: 0,
            fillOpacity: 0.4,
            markerType: 'none',
            showInLegend: true,
            yValueFormatString: '#0',
            dataPoints: [],
            minimum: 0,
            visible: true,
            toolTipContent: null,
            extraIndex: 3,
        },
        // {
        //     type: 'rangeArea',
        //     name: 'STATE4',
        //     legendText: 'STATE4',
        //     color: 'blue',
        //     lineThickness: 0,
        //     fillOpacity: 0.4,
        //     markerType: 'none',
        //     showInLegend: false,
        //     yValueFormatString: '#0',
        //     dataPoints: [],
        //     minimum: 0,
        //     toolTipContent: null,
        // },
        {
            type: 'rangeArea',
            name: 'WDT',
            legendText: 'WDT',
            color: 'red',
            lineThickness: 0,
            fillOpacity: 0.4,
            markerType: 'none',
            showInLegend: true,
            yValueFormatString: '#0',
            dataPoints: [],
            minimum: 0,
            visible: true,
            toolTipContent: null,
            extraIndex: 4,
        },
        // {
        //     type: 'rangeArea',
        //     name: 'WDT',
        //     legendText: 'WDT',
        //     color: 'red',
        //     lineThickness: 0,
        //     fillOpacity: 0.4,
        //     markerType: 'none',
        //     showInLegend: false,
        //     yValueFormatString: '#0',
        //     dataPoints: [],
        //     minimum: 0,
        //     toolTipContent: null,
        // },
        {
            type: 'rangeArea',
            name: 'INH',
            color: 'violet',
            lineThickness: 0,
            fillOpacity: 0.4,
            markerType: 'none',
            showInLegend: true,
            yValueFormatString: '#0',
            dataPoints: [],
            minimum: 0,
            visible: true,
            toolTipContent: null,
            extraIndex: 5,
        },
        // {
        //     type: 'rangeArea',
        //     name: 'INH',
        //     color: 'violet',
        //     lineThickness: 0,
        //     fillOpacity: 0.4,
        //     markerType: 'none',
        //     showInLegend: false,
        //     yValueFormatString: '#0',
        //     dataPoints: [],
        //     minimum: 0,
        //     toolTipContent: null,
        // },
        {
            type: 'line',
            name: 'good',
            color: 'rgb(33,150,243)',
            showInLegend: true,
            yValueFormatString: '#0.##',
            dataPoints: [],
            minimum: 0,
            extraIndex: 6,
        },
        {
            type: 'line',
            name: 'cnt',
            color: 'green',
            showInLegend: true,
            yValueFormatString: '#0.##',
            dataPoints: [],
            minimum: 0,
            extraIndex: 7,
        },
        {
            type: 'line',
            name: 'rej',
            color: 'red',
            showInLegend: true,
            yValueFormatString: '#0.##',
            dataPoints: [],
            minimum: 0,
            extraIndex: 8,
        },
        {
            type: 'line',
            name: 'cyc',
            color: 'rgb(33,150,243)',
            showInLegend: true,
            yValueFormatString: '#0.##',
            dataPoints: [],
            minimum: 0,
            extraIndex: 9,
        },
        {
            name: 'JO Time',
            // axisXIndex: 1,  //Au: uncomment to enable timestamp on x-axis
            dataPoints: [],
            minimum: 0,
            color: 'rgba(225, 255, 255, 0)',
            toolTipContent: null,
        },
    ],
};

const initVisualization = (options) => {
    console.trace();
    console.log('initVisualization()');

    $('#productivity-export-btn').attr('disabled',true);
    if (visualObjects.chart !== '') {
        // http-1201 Bug #16 fix
        $('#productivity-export-btn').attr('disabled',false);
        return;
    }
    defaultOptions.theme = options.theme;
    visualObjects.chart = new CanvasJS.Chart(
        'visual-container',
        defaultOptions
    );
    visualEventHandlers();
    // console.log(visualObjects);
    if (
        (visualObjects.selectedDevice !== '' ||
        visualObjects.selectedJob !== '')
    ) {
        getData({
            devid: visualObjects.selectedDevice,
            schedid: visualObjects.selectedJob,
        });
    } else {
        getVisualDevices()
        .then((data) => {
            enableDisplayButton();
        })
        .catch((err) => {
            enableDisplayButton();
            const viewBtn = $('.tab-pane.show .view-btn');
            viewBtn.removeClass('active');
            const i = $('.tab-pane.show .view-btn i');
            i.removeClass('text-success');
            // showPrompt(err.msg, err.type);
        });
    }
};

const changeVisualizationTheme = (options) => {
    visualObjects.chart.set("theme", options.theme);
}

const visualEventHandlers = () => {

    //  refresh button
    $('#visual-refresh-btn').on('click', () => {
        getData({
            devid: visualObjects.selectedDevice,
            schedid: visualObjects.selectedJob,
        });
    });

    let inputTimer;
    function debounce(func, timeout = 300) {
        return (...args) => {
            clearTimeout(inputTimer);
            inputTimer = setTimeout(() => {
                func.apply(this, args);
            }, timeout);
        };
    }

    const intervalHandler = () => {
        const inputElem = $('#productivity-interval input');
        inputElem.prop('disabled', true);
        const val = inputElem.val();
        if (val <= 0) {
            inputElem.val(1);
        }
        const elem = $('div.btn-group.interval-input button.active');

        checkInterval();

        //  load new data here
        getData({
            devid: visualObjects.selectedDevice,
            schedid: visualObjects.selectedJob,
        });
        inputElem.prop('disabled', false);
    };

    const intervalInputElement = $('#productivity-interval input');

    intervalInputElement.on(
        'input',
        debounce(() => intervalHandler(), 3000)
    );

    intervalInputElement.on('keyup', (e) => {
        // console.log('keyup');
        const inKey = e.which || e.keyCode;
        if (inKey === 13) {
            clearTimeout(inputTimer);
            intervalHandler();
        }

    });

    intervalInputElement.on('keydown', (e) => {
        if (e.key === '.') {
            e.preventDefault();
        }
    });

    intervalInputElement.on('input', (e) => {
        // console.log('input');
        const inputElem = intervalInputElement;
        const value = inputElem.val();
        // console.log(value);
        if (value.length > 5) {
            // console.log('greater than 5!');
            inputElem.val(value.slice(0, 5));
            e.preventDefault();
        }
    });

    $('#visualDevice').on('change', (e) => {
        // console.log('#visualDevice change event');
        visualObjects.selectedDevice = e.currentTarget.value;
        getVisualDeviceJobs(e.currentTarget.value)
            .then((data) => {
                if (data.type != 'Success') showPrompt(data.msg, data.type);

                $('#visualJobs').html(data.msg);
                $('#visualJobs').prop('disabled', false);
            })
            .catch((err) => {
                showPrompt(err.msg, err.type);
                const nojoblbl = lang[flags.pref.lang].general.nojoblbl;
                $('#visualJobs').html(
                    `<option value='0' hidden selected class="no-job-lbl">${nojoblbl}</option>`
                );
                $('#visualJobs').prop('disabled', true);
            });
    });

    $('#visualJobs').on('change', (e) => {
        visualObjects.selectedJob = e.currentTarget.value;
        visualObjects.selectedJobLabel = $('#visualJobs option:selected').html();

        // $('#switch-detail-data-btn').prop('disabled', false);
        // visualObjects.selectedJobLabel
        let duration =
            e.currentTarget[e.currentTarget.selectedIndex].attributes[
                'data-duration'
            ].value;
        duration /=
            $('#productivity-interval-btn-group')
                .find('button.active')
                .eq(0)
                .attr('id') === 'hrlbl'
                ? 3600
                : 60;
        duration /= 100;
        if (duration < 1) {
            duration = 1;
        }
        intervalInputElement.val(Math.round(duration));

        checkInterval();

        console.log(visualObjects);

        getData({
            devid: visualObjects.selectedDevice,
            schedid: visualObjects.selectedJob,
        });

    });

    $('#productivity-interval-btn-group button').on('click', (e) => {
        const elem = $(e.currentTarget);
        $('#productivity-interval-btn-group')
            .find('button')
            .each(function () {
                $(this).removeClass('active');
            });
        elem.addClass('active');

        checkInterval();
        // console.log(elem.html());

        getData({
            devid: visualObjects.selectedDevice,
            schedid: visualObjects.selectedJob,
        });
    });

    $('#productivity-chart-btn-group button').on('click', (e) => {
        const elem = $(e.currentTarget);
        $('#productivity-chart-btn-group')
            .find('button')
            .each(function () {
                $(this).removeClass('active');
            });
        elem.addClass('active');

        renderVisualization({
            graphType: elem.attr('id'),
            intervalType: $('#productivity-interval-btn-group')
                .find('button.active')
                .eq(0)
                .attr('id') === 'hrlbl' ? 'hour' : 'minute'
        });
    });

    $('#productivity-refresh-btn').on('click', () => {
        // console.log('refresh button clicked!');
        // const elem = $(e.currentTarget);
        getData({
            devid: visualObjects.selectedDevice,
            schedid: visualObjects.selectedJob,
        });
    });

    $(window).on('orientationchange, resize', () => {
        if (flags.currPage == 'visual-tab') {
            if (
                visualObjects.chart !== '' &&
                visualObjects.cachedData.productive[0] !== undefined
            ) {
                let newIntervalInUse = changeInterval({viewportMin: visualObjects.chart.axisX[0].viewportMinimum, viewportMax: visualObjects.chart.axisX[0].viewportMaximum});
                newIntervalInUse = adjustLabels(visualObjects.cachedData.maxX, newIntervalInUse);
        
                visualObjects.workingInterval = newIntervalInUse;
                visualObjects.dateTimeInterval = newIntervalInUse;
            }
        }
    });
};

const getData = ({ devid, schedid }) => {
    clearDataSeries();

    if (devid === null || schedid === null) {
        return;
    }

    console.log('getData()');
    // console.log(`devid: ${devid}`);
    // console.log(`schedid: ${schedid}`);

    // const intervalElement = $('#visual-addl-btn input');
    // const intervalElemValue = intervalElement.val();
    const intervalElement = $('#productivity-interval input');
    const intervalElemValue = intervalElement.val();

    visualObjects.interval = intervalElemValue;
    visualObjects.workingInterval = visualObjects.interval;
    visualObjects.originalInterval = visualObjects.interval;

    visualObjects.originalIntervalFactors = findFactors({number: visualObjects.interval});
    const otherFactors = divisibleByTwoFactors({number: visualObjects.interval});

    visualObjects.originalIntervalFactors = [...new Set(visualObjects.originalIntervalFactors.concat(...otherFactors))];

    visualObjects.originalIntervalFactors.sort((a, b) => {
        return a - b;
    });

    const params = {
        devid,
        schedid,
        interval: intervalElemValue,
        intervalType: $('#productivity-interval-btn-group')
            .find('button.active')
            .eq(0)
            .attr('id') === 'hrlbl' ? 'hour' : 'minute',
        from: addStartTime({dateString: $('.dateFr:not(.schedDate .dbmDate)').eq(0).val()}),
        to: addEndTime({dateString: $('.dateTo:not(.schedDate .dbmDate)').eq(0).val()}),
    };
    params.interval =
        params.intervalType == 'hour'
            ? params.interval * 3600
            : params.interval * 60;

    /* Clear Cached data */
    visualObjects.cachedData = {
        productive: [],
        unproductive: [],
        maxX: 0,
        unproductiveInfo: {},
    };

    //  unproductive data
    const getUnproductiveData = (params) => {
        flags.ajaxRequestStatus = $.ajax({
            type: 'POST',
            url: 'php/getUnproductivityData.php',
            data: params,
            dataType: 'json',
            async: true,
            success: function (data) {
                visualObjects.cachedData.unproductive = data;
                flags.ajaxRequestStatus = null;
                visualObjects.cachedData.lastUpdate = moment().format('YYYY-MM-DD HH:mm:ss');
                /* Render the right chart */
                renderVisualization({
                    graphType: $(
                        '#productivity-chart-btn-group > button.active'
                    ).attr('id'),
                    intervalType: params.intervalType,
                });
            },
            failed: function (err) {
                if (flags.ajaxRequestStatus != null) {
                    flags.ajaxRequestStatus.abort();
                    flags.ajaxRequestStatus = null;
                }
                /* Render the right chart */
                renderVisualization({
                    graphType: $(
                        'div.btn-group.visual-type > button.active'
                    ).attr('id'),
                    intervalType: params.intervalType,
                });
            },
        });
    };

    /* CountA and CountB */
    flags.ajaxRequestStatus = $.ajax({
        type: 'POST',
        url: 'php/getProductivityData.php',
        data: params,
        dataType: 'json',
        async: true,
        success: function (data) {
            console.log('getProductivityData.php');
            visualObjects.cachedData.productive = data;
            flags.ajaxRequestStatus = null;
            if (!$.isEmptyObject(data)) {
                getUnproductiveData(params);
                $('#productivity-export-btn').attr('disabled',false);
            } else {
                $('#productivityTbl tbody tr td.dataTables_empty').html(lang[flags.pref.lang].general.datatable.empty);
                $('#productivity-export-btn').attr('disabled',true);
            }
        },
        failed: function (err) {
            if (flags.ajaxRequestStatus != null) {
                flags.ajaxRequestStatus.abort();
                flags.ajaxRequestStatus = null;
            }
            console.log('error');
        },
    });
};

const getVisualDeviceJobs = (deviceId) => {
    console.log('getVisualDeviceJobs()');
    if (deviceId === '') {
        return;
    }
    
    if (!$('#productivity-view-btn').hasClass('active')){
        return;
    }

    return new Promise((resolve, reject) => {
        const dataParam = { data: { id: deviceId } };
        dataParam.url = 'php/getDeviceJOView.php';
        dataParam.data.fr = addStartTime({dateString: $('.dateFr:not(.schedDate .dbmDate)').eq(0).val()}); 
        dataParam.data.to = addEndTime({dateString: $('.dateTo:not(.schedDate .dbmDate)').eq(0).val()});

        flags.ajaxRequestStatus = $.ajax({
            type: 'POST',
            url: dataParam.url,
            data: dataParam.data,
            dataType: 'json',
            async: true,
            success: (data) => {
                flags.ajaxRequestStatus = null;
                if (!$.isEmptyObject(data)) {
                    const nojoblbl = lang[flags.pref.lang].general.nojoblbl;
                    let str = `<option value='0' disabled selected hidden class="no-job-lbl">${nojoblbl}</option>`;
                    for (let x = 0; x < data.length; x++) {
                        str += `<option value='${data[x].devdid}' data-duration='${data[x].duration}'>${data[x].devjob}</option>`;
                    }
                    resolve({ msg: str, type: 'Success' });
                } else {
                    reject({
                        msg: lang[flags.pref.lang].timechart.prompts.nojob,
                        type: 'Error',
                    });
                }
            },
            failed: (err) => {
                if (flags.ajaxRequestStatus != null) {
                    flags.ajaxRequestStatus.abort();
                    flags.ajaxRequestStatus = null;
                }
                reject({ msg: lang[flags.pref.lang].timechart.prompts.nosrv, type: 'Failed' });
            },
        });
    });
};

const getVisualDevices = () => {
    const nodevlbl = lang[flags.pref.lang].general.nodevlbl;
    $('#visualDevice').html(
        `<option value='0' hidden selected class="no-dev-lbl">${nodevlbl}</option>`
    );
    const nojoblbl = lang[flags.pref.lang].general.nojoblbl;
    $('#visualJobs').html(
        `<option value='0' hidden selected class="no-job-lbl">${nojoblbl}</option>`
    );
    $('#visualJobs, #visualDevice').prop('disabled', true);

    /* Clear Cached data */
    visualObjects.cachedData = {
        productive: [],
        unproductive: [],
        maxX: 0,
        unproductiveInfo: {},
    };

    // resetVisualizationPage();

    const viewBtn = $('#visual-tab.tab-pane .view-btn');
    viewBtn.addClass('active');
    const i = $('#visual-tab.tab-pane .view-btn i');
    i.addClass('text-success');

    // if (!$('#productivity-view-btn').hasClass('active')){
    //     return false;
    // }
    
    return new Promise((resolve, reject) => {
        let dateParam = getDateTimeNow('-');
        let dataParam = {};

        if (!$('#productivity-view-btn').hasClass('active')){
            return reject(false);
        }

        dataParam.fr = addStartTime({dateString: $('.dateFr:not(.schedDate .dbmDate)').eq(0).val()});
        dataParam.to = addEndTime({dateString: $('.dateTo:not(.schedDate .dbmDate)').eq(0).val()});

        // console.log(dataParam);

        flags.ajaxRequestStatus = $.ajax({
            type: 'POST',
            url: 'php/getDeviceByDate.php',
            data: dataParam,
            dataType: 'json',
            async: true,
            success: function (data) {
                console.log('getDeviceByDate result');
                $('#productivity-export-btn').attr('disabled',true);
                // console.table(data);
                /** Check if data is empty **/
                flags.ajaxRequestStatus = null;
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
                    $('#visualDevice').html(str);
                    $('#visualDevice').prop('disabled', false);
                    resolve({ type: 'Success' });
                } else {
                    reject({ msg: lang[flags.pref.lang].timechart.prompts.nodev, type: 'Error' });
                }
            },
            failed: function () {
                if (flags.ajaxRequestStatus != null) {
                    flags.ajaxRequestStatus.abort();
                    flags.ajaxRequestStatus = null;
                }

                reject({ msg: lang[flags.pref.lang].timechart.prompts.nosrv, type: 'Failed' });
            },
        });
    });
};

const handleVisualDate = () => {
    // console.log('handleVisualDate()');
    resetVisualizationPage();
    // flags.productivity.processedTableData = null;
    rerenderProductivityTable();
    getVisualDevices()
        .then((data) => {
            enableDisplayButton();
        })
        .catch((err) => {
            enableDisplayButton();
            showPrompt(err.msg, err.type);
        });
};

const xPositionToDate = ({ startDate, xPosition, unit }) => {
    // let dateResult = moment(startDate).startOf('hour');
    // let dateResult = moment(startDate).startOf('minute');
    let dateResult = moment(startDate);
    if (unit === 'MINUTE') {
        dateResult = dateResult.add(xPosition, 'minutes');
    } else if (unit === 'HOUR') {
        dateResult = dateResult.add(xPosition, 'hours');
    }
    return dateResult;
};

const dateToXPosition = ({ baseDate, date, unit }) => {
    const baseDateMoment = moment(baseDate);
    const dateMoment = moment(date);
    let diff;
    if (unit === 'MINUTE') {
        diff = dateMoment.diff(baseDateMoment, 'minutes', true);
    } else if (unit === 'HOUR') {
        diff = dateMoment.diff(baseDateMoment, 'hours', true);
    }
    // return Math.round(diff);
    return diff;
};

const xAxisLabelFormatter = (dataPoints) => {
    //  get first and last datapoint
    const length = dataPoints.length;
    const firstDataPoint = dataPoints[0];
    const lastDataPoint = dataPoints[length - 1];
    const momentStart = moment(firstDataPoint.x);
    const momentEnd = moment(lastDataPoint.x);
    const diff = momentEnd.diff(momentStart, 'days');
    if (diff > 0) {
        return 'MMM-DD HH:mm';
    } else {
        return 'HH:mm';
    }
};

const resetView = () => {
    const resetButton = $('button[state="reset"]');
    if (resetButton) {
        resetButton.trigger('click');
    }
};

const checkInterval = () => {
    const intervalElement = $('#productivity-interval input');
    const intervalElementValue = intervalElement.val();

    let newValue = intervalElementValue;

    //console.log(`checkInterval()`);
    //console.log(intervalElementValue);
    const fixedValue =  parseFloat(parseFloat(intervalElementValue).toFixed(1));
    //console.log(fixedValue);
    const intervalType = $('#productivity-interval-btn-group > .active').attr('id') === 'hrlbl' ? 'hour' : 'minute';

    let limit;
    switch (intervalType) {
        case 'minute':
            limit = 240;
            break;
        case 'hour':
            limit = 24;
            break;
    }

    if (intervalElementValue > limit) {
        newValue = limit;
        // intervalElement.val(limit);
    }

    if (intervalElementValue <= 1)  {
        newValue = 1;
        // intervalElement.val(1);
    }

    intervalElement.val(parseFloat(parseFloat(newValue).toFixed(1)));

    // intervalElement.val(parseFloat(intervalElementValue.toFixed(1)));
    
}

const renderVisualization = ({ graphType, intervalType }) => {
    console.log('renderVisualization()');
    console.log(graphType);
    if (visualObjects.cachedData.productive === null) {
        return;
    }
    // console.log(intervalType);
    // console.log(visualObjects.cachedData);
    // console.log(visualObjects.chart);

    const intervalElement = $('#productivity-interval input');
    let intervalVal = intervalElement.val();
    // console.log(intervalVal);

    // if (intervalVal < 1) {
    //     intervalElement.val(1);
    //     intervalVal = 1;
    // }

    // let limit;
    // switch (intervalType) {
    //     case 'minute':
    //         limit = 59;
    //         break;
    //     case 'hour':
    //         limit = 23;
    //         break;
    // }

    // if (intervalVal > limit) {
    //     console.log('hit limit');
    //     intervalElement.val(limit);
    //     intervalVal = limit;
    // }

    //  reinitialize
    visualObjects.chart = new CanvasJS.Chart(
        'visual-container',
        defaultOptions
    );

    clearDataSeries();

    const getUnproductiveDataGraphs = (
        { divisor, dateRef, min, maxCount },
        callback
    ) => {
        const dataSeries = {
            ST1: {
                index: graphIndex.ST1,
                data: [],
            },
            ST2: {
                index: graphIndex.ST2,
                data: [],
            },
            ST3: {
                index: graphIndex.ST3,
                data: [],
            },
            ST4: {
                index: graphIndex.ST4,
                data: [],
            },
            WDT: {
                index: graphIndex.WDT,
                data: [],
            },
            INH: {
                index: graphIndex.INH,
                data: [],
            },
        };

        // visualObjects.cachedData.unproductive.map((item) => {
        //     const startPoint = parseFloat(
        //         Math.abs(new Date(dateRef) - new Date(item.start)) /
        //             (1000 * divisor)
        //     );
        //     const duration = startPoint + parseFloat(item.duration) / divisor;

        //     [
        //         { x: startPoint, y: 0 },
        //         { x: startPoint, y: maxCount },
        //         { x: duration, y: maxCount },
        //         { x: duration, y: 0 },
        //     ].map((pts) => {
        //         dataSeries[item.source].data.push({
        //             ...pts,
        //             markerType: 'none',
        //             toolTipContent: `${item.source}`,
        //         });
        //         if (min <= 0) {
        //             const invY = { ...pts, y: pts.y == maxCount ? min : pts.y };
        //             dataSeries[`${item.source}INV`].data.push({
        //                 ...invY,
        //                 markerType: 'none',
        //                 toolTipContent: `${item.source}`,
        //             });
        //         }
        //     });
        // });

        // console.log('unprod dataseries');
        // console.log(dataSeries);
    };

    //  fixes runtime errors
    if (visualObjects.cachedData.productive[0] === undefined) {
        return;
    }

    const { dataPoints, dateTimePoints, min, max, tableData } = processData({
        interval: intervalVal,
        intervalType,
        data: visualObjects.cachedData.productive,
    });

    // console.log('dataPoints');
    // console.table(dataPoints);

    flags.productivity.tableData = tableData;

    const devId = $('#visualDevice').val();
    const jobId = $('#visualJobs').val();

    const devName = $(`#visualDevice option[value="${devId}"]`).html();
    const jobName = $(`#visualJobs option[value="${jobId}"]`).html();

    flags.productivity.devName = devName;
    flags.productivity.jobName = jobName;

    // console.log('processed data');
    // console.log(dataPoints);
    // console.log(dateTimePoints);
    // console.log(graphType);

    // console.log(min);
    // console.log(max);

    let minimumXValue = 0;
    let maximumXValue = 0;

    // console.log('max');
    // console.log(max);

    switch (graphType) {
        case 'overviewlbl':
            visualObjects.graphType = 'Overview';
            visualObjects.chart.options.axisY.title = 'Quantity (Accumulated)';
            const dataSeries = {
                CNTA: {
                    index: graphIndex.CNTA,
                    data: [],
                },
                CNTB: {
                    index: graphIndex.CNTB,
                    data: [],
                },
                GOODQTY: {
                    index: graphIndex.GOODQTY,
                    data: [],
                },
                JOTIME: {
                    index: graphIndex.JOTIME,
                    data: [],
                },
            };

            let totalOutput = 0;
            let totalCount = 0;
            let totalReject = 0;

            for(let i = 0; i < dataPoints.length - 1; i++) {
                const item = dataPoints[i];
                totalOutput += item.extraCntA - item.extraCntB;
                totalCount += item.extraCntA;
                totalReject += item.extraCntB;

                dataSeries.GOODQTY.data.push({
                    ...item,
                    x: item.x,
                    y: totalOutput,
                });
                dataSeries.CNTA.data.push({
                    ...item,
                    x: item.x,
                    y: totalCount,
                });
                dataSeries.CNTB.data.push({
                    ...item,
                    x: item.x,
                    y: totalReject,
                });
                minimumXValue = Math.min(
                    minimumXValue,
                    Math.min(
                        Math.min(
                            Math.min(totalCount, totalReject),
                            totalOutput
                        ),
                        0
                    )
                );
                maximumXValue = Math.max(
                    maximumXValue,
                    Math.max(Math.max(totalCount, totalReject), totalOutput)
                );
            }

            const lastDataOverview = dataPoints[dataPoints.length - 1];
            totalOutput += lastDataOverview.extraCntA - lastDataOverview.extraCntB;
            totalCount += lastDataOverview.extraCntA;
            totalReject += lastDataOverview.extraCntB;
            let newXValueOverview = 0;
            if (dataPoints.length > 1) {
                newXValueOverview = dataPoints[dataPoints.length - 2].x + parseInt(visualObjects.originalInterval);
            }
            dataSeries.GOODQTY.data.push({
                ...lastDataOverview,
                x: newXValueOverview,
                y: totalOutput
            });

            dataSeries.CNTA.data.push({
                ...lastDataOverview,
                x: newXValueOverview,
                y: totalCount
            });

            dataSeries.CNTB.data.push({
                ...lastDataOverview,
                x: newXValueOverview,
                y: totalReject
            });

            maximumXValue = Math.max(
                maximumXValue,
                Math.max(Math.max(totalCount, totalReject), totalOutput)
            );

            // dataPoints.forEach((item) => {
            //     totalOutput += item.extraCntA - item.extraCntB;
            //     totalCount += item.extraCntA;
            //     totalReject += item.extraCntB;

            //     dataSeries.GOODQTY.data.push({
            //         ...item,
            //         x: item.x,
            //         y: totalOutput,
            //     });
            //     dataSeries.CNTA.data.push({
            //         ...item,
            //         x: item.x,
            //         y: totalCount,
            //     });
            //     dataSeries.CNTB.data.push({
            //         ...item,
            //         x: item.x,
            //         y: totalReject,
            //     });
            //     minimumXValue = Math.min(
            //         minimumXValue,
            //         Math.min(
            //             Math.min(
            //                 Math.min(totalCount, totalReject),
            //                 totalOutput
            //             ),
            //             0
            //         )
            //     );
            //     maximumXValue = Math.max(
            //         maximumXValue,
            //         Math.max(Math.max(totalCount, totalReject), totalOutput)
            //     );
            // });

            Object.entries(dataSeries).map(([key, value]) => {
                visualObjects.chart.options.data[dataSeries[key].index].type =
                    'line';
                visualObjects.chart.options.data[
                    dataSeries[key].index
                ].dataPoints = dataSeries[key].data;
            });

            break;
        case 'goodqtylbl':
            visualObjects.graphType = 'GoodQty';
            minimumXValue = Math.min(parseFloat(min.goodQty), 0);
            maximumXValue = parseFloat(max.goodQty);

            visualObjects.chart.options.axisY.title = 'Good Qty';
            const goodQtyDataSeries = [];

            for(let i = 0; i < dataPoints.length - 1; i++) {
                const datapoint = {
                    ...dataPoints[i],
                    x: dataPoints[i].x - (visualObjects.originalInterval * 0.5),
                    y: dataPoints[i].extraGoodQty
                };
                goodQtyDataSeries.push(datapoint);
            }

            const lastDataGoodQty = dataPoints[dataPoints.length - 1];
            let newXValueGoodQty = 0;
            if (dataPoints.length > 1) {
                newXValueGoodQty = dataPoints[dataPoints.length - 2].x + parseInt(visualObjects.originalInterval);
            }
            // const xDiffGoodQty = dataPoints[dataPoints.length - 2].x - dataPoints[dataPoints.length - 3].x;
            const lastDataPointToInsertGoodQty = {
                ...lastDataGoodQty,
                x: newXValueGoodQty - (visualObjects.originalInterval * 0.5),
                y: lastDataGoodQty.extraGoodQty
            };
            goodQtyDataSeries.push(lastDataPointToInsertGoodQty);

            // console.table(goodQtyDataSeries);

            // visualObjects.chart.options.data[graphIndex.GOODQTY].type =
            //     'stepArea';
            visualObjects.chart.options.data[graphIndex.GOODQTY].type =
                'column';
            visualObjects.chart.options.data[graphIndex.GOODQTY].dataPoints =
                goodQtyDataSeries;
            visualObjects.chart.options.data[graphIndex.GOODQTY].color = 'rgb(33,150,243)';
            visualObjects.chart.options.data[graphIndex.GOODQTY].fillOpacity = 0.6;
            visualObjects.chart.render();
            
            setTimeout(() => {
                const range = visualObjects.chart.axisX[0].viewportMaximum - visualObjects.chart.axisX[0].viewportMinimum;
                visualObjects.cachedData.originalDataPointWidth = Math.ceil(visualObjects.chart.axisX[0].bounds.width * (visualObjects.originalInterval / range) * 0.9);

                visualObjects.chart.set("dataPointWidth", visualObjects.cachedData.originalDataPointWidth * 0.8, true);

                // console.log('init datapoint width');
                // console.log(visualObjects.cachedData.originalDataPointWidth);
                // console.log('bound');
                // console.log(visualObjects.chart.axisX[0].bounds.width);
                // console.log(visualObjects.chart);
            }, 1);

            break;
        case 'cycletimelbl':
            visualObjects.graphType = 'CycleTime';
            minimumXValue = Math.min(parseFloat(min.cycleTime), 0);
            maximumXValue = parseFloat(max.cycleTime);

            visualObjects.chart.options.axisY.title = 'Cycle Time, seconds';
            const cycleTimeDataSeries = [];

            for(let i = 0; i < dataPoints.length - 1; i++) {
                const datapoint = {
                    ...dataPoints[i],
                    x: dataPoints[i].x - (visualObjects.originalInterval * 0.5),
                    y: dataPoints[i].extraCycleTime
                };
                cycleTimeDataSeries.push(datapoint);
            }

            const lastDataP = dataPoints[dataPoints.length - 1];
            // const xDiff = dataPoints[dataPoints.length - 2].x - dataPoints[dataPoints.length - 3].x;
            // const newXValue = dataPoints[dataPoints.length - 2].x + parseInt(visualObjects.originalInterval);


            let newXValue = 0;
            if (dataPoints.length > 1) {
                newXValue = dataPoints[dataPoints.length - 2].x + parseInt(visualObjects.originalInterval);
            }

            const lastDataPointToInsert = {
                ...lastDataP,
                x: newXValue - (visualObjects.originalInterval * 0.5),
                y: lastDataP.extraCycleTime
            };

            cycleTimeDataSeries.push(lastDataPointToInsert);

            // console.table(cycleTimeDataSeries);

            visualObjects.chart.options.data[graphIndex.CYCLE].type =
                'column';
            visualObjects.chart.options.data[graphIndex.CYCLE].dataPoints =
                cycleTimeDataSeries;
                
            visualObjects.chart.options.data[graphIndex.CYCLE].color = 'rgb(33,150,243)';
            visualObjects.chart.options.data[graphIndex.CYCLE].fillOpacity = 0.6;
            visualObjects.chart.render();

            setTimeout(() => {
                const range = visualObjects.chart.axisX[0].viewportMaximum - visualObjects.chart.axisX[0].viewportMinimum;
                visualObjects.cachedData.originalDataPointWidth = Math.ceil(visualObjects.chart.axisX[0].bounds.width * (visualObjects.originalInterval / range) * 0.9);


                // visualObjects.cachedData.originalDataPointWidth = Math.ceil(visualObjects.chart.axisX[0].bounds.width/visualObjects.chart.data[graphIndex.GOODQTY].dataPoints.length);
                visualObjects.chart.set("dataPointWidth", visualObjects.cachedData.originalDataPointWidth * 0.8, true);

                // console.log('init datapoint width');
                // console.log(visualObjects.cachedData.originalDataPointWidth);
                // console.log('bound');
                // console.log(visualObjects.chart.axisX[0].bounds.width);
                // console.log(visualObjects.chart);
            }, 1);
            break;
    }

    visualObjects.originalIntervalMultiples = findMultiples({base: visualObjects.originalInterval, upTo: 240});

    visualObjects.chart.options.data[graphIndex.JOTIME].dataPoints =
        dateTimePoints;

    if (maximumXValue === 0) {
        maximumXValue = 9.09;
    }

    visualObjects.chart.options.axisY.maximum = maximumXValue * 1.1;
    visualObjects.chart.options.axisY.minimum = minimumXValue;

    // console.log('minimumXValue');
    // console.log(minimumXValue);
    // console.log('maximumXValue');
    // console.log(maximumXValue);
    //  unproductive datapoints
    const processedUnproductiveData = processUnproductiveData({
        data: visualObjects.cachedData.unproductive,
        baseDate: visualObjects.baseDate,
        min: minimumXValue,
        maxCount: maximumXValue * 1.1,
        lastProdDate:
            visualObjects.cachedData.productive[
                visualObjects.cachedData.productive.length - 1
            ].timestamp,
    });

    const dataSeries = processedUnproductiveData.dataSeries;
    visualObjects.cachedData.productiveInfo =
        processedUnproductiveData.productiveInfo;
    visualObjects.cachedData.unproductiveInfo =
        processedUnproductiveData.unproductiveInfo;

    // console.log('processedUnproductiveData');
    // console.log(dataSeries);

    Object.keys(dataSeries).forEach((key) => {
        const index = dataSeries[key].index;
        //  add gradient

        var canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 400;

        // Get the drawing context
        var ctx = canvas.getContext('2d');

        const gradient = ctx.createLinearGradient(
            0,
            0,
            0,
            $('#visual-container').height()
        );

        switch (key) {
            case 'ST1':
                gradient.addColorStop(0, 'rgba(255,167,38,1)');
                gradient.addColorStop(0.2, 'rgba(255,167,38,1)');
                gradient.addColorStop(1, 'rgba(255,167,38,0.3)');
                break;

            case 'ST1INV':
                gradient.addColorStop(0, 'rgba(255,167,38,0.1)');
                gradient.addColorStop(1, 'rgba(255,167,38,1)');
                break;

            case 'ST2':
                gradient.addColorStop(0, 'rgba(33,150,243,1)');
                gradient.addColorStop(0.2, 'rgba(33,150,243,1)');
                gradient.addColorStop(1, 'rgb(33,150,243,0.3)');
                break;

            case 'ST2INV':
                gradient.addColorStop(0, 'rgba(33,150,243,0.1)');
                gradient.addColorStop(1, 'rgba(33,150,243,1)');
                break;

            case 'ST3':
                gradient.addColorStop(0, 'rgba(76,175,80,1)');
                gradient.addColorStop(0.2, 'rgba(76,175,80,1)');
                gradient.addColorStop(1, 'rgba(76,175,80,0.3)');
                break;

            case 'ST3INV':
                gradient.addColorStop(0, 'rgba(76,175,80,0.1)');
                gradient.addColorStop(1, 'rgba(76,175,80,1)');
                break;

            case 'ST4':
                gradient.addColorStop(0, 'rgba(194,24,91,1)');
                gradient.addColorStop(0.2, 'rgba(194,24,91,1)');
                gradient.addColorStop(1, 'rgba(194,24,91,0.3)');
                break;

            case 'ST4INV':
                gradient.addColorStop(0, 'rgba(194,24,91,0.1)');
                gradient.addColorStop(1, 'rgba(194,24,91,1)');
                break;

            case 'WDT':
                gradient.addColorStop(0, 'rgba(244,67,54,1)');
                gradient.addColorStop(0.2, 'rgba(244,67,54,1)');
                gradient.addColorStop(1, 'rgba(244,67,54,0.3)');
                break;

            case 'WDTINV':
                gradient.addColorStop(0, 'rgba(244,67,54,0.1)');
                gradient.addColorStop(1, 'rgba(244,67,54,1)');
                break;

            case 'INH':
                gradient.addColorStop(0, 'rgba(126,87,194,1)');
                gradient.addColorStop(0.2, 'rgba(126,87,194,1)');
                gradient.addColorStop(1, 'rgba(126,87,194,0.3)');
                break;

            case 'INHINV':
                gradient.addColorStop(0, 'rgba(126,87,194,0.1)');
                gradient.addColorStop(1, 'rgba(126,87,194,1)');
                break;

            default:
                break;
        }
        visualObjects.chart.options.data[index].dataPoints =
            dataSeries[key].data;
        visualObjects.chart.options.data[index].color = gradient;
    });

    // visualObjects.chart.options.axisX[0].title = `JO Time, ${intervalType}s`;
    const firstTimestamp = visualObjects.cachedData.productive[0].timestamp;
    const lastTimestamp = visualObjects.cachedData.joEnd;

    
    visualObjects.chart.options.axisX[1].title = `JO Time, ${intervalType}s   ( JO Start Time: ${firstTimestamp}, JO End Time:`;
    if (visualObjects.cachedData.onGoingJob) {
        visualObjects.chart.options.axisX[1].title += ` On-going, ${lang[flags.pref.lang].general.lastUpdate}: ${visualObjects.cachedData.lastUpdate} )`;
        $('#productivity-refresh-btn').prop('disabled', false);
    } else {
        visualObjects.chart.options.axisX[1].title += ` ${lastTimestamp})`;
        $('#productivity-refresh-btn').prop('disabled', true);
    }

    visualizationSetLastUpdated();

    // visualObjects.chart.options.title.text = `JO Start Time: ${firstTimestamp}    JO End Time: ${lastTimestamp}`;

    //  add 5% to maximum to fix alignment. tick labels of values greater than dataPoints[dataPoints.length - 1] is not displayed.

    let farthestDowntimeValue = 0;
    let farthestRunningValue = 0;
    if (dataPoints.length !== 0) {
        if (dataPoints.length !== 1) {
            farthestRunningValue = dataPoints[dataPoints.length - 2].x + parseInt(visualObjects.originalInterval);
        } else {
            farthestRunningValue = dataPoints[dataPoints.length - 1].x;
        }
    }
    Object.values(processedUnproductiveData.dataSeries).forEach((downtimeCategory) => {
        if (downtimeCategory.data.length !== 0) {
            farthestDowntimeValue = Math.max(farthestDowntimeValue, downtimeCategory.data[downtimeCategory.data.length - 1].x);
        }
    });

    const xEdge = Math.max(farthestRunningValue, farthestDowntimeValue);

    visualObjects.chart.options.axisX[0].maximum =
        xEdge * 1.03;
    visualObjects.chart.options.axisX[1].maximum =
        xEdge * 1.03;

    visualObjects.cachedData.maxX = xEdge;

    // adjustLabels(visualObjects.cachedData.maxX);
    // visualObjects.chart.render();

    let newIntervalInUse = changeInterval({viewportMin: 0, viewportMax: xEdge});
    newIntervalInUse = adjustLabels(visualObjects.cachedData.maxX, newIntervalInUse);
    
    visualObjects.workingInterval = newIntervalInUse;
    visualObjects.dateTimeInterval = newIntervalInUse;

    const visualContainer = $('#visual-container');
    visualContainer.css('visibility', 'visible');
    visualContainer.css('opacity', '1');

    translateProductivity();

    visualObjects.chart.render();

    renderData(tableData);

};

const clearDataSeries = () => {
    // console.log('clearDataSeries()');
    Object.entries(graphIndex).map(([key, value]) => {
        visualObjects.chart.options.data[value].dataPoints = [];
    });
};

const processUnproductiveData = ({
    data,
    baseDate,
    min,
    maxCount,
    lastProdDate,
}) => {
    // console.log('processUnproductiveData()');
    // console.log(data);
    // const graphXRange = parseFloat(maxCount) - parseFloat(min);
    // console.log(maxCount);
    // console.log(min);
    // console.log('graphXRange');
    // console.log(graphXRange);

    const dataSeries = {
        ST1: {
            index: graphIndex.ST1,
            data: [],
        },
        ST2: {
            index: graphIndex.ST2,
            data: [],
        },
        ST3: {
            index: graphIndex.ST3,
            data: [],
        },
        ST4: {
            index: graphIndex.ST4,
            data: [],
        },
        WDT: {
            index: graphIndex.WDT,
            data: [],
        },
        INH: {
            index: graphIndex.INH,
            data: [],
        },
    };

    const unproductiveInfo = {};
    const productiveInfo = {};

    //  makes the array work similarly to a linked array, used to get previous item before current item.
    //  for the unproductive range detection on the tooltip display.
    let previousPoint = -1;

    data.map((item) => {
        const { duration, job, source, start, end } = item;
        const startPoint = dateToXPosition({
            baseDate,
            date: start,
            unit: visualObjects.intervalType,
        });
        const endPoint = dateToXPosition({
            baseDate,
            date: end,
            unit: visualObjects.intervalType,
        });

        if (previousPoint === startPoint) {
            previousPoint = -1;
        }

        const unprodInfo = {
            label: source,
            start: start,
            end: end,
            duration: duration,
            xStartPoint: startPoint,
            xEndPoint: endPoint,
            previousPoint: previousPoint,
            inRange: [],
        };

        
        const unprodInfoClone = {
            label: source,
            start: start,
            end: end,
            duration: duration,
            xStartPoint: startPoint,
            xEndPoint: endPoint,
            previousPoint: previousPoint,
            inRange: [],
        };

        const roundedStartPoint = Math.round(startPoint);
        const roundedEndPoint = Math.round(endPoint);

        for (let x = roundedStartPoint; x <= roundedEndPoint; x++) {
            if (!(`${x}` in productiveInfo)) {
                //  initialize
                // unproductiveInfo[`${x}`] = [unprodInfo];
                productiveInfo[`${x}`] = [unprodInfo];
            } else {
                //  add to this object
                // unproductiveInfo[`${x}`].push(unprodInfo);
                productiveInfo[`${x}`].push(unprodInfo);
            }
        }

        if (!(`${startPoint}` in unproductiveInfo)) {
            unproductiveInfo[`${startPoint}`] = [unprodInfo];
        } else {
            const arr = unproductiveInfo[`${startPoint}`];
            let hasItem = false;
            arr.forEach((item) => {
                if (item.label === unprodInfo.label) {
                    hasItem = true;
                }
            });
            if (!hasItem) {
                arr.push(unprodInfo);
            }
        }

        if (!(`${endPoint}` in unproductiveInfo)) {
            unproductiveInfo[`${endPoint}`] = [unprodInfoClone];
        } else {
            const arr = unproductiveInfo[`${endPoint}`];
            let hasItem = false;
            arr.forEach((item) => {
                if (item.label === unprodInfoClone.label) {
                    hasItem = true;
                }
            });
            if (!hasItem) {
                arr.push(unprodInfoClone);
            }
        }

        //  update previousPoint to the current item for the next iteration.
        previousPoint = startPoint;

        const init = {
            x: startPoint,
            y: [min, min],
            label: source,
            extraStart: start,
            extraEnd: end,
        };
        const up = {
            x: startPoint,
            y: [min, maxCount],
            label: source,
            extraStart: start,
            extraEnd: end,
        };
        const through = {
            x: endPoint,
            y: [min, maxCount],
            label: source,
            extraStart: start,
            extraEnd: end,
        };
        const down = {
            x: endPoint,
            y: [min, min],
            label: source,
            extraStart: start,
            extraEnd: end,
        };

        dataSeries[`${source}`].data.push(init);
        dataSeries[`${source}`].data.push(up);
        dataSeries[`${source}`].data.push(through);
        dataSeries[`${source}`].data.push(down);
    });

    //  loop through unprod info, check how many datapoints overlap each other

    const unprodInfoKeys = Object.keys(unproductiveInfo);
    unprodInfoKeys.sort((a, b) => {
        return parseFloat(a) - parseFloat(b);
    });

    unprodInfoKeys.forEach((k, index) => {
        const current = unproductiveInfo[`${k}`];
        const kValue = parseFloat(k);
        const subarray = unprodInfoKeys.slice(0, index);
        subarray.forEach((s) => {
            const data = unproductiveInfo[`${s}`];
            data.forEach((ss) => {
                const startPoint = ss.xStartPoint;
                const endPoint = ss.xEndPoint;
                if (kValue <= endPoint) {
                    // ss.inRange.push(s);
                    current.forEach((c) => {
                        if (c.label !== ss.label && !(c.inRange.includes(s))) {
                            c.inRange.push(s);
                        }
                    });
                }
            });

            // console.log(`data`);
            // console.log(data);
        });
    });

    // console.log(unproductiveInfo[`${unprodInfoKeys[0]}`][0]);

    // console.log('unprodInfoKeys');
    // console.log(unprodInfoKeys);

    // console.log('processUnproductiveData()');
    // console.log(unproductiveInfo);

    return { dataSeries, unproductiveInfo, productiveInfo };
};

const processData = ({ interval, intervalType, data }) => {
    // console.log('processData()');
    // console.log(`interval: ${interval}`);
    // console.log(`intervalType: ${intervalType}`);

    const INTERVAL_TYPE = `${intervalType}s`;
    const baseDate = data[0].timestamp;
    visualObjects.baseDate = baseDate;
    visualObjects.intervalType = INTERVAL_TYPE === 'hours' ? 'HOUR' : 'MINUTE';
    const dataPoints = [];
    const dateTimePoints = [];
    const tableData = [];

    const intervalMultiplier = intervalType === 'hour' ? 3600 : 60;

    const max = {
        cntA: 0,
        cntB: 0,
        goodQty: 0,
        cycleTime: 0,
    };

    const min = {
        cntA: 0,
        cntB: 0,
        goodQty: 0,
        cycleTime: 0,
    };

    // console.log(`data`);
    // console.log(data);

    data.forEach((item, index) => {
        //  do all methods here, put them all in `extra${} variables, leaving y to 0`

        const logInterval = item.logInterval;
        const lastInterval = item.lastInterval;

        if (logInterval === lastInterval) {
            //  this is the joEnd
            if (item.id === null) {
                item.timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
                visualObjects.cachedData.onGoingJob = true;
                visualObjects.cachedData.joEnd = 'On-going';
            } else {
                visualObjects.cachedData.joEnd = item.timestamp;
            }
        }

        //  do not render datapoint if it is the end data but it is not the last data on the array
        if (logInterval === lastInterval && index !== data.length - 1) {
            return;
        }

        const extraCntA = parseFloat(item.count);
        const extraCntB = parseFloat(item.reject);
        const extraGoodQty = parseFloat(extraCntA - extraCntB);
        const extraStart = item.timestamp;
        let pointAtX = parseFloat(item.pointAtX.toFixed(2));
        // let pointAtX = Math.ceil(item.pointAtX);

        // if (index === data.length - 1) {
        //     console.log('last item');
        //     console.log(data[data.length - 2].pointAtX);
        //     console.log(interval);
        //     console.log(dataPoints[dataPoints.length - 1]);
        //     pointAtX =
        //         parseInt(dataPoints[dataPoints.length - 1].x) +
        //         parseInt(interval);
        // }

        let extraCycleTime =
            item.count === 0
                ? 0
                : parseFloat(
                      (interval * intervalMultiplier) / (extraCntA - extraCntB)
                  );

        extraCycleTime = isFinite(extraCycleTime) ? extraCycleTime : 0;

        const dataPoint = {
            extraCntA,
            extraCntB,
            extraGoodQty,
            extraStart,
            extraCycleTime: isFinite(extraCycleTime) ? extraCycleTime : 0,
            x: pointAtX,
            y: 0,
        };

        const dateTimePoint = {
            x: pointAtX,
            y: 0,
        };

        max.cntA = max.cntA < extraCntA ? extraCntA : max.cntA;
        max.cntB = max.cntB < extraCntB ? extraCntB : max.cntB;
        max.goodQty = max.goodQty < extraGoodQty ? extraGoodQty : max.goodQty;
        max.cycleTime =
            max.cycleTime < extraCycleTime ? extraCycleTime : max.cycleTime;

        min.cntA = min.cntA > extraCntA ? extraCntA : min.cntA;
        min.cntB = min.cntB > extraCntB ? extraCntB : min.cntB;
        min.goodQty = min.goodQty > extraGoodQty ? extraGoodQty : min.goodQty;
        min.cycleTime =
            min.cycleTime > extraCycleTime ? extraCycleTime : min.cycleTime;

        //  check if last job
        // 0915: commented out to prevent changing last log timestamp
        // if (index === data.length - 1 && index !== 0) {
        //     const newDateTime = xPositionToDate({
        //         startDate: visualObjects.baseDate,
        //         xPosition: parseFloat((parseFloat(data[data.length - 2]) + parseFloat(interval)).toFixed(2)),
        //         unit: visualObjects.intervalType
        //     }).format('YYYY-MM-DD HH:mm:ss');
        //     dataPoint.extraStart = newDateTime;
        // }

        dataPoints.push(dataPoint);
        dateTimePoints.push(dateTimePoint);
        tableData.push(dataPoint);

        //  datapoints filler
        if (index < data.length - 1) {
            const actualNextInterval = parseFloat(data[index + 1].pointAtX.toFixed(2));
            let nextInterval = parseFloat((parseFloat(item.pointAtX) + parseFloat(interval)).toFixed(2));

            const actualNextDateTimeLabel = xPositionToDate({
                startDate: visualObjects.baseDate,
                xPosition: actualNextInterval,
                unit: visualObjects.intervalType
            }).format('YYYY-MM-DD HH:mm:ss');

            while (nextInterval < actualNextInterval) {
                let dateTimeLabel = xPositionToDate({
                    startDate: visualObjects.baseDate,
                    xPosition: nextInterval,
                    unit: visualObjects.intervalType,
                }).format('YYYY-MM-DD HH:mm:ss');

                if (actualNextDateTimeLabel === dateTimeLabel) {
                    break;
                }

                const fillerDatapoint = {
                    x: nextInterval,
                    y: 0,
                    extraCntA: 0,
                    extraCntB: 0,
                    extraStart: dateTimeLabel,
                    extraCycleTime: 0,
                    extraGoodQty: 0,
                };

                dataPoints.push(fillerDatapoint);
                dateTimePoints.push(fillerDatapoint);
                tableData.push(fillerDatapoint);
                nextInterval += parseFloat(interval);
                nextInterval = parseFloat(nextInterval.toFixed(2));
            }
        }
    });

    return { dataPoints, dateTimePoints, min, max, tableData };
};

const adjustLabels = (maximumValue, currentInterval) => {
    // console.log('adjustLabels()');
    let interval = parseFloat(currentInterval);

    const angle = visualObjects.chart.axisX[0].labelAngle;
    console.log(`angle: ${angle}`);

    if (angle !== 0) {
        const newInterval = test * 2;
        interval = newInterval;
        visualObjects.chart.axisX[0].set('interval', newInterval);
        visualObjects.chart.axisX[1].set('interval', newInterval);

        visualObjects.workingInterval = newInterval;
        visualObjects.dateTimeInterval = newInterval;
        visualObjects.zoomedInterval = newInterval;
    }
    return interval;
};

const addStartAndEndLabel = (data) => {
    // console.log(`addStartAndEndLabel()`);

    const ctx = visualObjects.chart.ctx;
    const width = visualObjects.chart.width;
    const height = visualObjects.chart.height;

    const start = new Date(data.start);
    const end = new Date(data.end);

    ctx.save();
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'end';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`Start`, 70, height - 30);
    ctx.fillText(
        `${start.getHours() < 10 ? '0' : ''}${start.getHours()}:${
            start.getMinutes() < 10 ? '0' : ''
        }${start.getMinutes()}`,
        70,
        height - 15
    );
    ctx.fillText(`End`, width - 15, height - 30);
    ctx.fillText(
        `${end.getHours() < 10 ? '0' : ''}${end.getHours()}:${
            end.getMinutes() < 10 ? '0' : ''
        }${end.getMinutes()}`,
        width - 15,
        height - 15
    );
    ctx.restore();
};

const reload = () => {
    const devid = $('#visualDevice').val();
    const schedid = $('#visualJobs').val();
    const visualContainer = $('#visual-container');
    visualContainer.css('visibility', 'hidden');
    visualContainer.css('opacity', '0');
    getData({
        devid,
        schedid,
    });
};

const resetVisualizationPage = () => {
    
    const devElement = $('#visualDevice');
    const schedElement = $('#visualJobs');
    const nojoblbl = lang[flags.pref.lang].general.nojoblbl;
    const noJobsOption = `<option value = "0" disabled selected hidden class="no-job-lbl">${nojoblbl}</option>`;
    const nodevlbl = lang[flags.pref.lang].general.nodevlbl;
    const noDevicesOption = `<option value="0" disabled selected hidden class="no-dev-lbl">${nodevlbl}</option>`;
    devElement.html(noDevicesOption);
    schedElement.html(noJobsOption);

    devElement.prop('disabled', true);
    schedElement.prop('disabled', true);

    const viewBtn = $('#visual-tab.tab-pane .view-btn');
    viewBtn.removeClass('active');
    const i = $('#visual-tab.tab-pane .view-btn i');
    i.removeClass('text-success');

    visualObjects.cachedData.productive = null;
    flags.productivity.processedTableData = null;

    visualDisplayNoDatav2();
};

function visualDisplayNoDatav2(forceRender = false) {
        // No data is present
        if (visualObjects.chart.options !== undefined) {
            visualObjects.chart.options.data.map((item) => {
                item.dataPoints = [];
            });
            visualObjects.chart.options.axisX[1].title = '';
            visualObjects.chart.render();
    
            setTimeout(() => {
                var ctx = visualObjects.chart.ctx;
                var width = visualObjects.chart.width;
                var height = visualObjects.chart.height;
    
                ctx.save();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = '30px sans-serif';
                // ctx.fillText('No data to display', width / 2, height / 2);
                ctx.restore();
                $('#graphModal').modal('hide');
            }, 500);
        }

}

const visualizationSetLastUpdated = (date = null) => {
    const lastUpdatedElement = $('#productivity-last-updated');
    if (date === null) {
        date = `Last Update: ${moment().format('YYYY-MM-DD HH:mm:ss')}`;
    } else {
        date = `Last Update: ${date}`;
    }
    lastUpdatedElement.html(date);
}