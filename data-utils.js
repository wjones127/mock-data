exports.select = function(data, variable) {
  var output = [];
  for (var i = 0; i < data.length; i++)
    output.push(data[i][variable]);
  return output;
}

exports.sort = function(data, variable, func) {
  data = data.slice(); // make a shallow copy
  func = func || function(a,b) { a-b };
  data.sort(function(a, b) {
    return func(a[variable], b[variable]);
    });
  return data;
}

exports.fill = function(data, input, defaults, start, end) {
  data = data.slice(); // make a shallow copy
  var inputs = this.select(data, input);
  console.log("Inputs: " + inputs);
  var min = Math.min(inputs);
  var max = Math.min(inputs);
  if (start === undefined && end === undefined)
    start = min, end = max;
  else if (end === undefined && start < min)
    end = max;
  else if (end === undefined && start > max)
    end = start, start = min;
  else
    start = min, end = max;

  // Create new array of filled in values
  inputs = [];
  for (var i = start; i <= end; i++)
    inputs.push(i);
  
  // Create output array
  var output = [];
  for (var i = 0; i < inputs.length; i++) {
    var x = find(data, input, output[i]);
    if (x !== -1)
      output[i] = x;
    else {
      output[i] = defaults;
      output[i][input] = inputs[i];
    }  
  }
  
  return output;

  function find(array, location, target) {
    for (var i = 0; i < array.length; i++)
      if (array[location] === target)
	return i;
    return -1;
  }

}

exports.cumulative = function(data, input, output, baseline) {
  data = data.slice(); // make a shallow copy
  baseline = baseline || 0;
  
  data[0][output] = data[0][input] + baseline;
  for (var i = 1; i < data.length; i++)
    data[i][output] = data[i][input] + data[i-1][output];
  return data;
}

exports.percentGrowth = function(data, input, output, trim) {
  if (trim === undefined) trim = true;

  var result = data.map(function(item, i, array) {
    var out = item;
    if (i > 0)
      out[output] = out[input] / array[i-1][input] * 100;
    return out;
  });
  
  if (trim)
    result.shift();
  else
    result[0][output] = 0;
  
  return output;
}
