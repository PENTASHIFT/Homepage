// Set ticker to decide what stock should show.
const ticker = "";

var getJSON = function(url, callback) {
	let xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'json';
	xhr.onload = function() {
		let stat = xhr.status;
		if (stat == 200) {
			callback(null, xhr.response);
		} else {
			callback(stat, xhr.response);
		}
	};
	xhr.send();
}

// Grabbing stock information from financialmodelingprep.com
getJSON(`https://financialmodelingprep.com/api/company/historical-price/${ticker}?serietype=line&serieformat=array&datatype=json`,
function(err, json) {
	if (err !== null) {
		window.alert('Something went wrong ' + err);
	} else {
		let len = json["historical"].length;
		let data = {
			labels: [],
			series : [[]]
		};
		// Getting 10 most recent stocks.
		for(var i=(len-10); i<len; i++) {
			data["labels"].push(json["historical"][i][0].match(/\d+\s\d+\s/g)); // Matches dates in MMDDYYYY format.
			data["series"][0].push(json["historical"][i][1]);	// Prices.
		}
		// Get average of prices to get a better high/low value.
		let avg = data["series"][0].reduce((a, b) => a + b, 0) / 10;
		console.log(avg);
		let options = {
			// For aesthetic reasons, the average price will be closer to the high than the low.
			high: (avg + (avg / 2.5)),
			low: (avg - (avg / 2)),
			showArea: true,
			axisY: {
				showLabel: false,
			}
		}
		new Chartist.Line('.ct-chart', data, options);
		document.getElementById("ticker").textContent = `${ticker} $${data["series"][0][9].toFixed(2)}`
	}
})

// Grabbing IP information from ipinfo.io
getJSON('https://ipinfo.io/json', function(err, json) {
	if (err !== null) {
		window.alert('Something went wront' + err);
	} else {
		document.getElementById("ip").textContent = json["ip"];
		document.getElementById("location").textContent = `${json["city"]}, ${json["country"]}`;
	}
})
