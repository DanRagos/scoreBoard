var localArray = [];
var sentIndex = -1;
var sentIndexLimit = 0;

self.addEventListener("message", function (e) {
	var args = e.data.args;
	if (args == 'process') {
		returnPartialData(e.data.jsonData, e.data.someVal);
	} else if (args == 'continue') {
		getNextData(e.data.someVal);
	}
}, false);

function returnPartialData(arr, val) {
	if (arr === undefined) return;

	localArray = JSON.parse(arr);
	for (var i = 0; i < localArray.length; i++) {
		/* Pre-process data here */
		
		if (i == 0) {
			sentIndex++;
			setTimeout(function () {
				postMessage({ someVar: val, arr: JSON.stringify(localArray[sentIndex]) });
			}, 300);
		}
		sentIndexLimit++;
	}
}

function getNextData(val) {
	sentIndex++;
	if (sentIndex > sentIndexLimit) {
		postMessage({ someVar: val, arr: 'null' });
	}
	postMessage({ someVar: val, arr: JSON.stringify(localArray[sentIndex]) });
}