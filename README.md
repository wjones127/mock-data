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
- `d8ta.generate(n, func)`: generates a sample of size `n` using the supplied
  function, and saves the data in the object, which can be chained with other
  methods or returned with `.data()`.
- `d8ta.bin(bins[, data])`: takes an array of bins and a data set (if one is not
  already in the chain) and returns an array counting how many points in the
  data set are in each bin. The elements in the bin must be numeric, sorted in
  either ascending or descending order, and equally spaced.
- `d8ta.collect`: Converts an object of arrays into an array of objects. For
  example, given the template `{'x': [1,2,3], 'y': [4,5,6]}` it will output an
  array whose first element is `{'x': 1, 'y': 4}`.

##Examples
Say you wanted to create a data set of class years and counts of alums. Here is
how you can do this with this library (this example also uses function from d3):

```javascript
years = d3.range(1920, 2016);
counts = d8ta.generate(5000, d3.random(1990, 20))
       .bin(years).data();
data = d8ta.collect({'year': years, 'count': counts});
```