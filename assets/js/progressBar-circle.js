/*!
  * Sirkol v1.0
  * Author: Klarenz Pantaleon
  * Unlicensed: Use at your own risk
  * Object Parameters:
  * 	id				= container id
  * 	height 			= height of the circle ('auto': renders with the size of the container)
  * 	width 			= width of the circle ('auto': renders with the size of the container)
  * 	progressColor	= progress bar color
  * 	progressStrokeWd= progress bar width
  * 	progressTip 	= progress bar tip: (butt or round)
  * 	showBase 		= show background circle
  * 	baseColor 		= background circle color
  * 	baseStrokeWd 	= background circle stroke width
  * 	baseBgFill		= background circle background color
  * 	textColor 		= text and subtext color
  * 	showSubText 	= show subtext below the circle (Height must be greater than width or else it will not show)
  *		baseCircleLg	= make base circle size larger than actual progress cirle
  * Svg element ID
  *		*-svg			= svg container
  *		*-progress		= progress circle
  *		*-text			= text inside the circle
  *		*-subtext		= text outside the circle
  * How to use:
  *		1. var myCircle = new CircleBar({ object parameters });
  *		Ex. var goodCircle = new CircleBar({
  *				id: 'progressBarCircle-1',
  *				height: 150,
  *				width: 150,
  *				progressStrokeWd: 3,
  *				baseBgFill: '#000000a6',
  *				progressTip: 'round',
  *				showBase: true,
  *				progressColor: 'rgb(0,220,0,0.7)'
  *			});
  *		2. myCircle.setProgress(90); //90%
  */
function CircleBar(param) {
	this.autosize = false;

	/** input filtering **/
	if(param.id == '' || param.id == undefined) {
		return console.error('Error: No container id declared.');
	} else {
		var test = document.getElementById(param.id);
		if(test === null || test == '' || test == undefined) {
			return console.error('Error: Container declared not found.');
		}
	}
	if(isNaN(param.height) || isNaN(param.width)) {
		if(param.height != 'auto' || param.width != 'auto') {
			return console.error('Error: Invalid dimensions declared.');
		} else {
			/** Get the containers dimension **/
			this.autosize = true;
			param.width = document.getElementById(param.id).offsetWidth;
			param.height = document.getElementById(param.id).offsetHeight;
			window.addEventListener("resize", (evt) => this.updateSize(evt), true);
		}
	} else if(parseFloat(param.height) <= 0 || parseFloat(param.width) <= 0) {
		return console.error('Error: Invalid dimensions declared.');
	}

	/** Initialization of variables **/
	this.IdName		= param.id;
	this.Height 	= parseFloat(param.height);
	this.Width 		= parseFloat(param.width);
	this.ProgClr	= param.progressColor === undefined ? 'rgb(255,0,0,0.7)' : param.progressColor;
	this.ProgWd 	= parseFloat(param.progressStrokeWd === undefined ? 1 : param.progressStrokeWd);
	this.ProgTip 	= param.progressTip === undefined ? 'butt' : param.progressTip;
	this.ShowBase 	= param.showBase === undefined ? true : param.showBase;
	this.BaseClr 	= param.baseColor === undefined ? '#000000a6' : param.baseColor;
	this.BaseWd 	= parseFloat(param.baseStrokeWd === undefined ? 1 : param.baseStrokeWd);
	this.BaseFill	= param.baseBgFill === undefined ? 'transparent' : param.baseBgFill;
	this.TextClr 	= param.textColor === undefined ? '#000000a6' : param.textColor;
	this.ShudShowSub= param.showSubText === undefined ? false : param.showSubText;
	this.ShowSubTxt = this.ShudShowSub ? (this.Height > this.Width + 18 ? this.ShudShowSub : false) : false;
	this.SubTxtPh	= param.subtextPlaceholder === undefined ? '--' : param.subtextPlaceholder;
	this.TxtHt      = (this.Height > this.Width ? this.Width : this.Height) * 0.007;
	this.baseLg		= param.baseCircleLg === undefined ? false : param.baseCircleLg;

	/** Please don't access _reserved variables and methods **/
	this._cx = this.Width / 2;
	this._cy = this.ShowSubTxt ? (this.Height > this.Width ? this.Width / 2 : this.Height / 2) : this.Height / 2;
	this._r  = (this.Height > this.Width ? this.Width / 2 : this.Height / 2) - (2 * this.ProgWd);
	if(this.baseLg) {
		this._br = (this.Height > this.Width ? this.Width / 2 : this.Height / 2) - (3.5 * this.ProgWd);
	} else {
		this._br = (this.Height > this.Width ? this.Width / 2 : this.Height / 2) - (2 * this.BaseWd);
	}
	this._x  = this._cx;
	this._y  = this._cy;
	this._dy = this.Height;

	/** Save value for reinitialization during resizing **/
	this._percent = 0;
	this._decimal = 2;
	this._subtxt  = this.SubTxtPh;

	/** Error detection **/
	this._error = '';

	/** Initialization of svg components **/
	this._initialize = function() {
		var html;

		if(this._r <= 0 || this._br <= 0) {
			this._error = '1';
			this._r = this._br = 1;
		} else {
			this._error = '';
		}

		/** View box **/
		html = '<svg id="' + this.IdName + '-svg" height="' + this.Height + '" width="' + this.Width + '">';
		/** base circle **/
		if(this.ShowBase) {
			html += '<circle stroke-width="' + this.BaseWd;
			html += '" fill="' + this.BaseFill;
			html += '" stroke="' + this.BaseClr;
			html += '" cy="' + this._cy;
			html += '" cx="' + this._cx;
			html += '" r="' + this._br;
			html += '"></circle>';
		}
		/** progress circle **/
		html += '<circle id="' + this.IdName + '-progress" class="progress-circle-offset"';
		html += ' stroke-width="' + this.ProgWd;
		html += '" fill="transparent"';
		html += ' stroke="' + this.ProgClr;
		html += '" cy="' + this._cy;
		html += '" cx="' + this._cx;
		html += '" r="' + this._r;
		html += '" stroke-linecap="';
		html += this.ProgTip + '"></circle>';
		/** text **/
		html += '<text id="' + this.IdName + '-text"';
		html += ' x="' + this._x;
		html += '" y="' + this._y;
		html += '" text-anchor="middle"';
		html += ' fill="' + this.TextClr;
		html += '" dy="0.5rem" font-size="' + (this.TxtHt) + 'rem">0%</text>';
		/** subtext **/
		if(this.ShowSubTxt) {
			html += '<text id="' + this.IdName + '-subtext"';
			html += ' x="' + this._x;
			html += '" y="' + (this._dy - (this._dy * 0.001));
			html += '" text-anchor="middle"';
			html += ' fill="' + this.TextClr;
			html += '" font-size="' + 0.9 + 'rem">' + this.SubTxtPh + '</text>';
		}
		html += '</svg>';

		document.getElementById(this.IdName).innerHTML = html;

		var a = document.getElementById(this.IdName + '-progress');
		var c = this._r * 2 * Math.PI;
		
		a.style.strokeDasharray = `${c} ${c}`;
		a.style.strokeDashoffset = c;
		a.style.transformOrigin = this._cx + "px " + this._cy + "px";
	}

	this.setProgress = function(percentVal, decimalDisp = 2, subtextVal = null) {
		if(isNaN(percentVal)) {
			return console.error("Error: cannot set a null progress");
		}
		this._percent = percentVal;
		this._subtxt  = subtextVal;
		this._decimal = decimalDisp;

		var a = document.getElementById(this.IdName + '-progress');
		var c = this._r * 2 * Math.PI;
		var offset = c - (parseFloat(this._percent) / 100) * c;
		if(offset < 0) {
			offset = 0;
		} else if(offset > c) {
			offset = c; 
		}

		a.style.strokeDashoffset = offset;
		document.getElementById(this.IdName + '-text').innerHTML = (parseFloat(this._percent)).toFixed(this._decimal) + '%';
		this.ShowSubTxt ? document.getElementById(this.IdName + '-subtext').innerHTML = this._subtxt : false;
	}

	this.updateSize = function() {
		if(!this.autosize) {
			return console.error('Error: Cannot use updateSize function, autosize mode not enabled.');
		}
		this.Width 	= document.getElementById(this.IdName).offsetWidth;
		this.Height = document.getElementById(this.IdName).offsetHeight;

		this.refresh();
	}
	
	this.setProgressColor = function(color) {
		this.ProgClr = color;
		this._initialize();
		this.setProgress(this._percent, this._decimal, this._subtxt);
	}
	
	this.setBaseColor = function(color) {
		this.BaseClr = color;
		this._initialize();
		this.setProgress(this._percent, this._decimal, this._subtxt);
	}
	
	this.setTextColor = function(color) {
		this.TextClr = color;
		this._initialize();
		this.setProgress(this._percent, this._decimal, this._subtxt);
	}

	this.refresh = function() {
		this.ShowSubTxt = this.ShudShowSub ? (this.Height > this.Width + 18 ? this.ShudShowSub : false) : false;
		this._cx 	= this.Width / 2;
		this._cy 	= this.ShowSubTxt ? (this.Height > this.Width ? this.Width / 2 : this.Height / 2) : this.Height / 2;
		this._r  	= (this.Height > this.Width ? this.Width / 2 : this.Height / 2) - (2 * this.ProgWd);
		this._br 	= (this.Height > this.Width ? this.Width / 2 : this.Height / 2) - (2 * this.BaseWd);
		this._x  	= this._cx;
		this._y  	= this._cy;
		this._dy 	= this.Height;
		this.TxtHt  = (this.Height > this.Width ? this.Width : this.Height) * 0.007;

		this._initialize();
		this.setProgress(this._percent, this._decimal, this._subtxt);
	}

	this.checkError = function() {
		return this._error;
	}

	/** Do not use unless you know what you're doing **/
	this.setHeight = function(val) {
		this.Height = val;
		this.refresh();
	}

	/** Do not use unless you know what you're doing **/
	this.setWidth = function(val) {
		this.Width = val;
		this.refresh();
	}

	/** Do not use unless you know what you're doing **/
	this.setTextHeight = function(val) {
		this.TxtHt = val;
		this.refresh();
	}

	this._initialize();
}
