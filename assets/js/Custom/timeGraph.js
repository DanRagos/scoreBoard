/** All available attributes **/
var paramList = [
	'title',
	'bg',
	'dimension',
	'width',
	'height',
	'instance',
	'minDate',
	'maxDate',
	'start',
	'length',
	'animationDelay',
	'chartColors',
	'legend',
	'labelPosition',
	'chartoffset-top',
	'chartoffset-bot',
	'chartoffset-lft',
	'chartoffset-rth',
	'pageItems',
	'dateRange',
];

var _workerDraw, _workerDown;
/*
 * REFERENCES:
 * Data sample
	* <start>, <end>, <logid>, <jobid>
	sampledata = [
		[
			[ '2019-10-07 00:00:00', '2019-10-07 05:30:00', '1', '1' ],
			[ '2019-10-07 00:00:00', '2019-10-07 05:45:00', '1', '1' ],
			[ '2019-10-07 00:00:00', '2019-10-07 06:00:00', '1', '1' ],
			[ '2019-10-07 00:00:00', '2019-10-07 06:15:00', '1', '1' ],
			[ '2019-10-07 00:00:00', '2019-10-07 06:30:00', '1', '1' ],
			[ '2019-10-08 08:00:00', '2019-10-08 09:15:00', '4', '1' ],
			[ '2019-10-08 08:00:00', '2019-10-08 09:30:00', '4', '1' ],
			[ '2019-10-07 00:00:00', '2019-10-07 05:30:00', '1', '2' ],
			[ '2019-10-07 00:00:00', '2019-10-07 05:45:00', '1', '2' ],
			[ '2019-10-07 00:00:00', '2019-10-07 06:00:00', '1', '2' ],
		],
		[
			[ '2019-10-07 01:00:00', '2019-10-07 03:30:00', '1', '1' ],
			[ '2019-10-07 01:00:00', '2019-10-07 04:45:00', '1', '1' ],
			[ '2019-10-07 05:00:00', '2019-10-07 05:15:00', '2', '1' ],
			[ '2019-10-07 11:00:00', '2019-10-07 12:15:00', '5', '1' ],
			[ '2019-10-07 11:00:00', '2019-10-07 12:30:00', '5', '1' ],
			[ '2019-10-07 01:00:00', '2019-10-07 03:30:00', '1', '2' ],
			[ '2019-10-07 01:00:00', '2019-10-07 04:45:00', '1', '2' ],
			[ '2019-10-07 05:00:00', '2019-10-07 05:15:00', '2', '2' ],
		]
	];

 * initialization
	* html
	<div style="width:100%; height:500px">
		<svg id="chart-1" width="100%" height="100%"></svg>
	</div>

	* js
 	var mygraph = new initTimechart({
		'element': '#chart-1',
		'dimension': 'auto',
		'instance': [ 'Machine 1', 'Machine 2', 'Machine 3', 'Machine 4', 'Machine 5', 'Machine 6' ],
		'labelPosition': 'top',
		'minDate': '2019-10-15',
		'maxDate': '2019-10-16',
		'chartColors': [ "rgba(0, 204, 0, 0.6)", "rgba(200, 0, 0, 0.8)" ],
		'legend': [ 'Productive', 'Unproductive' ],
	});

 * Usage sample
	mygraph.attr({
		'minDate': ($('#fr').val()).split(' ')[0],
		'maxDate': ($('#to').val()).split(' ')[0]
	});
	mygraph.refresh();
	mygraph.plotMultiGraph(testDataMulti);
 *
 * End
 */

function initTimegraph(params) {
	if(params.element == '' || params.element === null) {
		return console.error('No element declared');
	}

	var that = this;
	this._elem = params.element;
	this._chart = {};
	this._attr = {
		'title': 'TimeChart',
		'bg': 'default',
		'dimension': 'auto',
		'x': 0,
		'y': 0, 
		'w': 0, 
		'h': 0,
		'dx': 0,
		'dy': 0,
		'dw': 0,
		'dh': 0,
		'interval': 1,
		'topOffset': 65,
		'btmOffset': 40,
		'lftOffset': 15,
		'rthOffset': 15,
		'txtOffset': 8,
		'range': 24,
		'rangeOffset':0,
		'borderrad': 5,
		'graphOffset': 0.5,
		'graphClr': [ 'blue', 'red', 'green', 'yellow', 'violet', 'pink' ],
		'animDelay': 200,
		'dataset': {},
		'legend': [],
		'graphTempClr': '',
		'minDate': '',
		'maxDate': '',
		'instance': [],
		'labelPos': 'bottom',
		'pageItems': 6,
		'page': 1,
		'pageTxt': '',
		'currentPage': 1,
		'dateRange': '',
	};
	var _lbl = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24' ];
	var _attrClr = {
		'default': {
			'text': '#666666',
			'legend': 'black',
			'grid': 'rgba(0,0,0,0.8)',
			'base': '#cccccc',
			'placeholder': 'rgba(0,0,0,0.05)'
		},
		'dark': {
			'text': '#ffffff',
			'legend': 'white',
			'grid': 'rgba(255,255,255,0.8)',
			'base': 'rgba(255,255,255,0.7)',
			'placeholder': 'rgba(255,255,255,0.1)'
		}
	};

	this.attr = function(dataset) {
		if($.isEmptyObject(dataset) || $.isEmptyObject($(this._elem))) {
			return;
		}

		this._attr.dimension = dataset.dimension === undefined ? this._attr.dimension : dataset.dimension;
		switch(this._attr.dimension) {
			case 'manual':
				this._attr.w = parseFloat(dataset.width);
				this._attr.h = parseFloat(dataset.height);
				break;

			case 'auto':
				this._attr.w = parseFloat($(this._elem).width());
				this._attr.h = parseFloat($(this._elem).height());
				break;

			default:
				console.error("Invalid dimension setting detected");
				return;
		}

		this._attr.topOffset = dataset['chartoffset-top'] === undefined ? this._attr.topOffset : parseFloat(dataset['chartoffset-top']);
		this._attr.btmOffset = dataset['chartoffset-bot'] === undefined ? this._attr.btmOffset : parseFloat(dataset['chartoffset-bot']);
		this._attr.lftOffset = dataset['chartoffset-lft'] === undefined ? this._attr.lftOffset : parseFloat(dataset['chartoffset-lft']);
		this._attr.rthOffset = dataset['chartoffset-rth'] === undefined ? this._attr.rthOffset : parseFloat(dataset['chartoffset-rth']);
		this._attr.animDelay = dataset.animationDelay === undefined ? this._attr.animDelay : parseInt(dataset.animationDelay);
		this._attr.range = dataset.length === undefined ? this._attr.range : parseInt(dataset.length);
		this._attr.legend = dataset.legend === undefined ? this._attr.legend : dataset.legend;
		this._attr.minDate = dataset.minDate === undefined ? this._attr.minDate : dataset.minDate;
		this._attr.maxDate = dataset.maxDate === undefined ? this._attr.maxDate : dataset.maxDate;
		this._attr.instance = dataset.instance === undefined ? this._attr.instance : dataset.instance;
		this._attr.labelPos = dataset.labelPosition === undefined ? this._attr.labelPos : dataset.labelPosition;
		this._attr.graphClr = $.isEmptyObject(dataset.chartColors) ? this._attr.graphClr : dataset.chartColors;
		this._attr.rangeOffset = dataset.start === undefined ? this._attr.rangeOffset : dataset.start;
		this._attr.bg = dataset.bg === undefined ? this._attr.bg : dataset.bg;
		this._attr.title = dataset.title === undefined ? this._attr.title : dataset.title;
		this._attr.pageItems = dataset.pageItems === undefined ? this._attr.pageItems : parseInt(dataset.pageItems);
		this._attr.page = Math.ceil(parseInt(this._attr.instance.length) / parseInt(this._attr.pageItems));
		this._attr.dateRange = dataset.dateRange === undefined ? '' :  dataset.dateRange;
	}

	this._initialize = function() {
		this._attr.dx = this._attr.x + this._attr.lftOffset;
		this._attr.dy = this._attr.y + this._attr.topOffset;
		this._attr.dw = this._attr.w - this._attr.lftOffset - this._attr.rthOffset;
		this._attr.dh = this._attr.h - this._attr.topOffset - this._attr.btmOffset;

		if(this._attr.range > 48) {
			this._attr.interval = 2;
			if(this._attr.range > 96) {
				this._attr.interval = 4;
				if(this._attr.range > 192) {
					this._attr.interval = 6;
					if(this._attr.range > 240) {
						this._attr.interval = 12;
					}
				}
			}
		} else {
			this._attr.interval = 1;
		}

		var gridDistance = (this._attr.dw * this._attr.interval) / this._attr.range;

		/** grid base **/
		var gb = this._chart.rect(this._attr.dx, this._attr.dy, this._attr.dw, this._attr.dh, this._attr.borderrad, this._attr.borderrad).attr({
			fill: "none",
			stroke: _attrClr[this._attr.bg].base,
			strokeWidth: 1
		});

		/** background grid **/
		var gridDistance_bg;
		if (this._attr.range <= 2) {
			gridDistance_bg = gridDistance/4;
		} else if (this._attr.range <= 8) {
			gridDistance_bg = gridDistance/2;
		} else {
			gridDistance_bg = gridDistance;
		}
		var instanceHt = this._attr.dh / ((2 * this._attr.pageItems) - 1);
		var path = "M " + this._attr.dw + " " + this._attr.dy + " L " + this._attr.dx + " " + this._attr.dy + " " + this._attr.dx + " " + this._attr.dh;
		var p = this._chart.path(path).attr({
			fill: "none",
			stroke: _attrClr[this._attr.bg].text,
			strokeWidth: this._attr.graphOffset
		}).pattern(this._attr.dx, this._attr.dy, gridDistance_bg, instanceHt);

		gb.attr({ fill: p });

		/** ui base **/
		var uib = this._chart.rect(this._attr.x, this._attr.y, this._attr.w, this._attr.h, this._attr.borderrad, this._attr.borderrad).attr({
			fill: "none",
			stroke: _attrClr[this._attr.bg].grid,
			strokeWidth: 1.5
		});

		/** chart label **/
		const offset = 2.5;
		var firstDate = true, dateDisplay = this._attr.minDate;
		var y = this._attr.dy + (this._attr.labelPos == 'top' ? -10 : this._attr.dh + 5);
		var lbl_range = this._attr.range <= 8 ? (this._attr.range / this._attr.interval) * 2 : this._attr.range / this._attr.interval;
		for(var i = 0; i <= lbl_range; i++) {
			var x = this._attr.dx + (gridDistance * i);
			var lblIndex = (( (i) * this._attr.interval ) + this._attr.rangeOffset) % 24; 
			var lbl = this._chart.text(x - offset, y, _lbl[lblIndex]);
			var dateLabelStart = Math.floor(parseFloat(_lbl[lblIndex]) / this._attr.interval) == 0 ? true : false;
			lbl.attr({ 
				textpath: "M" + 0 + "," + (y + this._attr.txtOffset) + "L" + (this._attr.dx + this._attr.dw + 15) + "," + (y + this._attr.txtOffset),
				fontSize: '0.65rem',
				fill: _attrClr[this._attr.bg].text,
				fontFamily: 'arial',
				strokeWidth: 0.5
			});
			/** Every 0 label, put a date on top of it **/
			if( (dateLabelStart || firstDate) && dateDisplay != '' && i < ( this._attr.range / this._attr.interval) ) {
				var newy = y + (this._attr.labelPos == 'top' ? -8 : 24)
				var newht = this._computeFontSize(this._attr.range);
				this._chart.text(x, newy, dateDisplay).attr({
					fontSize: newht,
					fontFamily: 'arial',
					fill: _attrClr[this._attr.bg].text,
					fontWeight: 'bolder',
					strokeWidth: 0
				}).addClass('chartDate');

				var d = new Date(dateDisplay);
				var m = moment(d, "YYYY-MM-DD");
				m.add(1, 'days');
				d = m.toDate();
				dateDisplay = moment(d).format("YYYY-MM-DD");
				firstDate = false;
			}
		}

		/** TEXT LABEL (LEFT) **/
		const textLabelClr = [ '#424242', '#b71c1c', '#FF8F00', '#2196F3', '#FF5722', '#2E7D32', '#424242' ];
		const nameOffset = 5;
		const graphHeight = instanceHt;
		for(var i = 0; i < this._attr.pageItems; i++) {
			/** Graph Text Label BG **/
			this._chart.rect(this._attr.dx - 90, this._attr.dy + (instanceHt * ((i * 2))), 80, graphHeight, 5, 5).attr({
				fill: textLabelClr[i],
				stroke: "none",
				strokeWidth: 0
			});
			/** Graph text label **/
			this._chart.text(this._attr.dx - 50, this._attr.dy + (nameOffset - (graphHeight/2)) /*(nameOffset - (0.48 * this._attr.pageItems))*/ + (instanceHt * ((i * 2) + 1)), 
				(this._attr.instance[i] === undefined ? 'No assigned device' : this._attr.instance[i]) ).attr({
				fontSize: (0.9 - (0.02 * this._attr.pageItems)) + 'rem',
				fontFamily: 'arial',
				fill: '#FFFFFF',
				fontWeight: 'bolder',
				strokeWidth: 0,
				textAnchor: 'middle'
			}).addClass('instanceName');
			/** Graph bg identifier can be removed (ALT COLOR INSIDE GRAPH) **/
			this._chart.rect(this._attr.dx, this._attr.dy + (instanceHt * (i * 2)), this._attr.dw, graphHeight, 0, 0).attr({
				fill: _attrClr[this._attr.bg].placeholder,
				stroke: "none",
				strokeWidth: 0
			});
		}
	}

	this._computeFontSize = function(arg) {
		let val;

		if (arg >= 600) {
			val = '0.5rem';
		} else if (arg >= 360) {
			val = '0.65rem';
		} else {
			val = '0.75rem';
		}

		return val;
	}

	this._addBgToText = function(x, y, wd, ht) {
		// var bbox = textElement.getBBox();
		// var width = bbox.width;
		// var height = bbox.height;

		//or

		// var oof = this._chart.text(...)
		// console.log('Text Length: ' + oof.node.textLength.baseVal.value);
		// this._addBgToText(oof.node.x.baseVal[0].value,oof.node.y.baseVal[0].value,oof.node.textLength.baseVal.value,graphHeight);

		this._chart.rect(x - wd, y, wd, ht, 5, 5).attr({
			fill: 'rgba(0, 204, 0, 0.6)',
		});
	}

	this._timeParser = function(str) {
		var temp;

		if(str.indexOf(' ') < 0) {
			temp = str.split(':');
		} else {
			temp = (str.split(' '))[1].split(':');
		}
		return parseInt(temp[0]) + (parseInt(temp[1])/60) + (parseInt(temp[2])/3600);
	}

	/** yyyy-mm-dd **/
	this._dateParser = function(str) {
		const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		var temp;

		if(str.indexOf(' ') < 0) {
			temp = str.split('-');
		} else {
			temp = (str.split(' '))[0].split('-');
		}
		return month[parseInt(temp[1]) - 1] + ' ' + temp[2] + ' ' + temp[0];
	}

	this._timeCompare = function(fr, to) {
		var a = moment(fr);
		var b = moment(to);

		return (b.diff(a, 'seconds') / 3600);
	}

	this._datecompare = function(ref, data) {
		var retval = 0, res = moment(ref).isSame(data, 'day');

		if(!res) {
			retval = moment(data.split(' ')[0]).diff(moment(ref), 'days');
		}

		return retval * 24;
	}

	/* Returns [ days hours minutes seconds ] in string */
	this._timestampcompare = function(fr, to) {
		var retval = 'Unknown';

		var diff = moment.duration(moment(to).diff(moment(fr)));
		var days = parseInt(diff.asDays());
		var hours = parseInt(diff.asHours());
		hours -= days * 24;
		var minutes = parseInt(diff.asMinutes());
		minutes -= (days * 24 * 60) + (hours * 60);
		var sec = parseInt(diff.asSeconds());
		sec -= (days * 24 * 3600) + (hours * 3600) + (minutes * 60);
		retval = days + ' ' + (days > 1 ? 'days' : 'day') + ', ' + hours + ' ' + (hours > 1 ? 'hrs' : 'hr') + ', ' + minutes + ' ' + (minutes > 1 ? 'mins' : 'min') + ', ' + sec + ' ' + (sec > 1 ? 'secs' : 'sec');

		return retval;
	}

	this.plotMultiGraph = function(dataset, callback) {
		if($.isEmptyObject(dataset)) {
			this._getChartMarker();
			return;
		}
		/** chart data **/
		$('#cancelLoading').prop('disabled', false);
		/** Productive data **/
		this._drawData(dataset[0], function() {
			/** Unproductive data **/
			that._drawData(dataset[1]);
			/** Log Summary **/
			that._getDowntimeLogSummary(dataset[1], function() {
				callback();
			});
		});

		this._getChartMarker();

		/**  **/
		this._attr.dataset = dataset;
	}

	this._drawData = function(dataset, callback) {
		var gridDistance = this._attr.dw / this._attr.range;

		var debug = [];
		for(var i = 0; i < dataset.length; i++) {
			var temp, start, end, duration, logid, offset;

			var itemOffset = 0;
			var unprodCause = dataset[i][7];
			var jobName = dataset[i][6];
			var unprodSrc = dataset[i][5];
			var logName = dataset[i][4];
			var itemId = parseInt(dataset[i][3]);
			var schedID =  parseInt(dataset[i][2]);
			var rawStart = dataset[i][0];
			var rawEnd = dataset[i][1];

			/* Creating the bounds */
			offset = this._datecompare(this._attr.minDate, rawStart);
			var end_offset = this._datecompare(this._attr.minDate, rawEnd);
			if(offset < 0 && end_offset < 0) {
				continue;
			}
			start = this._timeParser(rawStart) + offset;
			end = this._timeCompare(rawStart, rawEnd) + start;

			/* Destroy and create previously similar logs */
			logid = unprodSrc + '-' + i + '-' + itemId + '-' + schedID + '_';

			/* Detect bound overflow or underflow */
			if(start < this._attr.rangeOffset && end <= this._attr.rangeOffset) {
				continue;
			} else if(start < this._attr.rangeOffset && end > this._attr.rangeOffset) {
				start = 0;
				duration = end >= this._attr.range + this._attr.rangeOffset ? this._attr.range : (end - this._attr.rangeOffset);
			} else {
				if(end >= this._attr.range + this._attr.rangeOffset) {
					end = this._attr.range;
					start -= this._attr.rangeOffset;
					duration = end - start;
				} else {
					start -= this._attr.rangeOffset;
					end -= this._attr.rangeOffset;
					duration = end - start;
				}
			}

			/* Draw graphs */
			var graphHeight = this._attr.dh / ((2 * this._attr.pageItems) - 1);
			var graphColor = '';
			var y = 0;
			switch (unprodSrc) {
				case 'JO':
					y = this._attr.dy + (graphHeight * ((0 * 2)));
					graphColor = 'rgba(66,66,66,0.8)';
					break;

				case 'WDT':
					y = this._attr.dy + (graphHeight * ((1 * 2)));
					graphColor = 'rgba(183,28,28,0.7)';
					break;

				case 'DT1':
					y = this._attr.dy + (graphHeight * ((2 * 2)));
					graphColor = 'rgba(255,143,0,0.7)';
					break;

				case 'DT2':
					y = this._attr.dy + (graphHeight * ((3 * 2)));
					graphColor = 'rgba(33,150,243,0.7)';
					break;

				case 'DT3':
					y = this._attr.dy + (graphHeight * ((4 * 2)));
					graphColor = 'rgba(255,87,34,0.7)';
					break;

				case 'DT4':
					y = this._attr.dy + (graphHeight * ((5 * 2)));
					graphColor = 'rgba(46,125,50,0.7)';
					break;
			}
			var totalLen = duration * gridDistance;
			if(totalLen < 0) {
				totalLen = 0;
			}

			debug.push({ 'logid': logid, 'jobName': jobName, 'schedID': schedID, 'itemId': itemId, 'graphHeight': graphHeight, 'y': y, 'totalLen': totalLen, 'start': start, 'gridDistance': gridDistance, 'rawStart': rawStart, 'rawEnd': rawEnd, 'graphColor': graphColor, 'unprodCause': unprodCause });
		}

		if ($.isEmptyObject(debug)) {
			if (callback && typeof callback === "function") {
				callback();
			}
			return console.log('Draw Data completed');
		}

		var dateRange = this._attr.dateRange.split(',');
		var prevDataset = {
			end: '',
			id: '',
			device: '',
		};
		/* Thread parsing */
		if (typeof(_workerDraw) != "undefined") {
			_workerDraw.terminate();
		}
		_workerDraw = new Worker("assets/js/Custom/timegraphWorker.js?version=1");
		_workerDraw.postMessage({ args: 'process', jsonData: JSON.stringify(debug), someVal: '' });
		_workerDraw.onmessage = function(event) {
			if (event.data.arr == "null" || event.data.arr == undefined) {
				if (callback && typeof callback === "function") {
					callback();
				}
				return console.log('Draw Data completed');
			}
			var arrData = JSON.parse(event.data.arr);
			
			/* Do something with the data */
			/* Verify if the data is relevant to the requested data */
			var isRelevant = false;
			if (Date.parse(arrData.rawStart) < Date.parse(dateRange[0])) {
				/* Check for end */
				if (Date.parse(arrData.rawEnd) >= Date.parse(dateRange[0])) {
					isRelevant = true;
				}
			} else if (Date.parse(arrData.rawEnd) > Date.parse(dateRange[1])) {
				/* Check for end */
				if (Date.parse(arrData.rawStart) < Date.parse(dateRange[1])) {
					isRelevant = true;
				}
			} else {
				isRelevant = true;
			}

			if (isRelevant) {
				if ($(that._elem + ' .' + arrData.logid).length > 0) {
					if (prevDataset.end == arrData.rawStart && prevDataset.id == arrData.schedID && prevDataset.device == arrData.itemId) {} 
					else {
						$(that._elem + ' .' + arrData.logid).remove();
					}
				}
				prevDataset.end = arrData.rawEnd;
				prevDataset.id = arrData.schedID;
				prevDataset.device = arrData.itemId;

				var pg = that._chart.rect(that._attr.dx + that._attr.graphOffset + (arrData.start * arrData.gridDistance), arrData.y, 0, arrData.graphHeight, 0, 0).attr({
					fill: arrData.graphColor,
					stroke: 'white',
					strokeWidth: 0.5,
					strokeDasharray: (arrData.graphHeight + arrData.totalLen) + ', ' + (arrData.totalLen),
				});
				pg.addClass(arrData.logid).addClass('hoverSVG').animate({ width: arrData.totalLen }, that._attr.animDelay);

				var cause = arrData.unprodCause == "NONE" ? '' : '\nCause: ' + arrData.unprodCause;
				var tooltip = Snap.parse('<title>Job: ' + arrData.jobName + cause + '\nFrom: ' + arrData.rawStart + '\nTo: ' + arrData.rawEnd + '\n' + 
					'Duration: ' + that._timestampcompare(arrData.rawStart, arrData.rawEnd) + '</title>');
				pg.append(tooltip);
			}

			_workerDraw.postMessage({ args: 'continue', someVal: '' });
		}
	}

	this.refresh = function(callback) {
		$(this._elem).empty();
		this._attr.currentPage = 1;
		this._initialize();

		// if(!$.isEmptyObject(this._attr.dataset)) {
		// 	this.plotMultiGraph(this._attr.dataset, callback);
		// } else {
		// 	if (callback && typeof callback === "function") {
		// 		callback();
		// 	}
		// }
	}

	this.nextPage = function() {
		if(this._attr.page == 1) {
			return;
		}

		$('[class^=graphMember]').remove();
		$('[class^=instanceName]').remove();

		this._attr.currentPage++;
		if(this._attr.currentPage > this._attr.page) {
			this._attr.currentPage = 1;
		}

		/** attributes per instance **/
		var itemOffset = (this._attr.currentPage - 1) * this._attr.pageItems;
		const instanceHt = this._attr.dh / (2 * this._attr.pageItems);
		const nameOffset = 18;
		for(var i = 0 + itemOffset; (i - itemOffset) < this._attr.pageItems; i++) {
			/** Graph text **/
			this._chart.text(this._attr.dx + 5, this._attr.dy + (nameOffset - (0.45 * this._attr.pageItems)) + (instanceHt * (((i - itemOffset) * 2) + 1)), (this._attr.instance[i] === undefined ? 'No assigned device' : '\u21AA ' + this._attr.instance[i])).attr({
				fontSize: (0.9 - (0.02 * this._attr.pageItems)) + 'rem',
				fontFamily: 'arial',
				fill: _attrClr[this._attr.bg].text,
				fontWeight: 'bolder',
				strokeWidth: 0
			}).addClass('instanceName');
		}
		this._attr.pageTxt.attr({ text: "Page " + this._attr.currentPage + " of " + this._attr.page });
		this.plotMultiGraph(this._attr.dataset);
	}

	this.prevPage = function() {
		if(this._attr.page == 1) {
			return;
		}

		$('[class^=graphMember]').remove();
		$('[class^=instanceName]').remove();

		this._attr.currentPage--;
		if(this._attr.currentPage < 1) {
			this._attr.currentPage = this._attr.page;
		}

		/** attributes per instance **/
		var itemOffset = (this._attr.currentPage - 1) * this._attr.pageItems;
		const instanceHt = this._attr.dh / (2 * this._attr.pageItems);
		const nameOffset = 18;
		for(var i = 0 + itemOffset; (i - itemOffset) < this._attr.pageItems; i++) {
			/** Graph text **/
			this._chart.text(this._attr.dx + 5, this._attr.dy + (nameOffset - (0.45 * this._attr.pageItems)) + (instanceHt * (((i - itemOffset) * 2) + 1)), (this._attr.instance[i] === undefined ? 'No assigned device' : '\u21AA ' + this._attr.instance[i])).attr({
				fontSize: (0.9 - (0.02 * this._attr.pageItems)) + 'rem',
				fontFamily: 'arial',
				fill: _attrClr[this._attr.bg].text,
				fontWeight: 'bolder',
				strokeWidth: 0
			}).addClass('instanceName');
		}
		this._attr.pageTxt.attr({ text: "Page " + this._attr.currentPage + " of " + this._attr.page });
		this.plotMultiGraph(this._attr.dataset);
	}

	this.clearData = function() {
		this._attr.dataset = {};
		$('[class^=JO]').remove();
		$('[class^=WDT]').remove();
		$('[class^=DT]').remove();
		$('[class^=SUM]').remove();
	}

	this.reinitialize = function() {
		$(this._elem).empty();
		this._initialize();
	}

	this._getDowntimeLogSummary  = function(rawdata, callback) {
		/* Get all schedule id */
		var unqId = [];
		for (var i = 0; i < rawdata.length; i++) {
			unqId.push(rawdata[i][3]);
		}
		/* Get all unique schedule id */
		const uniqueSchedules = [...new Set(unqId)];
		/* Filter data based on jobschedule id */
		var filteredData = [];
		for (var i = 0; i <= uniqueSchedules.length; i++) {
			filteredData[i] = [];
			for (var j = 0; j < rawdata.length; j++) {
				if (uniqueSchedules[i] == rawdata[j][3]) {
					filteredData[i].push(rawdata[j]);
				}
			}
		}
		/* Get duration from the start to end of the next parent Downtime */
		var processedData = [];
		var parentDt, realLogStart;
		for (var i = 0; i < filteredData.length; i++) {
			parentDt = '';
			if (filteredData[i].length == 1) {
				processedData[i] = [];
				processedData[i][0] = filteredData[i][0];
			} else {
				var index = 0
				processedData[i] = [];
				for (var j = 0; j < filteredData[i].length; j++) {
					if (j > 0) {
						const parentDtStart = Date.parse(parentDt[0]);
						const parentDtEnd = Date.parse(parentDt[1]);
						const childDtStart = Date.parse(filteredData[i][j][0]);
						const childDtEnd = Date.parse(filteredData[i][j][1]);

						if (childDtStart < parentDtEnd && childDtEnd < parentDtEnd) {
							continue;
						}

						if (childDtStart >= parentDtStart && childDtStart <= parentDtEnd) {
							// what we want
						} else {
							realLogStart = '';
						}

						if (childDtEnd >= parentDtEnd) {
							processedData[i][index] = [];
							processedData[i][index].push(realLogStart != '' ? realLogStart : filteredData[i][j][0]); //start
							processedData[i][index].push(filteredData[i][j][1]); //end
							processedData[i][index].push(filteredData[i][j][2]); //schedId
							processedData[i][index].push(filteredData[i][j][3]); //itemId
							processedData[i][index].push(filteredData[i][j][4]); //devname
							processedData[i][index].push(filteredData[i][j][5]); //src
							processedData[i][index].push(filteredData[i][j][6]); //processdata
							processedData[i][index].push(filteredData[i][j][7]); //cause
							/* new parentDt */
							parentDt = filteredData[i][j]; // accepted data is now the parentDt
							realLogStart = parentDt[1];
							index++;
						}
					} else {
						parentDt = filteredData[i][j]; // first data is always assumed as parentDt
						realLogStart = parentDt[1];
						processedData[i][index] = parentDt;
						index++;
					}
				}
			}
		}

		var gridDistance = this._attr.dw / this._attr.range;
		var dataset = processedData, debug = [];
		for (var h = 0; h < dataset.length; h++) {
			for(var i = 0; i < dataset[h].length; i++) {
				var temp, start, end, duration, logid, offset;

				var itemOffset = 0;
				var unprodCause = dataset[h][i][7];
				var jobName = dataset[h][i][6];
				var unprodSrc = dataset[h][i][5];
				var logName = dataset[h][i][4];
				var itemId = parseInt(dataset[h][i][3]);
				var schedID =  parseInt(dataset[h][i][2]);
				var rawStart = dataset[h][i][0];
				var rawEnd = dataset[h][i][1];

				/* Creating the bounds */
				offset = this._datecompare(this._attr.minDate, rawStart);
				var end_offset = this._datecompare(this._attr.minDate, rawEnd);
				if(offset < 0 && end_offset < 0) {
					continue;
				}
				start = this._timeParser(rawStart) + offset;
				end = this._timeCompare(rawStart, rawEnd) + start;

				/* Destroy and create previously similar logs */
				logid = 'SUM' + '-' + i + '-' + itemId + '-' + schedID + '_';

				/* Detect bound overflow or underflow */
				if(start < this._attr.rangeOffset && end <= this._attr.rangeOffset) {
					continue;
				} else if(start < this._attr.rangeOffset && end > this._attr.rangeOffset) {
					start = 0;
					duration = end >= this._attr.range + this._attr.rangeOffset ? this._attr.range : (end - this._attr.rangeOffset);
				} else {
					if(end >= this._attr.range + this._attr.rangeOffset) {
						end = this._attr.range;
						start -= this._attr.rangeOffset;
						duration = end - start;
					} else {
						start -= this._attr.rangeOffset;
						end -= this._attr.rangeOffset;
						duration = end - start;
					}
				}

				/* Draw graphs */
				var graphHeight = this._attr.dh / ((2 * this._attr.pageItems) - 1);
				var graphColor = '';
				var y = this._attr.dy + (graphHeight * ((6 * 2)));
				switch (unprodSrc) {
					case 'JO':
						break;

					case 'WDT':
						graphColor = 'rgba(183,28,28,0.7)';
						break;

					case 'DT1':
						graphColor = 'rgba(255,143,0,0.7)';
						break;

					case 'DT2':
						graphColor = 'rgba(33,150,243,0.7)';
						break;

					case 'DT3':
						graphColor = 'rgba(255,87,34,0.7)';
						break;

					case 'DT4':
						graphColor = 'rgba(46,125,50,0.7)';
						break;
				}
				var totalLen = duration * gridDistance;
				if(totalLen < 0) {
					totalLen = 0;
				}

				debug.push({ 'logid': logid, 'jobName': jobName, 'schedID': schedID, 'itemId': itemId, 'graphHeight': graphHeight, 'y': y, 'totalLen': totalLen, 'start': start, 'gridDistance': gridDistance, 'rawStart': rawStart, 'rawEnd': rawEnd, 'graphColor': graphColor, 'unprodCause': unprodCause });
			}
		}

		if ($.isEmptyObject(debug)) {
			if (callback && typeof callback === "function") {
				callback();
			}
			return console.log('Draw Data completed');
		}

		var dateRange = this._attr.dateRange.split(',');
		var prevDataset = {
			end: '',
			id: '',
			device: '',
		};
		/* Thread parsing */
		if (typeof(_workerDown) != "undefined") {
			_workerDown.terminate();
		}
		_workerDown = new Worker("assets/js/Custom/timegraphWorker.js?version=1");
		_workerDown.postMessage({ args: 'process', jsonData: JSON.stringify(debug), someVal: '' });
		_workerDown.onmessage = function(event) {
			if (event.data.arr == "null" || event.data.arr == undefined) {
				if (callback && typeof callback === "function") {
					callback();
				}
				return console.log('Draw Data completed');
			}
			var arrData = JSON.parse(event.data.arr);
			
			/* Do something with the data */
			/* Verify if the data is relevant to the requested data */
			var isRelevant = false;
			if (Date.parse(arrData.rawStart) < Date.parse(dateRange[0])) {
				/* Check for end */
				if (Date.parse(arrData.rawEnd) >= Date.parse(dateRange[0])) {
					isRelevant = true;
				}
			} else if (Date.parse(arrData.rawEnd) > Date.parse(dateRange[1])) {
				/* Check for end */
				if (Date.parse(arrData.rawStart) < Date.parse(dateRange[1])) {
					isRelevant = true;
				}
			} else {
				isRelevant = true;
			}

			if (isRelevant) {
				if ($(that._elem + ' .' + arrData.logid).length > 0) {
					if (prevDataset.end == arrData.rawStart && prevDataset.id == arrData.schedID && prevDataset.device == arrData.itemId) {} 
					else {
						$(that._elem + ' .' + arrData.logid).remove();
					}
				}
				prevDataset.end = arrData.rawEnd;
				prevDataset.id = arrData.schedID;
				prevDataset.device = arrData.itemId;

				var pg = that._chart.rect(that._attr.dx + that._attr.graphOffset + (arrData.start * arrData.gridDistance), arrData.y, 0, arrData.graphHeight, 0, 0).attr({
					fill: arrData.graphColor,
					stroke: 'white',
					strokeWidth: 0.5,
					strokeDasharray: (arrData.graphHeight + arrData.totalLen) + ', ' + (arrData.totalLen),
				});
				pg.addClass(arrData.logid).addClass('hoverSVG').animate({ width: arrData.totalLen }, that._attr.animDelay);

				var tooltip = Snap.parse('<title>Job: "' + arrData.jobName + '"\nCause: ' + arrData.unprodCause + '\nFrom: ' + arrData.rawStart + '\nTo: ' + arrData.rawEnd + '\n' + 
					'Duration: ' + that._timestampcompare(arrData.rawStart, arrData.rawEnd) + '</title>');
				pg.append(tooltip);
			}

			_workerDown.postMessage({ args: 'continue', someVal: '' });
		}
	}

	this._getChartMarker = function() {
		/** chart data **/
		var gridDistance = this._attr.dw / this._attr.range;
		var temp, start, end, duration, logid, offset;

		var today = new Date();
		var retDate = today.getFullYear() + '-' + appendZero(parseInt(today.getMonth())+1) + '-' + appendZero(today.getDate());
		var retTime = appendZero(today.getHours()) + ':' + appendZero(today.getMinutes()) + ':' + appendZero(today.getSeconds());
		var retDnT = retDate + ' ' + retTime;

		var rawStart = retDnT;
		var rawEnd = retDnT;

		offset = this._datecompare(this._attr.minDate, rawStart);
		var end_offset = this._datecompare(this._attr.minDate, rawEnd);
		if(offset < 0 && end_offset < 0) {
			return;
		}
		start = this._timeParser(rawStart) + offset;
		end = this._timeCompare(rawStart, rawEnd) + start;

		logid = 'graphMember-marker';
		if ($(this._elem + ' .' + logid).length > 0) {
			$(this._elem + ' .' + logid).remove();
		}

		if(start < this._attr.rangeOffset && end <= this._attr.rangeOffset) {
			return;
		} else if(start < this._attr.rangeOffset && end > this._attr.rangeOffset) {
			start = 0;
			duration = end >= this._attr.range + this._attr.rangeOffset ? this._attr.range : (end - this._attr.rangeOffset);
		} else {
			if(end >= this._attr.range + this._attr.rangeOffset) {
				end = this._attr.range;
				start -= this._attr.rangeOffset;
				duration = end - start;
			} else {
				start -= this._attr.rangeOffset;
				end -= this._attr.rangeOffset;
				duration = end - start;
			}
		}

		var trueX = this._attr.dx + this._attr.graphOffset + (start * gridDistance);
		var pg = this._chart.line(trueX, this._attr.dy, trueX, this._attr.dy + this._attr.dh).attr({
			stroke: "#FDD835",
			strokeWidth: 1,
			strokeDasharray: "5,5",
		}).addClass(logid);
	}

	/** Execute initialization **/
	this._chart = Snap(this._elem);
	this.attr(params);
	$(this._elem).empty();
	this._initialize();
}