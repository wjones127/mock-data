//if (require) var d3 = require('d3'), moment = require('moment');

(function(exports) {

    function getNextDatum(dict) {
	var dest = {};
	for (var key in dict) {
	    if (Array.isArray(dict[key])) dest[key] = dict[key].shift();
	    else dest[key] = getNextDatum(dict[key]);
	}
	return dest;
	}

    function getLength(dict) {
	for (var key in dict) {
	    if (Array.isArray(dict[key])) return dict[key].length;
	    else getLength(dict[key]);
	}
    }

    exports.collect = function(dataTemplate) {
	var output = [];
	for (var i = 0, n = getLength(dataTemplate); i < n; i++)
	    output.push(getNextDatum(dataTemplate, output));
	return output;
    }

    exports.data =(function() {
	var data;
	function get_set_data(new_data) {
	    // Binds the data to the chain or returns the data
	    if (new_data == undefined) return data
	    else {
		data = new_data;
		return this;
	    }
	}
	return get_set_data;
    })();

    exports.generate = function (n, func) {
	// Generates n random samples using func
	output = [];
	for (var i = 0; i < n; i++) output.push( func() );
	this.data(output);
	return this;
    }

    exports.aggregate = function () {
	// Takes the data and makes each observation the sum of itself and the
	// previous observations
	var data = this.data();
	for (var i = 1; i < data.length; i++)
	    data[i] += data[i-1];
	this.data(data);
	return this;
    }

    exports.bin = function(bins, data) {
	// Takes an array of bins, and bins the data into them.
	// Assumes the bins are sorted and there are no repeats.
	if (data == undefined) data = this.data();

	var ascending = bins[0] < bins[1];

	data.sort(function(a,b) {
	    if (ascending) return a - b;
	    else return b - a;
	})

	var output = new Array(bins.length);

	for (var i = 0; i < output.length; i++) output[i] = 0;

	var binwidth = bins[1] - bins[0];

	for (var i = 0, j = 0; i < data.length;) {
	    if (ascending) {
		if (j >= bins.length) break
		else if (data[i] < bins[j]) i++
		else if (data[i] >= bins[j] + binwidth) j++
		else output[j]++, i++
	    }
	    else {
		if (j >= bins.length) break
		else if (data[i] > bins[j]) i++
		else if (data[i] <= bins[j] + binwidth) j++
		else output[j]++, i++
	    }
	}

	this.data(output);

	return this;
    }

    exports.thePast = function (n, time) {
	// Returns an array of n datetime strings separated by days, months or
	// years, depending on the time parameter.
	var times = ['days', 'months', 'years'];
	var time = times.indexOf(time);
	if (time === -1) throw new Error('Invalid time type! Please enter' +
					 ' "days", "months", or "years".');
	var now = new Date();

	var start = new Date(now);
	if (time === 0) start.setDate(now.getDate() - n);
	else if (time === 1) start.setMonth(now.getMonth() - n);
	else if (time === 2) start.setYear(1900 + now.getYear() - n);

	var result = [];

	while (start <= now) {
	    result.push(moment(start).format());
	    if (time === 0) start.setDate(start.getDate() + 1);
	    else if (time === 1) start.setMonth(start.getMonth() + 1);
	    else if (time === 2) start.setYear(1900 + start.getYear() + 1);
	}
	return result;
    }


    })(d8ta = {});
