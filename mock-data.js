if (require) var d3 = require('d3'), moment = require('moment');

// only implement if no native implementation is available
if (typeof Array.isArray === 'undefined') {
  Array.isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }
};

(function(exports) {

    function getNextDatum(dict) {
	var dest = {};
	for (key in dict) {
	    if (Array.isArray(dict[key])) dest[key] = dict[key].shift();
	    else dest[key] = getNextDatum(dict[key]);
	}
	return dest;
	}

    function getLength(dict) {
	for (key in dict) {
	    if (Array.isArray(dict[key])) return dict[key].length;
	    else getLength(dict[key]);
	}
    }

    exports.collect = function(dataTemplate) {
	var output = [];
	console.log(getLength(dataTemplate));
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

    exports.bin = function(bins, data) {
	// Takes an array of bins, and bins the data into them.
	// Assumes the bins are sorted and there are no repeats.
	if (data == undefined) data = this.data();

	console.log(data)

	var ascending = bins[0] < bins[1];

	data.sort(function(a,b) {
	    if (ascending) return a - b;
	    else return b - a;
	})

	var output = new Array(bins.length);

	for (var i = 0; i < output.length; i++) output[i] = 0;

	var binwidth = bins[1] - bins[0];

	for (var i = 0, j = 0; i < data.length; i++) {
	    if (ascending) {
		if (data[i] < bins[j]) i++
		else if (j >= bins.length) break
		else if (data[i] > bins[j] + binwidth) j++
		else output[j]++, i++
	    }
	    else {
		if (data[i] > bins[j]) i++
		else if (j >= bins.length) break
		else if (data[i] < bins[j] - binwidth) j++
		else output[j]++, i++
	    }
	}

	this.data(output);

	return this;
    }

    })(d8ta = {});





function testCollect() {
    var x, y, z, input, test;
    x = [1, 3, 45, 20];
    y = [2, 19, 200, 10];
    z = ['Hello', 'My', 'Name', 'Is'];
    input = {'iterations': x,
	     'data': {'number': y, 'word': z} };
    test = d8ta.collect(input);
    return test;
}


function thePast(n, time) {
    var times = ['days', 'months', 'years'];
    var time = times.indexOf(time);
    if (time === -1) throw new Error('Invalid time type!');
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
