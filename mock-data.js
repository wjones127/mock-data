var d3 = require('d3'), moment = require('moment');

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



// Create class year data
years = d3.range(1920, 2016);
counts = d8ta.generate(5000, d3.random.normal(1990, 20))
    .bin(years).data();
result = d8ta.collect({'year': years, 'count': counts});
console.log(result)
