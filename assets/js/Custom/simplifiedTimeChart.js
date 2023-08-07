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
	'nextText',
	'prevText',
	'dateRange',
];

var _workerProd, _workerUnprod;
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
		'minDate': "2019-10-07",
		'maxDate': "2019-10-08"
	});
	mygraph.refresh();
	mygraph.normalGraph(testDataMulti);
 *
 * End
 */

function initTimechart(params) {
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
		'prevText': 'Prev',
		'nextText': 'Next',
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
		this._attr.prevText = dataset.prevText === undefined ? this._attr.prevText :  dataset.prevText;
		this._attr.nextText = dataset.nextText === undefined ? this._attr.nextText :  dataset.nextText;
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
		var instanceHt = this._attr.dh / (2 * this._attr.pageItems);
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
		var y = this._attr.dy + (this._attr.labelPos == 'top' ? -10 : this._attr.dh);
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
				this._chart.text(x, this._attr.dy - (this._attr.labelPos == 'top' ? 16 : 8), dateDisplay).attr({
					fontSize: this._attr.range > 360 ? '0.5rem' : '0.7rem',
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

		/** attributes per instance **/
		const nameOffset = 12;
		const graphHeight = (this._attr.dh - (this._attr.graphOffset * 2)) / (2 * this._attr.pageItems);
		for(var i = 0; i < this._attr.pageItems; i++) {
			/** Graph text **/
			this._chart.text(this._attr.dx + 5, this._attr.dy + nameOffset /*this._attr.dy + (nameOffset - (0.48 * this._attr.pageItems))*/ + (instanceHt * ((i * 2) + 1)), 
				(this._attr.instance[i] === undefined ? 'No assigned device' : '\u21AA ' + this._attr.instance[i]) ).attr({
				fontSize: (0.9 - (0.02 * this._attr.pageItems)) + 'rem',
				fontFamily: 'arial',
				fill: _attrClr[this._attr.bg].text,
				fontWeight: 'bolder',
				strokeWidth: 0
			}).addClass('instanceName');
			/** Graph bg identifier can be removed **/
			this._chart.rect(this._attr.dx, this._attr.dy + (instanceHt * (i * 2)), this._attr.dw, graphHeight, 0, 0).attr({
				fill: _attrClr[this._attr.bg].placeholder,
				stroke: "none",
				strokeWidth: 0
			});
		}

		/** legends **/
		const legendHt = 10;
		const legendwd = 10;
		var legendDist = 0;
		var xOrigin = (this._attr.w/2) + ( (this._attr.graphClr.length/2)*legendwd*(this._attr.graphClr.length/2) );
		for(var i = 0; i < this._attr.graphClr.length; i++) {
			/** colored boxes **/
			this._chart.rect(xOrigin - (legendDist), this._attr.y + (this._attr.topOffset/2 - legendHt), legendwd, legendHt, 1, 1).attr({
				fill: this._attr.graphClr[i],
				stroke: _attrClr[this._attr.bg].legend,
				strokeWidth: 0.5
			});
			/** legend text **/
			var txt = this._chart.text(xOrigin - (legendDist) + legendwd + 5, this._attr.y + (this._attr.topOffset/2 - legendHt) + legendHt, ($.isEmptyObject(this._attr.legend) ? 'Data ' + (i+1) : this._attr.legend[i])).attr({
				fontSize: '0.75rem',
				fontFamily: 'arial',
				fill: _attrClr[this._attr.bg].legend
			});
			legendDist += txt.getBBox().width + legendwd + 25;
		}
		/** page text **/
		this._attr.pageTxt = this._chart.text(xOrigin - 45, this._attr.y + this._attr.dh + this._attr.topOffset + (this._attr.btmOffset/2), "Page " + this._attr.currentPage + " of " + this._attr.page).attr({
			fontSize: '0.75rem',
			fontFamily: 'arial',
			fill: _attrClr[this._attr.bg].legend
		});

		/** Table title **/
		var txt = this._chart.text(this._attr.x + this._attr.lftOffset, this._attr.y + (this._attr.topOffset/2) - 6, this._attr.title).attr({
			fontSize: '1rem',
			fontFamily: 'arial',
			fontWeight: 'bold',
			fill: _attrClr[this._attr.bg].text
		});

		/** Buttons left and right **/
		const btnWidth = 45;
		const btnHeight = 20;
		if($('.chartPrev').length == 0) {
			this._chart.rect(this._attr.dx, this._attr.y + this._attr.dh + this._attr.topOffset + ((this._attr.btmOffset - btnHeight) /2) - 2, btnWidth, btnHeight, 3, 3).attr({
				fill: _attrClr[this._attr.bg].placeholder,
				stroke: _attrClr[this._attr.bg].legend,
				strokeWidth: 0.5
			}).addClass('chartPrev');
			this._chart.text(this._attr.dx + (btnWidth / 2), this._attr.y + this._attr.dh + this._attr.topOffset + ((this._attr.btmOffset + 4)/2), this._attr.prevText).attr({
				fontSize: '0.75rem',
				fontFamily: 'arial',
				fill: _attrClr[this._attr.bg].legend,
				textAnchor: 'middle'
			}).addClass('chartPrev');

			$('.chartPrev').on('click', function() {
				$('#graphModal .snsPrompt').html("Loading...");
				$('#graphModal').modal('show');
				$('#cancelLoading').prop('disabled', true);

				setTimeout(function() {
					that.prevPage();
				}, 500);
			});
		}
		if($('.chartNext').length == 0) {
			this._chart.rect(this._attr.dx + this._attr.dw - btnWidth, this._attr.y + this._attr.dh + this._attr.topOffset + ((this._attr.btmOffset - btnHeight) /2) - 2, btnWidth, btnHeight, 3, 3).attr({
				fill: _attrClr[this._attr.bg].placeholder,
				stroke: _attrClr[this._attr.bg].legend,
				strokeWidth: 0.5
			}).addClass('chartNext');
			this._chart.text(this._attr.dx + this._attr.dw - (btnWidth / 2), this._attr.y + this._attr.dh + this._attr.topOffset + ((this._attr.btmOffset + 4)/2), this._attr.nextText).attr({
				fontSize: '0.75rem',
				fontFamily: 'arial',
				fill: _attrClr[this._attr.bg].legend,
				textAnchor: 'middle'
			}).addClass('chartNext');

			$('.chartNext').on('click', function() {
				$('#graphModal .snsPrompt').html("Loading...");
				$('#graphModal').modal('show');
				$('#cancelLoading').prop('disabled', true);
				
				setTimeout(function() {
					that.nextPage();
				}, 500);
			});
		}
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

	this.normalGraph = function(dataset) {
		if($.isEmptyObject(dataset)) {
			return;
		}

		var gridDistance = this._attr.dw / this._attr.range;
		var prevDataset = {
			end: '',
			id: '',
			device: '',
		};
		/** chart data **/
		for(var i = 0; i < dataset.length; i++) {
			for(var j = 0; j < dataset[i].length; j++) {
				var temp, start, end, duration, logid, offset;

				var itemOffset = (this._attr.currentPage - 1) * this._attr.pageItems;
				var min = ((this._attr.currentPage - 1) * this._attr.pageItems) + 1;
				var max = min + this._attr.pageItems;
				var itemId = parseInt(dataset[i][j][3]);
				var schedID = dataset[i][j][2];
				var rawStart = dataset[i][j][0];
				var rawEnd = dataset[i][j][1];
				if(itemId < min || itemId >= max) {
					continue;
				}

				offset = this._datecompare(this._attr.minDate, rawStart);
				var end_offset = this._datecompare(this._attr.minDate, rawEnd);
				if(offset < 0 && end_offset < 0) {
					continue;
				}
				start = this._timeParser(rawStart) + offset;
				end = this._timeCompare(rawStart, rawEnd) + start;


				logid = 'graphMember-' + i + '-' + itemId + '-' + schedID + '_';
				if ($(this._elem + ' .' + logid).length > 0) {
					if (prevDataset.end == rawStart && prevDataset.id == schedID && prevDataset.device == itemId) {
						// $(this._elem + ' .' + logid).remove();
					} else {
						$(this._elem + ' .' + logid).remove();
					}
				}
				prevDataset.end = rawEnd;
				prevDataset.id = schedID;
				prevDataset.device = itemId;

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

				var totalLen = duration * gridDistance;
				if(totalLen < 0) {
					totalLen = 0;
				}
				var graphHeight = (this._attr.dh - (this._attr.graphOffset * 2)) / (2 * this._attr.pageItems);
				var y = this._attr.dy + this._attr.graphOffset + ( (itemId - itemOffset - 1) * 2 * graphHeight );
				var pg = this._chart.rect(this._attr.dx + this._attr.graphOffset + (start * gridDistance), y, 0, graphHeight, 0, 0).attr({
					fill: this._attr.graphClr[i],
					stroke: "none",
					strokeWidth: 0
				});
				pg.addClass(logid).animate({ width: totalLen }, this._attr.animDelay);

				/** everything other than the job duration i guess.. (for improvement) **/
				if(i > 0) {
					pg.addClass('hoverSVG');
					var tooltip = Snap.parse('<title>' + this._attr.legend[i] + ': ' + dataset[i][j][0] + ' to ' + rawEnd + '\n' + 
						'Duration: ' + this._timestampcompare(rawStart, rawEnd) + '</title>');
					pg.append(tooltip);
				} else {
					var tooltip = Snap.parse('<title>Job: ' + rawStart + ' to ' + rawEnd + '\n' + 
						'Duration: ' + this._timestampcompare(rawStart, rawEnd) + '</title>');
					pg.append(tooltip);
				}
			}
		}

		this._attr.dataset = dataset;
	}

	this.plotMultiGraph = function(dataset, callback) {
		if($.isEmptyObject(dataset) || $.isEmptyObject(dataset[0])) {
			this._getChartMarker();
			return callback();
		}

		var tracer;
		// this._getProductiveGraphv2(dataset[0], function() {
			// if (tracer !== undefined) return;

			// tracer = 1;
			// that._getUnproductiveGraph(dataset[1], function() {
			// 	callback();
			// });
		// });
		that._getProductiveGraphv2(dataset[0], function() {
			if (tracer !== undefined) return;

			tracer = 1;
			that._getUnproductiveGraph(dataset[1], function() {
				callback();
			});
		});

		this._getChartMarker();

		this._attr.dataset = dataset;
	}

	this._getProductiveGraph = function(dataset, callback) {
		var perDeviceinstance = [];

		var gridDistance = this._attr.dw / this._attr.range;
		var debug = [];
		for(var j = 0; j < dataset.length; j++) {
			var temp, start, end, duration, logid, offset;

			var itemOffset = (this._attr.currentPage - 1) * this._attr.pageItems;
			var min = ((this._attr.currentPage - 1) * this._attr.pageItems) + 1;
			var max = min + this._attr.pageItems;
			var jobName = dataset[j][5];
			var itemId = parseInt(dataset[j][3]);
			var schedID = dataset[j][2];
			var rawStart = dataset[j][0];
			var rawEnd = dataset[j][1];
			if(itemId < min || itemId >= max) {
				continue;
			}

			if (perDeviceinstance[itemId] === undefined) {
				perDeviceinstance[itemId]= [];
			}

			offset = this._datecompare(this._attr.minDate, rawStart);
			if(offset < 0 && end_offset < 0) {
				continue;
			}
			var end_offset = this._datecompare(this._attr.minDate, rawEnd);
			start = this._timeParser(rawStart) + offset;
			end = this._timeCompare(rawStart, rawEnd) + start;

			logid = 'graphMember-' + 0 + '-' + itemId + '-' + schedID + '_';

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
			var totalLen = duration * gridDistance;
			if(totalLen < 0) {
				totalLen = 0;
			}
			var graphHeight = (this._attr.dh - (this._attr.graphOffset * 2)) / (2 * this._attr.pageItems);
			var y = this._attr.dy + this._attr.graphOffset + ( (itemId - itemOffset - 1) * 2 * graphHeight );
			// debug.push({ 'logid': logid, 'jobName': jobName, 'schedID': schedID, 'itemId': itemId, 'graphHeight': graphHeight, 'y': y, 'totalLen': totalLen, 'start': start, 'gridDistance': gridDistance, 'rawStart': rawStart, 'rawEnd': rawEnd });

			perDeviceinstance[itemId].push({ 'logid': logid, 'jobName': jobName, 'schedID': schedID, 'itemId': itemId, 'graphHeight': graphHeight, 'y': y, 'totalLen': totalLen, 'start': start, 'gridDistance': gridDistance, 'rawStart': rawStart, 'rawEnd': rawEnd });
		}

		$('#cancelLoading').prop('disabled', false);
		var dateRange = this._attr.dateRange.split(',');
		var prevDataset = {
			end: '',
			id: '',
			device: '',
		};

		if ($.isEmptyObject(perDeviceinstance)) {
			if (callback && typeof callback === "function") {
				callback();
			}
			return console.log('Draw Data completed');
		}

		_workerProd = [];
		// for (var i = 1; i < perDeviceinstance.length; i++) {
		perDeviceinstance.map((val, i) => {
			if (typeof(_workerProd[i]) != "undefined") {
				_workerProd[i].terminate();
			}
			_workerProd[i] = new Worker("assets/js/Custom/timechartWorker.js?version=3");
			_workerProd[i].postMessage({ args: 'process', jsonData: JSON.stringify(val), someVal: '' });
			_workerProd[i].onmessage = function(event) {
				if (event.data.arr == "null" || event.data.arr == undefined) {
					this.terminate();
					if (callback && typeof callback === "function") {
						callback();
					}
					return console.log('Productive Data pull completed');
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
					fill: that._attr.graphClr[0],
					stroke: "none",
					strokeWidth: 0
				});
				pg.addClass(arrData.logid).animate({ width: arrData.totalLen }, that._attr.animDelay);
				/** everything other than the job duration i guess.. (for improvement) **/
				var tooltip = Snap.parse('<title>Job: "' + arrData.jobName + '"\nStatus: ' + that._attr.legend[0] + '\nFrom: ' + arrData.rawStart + '\nTo: ' + arrData.rawEnd + '\n' + 
					'Duration: ' + that._timestampcompare(arrData.rawStart, arrData.rawEnd) + '</title>');
				pg.append(tooltip);

				this.postMessage({ args: 'continue', someVal: '' });
			}
		});
	}

	this._getUnproductiveGraph = function(rawdata, callback) {
		/* Get all schedule id */
		var unqId = [];
		for (var i = 0; i < rawdata.length; i++) {
			unqId.push(rawdata[i][4]);
		}
		/* Get all unique schedule id */
		const uniqueSchedules = [...new Set(unqId)];
		/* Filter data based on jobschedule id */
		var filteredData = [];
		for (var i = 0; i <= uniqueSchedules.length; i++) {
			filteredData[i] = [];
			for (var j = 0; j < rawdata.length; j++) {
				if (uniqueSchedules[i] == rawdata[j][4]) {
					filteredData[i].push(rawdata[j]);
				}
			}
		}
		/* Get duration from the start to end of the next parent Downtime */
		var processedData = [];
		var parentDt, realLogStart, addParent = false;
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

		/* Test */
		var perDeviceinstance = [];

		var dataset = processedData;
		var gridDistance = this._attr.dw / this._attr.range;
		var dataset = processedData, debug = [];
		for (var h = 0; h < dataset.length; h++) {
			for(var i = 0; i < dataset[h].length; i++) {
				var temp, start, end, duration, logid, offset;

				var itemOffset = (this._attr.currentPage - 1) * this._attr.pageItems;
				var jobName = dataset[h][i][5];
				var commonId = dataset[h][i][4];
				var itemId = parseInt(dataset[h][i][3]);
				var schedID =  parseInt(dataset[h][i][2]);
				var rawStart = dataset[h][i][0];
				var rawEnd = dataset[h][i][1];
				var min = ((this._attr.currentPage - 1) * this._attr.pageItems) + 1;
				var max = min + this._attr.pageItems;
				if(itemId < min || itemId >= max) {
					continue;
				}

				/* Test */
				if (perDeviceinstance[itemId] === undefined) {
					perDeviceinstance[itemId]= [];
				}

				/* Creating the bounds */
				offset = this._datecompare(this._attr.minDate, rawStart);
				if(offset < 0 && end_offset < 0) {
					continue;
				}
				var end_offset = this._datecompare(this._attr.minDate, rawEnd);
				start = this._timeParser(rawStart) + offset;
				end = this._timeCompare(rawStart, rawEnd) + start;

				/* Destroy and create previously similar logs */
				logid = 'graphMemberUnp' + '-' + i + '-' + itemId + '-' + schedID + '_';

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
				var graphHeight = (this._attr.dh - (this._attr.graphOffset * 2)) / (2 * this._attr.pageItems);
				var y = this._attr.dy + this._attr.graphOffset + ( (itemId - itemOffset - 1) * 2 * graphHeight );
				var totalLen = duration * gridDistance;
				if(totalLen < 0) {
					totalLen = 0;
				}
				// debug.push({ 'logid': logid, 'jobName': jobName, 'schedID': schedID, 'itemId': itemId, 'graphHeight': graphHeight, 'y': y, 'totalLen': totalLen, 'start': start, 'gridDistance': gridDistance, 'rawStart': rawStart, 'rawEnd': rawEnd });

				/* Test */
				perDeviceinstance[itemId].push({ 'logid': logid, 'jobName': jobName, 'schedID': schedID, 'itemId': itemId, 'graphHeight': graphHeight, 'y': y, 'totalLen': totalLen, 'start': start, 'gridDistance': gridDistance, 'rawStart': rawStart, 'rawEnd': rawEnd });
			}
		}

		var dateRange = this._attr.dateRange.split(',');
		var prevDataset = {
			end: '',
			id: '',
			device: '',
		};
		
		if ($.isEmptyObject(perDeviceinstance)) {
			if (callback && typeof callback === "function") {
				callback();
			}
			return console.log('Draw Data completed');
		}

		_workerUnprod = [];
		// for (var i = 1; i < perDeviceinstance.length; i++) {
		perDeviceinstance.map((val, i) => {
			if (typeof(_workerUnprod[i]) != "undefined") {
				_workerUnprod[i].terminate();
			}
			_workerUnprod[i] = new Worker("assets/js/Custom/timechartWorker.js?version=3");
			_workerUnprod[i].postMessage({ args: 'process', jsonData: JSON.stringify(val), someVal: '' });
			_workerUnprod[i].onmessage = function(event) {
				if (event.data.arr == "null" || event.data.arr == undefined) {
					this.terminate();
					if (callback && typeof callback === "function") {
						callback();
					}
					return console.log('Unproductive Data pull completed');
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
						fill: that._attr.graphClr[1],
						stroke: 'white',
						strokeWidth: 0.5,
						strokeDasharray: (arrData.graphHeight + arrData.totalLen) + ', ' + (arrData.totalLen),
					});
					pg.addClass(arrData.logid).addClass('hoverSVG').animate({ width: arrData.totalLen }, that._attr.animDelay);

					var tooltip = Snap.parse('<title>Job: "' + arrData.jobName + '"\nStatus: ' + that._attr.legend[1] + '\nFrom: ' + arrData.rawStart + '\nTo: ' + arrData.rawEnd + '\n' + 
						'Duration: ' + that._timestampcompare(arrData.rawStart, arrData.rawEnd) + '</title>');
					pg.append(tooltip);
				}

				this.postMessage({ args: 'continue', someVal: '' });
			}
		});
	}

	this._getProductiveGraphv2 = function(rawdata, callback) {
		/* Get all schedule id */
		var unqId = [];
		for (var i = 0; i < rawdata.length; i++) {
			unqId.push(rawdata[i][4]);
		}
		/* Get all unique schedule id */
		const uniqueSchedules = [...new Set(unqId)];
		/* Filter data based on jobschedule id */
		var filteredData = [];
		for (var i = 0; i <= uniqueSchedules.length; i++) {
			filteredData[i] = [];
			for (var j = 0; j < rawdata.length; j++) {
				if (uniqueSchedules[i] == rawdata[j][4]) {
					filteredData[i].push(rawdata[j]);
				}
			}
		}
		/* Get duration from the start to end of the next parent Downtime */
		var processedData = [];
		var parentDt, realLogStart, addParent = false;
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

		/* Test */
		var perDeviceinstance = [];

		var dataset = processedData;
		var gridDistance = this._attr.dw / this._attr.range;
		var dataset = processedData, debug = [];
		for (var h = 0; h < dataset.length; h++) {
			for(var i = 0; i < dataset[h].length; i++) {
				var temp, start, end, duration, logid, offset;

				var itemOffset = (this._attr.currentPage - 1) * this._attr.pageItems;
				var jobName = dataset[h][i][5];
				var commonId = dataset[h][i][4];
				var itemId = parseInt(dataset[h][i][3]);
				var schedID =  parseInt(dataset[h][i][2]);
				var rawStart = dataset[h][i][0];
				var rawEnd = dataset[h][i][1];
				var min = ((this._attr.currentPage - 1) * this._attr.pageItems) + 1;
				var max = min + this._attr.pageItems;
				if(itemId < min || itemId >= max) {
					continue;
				}

				/* Test */
				if (perDeviceinstance[itemId] === undefined) {
					perDeviceinstance[itemId]= [];
				}

				/* Creating the bounds */
				offset = this._datecompare(this._attr.minDate, rawStart);
				if(offset < 0 && end_offset < 0) {
					continue;
				}
				var end_offset = this._datecompare(this._attr.minDate, rawEnd);
				start = this._timeParser(rawStart) + offset;
				end = this._timeCompare(rawStart, rawEnd) + start;

				/* Destroy and create previously similar logs */
				logid = 'graphMember' + '-' + i + '-' + itemId + '-' + schedID + '_';

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
				var graphHeight = (this._attr.dh - (this._attr.graphOffset * 2)) / (2 * this._attr.pageItems);
				var y = this._attr.dy + this._attr.graphOffset + ( (itemId - itemOffset - 1) * 2 * graphHeight );
				var totalLen = duration * gridDistance;
				if(totalLen < 0) {
					totalLen = 0;
				}
				// debug.push({ 'logid': logid, 'jobName': jobName, 'schedID': schedID, 'itemId': itemId, 'graphHeight': graphHeight, 'y': y, 'totalLen': totalLen, 'start': start, 'gridDistance': gridDistance, 'rawStart': rawStart, 'rawEnd': rawEnd });

				/* Test */
				perDeviceinstance[itemId].push({ 'logid': logid, 'jobName': jobName, 'schedID': schedID, 'itemId': itemId, 'graphHeight': graphHeight, 'y': y, 'totalLen': totalLen, 'start': start, 'gridDistance': gridDistance, 'rawStart': rawStart, 'rawEnd': rawEnd });
			}
		}

		$('#cancelLoading').prop('disabled', false);
		var dateRange = this._attr.dateRange.split(',');
		var prevDataset = {
			end: '',
			id: '',
			device: '',
		};
		
		if ($.isEmptyObject(perDeviceinstance)) {
			if (callback && typeof callback === "function") {
				callback();
			}
			return console.log('Draw Data completed');
		}

		_workerUnprod = [];
		// for (var i = 1; i < perDeviceinstance.length; i++) {
		perDeviceinstance.map((val, i) => {
			if (typeof(_workerUnprod[i]) != "undefined") {
				_workerUnprod[i].terminate();
			}
			_workerUnprod[i] = new Worker("assets/js/Custom/timechartWorker.js?version=3");
			_workerUnprod[i].postMessage({ args: 'process', jsonData: JSON.stringify(val), someVal: '' });
			_workerUnprod[i].onmessage = function(event) {
				if (event.data.arr == "null" || event.data.arr == undefined) {
					this.terminate();
					if (callback && typeof callback === "function") {
						callback();
					}
					return console.log('Productive Data pull completed');
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
						fill: that._attr.graphClr[0],
						stroke: 'white',
						strokeWidth: 0.5,
						strokeDasharray: (arrData.graphHeight + arrData.totalLen) + ', ' + (arrData.totalLen),
					});
					pg.addClass(arrData.logid).addClass('hoverSVG').animate({ width: arrData.totalLen }, that._attr.animDelay);

					var tooltip = Snap.parse('<title>Job: "' + arrData.jobName + '"\nStatus: ' + that._attr.legend[0] + '\nFrom: ' + arrData.rawStart + '\nTo: ' + arrData.rawEnd + '\n' + 
						'Duration: ' + that._timestampcompare(arrData.rawStart, arrData.rawEnd) + '</title>');
					pg.append(tooltip);
				}

				this.postMessage({ args: 'continue', someVal: '' });
			}
		});
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

	this.reload = function(callback) {
		this.refresh();
		if(!$.isEmptyObject(this._attr.dataset)) {
			this.plotMultiGraph(this._attr.dataset, callback);
		}
	}

	this.nextPage = function() {
		if(this._attr.page == 1) {
			$('#graphModal').modal('hide'); 
			return;
		}

		$('[class^=graphMember]').remove();
		$('[class^=instanceName]').remove();
		$('[class^=graphMemberUnp]').remove();

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
		this.plotMultiGraph(this._attr.dataset, function() { 
			$('#graphModal').modal('hide'); 
		});
	}

	this.prevPage = function() {
		if(this._attr.page == 1) {
			$('#graphModal').modal('hide'); 
			return;
		}

		$('[class^=graphMember]').remove();
		$('[class^=instanceName]').remove();
		$('[class^=graphMemberUnp]').remove();

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
		this.plotMultiGraph(this._attr.dataset, function() { 
			$('#graphModal').modal('hide'); 
		});
	}

	this.clearData = function() {
		this._attr.dataset = {};
	}

	this.getPageProperties = function() {
		return { 'page': this._attr.currentPage, 'min': ((this._attr.currentPage - 1) * this._attr.pageItems) + 1, 'max': ((this._attr.currentPage - 1) * this._attr.pageItems) + this._attr.pageItems };
	}

	/** Execute initialization **/
	this._chart = Snap(this._elem);
	this.attr(params);
	$(this._elem).empty();
	this._initialize();
}