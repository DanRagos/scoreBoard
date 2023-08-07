/** Parameters:
	TEST - not for production code, but to test the script using a simulated data
	PRODUCTION - run production code
  **/
	var MODE = "PRODUCTION";
	var maxDevicePerQuery = 10;
	
	var overviewData;
	var isCompleted = true;
	
	var _countTest = 0;
	
	self.addEventListener("message", function(e) {
		var cmd = e.data.cmd;
		if (cmd == "start") {
			if (isCompleted === false) return; 
			initOverviewData(getDeviceOverview, [e.data.min, e.data.max]);
		} else if (cmd == "get") {
			postMessage({ 'data': JSON.stringify(overviewData), 'isCompleted': isCompleted });
		} else if (cmd == "update") {
			rangeUpdateSingleTrans(e.data.min);
		}
	}, false);
	
	function initOverviewData(callback, args) {
		if (overviewData !== undefined) return callback(args);
	
		overviewData = [];
		for (var i = 0; i < 10; i++) {
			overviewData[i] = [];
		}
		callback(args);
	}
	
	function getDeviceOverview([min, max]) {
		// overviewData = [];
		isCompleted = false;
		console.log(`Worker query: ${min}-${max}`);
	
		_countTest++;
	
		if (MODE == "TEST") {
			/** Testing only / Ajax function here later **/
			for (var i = min; i < max; i++) {
				setTimeout((x, _countTest) => {
					console.log(`Worker loop: ${x}`);
	
					overviewData.push({
						'devdid': (x + 1),
						'devbck': '0',
						'devnme': `MAC ${x + 1}`, 
						'devsta': '1', 
						'devsid': 0,
						'devmst': _countTest % 2 == 0 ? 'PRODUCTIVE' : 'COMPLETED',  
						'devpwn': 0,
						'devcnt': 0,
						'devtgt': 0,
						'devlid': 0,
						'devcus': '',
					});
	
					if (x + 1 >= max) {
						isCompleted = true;
						console.log(`Worker loop completed`);
					}			
				}, 2000, i, _countTest);
			}
		} else if (MODE == "PRODUCTION") {
			var minId = (min * maxDevicePerQuery) + 1;
			var maxId = (min * maxDevicePerQuery) + maxDevicePerQuery;
			ajaxCall('../../../php/jooverview.php', responseHandler, [minId, maxId, max]);
		}
	}
	
	function rangeUpdateSingleTrans(min) {
		ajaxCall('../../../php/jooverview.php', function (data, args) {
			var _data = JSON.parse(data);
			if (_data.length > 0) {
				if (Object.keys(overviewData[parseInt(_data[0].devdid) - 1]).length == 0) {
					overviewData[parseInt(_data[0].devdid) - 1] = _data[0];
				} else {
					overviewData[parseInt(_data[0].devdid) - 1]['devcus'] = _data[0].devcus;
				}
			}
			postMessage({ 'data': JSON.stringify(overviewData) });
		}, [min, min, 1]);
	}
	
	function responseHandler(data, args) {
		[min, max, limit] = args;
		// console.log(`Worker loop: ${min}-${max} until ${limit}`); //Au
		var minId = max + 1;
		var maxId = max + maxDevicePerQuery;
		var info;
	
		try {
			info = JSON.parse(data);
		} catch (err) {
			ajaxCall('../../../php/jooverview.php', responseHandler, [minId - 1, maxId - maxDevicePerQuery, limit]);
		}
			
		for (var y = 0; y < info.length; y++) {
			// overviewData.push(info[y]);
			overviewData[parseInt(info[y].devdid) - 1] = info[y];
		}
	
		if (max >= limit) {
			isCompleted = true;
			console.log(`Worker loop completed`);
		} else {
			ajaxCall('../../../php/jooverview.php', responseHandler, [minId, maxId, limit]);
		}
	}
	
	function ajaxCall(url, callback, args) {
		[min, max, limit] = args;
	
		/* Instead of jquery, inhouse xmlhttprequest was used since we cannot import jquery here */
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				  callback(xhr.response, args);
			}
		}
	
		xhr.open("POST", url, true);
		  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhr.send(JSON.stringify({ min: min, max: max }));
	}
	 