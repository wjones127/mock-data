# Mock Data Library
This library helps create mock data. All functions in a closure that can be
interfaced through the `d8ta` variable.

## Setup

This library does not depend on, but is much more useful in conjunction with
d3.js.

## Methods

- `d8ta.data([data])`: either sets or returns the current data array, depending on
  whether there is an argument supplied. Data set with this can subsequently
  be chained with other methods.

```javascript
var x = d8ta.data([1,2,3,4]);
x.data() // -> [1,2,3,4]
```

- `d8ta.generate(n, func)`: generates a sample of size `n` using the supplied
  function, and saves the data in the object, which can be chained with other
  methods or returned with `.data()`.

```javascript
var x = d8ta.generate(4, function() { return 28; });
x.data() // -> [28, 28, 28, 28]
```

- `d8ta.bin(bins[, data])`: takes an array of bins and a data set (if one is not
  already in the chain) and returns an array counting how many points in the
  data set are in each bin. The elements in the bin must be numeric, sorted in
  either ascending or descending order, and equally spaced.

```javascript
var bins = [2, 4, 6];
var data = [1, 2, 3, 4.23, 7, 8, 8.5];
d8ta.data(data).bin(bins).data() // -> [2, 1, 1]
```

- `d8ta.collect`: Converts an object of arrays into an array of objects. For
  example, given the template `{'x': [1,2,3], 'y': [4,5,6]}` it will output an
  array whose first element is `{'x': 1, 'y': 4}`.

```javascript
var x = [1, 2, 3];
var y = [4, 5, 6];
d8ta.collect({'low': x, 'high': y});
// -> [{'low': 1, 'high': 4}, {'low': 2, 'high': 5}, ...]
```

- `d8ta.thePast(n, time)`: given either `'days'`, `'weeks'`, or '`years'`, this
  function will return an array of datetime strings for the past n days (or
  months or years).

```javascript
d8ta.thePast(12, 'months');
// -> ["2014-06-12T16:53:59-07:00", "2014-07-12T16:53:59-07:00", ... ]
```

##Examples
Say you wanted to create a data set of class years and counts of alums. Here is
how you can do this with this library (this example also uses function from d3):

```javascript
years = d3.range(1920, 2016);
counts = d8ta.generate(5000, d3.random.normal(1990, 20))
       .bin(years).data();
data = d8ta.collect({'year': years, 'count': counts});
```