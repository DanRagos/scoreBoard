const SCHEDULE_DEVICE_PER_PAGE = 10;

const scheduleVisualObjects = {
    from: '',
    to: '',
    originalInterval: 0,
};

const scheduleTestCanvas = document.createElement('canvas');
scheduleTestCanvas.width = document.width;
scheduleTestCanvas.height = document.height;
const testContext = scheduleTestCanvas.getContext('2d');
testContext.font = '15px Arial';

//  resets all index labels back to using what the indexLabelFormatter method supplies
const resetIndexLabels = (data) => {
    data.forEach((d) => {
        d.indexLabel = '';
    })
};

const scheduleChartZoomEventHandler = (e) => {
    currentTimechart = e.chart;
    if (e.trigger === 'zoom') {
        const viewportMin = e.axisY[0].viewportMinimum;
        const viewportMax = e.axisY[0].viewportMaximum;
        const range = viewportMax - viewportMin;
      
        //  use same strategy for figuring out new interval
        let rangeMutable = range;
        const interval = calculateTimeGraphInterval({numberOfMinutes: range});
        // console.log(`new interval: ${interval}`);

        e.chart.axisY[0].set('interval', interval, true);
        let labelAngle = e.chart.axisY[0].labelAngle;
        // while (labelAngle !== 0) {
        //     rangeMutable *= 2;
        //     e.chart.axisY[0].set('interval', calculateTimeGraphInterval({numberOfMinutes: rangeMutable}));
        //     labelAngle = e.chart.axisY[0].labelAngle;
        // }
        dynamicInterval(rangeMutable, e.chart, labelAngle);

    } else if (e.trigger === 'reset') {
        e.chart.axisY[0].set('interval', scheduleVisualObjects.originalInterval, true);
        let labelAngle = e.chart.axisY[0].labelAngle;
        let rangeMutable = scheduleVisualObjects.originalInterval;
        // while (labelAngle !== 0) {
        //     rangeMutable *= 2;
        //     e.chart.axisY[0].set('interval', calculateTimeGraphInterval({numberOfMinutes: rangeMutable}));
        //     labelAngle = e.chart.axisY[0].labelAngle;
        // }
        dynamicInterval(rangeMutable, e.chart, labelAngle);
        resetIndexLabels(e.chart.options.data[0].dataPoints);
    }
};

const indexLabelHandler = (e) => {
    const y0bound = e.axisY[0].viewportMinimum;
    const y1bound = e.axisY[0].viewportMaximum;
    const data = e.chart.options.data[0].dataPoints;
    //  only process data that started before the bound, but ended after the bound
    const filteredY0Data = data.filter((d) => {
        return d.y[0] < y0bound && d.y[1] > y0bound;
    });

    filteredY0Data.forEach((f) => {
        const start = e.chart.axisY[0].convertValueToPixel(y0bound);
        const end = e.chart.axisY[0].convertValueToPixel(f.y[1]);
        const rangeBarWidth = end - start;
        const textToDisplay = `${f.extraJob}, \n${f.extraModel}, ${f.extraMaterial}`;
        const textWidth = testContext.measureText(textToDisplay).width;
        if (textWidth + 10 > rangeBarWidth) {
            //  replace the indexlabel formatter with a blank space, which hides it.
            f.indexLabel = " ";
        } else {
            //  resets the index label.
            f.indexLabel = "";
        }
    });

    const filteredY1Data = data.filter((d) => {
        return d.y[0] < y1bound && d.y[1] > y1bound;
    });

    filteredY1Data.forEach((f) => {
        const start = e.chart.axisY[0].convertValueToPixel(f.y[0]);
        const end = e.chart.axisY[0].convertValueToPixel(y1bound);
        const rangeBarWidth = end - start;
        const textToDisplay = `${f.extraJob}, \n${f.extraModel}, ${f.extraMaterial}`;
        const textWidth = testContext.measureText(textToDisplay).width;
        if (textWidth + 10 > rangeBarWidth) {
            //  replace the indexlabel formatter with a blank space, which hides it.
            f.indexLabel = " ";
        } else {
            //  resets the index label.
            f.indexLabel = "";
        }
    });

};

const processPagination = (dataset) => {
    let pagination = {};
    let currentPaginationIndex = 0;

    let currentCount = 0;

    //  get unique x values
    const uniqueXValues = [...new Set(dataset.map(i => i.x))];

    const paginationIndex = {};

    //  group x values by the device per page variable
    for (let i = 0; i < uniqueXValues.length; i++) {
        if (currentCount >= SCHEDULE_DEVICE_PER_PAGE) {
            currentCount = 0;
            currentPaginationIndex++;
        }
        //  check if pagination exists
        if (!(uniqueXValues[i] in pagination)) {
            paginationIndex[uniqueXValues[i]] = currentPaginationIndex;
            pagination[currentPaginationIndex] = [];
        }
        currentCount++;
    }

    dataset.forEach((d) => {
        //  get pagination to insert to
        const index = paginationIndex[d.x];
        const activePagination = pagination[index];
        activePagination.push(d);
    });

    Object.values(pagination).forEach((p, ii) => {
        let oldIndexVal = '';
        let index = -1;
        let oldLabel = '';
        p.forEach((d) => {
            if (oldIndexVal !== d.x) {
                if (oldLabel !== d.label) {
                    index += 1;
                    oldLabel = d.label;
                } else {
                    index += 0.5; 
                }
                oldIndexVal = d.x;
            }
            d.x = index;
        });
    });

    return pagination;
};

const getScheduleChartData = () => {
    // console.trace();
    const from = flags.schedule.dateToUse.fr;
    const to = flags.schedule.dateToUse.to;

    const processedData = processScheduleChart(from, to);

    let combinedDataset = [];
    Object.keys(processedData).forEach((label) => {
        processedData[label].forEach((arr) => {
            combinedDataset = combinedDataset.concat(arr.data);
        });
    });

    // console.log('combinedDataset');
    // console.log(combinedDataset);

    let pagination = {};

    pagination = processPagination(combinedDataset);

    // Object.values(pagination).forEach((arr) => {
    //     const dummy = {x: 0.5, y: [0, 1000], extraJob: '', extraModel: '', extraMaterial: '', extraOperator: '', extraTargetQty: '', extraFrom: '', extraTo: '', label: ''};
    //     arr.push(dummy);
    // });

    //  console.trace();

    // console.log('pagination');
    // console.log(pagination);

    return pagination;
};

const initScheduleChart = (theme, data) => {
    const from = flags.schedule.dateToUse.fr;
    const to = flags.schedule.dateToUse.to;

    const xPos = Math.ceil(dateToXPositionTimeGraph({
        baseDate: from,
        date: to
    }));
    
    const interval = calculateTimeGraphInterval({numberOfMinutes: xPos});

    const titleObject = {
        text: '',
        verticalAlign: 'center',
        horizontalAlign: 'center',
        fontSize: 25,
    };

    const joblbl = lang[flags.pref.lang].jobdetails.jobcap;
    const modellbl = lang[flags.pref.lang].jobdetails.model;
    const materiallbl = lang[flags.pref.lang].jobdetails.material;
    const targetqtylbl = lang[flags.pref.lang].jobdetails.target;
    const operatorlbl = lang[flags.pref.lang].jobdetails.operator;
    const jobstartlbl = lang[flags.pref.lang].chart.start;
    const jobendlbl = lang[flags.pref.lang].chart.end;

    $('#schedchart').html('');

    const chart = new CanvasJS.Chart('schedchart', {
        theme,
        animationEnabled: false,
        zoomEnabled: true,
        zoomType: 'y',
        // dataPointWidth: 30,
        axisX:{
            reversed:  true,
            margin: 100,
            gridColor: 'white',
            lineThickness: 0,
            labelFontSize: 20,
            // maximum: 10,
            minimum: -1,
            // labelFormatter: (e) => {
            //     if (e.label !== null) {
            //         return e.label;
            //     }
            //     return ' ';
            // },
            labelFormatter: (e) => {
                return '';
            },
            interval: 0.5,
            tickLength: 0,
        },
        axisY: {
            labelFontSize: 10,
            margin: 20,
            minimum: 0,
            maximum: dateToXPositionTimeGraph({
                baseDate: from,
                date: to,
            }),
            labelMaxWidth: 30,
            labelFormatter: function (e) {
                if (e.axis.interval >= 1440) {
                    return xPositionToDateTimeGraph({
                        startDate: from,
                        xPosition: e.value
                    }).format('MM-DD');
                }
                return xPositionToDateTimeGraph({
                    startDate: from,
                    xPosition: e.value
                }).format('MM-DD HH:mm');
            },
            gridThickness: 0,
            lineThickness: 1,
            interval,
        },
        toolTip: {
            content: (e) => {
                const {
                    label,
                    extraJob,
                    extraModel,
                    extraMaterial,
                    extraFrom,
                    extraTo,
                    extraTargetQty,
                    extraOperator,
                } = e.entries[0].dataPoint;
                let toolTipContent = `<b>${label}</b> <br /> ${joblbl}: ${extraJob} <br /> ${modellbl}: ${extraModel} <br /> ${materiallbl}: ${extraMaterial} <br />${targetqtylbl}: ${extraTargetQty} <br /> ${operatorlbl}: ${extraOperator} <br /> ${jobstartlbl}: ${extraFrom} <br /> ${jobendlbl}: ${extraTo}`;

                return toolTipContent;
            },
        },
        rangeChanging: (e) => {
            scheduleChartZoomEventHandler(e);
            indexLabelHandler(e);
        },
        rangeChanged: (e) => {
            if (e.trigger !== 'reset') {
                overlayLabels(e.chart, flags.schedule.chartData[flags.schedule.chartCurrentPage]);
            }
        },
        data: [
            {
                type: 'rangeBar',
                indexLabelWrap: true,
                indexLabelFormatter: (e) => {
                    // console.log(e);

                    //  using these variables directly causes a bug with datapoints longer than the range given
                    const startDatapoint = e.chart.axisY[0].convertValueToPixel(e.dataPoint.y[0]);
                    const endDatapoint = e.chart.axisY[0].convertValueToPixel(e.dataPoint.y[1]);

                    //  get the chart's start bound and end bounds
                    
                    const y0bound = e.chart.axisY[0].convertValueToPixel(e.chart.axisY[0].viewportMinimum);
                    const y1bound = e.chart.axisY[0].convertValueToPixel(e.chart.axisY[0].viewportMaximum);
                    
                    //  use whichever is higher
                    const start = startDatapoint > y0bound ? startDatapoint : y0bound;
                    //  use whichever is lower
                    const end = endDatapoint < y1bound ? endDatapoint : y1bound;

                    

                    const rangeBarWidth = end - start;
                    if(e.index === 0) {
                        const textToDisplay = `${e.dataPoint.extraJob}, \n${e.dataPoint.extraModel}, ${e.dataPoint.extraMaterial}`;
                        const textWidth = testContext.measureText(textToDisplay).width;
                        // console.log(`rangeBarWidth: ${rangeBarWidth}`);
                        // console.log(`textWidth: ${textWidth}`);
                        if (textWidth + 10 < rangeBarWidth) {
                            return `${e.dataPoint.extraJob}, \n${e.dataPoint.extraModel}, ${e.dataPoint.extraMaterial}`;
                        }
                        return " ";
                    }
                    else {
                        return " ";
                    }
                },
                indexLabelPlacement: 'inside',
                indexLabelFontSize: 15,
                indexLabelFontFamily: 'calibri',
                dataPoints: data,
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

    if (data !== undefined) {
        chart.axisX[0].set('maximum', data[data.length - 1].x + 1);
    }
    overlayLabels(chart, data);

    scheduleVisualObjects.originalInterval = chart.axisY[0].interval;

    // console.log(chart);
    return chart;
};

const processScheduleChart = (from, to) => {
    // console.log(flags.schedule.data);

    const sortedData = scheduleSortByDeviceName(flags.schedule.data);
    // console.log(sortedData);
    const labels = Object.keys(sortedData);

    const toFormatted = dateToXPositionTimeGraph({
        baseDate: from,
        date: to,
    });

    let staggeredData = {};
    let currentXIndex = 1;
    labels.forEach((label) => {
        //  sort by start date, ascending
        sortedData[label] = sortedData[label].sort((a, b) => {
            const aMoment = moment(a.devstt, 'YYYY-MM-DD HH:mm:ss');
            const bMoment = moment(b.devstt, 'YYYY-MM-DD HH:mm:ss');
            return aMoment - bMoment;
        });

        const dataArray = [];
        const firstLine = {data: [], latestEndDate: 0};
        // dataArray.push(firstLine);
        sortedData[label].forEach((d) => {
            const generatedData = scheduleGenerator(d, from, to);
            let isInserted = false;
            for (let i = 0; i < dataArray.length; i++) {
                const currentLine = dataArray[i];
                if (currentLine.latestEndDate === -1) {
                    //  currentLine's latest data has no end.
                    //  turn last data's y[1] into generated data's y[0]]
                    //  check previously inserted data devstart for conflict

                    const previouslyInsertedData = currentLine.data[currentLine.data.length - 1];

                    if (previouslyInsertedData.y[0] === generatedData.y[0]) {
                        break;
                    }
                    if (previouslyInsertedData.y[0] < generatedData.y[0]) {
                        previouslyInsertedData.y[1] = generatedData.y[0] - 3; //  subtract 3 of its value for spacing
                        currentLine.data.push(generatedData);
                        currentLine.latestEndDate = generatedData.y[1];
                        isInserted = true;
                        break;
                    }

                }
                if (currentLine.latestEndDate <= generatedData.y[0]) {
                    currentLine.data.push(generatedData);
                    currentLine.latestEndDate = generatedData.y[1];
                    isInserted = true;
                    break;
                }
            }

            if (!isInserted) {
                //  create new line
                const newLine = {data: [], latestEndDate: 0};
                newLine.data.push(generatedData);
                newLine.latestEndDate = generatedData.y[1];
                dataArray.push(newLine);
            }
        });
        for (let i = 0; i < dataArray.length; i++) {
            dataArray[i].data.forEach((d) => {
                d.x = currentXIndex;
                // d.label = `${d.label}-${i+1}`;
                d.label = `${d.label}`;
            });
            if (dataArray[i].latestEndDate === -1) {
                //  get last data, set its y[1] to end date filter
                const lastData = dataArray[i].data[dataArray[i].data.length - 1];
                lastData.y[1] = toFormatted;
            }
            if (i !== dataArray.length - 1) {
                currentXIndex += 1;
            }
        }
        staggeredData[label] = dataArray;
        currentXIndex += 1;
    });

    // console.log('staggered data');
    // console.log(staggeredData);
    return staggeredData;
};

const scheduleGenerator = (data, base, to) => {
    const dateToMoment = moment(to, 'YYYY-MM-DD HH:mm:ss');
    const dateFromMoment = moment(base, 'YYYY-MM-DD HH:mm:ss');
    const fromFormatted = dateToXPositionTimeGraph({
        baseDate: base,
        date: data.devstt
    });
    let toFormatted;
    if (data.devend === '--') {
        toFormatted = -1;
    } else {
        toFormatted = dateToXPositionTimeGraph({
            baseDate: base,
            date: data.devend
        });
    }

    let color = 'rgba(33,150,243,1)'; // blue

    if (data.devend !== '--') {
        const momentdevend = moment(data.devend, 'YYYY-MM-DD HH:mm:ss');
        const momentdevstart = moment(data.devstt, 'YYYY-MM-DD HH:mm:ss');

        if (momentdevend > dateToMoment || momentdevstart < dateFromMoment) {
            color = 'rgba(255,167,38,1)'; // yellow
        }
    } else {
        color = 'rgb(33,150,243,0.4)';
    }

    return {
        x: -1,
        y: [fromFormatted, toFormatted],
        extraJob: data.devjob,
        extraModel: data.devmod,
        extraMaterial: data.devmat,
        extraFrom: data.devstt,
        extraTo: data.devend,
        extraTargetQty: data.devtgt,
        extraOperator: data.devopr,
        label: data.devnme,
        color
    };
};

const scheduleGetXIndexFromLabel = (label, labelsArray) => {
    let xLocation = labelsArray[`${label}`];
    if (xLocation === undefined) {
        xLocation = SCHEDULE_DEVICE_PER_PAGE - Object.keys(labelsArray).length + 1;
    }
    return xLocation;
};

const scheduleSortByDeviceName = (data) => {
    data = data.sort((a, b) => {
        return collator.compare(a.devnme, b.devnme);
    });
    let sortedData = {};
    data.forEach((d) => {
        if (d.devnme in sortedData) {
            sortedData[d.devnme].push(d);
        } else {
            sortedData[d.devnme] = [d];
        }
    });
    return sortedData;
};


const overlayLabels = (chart, data) => {
    if (data === undefined)  {
        return;
    }

    const labelStartEndMap = {};

    for (let i = 0; i < data.length; i++) {
        const currentData = data[i];
        if (currentData.label in labelStartEndMap) {
            continue;
        }
        const filteredData = data.filter(f => f.label === currentData.label);
        const start = filteredData[0].x;
        const end = filteredData[filteredData.length - 1].x;
        labelStartEndMap[`${currentData.label}`] = {
            label: currentData.label,
            start,
            end,
            mid: (start + end) / 2
        };
    }
    
    const ctx = chart.ctx;
    ctx.save();
    
    ctx.font = "12px sans-serif";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 0.3;

    const radius = 4;


    Object.values(labelStartEndMap).forEach((l, index) => {
        const xPixelVal = chart.axisX[0].convertValueToPixel(l.mid);
        const xPixelStart = chart.axisX[0].convertValueToPixel(l.start - 0.5);
        const xPixelEnd = chart.axisX[0].convertValueToPixel(l.end + 0.5);
        const measuredText = ctx.measureText(l.label);
        const textWidth = measuredText.width;
        
        // const labelGradient = ctx.createLinearGradient(0, xPixelVal - 20, 0, xPixelVal + 50);
        const labelGradient = ctx.createLinearGradient(0, xPixelVal-50, 0, xPixelVal + 20);

        // labelGradient.addColorStop(1, 'rgba(158,158,158,1)');
        // labelGradient.addColorStop(0, 'rgba(158,158,158,0.1)');

        labelGradient.addColorStop(1, 'rgba(76,175,80,1)');
        labelGradient.addColorStop(0, 'rgba(76,175,80,0.1)');

        // const textHeight = measuredText.height;
        // ctx.moveTo(80, xPixelVal);
        // ctx.lineTo(100, xPixelVal);

        /******* borders ******/  
        ctx.beginPath();
        ctx.moveTo(100, xPixelEnd);
        ctx.lineTo(chart.width - 25, xPixelEnd);
        ctx.closePath();
        ctx.fillStyle = '#fff';
        if (flags.pref.theme === 'dark') {
            ctx.strokeStyle = '#fff';
        } else {
            ctx.strokeStyle = '#000'; 
        }
        ctx.stroke();
        /**********************/

        ctx.beginPath();
        if (index === 0) {
            ctx.moveTo(100, xPixelStart);
            ctx.lineTo(chart.width - 25, xPixelStart);
        }

        const xStart = 5;
        const xEnd = 85;
        const yStart = xPixelVal - 20;
        const yEnd = xPixelVal + 20;
        
        ctx.moveTo(xStart + radius, yStart);
        ctx.lineTo(xEnd - radius, yStart);
        ctx.quadraticCurveTo(
            xEnd,
            yStart,
            xEnd,
            yStart + radius
        );
        ctx.lineTo(xEnd, yEnd - radius);
        ctx.quadraticCurveTo(
            xEnd, 
            yEnd, 
            xEnd - radius, 
            yEnd
        );
        ctx.lineTo(xStart + radius, yEnd);
        ctx.quadraticCurveTo(
            xStart,
            yEnd,
            xStart,
            yEnd - radius
        );
        ctx.lineTo(xStart, yStart + radius);
        ctx.quadraticCurveTo(xStart, yStart, xStart + radius, yStart);



        //  old box implementation
        // ctx.moveTo(5, xPixelVal - 20);
        // ctx.lineTo(85, xPixelVal - 20);
        // ctx.lineTo(85, xPixelVal + 20);
        // ctx.lineTo(5, xPixelVal + 20);
        // ctx.lineTo(5, xPixelVal - 20);
        
        ctx.closePath();
        ctx.fillStyle = labelGradient;
        ctx.fill();
        ctx.fillStyle = "#fff";

        const textLength = ctx.measureText(l.label).width;
        // console.log(`textLength: ${textLength}`);
        length = 50 - (ctx.measureText(l.label).width / 2);

        ctx.textAlign = 'center';
        ctx.fillText(l.label, 45, xPixelVal);
        

    });
    ctx.restore();

    // console.log('overlayLabels()');

};

let scheduleChartPagination = {};

$(document).on('click', '#schedchart button', () => {
    overlayLabels(flags.schedule.chartObject, flags.schedule.chartData[flags.schedule.chartCurrentPage]);
});
