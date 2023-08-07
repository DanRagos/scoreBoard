const DOWN_COLOR = '#d50000';
const UP_COLOR = '#00c853';
const IDLE_COLOR = '#9E9E9E';
const IDLE_TRANSPARENT_COLOR = 'rgba(158,158,158, 0.3)';
const TIMECHART_DEVICE_PER_PAGE = 10;

const timeGraphSettings = {
    interval: 0
};

const calculateTimeGraphInterval = ({numberOfMinutes}) => {
    let interval;
    if (numberOfMinutes <= 720) {
        //  half day, 1 hour interval
        interval = 60;
    } else if (numberOfMinutes <= 1440) {
        //  1 day, 3 hour interval
        interval = 120;  //2hr
    } else if (numberOfMinutes <= 2880) {
        //  2 day, 3 hour interval
        interval = 180;  
    }  else if (numberOfMinutes <= 7200) {
        //  5 days, 6 hour interval
        interval = 360;
    }  else if (numberOfMinutes <= 14400) {
        //  10 days, 12 hour interval
        interval = 720
    } else if (numberOfMinutes <= 28800) {
        //  20 days, 1 day interval
        interval = 1440;
    } else if (numberOfMinutes <= 57600) {
        //  40 days, 2 day interval
        interval = 2880;
    } else if (numberOfMinutes <= 86400) {
        //  2 months, 3 day interval
        interval = 4320;
    } else if (numberOfMinutes <= 129600) {
        //  3 months, 2 week interval
        // interval = 21600;   //2week
        interval = 10080;   //1week
    } else if (numberOfMinutes <= 259200) {
        //  6 months, 1 month interval
        // interval = 43200;   //1month
        interval = 21600;   //2week
    } else if (numberOfMinutes <= 518400) {
        //  1 year, 1 month interval
        // interval = 129600;  //90days
        interval = 43200;   //30days
    } else if (numberOfMinutes <= 1036800) {
        //  2 years, 2 month interval
        interval = 86400;
    } else if (numberOfMinutes <= 2073600) {
        //  4 years, 4 month interval
        interval = 172800;
    } else if (numberOfMinutes > 2073600) {
        //  greater than 4 years, 1 year interval
        interval = 518400;
    }

    return interval;
};

const dynamicInterval = (range, chart, labelAngle) => {
    let rangeMutable = range;
    let labelAngleMutable = labelAngle;
    let count = 0;
    while (labelAngleMutable !== 0) {
        if (count === 20) {
            let newInterval = range * 0.2;
            chart.axisY[0].set('interval', newInterval);
            break;
        } else {
            rangeMutable *= 2;
            chart.axisY[0].set('interval', calculateTimeGraphInterval({numberOfMinutes: rangeMutable}));
            labelAngleMutable = chart.axisY[0].labelAngle;
            count++;
        }
    }
};

let currentTimechart;
const timeGraphZoomEventHandler = (e) => {
    currentTimechart = e.chart;
    if (e.trigger === 'zoom') {
        const viewportMin = e.axisY[0].viewportMinimum;
        const viewportMax = e.axisY[0].viewportMaximum;
        const range = viewportMax - viewportMin;
      
        //  use same strategy for figuring out new interval
        const interval = calculateTimeGraphInterval({numberOfMinutes: range});
        console.log(`new interval: ${interval}`);

        e.chart.axisY[0].set('interval', interval, true);

        let rangeMutable = range;
        let labelAngle = e.chart.axisY[0].labelAngle;
        // while (labelAngle !== 0) {
        //     rangeMutable *= 2;
        //     e.chart.axisY[0].set('interval', calculateTimeGraphInterval({numberOfMinutes: rangeMutable}));
        //     labelAngle = e.chart.axisY[0].labelAngle;
        // }
        dynamicInterval(rangeMutable, e.chart, labelAngle);

    } else if (e.trigger === 'reset') {
        e.chart.axisY[0].set('interval', timeGraphSettings.interval, true);

        let rangeMutable = timeGraphSettings.interval;
        let labelAngle = e.chart.axisY[0].labelAngle;
        // while (labelAngle !== 0) {
        //     rangeMutable *= 2;
        //     e.chart.axisY[0].set('interval', calculateTimeGraphInterval({numberOfMinutes: rangeMutable}));
        //     labelAngle = e.chart.axisY[0].labelAngle;
        // }
        dynamicInterval(rangeMutable, e.chart, labelAngle);

    }
};
    

const initTimeGraphNew = (xMinimum, xMaximum, processedData, _theme) => {

    //  console.log("initTimeGraph called!");
    //  console.log(processedData);
    //  console.log(_theme);
    const baseDate = moment(xMinimum).format('YYYY-MM-DD HH:mm:ss');
    const endDate = moment(xMaximum).format('YYYY-MM-DD HH:mm:ss');
    // console.log(baseDate);
    // console.log(endDate);

    const xPos = Math.ceil(dateToXPositionTimeGraph({
        baseDate: baseDate,
        date: endDate
    }));

    // console.log(baseDate);
    // console.log(endDate);

    // const interval = Math.ceil(xPos / 15);

    const interval = calculateTimeGraphInterval({numberOfMinutes: xPos});
    // console.log(`interval: ${interval}`);

    timeGraphSettings.interval = interval;

    // console.log(`xPos: ${xPos}`);

    const titleObject = {
        text: '',
        verticalAlign: 'center',
        horizontalAlign: 'center',
        fontSize: 25,
    };

    if (processedData.length === 0) {
        titleObject.text = lang[flags.pref.lang].summary.nodatatodisplay;
    }

    const chart = new CanvasJS.Chart('timechart-content', {
        theme: _theme,
        animationEnabled: true,
        zoomEnabled: true,
        zoomType: 'y',
        dataPointWidth: 40,
        title: titleObject,
        toolTip: {
            content: (e) => {
                const {
                    label,
                    extraJob,
                    extraStatus,
                    extraFrom,
                    extraTo,
                    extraDuration,
                    extraActualStart,
                    extraActualEnd,
                } = e.entries[0].dataPoint;
                let toolTipContent = `<b>${label}</b> <br /> ${lang[flags.pref.lang].jobdetails.job}: ${extraJob} <br /> `;
                toolTipContent += `${lang[flags.pref.lang].jobdetails.prodstatus}: ${lang[flags.pref.lang].status[extraStatus]} <br /> `;
                toolTipContent += `${lang[flags.pref.lang].chart.from}: ${extraFrom} <br />${lang[flags.pref.lang].chart.to}: ${extraTo} <br /> `;
                toolTipContent += `${lang[flags.pref.lang].chart.duration}: ${extraDuration}`;

                if (e.entries[0].dataPoint.extraStatus != 'idle') {
                    toolTipContent += `<br /> ${lang[flags.pref.lang].chart.jostart}: ${extraActualStart} <br /> ${lang[flags.pref.lang].chart.joend}: ${extraActualEnd}`;
                }
                return toolTipContent;
            },
        },
        rangeChanging: (e) => {
            timeGraphZoomEventHandler(e);
        },
        rangeChanged: (e) => {
            addBorderToDataPoint(e.chart, 2);
        },
        axisX: {
            margin: 30,
            gridColor: 'white',
            lineThickness: 0,
        },
        axisY: {
            includeZero: true,
            labelFormatter: function (e) {
                if (e.value === xMinimum) {
                    console.log(e.value);
                    console.log('start date tick detected');
                }
                // return CanvasJS.formatDate(e.value, 'MM-DD - HH:mm ');
                if (e.axis.interval >= 1440) {
                    return xPositionToDateTimeGraph({
                        startDate: baseDate,
                        xPosition: e.value
                    }).format('MM-DD');
                }
                return xPositionToDateTimeGraph({
                    startDate: baseDate,
                    xPosition: e.value
                }).format('MM-DD - HH:mm');
                // return e.value;
            },
            interval: interval,
            labelFontSize: 10,
            minimum: 0,
            maximum: dateToXPositionTimeGraph({
                baseDate,
                date: endDate
            }),
            // minimum: xMinimum,
            // maximum: xMaximum,
            gridColor: 'white',
            gridThickness: 0,
            lineThickness: 1,
        },
        legend: {
            fontSize: 16,
            fontWeight: 'normal',
            horizontalAlign: 'center',
            verticalAlign: 'bottom',
        },
        data: [
            {
                type: 'rangeBar',
                dataPoints: processedData,
            },
            {
                type: 'rangeBar',
                legendText: 'RUNNING',
                color: UP_COLOR,
                showInLegend: true,
                visible: false,
                dataPoints: [[0,0],[0,0]],
            },
            {
                type: 'rangeBar',
                legendText: 'DOWN',
                color: DOWN_COLOR,
                showInLegend: true,
                visible: false,
                dataPoints: [[0,0],[0,0]],
            },
        ],
    });

    chart.render();
    let rangeMutable = xPos;
    let labelAngle = chart.axisY[0].labelAngle;
    // while (labelAngle !== 0) {
    //     rangeMutable *= 2;
    //     chart.axisY[0].set('interval', calculateTimeGraphInterval({numberOfMinutes: rangeMutable}));
    //     labelAngle = chart.axisY[0].labelAngle;
    // }
    dynamicInterval(rangeMutable, chart, labelAngle);

    return chart;
};

const upGenerator = (data, extraDevend, actualStart, actualEnd) => {
    data['color'] = UP_COLOR;
    data['extraStatus'] = 'run';//'Running';
    if (extraDevend) {
        data.extraDevend = extraDevend;
    }
    if (actualStart) {
        data.extraActualStart = actualStart;
    }
    if (actualEnd) {
        data.extraActualEnd = actualEnd;
    }
    return data;
};

const downGenerator = (data) => {
    data['color'] = DOWN_COLOR;
    data['extraStatus'] = 'down';//'Down';
    return data;
};

const idleGenerator = (data, devend) => {
    data['color'] = IDLE_TRANSPARENT_COLOR;
    data['extraStatus'] = 'idle';//'Idle';
    data['extraDevend'] = devend;
    return data;
};

const dateToXPositionTimeGraph = ({baseDate, date}) => {
    const baseDateMoment = moment(baseDate, 'YYYY-MM-DD HH:mm:ss');
    const dateMoment = moment(date, 'YYYY-MM-DD HH:mm:ss');

    let diff;

    diff = dateMoment.diff(baseDateMoment, 'minutes', true);

    return diff;
};

const xPositionToDateTimeGraph = ({startDate, xPosition}) => {
    let dateResult = moment(startDate, 'YYYY-MM-DD HH:mm:ss');
    return dateResult.add(xPosition, 'minutes');
};

const timelineDataGenerator = (label, xLocation, from, to, jobName, base) => {
    // const fromFormatted = moment(from, 'YYYY-MM-DD HH:mm:ss').valueOf();
    // const toFormatted = moment(to, 'YYYY-MM-DD HH:mm:ss').valueOf();
    const duration = timestampCompare({ from, to });
    const fromFormatted = dateToXPositionTimeGraph({
        baseDate: base,
        date: from,
    });
    const toFormatted = dateToXPositionTimeGraph({
        baseDate: base,
        date: to,
    });

    const fromFormatted2 = moment(base, 'YYYY-MM-DD HH:mm:ss').unix();
    const toFormatted2 = moment(to, 'YYYY-MM-DD HH:mm:ss').unix();

    // console.log('fromformatted2');
    // console.log(fromFormatted2);
    return {
        label,
        x: xLocation,
        y: [fromFormatted, toFormatted],
        extraJob: jobName,
        extraFrom: from,
        extraTo: to,
        extraDuration: duration,
    };
};

//  format: {processedData: [], idleData: {}, lastXLocation: integer}
timechartPagination = {};
let timechartPageLookup = {};

// format: {label: string, index: integer}
const labels = {};
let lastXLocation = 0;

//  used for sorting alphanumeric strings
const collator = new Intl.Collator('en', {
    numeric: true,
    sensitivity: 'base',
});

const addTimeChartPage = (timechartPagination, index) => {
    // console.log(`created new timechart page ${index}`);
    const newTimechartPageObject = {
        data: [],
        idleData: [],
        labels: {},
        currentXLocation: 0,
    };
    timechartPagination[`${index}`] = newTimechartPageObject;
};

const getXIndexFromLabel = (label, labelsArray) => {
    let xLocation = labelsArray[`${label}`];
    if (xLocation === undefined) {
        xLocation = TIMECHART_DEVICE_PER_PAGE - Object.keys(labelsArray).length + 1;
    }
    return xLocation;
};

const getOrGeneratexLocationFromLabelNew = (
    label,
    labelsArray,
    currentXLocation
) => {
    let xLocation = labelsArray[`${label}`];
    if (xLocation === undefined) {
        xLocation = ++currentXLocation;
    }
    return xLocation;
};

const timestampCompare = ({ from, to }) => {
    const fromMoment = moment(from, 'YYYY-MM-DD HH:mm:ss');
    const toMoment = moment(to, 'YYYY-MM-DD HH:mm:ss');
    const days = toMoment.diff(fromMoment, 'days');
    const dayFormat = pluralFormatter({
        unit: 'day', // change translation here
        count: days,
    });
    let remainingMoment = toMoment.subtract(days, 'days');
    const hours = remainingMoment.diff(fromMoment, 'hours');
    const hourFormat = pluralFormatter({
        unit: 'hour',
        count: hours,
    });
    remainingMoment = remainingMoment.subtract(hours, 'hours');
    const minutes = remainingMoment.diff(fromMoment, 'minutes');
    const minuteFormat = pluralFormatter({
        unit: 'minute',
        count: minutes,
    });
    remainingMoment = remainingMoment.subtract(minutes, 'minutes');
    const seconds = remainingMoment.diff(fromMoment, 'seconds');
    const secondFormat = pluralFormatter({
        unit: 'second',
        count: seconds,
    });
    return `${days} ${dayFormat}, ${hours} ${hourFormat}, ${minutes} ${minuteFormat}, ${seconds} ${secondFormat}`;
};

const pluralFormatter = ({ unit, count }) => {
    if (count === 0 || count > 1) {
        return `${unit}s`;
    } else {
        return unit;
    }
};

const detectConflicts = (({data}) => {
    console.log('detectConflicts');
    console.log(data);
    const filteredData = [];
    const removedData = [];
    //  get first data
    let nextData;
    for(let i = 0; i < data.length - 1; i++) {
        currentData = data[i];
        nextData = data[i + 1];
        if (currentData.devnme !== nextData.devnme) {
            filteredData.push(currentData);
            filteredData.push(nextData);
            continue;
        }

        const currentDataMoment = moment(currentData.devend, 'YYYY-MM-DD HH:mm:ss');
        const nextDataMoment = moment(nextData.devstt, 'YYYY-MM-DD HH:mm:ss');

        //  check if currentData is on removedData
        let foundInRemovedData = false;
        for (let y = 0; y < removedData.length; y++) {
            if (removedData[y] === currentData) {
                console.log('found in removed data!');
                foundInRemovedData = true;
                break;
            }
        }

        if (!foundInRemovedData) {
            filteredData.push(currentData);
        }

        if (currentDataMoment > nextDataMoment) {
            console.error('conflict found!');
            console.error(currentData);
            console.error(nextData);
            removedData.push(nextData);
        } else {
            filteredData.push(nextData);
        }
    }
});

const detectConflictsv2 = (({data}) => {
    console.log('detectConflicts v2');
    let dataAndLastDates = {};
    const filteredData = [];
    const removedData = {};

    for (let i = 0; i < data.length; i++) {
        let currentLatest;
        if (data[i].devdid in dataAndLastDates) {
            currentLatest = dataAndLastDates[data[i].devdid].devend;
            const currentLatestMoment = moment(currentLatest, 'YYYY-MM-DD HH:mm:ss');
            const currentDataMoment = moment(data[i].devstt, 'YYYY-MM-DD HH:mm:ss');

            if (currentLatestMoment > currentDataMoment) {
                // console.error('conflict found');
                // console.error(dataAndLastDates[data[i].devdid]);
                // console.error(data[i]);
                const dataToRemove = data[i];
                const dataToRemoveHash = `${dataToRemove.devdid}-${dataToRemove.devsid}-${dataToRemove.devstt}-${dataToRemove.devend}`;
                removedData[dataToRemoveHash] = true;
            } else {
                dataAndLastDates[data[i].devdid] = data[i];
                filteredData.push(data[i]);
            }
        } else {
            dataAndLastDates[data[i].devdid] = data[i];
            filteredData.push(data[i]);
        }
    }
    return {filteredData, removedData};
});

const generateTimechartData = ({
    productive,
    unproductive,
    startDate,
    endDate,
}) => {
    //  sort productive and unproductive
    // console.log('before productive sort');
    // console.log(productive);
    productive = productive.sort((a, b) => {
        if (a.devnme === b.devnme) {
            const aMoment = moment(a.devstt, 'YYYY-MM-DD HH:mm:ss');
            const bMoment = moment(b.devstt, 'YYYY-MM-DD HH:mm:ss');
            return aMoment - bMoment;
        }
        return collator.compare(a.devnme, b.devnme);
    });

    unproductive = unproductive.sort((a, b) => {
        if (a.devnme === b.devnme) {
            const aMoment = moment(a.devstt, 'YYYY-MM-DD HH:mm:ss');
            const bMoment = moment(b.devstt, 'YYYY-MM-DD HH:mm:ss');
            return aMoment - bMoment;
        }
        return collator.compare(a.devnme, b.devnme);
    });

    // detectConflicts({data: productive});
    const conflictResult = detectConflictsv2({data: productive});

    productive = conflictResult.filteredData;

    console.log('removed data');
    console.table(Object.keys(conflictResult.removedData));

    const transformedUnproductive = processUnproductive({
        unproductive,
        baseDate: startDate,
        removedData: conflictResult.removedData
    });

    // console.log(`generatedTimechartData()`);
    // console.log(`unprod`);
    // console.log(transformedUnproductive);
    // console.log(unproductive);

    const transformedProductive = processProductive({
        productive: productive,
        unproductiveData: transformedUnproductive,
        baseDate: startDate
    });

    // console.log(`prod`);
    // console.log(transformedProductive);
    // console.log(productive);

    const transformedIdle = processIdle({
        productive: productive,
        devices: Object.keys(transformedProductive),
        startDate: startDate,
        endDate: endDate,
    });

    // console.log('idle');
    // console.log(transformedIdle);

    const combined = {};

    const combinedUniqueKeys = [
        ...new Set(
            Object.keys(transformedProductive).concat(
                Object.keys(transformedUnproductive).concat(
                    Object.keys(transformedIdle)
                )
            )
        ),
    ];

    // console.log(`combined keys`);
    // console.log(combinedUniqueKeys);

    const timechartPagination = {};
    let currentIndex = 0;

    addTimeChartPage(timechartPagination, currentIndex);
    let currentPage = timechartPagination[`${currentIndex}`];

    combinedUniqueKeys.forEach((device) => {
        // console.log(device);
        let xIndex = getXIndexFromLabel(device, currentPage.labels);

        if (xIndex <= 1) {
            //  create new page
            addTimeChartPage(timechartPagination, ++currentIndex);
            //  set newly created page as currentPage
            currentPage = timechartPagination[`${currentIndex}`];
            xIndex = getXIndexFromLabel(device, currentPage.labels);
        }

        currentPage.currentXLocation = xIndex;
        currentPage.labels[`${device}`] = xIndex;

        let prod = [];
        let unprod = [];
        let idle = [];
        if (`${device}` in transformedProductive) {
            prod = transformedProductive[`${device}`];
            prod.forEach((p) => {
                p.x = xIndex;
            });
        }
        if (`${device}` in transformedUnproductive) {
            unprod = transformedUnproductive[`${device}`];
            unprod.forEach((u) => {
                u.x = xIndex;
            });
        }
        if (`${device}` in transformedIdle) {
            idle = transformedIdle[`${device}`];
            idle.forEach((i) => {
                i.x = xIndex;
            })
        }

        combined[`${device}`] = [...prod, ...unprod, ...idle];
        // combined[`${device}`] = [...unprod];
        combined[`${device}`] = combined[`${device}`].sort((a, b) => {
            return a.y[0] - b.y[0];
        });

        currentPage.data.push(...combined[`${device}`]);
    });

    // console.log('combined');
    // console.log(combined);

    // console.log('pagination');
    // console.log(timechartPagination);
    return timechartPagination;
};

const processProductive = ({ productive, unproductiveData, baseDate }) => {
    const transformedData = {};

    productive.forEach((p) => {
        let loc;
        if (!(`${p.devnme}` in transformedData)) {
            loc = [];
            transformedData[`${p.devnme}`] = loc;
        } else {
            loc = transformedData[`${p.devnme}`];
        }

        const unprodData = unproductiveData[`${p.devnme}`] || [];
        // let startPoint = moment(p.devstt, 'YYYY-MM-DD HH:mm:ss').valueOf();
        // let endPoint = moment(p.devend, 'YYYY-MM-DD HH:mm:ss').valueOf();
        let startPoint = dateToXPositionTimeGraph({baseDate, date: p.devstt});
        let endPoint = dateToXPositionTimeGraph({baseDate, date: p.devend});
        let base = p.devstt;
        let isInserted = false;
        for (let i = 0; i <= unprodData.length - 1; i++) {
            if (startPoint >= endPoint) {
                //  skip insertion
                isInserted = true;
                break;
            }
            const unprodStartPoint = unprodData[i].y[0];
            const unprodEndPoint = unprodData[i].y[1];
            // const unprodStartPoint = xPositionToDateTimeGraph({startDate: baseDate, xPosition: unprodData[i].y[0]});
            // const unprodEndPoint = xPositionToDateTimeGraph({startDate: baseDate, xPosition: unprodData[i].y[1]});
            if (unprodStartPoint <= startPoint) {
                base = unprodData[i].extraTo;
                continue;
            }
            const devJob = unprodData[i].extraJob;
            const schedID = unprodData[i].extraSchedID;
            // if (p.devjob !== devJob) {
            //     isInserted = false;
            //     break;
            // }

            if (p.devsid !== schedID) {
                // base = unprodData[i].extraTo;
                isInserted = false;
                continue;
            }

            let momentBase = moment(base, 'YYYY-MM-DD HH:mm:ss').valueOf();
            const momentDevstt = moment(
                p.devstt,
                'YYYY-MM-DD HH:mm:ss'
            ).valueOf();
            const momentDevend = moment(
                p.devend,
                'YYYY-MM-DD HH:mm:ss'
            ).valueOf();
            const momentExtraFrom = moment(
                unprodData[i].extraFrom,
                'YYYY-MM-DD HH:mm:ss'
            ).valueOf();

            if (momentBase < momentDevstt) {
                base = p.devstt;
            }

            let to = unprodData[i].extraFrom;

            if (momentDevend < momentExtraFrom) {
                to = p.devend;
            }

            momentBase = moment(base, 'YYYY-MM-DD HH:mm:ss').valueOf();
            let momentTo = moment(to, 'YYYY-MM-DD HH:mm:ss').valueOf();

            if (momentBase >= momentTo) {
                isInserted = true;
                continue;
            }

            //  create running data from startPoint to unprodStartPoint
            let generatedData = timelineDataGenerator(
                p.devnme,
                -1,
                base,
                to,
                p.devjob,
                baseDate
            );
            generatedData = upGenerator(generatedData, to, p.devstt, p.devend);
            loc.push(generatedData);

            startPoint = unprodEndPoint;
            base = unprodData[i].extraTo;
            isInserted = true;

            if (i === unprodData.length - 1) {
                //  last data, check if filled to the end

                momentBase = moment(base, 'YYYY-MM-DD HH:mm:ss').valueOf();
                let momentDevend = moment(
                    p.devend,
                    'YYYY-MM-DD HH:mm:ss'
                ).valueOf();

                if (p.devend !== base && momentBase < momentDevend) {
                    //  fill to the end
                    lastData = timelineDataGenerator(
                        p.devnme,
                        -1,
                        base,
                        p.devend,
                        p.devjob,
                        baseDate,
                    );
                    lastData = upGenerator(
                        lastData,
                        p.devend,
                        p.devstt,
                        p.devend
                    );
                    loc.push(lastData);
                }
            }
        }
        if (!isInserted) {
            //  data was not inserted, which means it has no downtime data

            const momentBase = moment(base, 'YYYY-MM-DD HH:mm:ss').valueOf();
            const momentDevstt = moment(
                p.devstt,
                'YYYY-MM-DD HH:mm:ss'
            ).valueOf();

            if (momentBase < momentDevstt) {
                base = p.devstt;
            }

            if (base === p.devend) {
                return;
            }

            let generatedData = timelineDataGenerator(
                p.devnme,
                -1,
                base,
                p.devend,
                p.devjob,
                baseDate,
            );
            generatedData = upGenerator(
                generatedData,
                p.devend,
                p.devstt,
                p.devend
            );
            loc.push(generatedData);

            // startPoint = generatedData.y[1];
            startPoint = xPositionToDateTimeGraph({startDate: baseDate, xPosition: generatedData.y[1]}).valueOf();
            base = p.devend;
        }
    });
    return transformedData;
};

const processUnproductive = ({ unproductive, baseDate, removedData }) => {
    // console.log('processUnproductive');
    // console.log(unproductive);
    const transformedData = {};
    unproductive.forEach((u) => {
        //  check if this data's productive log was removed for being an overlap.
        let unproductiveDataHash = `${u.devdid}-${u.devsid}-${u.prodStart}-${u.prodEnd}`;
        if (!(unproductiveDataHash in removedData)) {
            let loc;
            if (!(`${u.devnme}` in transformedData)) {
                loc = [];
                transformedData[`${u.devnme}`] = loc;
            } else {
                loc = transformedData[`${u.devnme}`];
            }
            let generatedData = timelineDataGenerator(
                u.devnme,
                -1,
                u.devstt,
                u.devend,
                u.devjob,
                baseDate
            );
            generatedData = downGenerator(generatedData);
            generatedData.extraActualStart = u.prodStart;
            generatedData.extraActualEnd = u.prodEnd;
            generatedData.extraSchedID = u.devsid;
            loc.push(generatedData);
        }
    });
    return transformedData;
};

const processIdle = ({ productive, devices, startDate, endDate }) => {
    const transformedData = {};
    const momentStartDate = moment(startDate, 'YYYY-MM-DD HH:mm:ss').valueOf();
    const momentEndDate = moment(endDate, 'YYYY-MM-DD HH:mm:ss').valueOf();

    const sortedProductiveData = {};

    devices.forEach((d) => {
        if (!(`${d}` in transformedData)) {
            transformedData[`${d}`] = [];
            sortedProductiveData[`${d}`] = [];
        }
    });

    let loc;
    //  sort them
    productive.forEach((p) => {
        loc = sortedProductiveData[`${p.devnme}`];
        loc.push(p);
    });

    devices.forEach((d) => {
        let prodData = sortedProductiveData[`${d}`];
        let loc = transformedData[`${d}`];
        if (prodData.length !== 0) {
            //  get first and last productive data,
            //  try to fill between startDate - first prod and
            //  last prod - endDate
            const firstData = prodData[0];
            const firstDataMoment = moment(
                firstData.devstt,
                'YYYY-MM-DD HH:mm:ss'
            ).valueOf();

            if (momentStartDate < firstDataMoment) {
                let firstGeneratedData = timelineDataGenerator(
                    firstData.devnme,
                    -1,
                    startDate,
                    firstData.devstt,
                    'No Job',
                    startDate
                );
                firstGeneratedData = idleGenerator(
                    firstGeneratedData,
                    firstData.devstt
                );
                loc.push(firstGeneratedData);
            }

            const lastData = prodData[prodData.length - 1];
            const lastDataMoment = moment(
                lastData.devend,
                'YYYY-MM-DD HH:mm:ss'
            ).valueOf();

            if (momentEndDate > lastDataMoment) {
                let lastGeneratedData = timelineDataGenerator(
                    lastData.devnme,
                    -1,
                    lastData.devend,
                    endDate,
                    'No Job',
                    startDate
                );
                lastGeneratedData = idleGenerator(lastGeneratedData, endDate);
                loc.push(lastGeneratedData);
            }
        }

        if (prodData.length > 1) {
            for (let i = 0; i < prodData.length - 1; i++) {
                //  get current prod data
                const currentProd = prodData[i];
                //  get next prod data
                const nextProd = prodData[i+1];
                if (currentProd.devend === nextProd.devstt) {
                    continue;
                }
                let generatedData = timelineDataGenerator(
                    currentProd.devnme,
                    -1,
                    currentProd.devend,
                    nextProd.devstt,
                    'No Job',
                    startDate
                );
                generatedData = idleGenerator(generatedData, nextProd.devstt);
                loc.push(generatedData)
            }
        }
    });

    // console.log('sorted prod data');
    // console.log(sortedProductiveData);

    return transformedData;
};



const calculateStripLines = ({noOfData, xValue}) => {
    switch (noOfData) {
        case 5:
            return 0.6643313260316049 + (((0.004506325021218119) * xValue) * (-1))
    }
};

const addBorderToDataPoint = (chart, borderWidth) => {
    if (chart === undefined) {
        return;
    }
    const ctx = chart.ctx;
    ctx.save();
    const plotArea = chart.plotArea;
    ctx.beginPath();
    ctx.rect(plotArea.x1, plotArea.y1, plotArea.x2 - plotArea.x1, plotArea.y2 - plotArea.y1);
    ctx.clip();
    ctx.lineWidth = 0.4;

    for (let i = 0; i < chart.data.length; i++) {
        if (chart.data[i].type === 'rangeBar') {
            for (let j = 0; j < chart.data[i].dataPointIds.length; j++) {
                let dataPointInfo = chart._eventManager.objectMap[chart.data[i].dataPointIds[j]];
                
                if (dataPointInfo === undefined) {
                    continue;
                }
                ctx.beginPath();
                // ctx.rect(dataPointInfo.x1, dataPointInfo.y1, dataPointInfo.x2 - dataPointInfo.x1, 1);
                ctx.moveTo(dataPointInfo.x1, dataPointInfo.y1);
                ctx.lineTo(dataPointInfo.x2, dataPointInfo.y1);
                ctx.closePath();
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(dataPointInfo.x1, dataPointInfo.y2);
                ctx.lineTo(dataPointInfo.x2, dataPointInfo.y2);
                ctx.closePath();
                ctx.stroke();
            }
        }
    }
    ctx.restore();
};

$(document).on('click', '#timechart-content button[title="Pan"]', () => {
    console.log('pan clicked!');
    console.log(currentTimechart);
    addBorderToDataPoint(currentTimechart, 2);
});

$(document).on('click', '#timechart-content button[title="Zoom"]', () => {
    addBorderToDataPoint(currentTimechart, 2);
})