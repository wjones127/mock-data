# Will's Data Utilities
This library provides several useful functions for manipulating data in
javascript.

## Setup
In you project directory, type this into the console
```npm install wills-data-utils```
Then you can add the node module as usual:
```javascript
var d8ta = require('wills-data-utils');
```
All the examples in this readme call the library `d8ta`, but you could name it
anything else you would like.

This library does not depend on, but is much more useful in conjunction with
d3.js. It uses but does not provide functions for generating random values, so it
is best to use this library in conjunction with a library that provides sampling
methods from various probability distributions. (Here is one such 
[library](https://github.com/jacobmenick/sampling).)

## Methods

__`d8ta.data([data])`__: either sets or returns the current data array, depending on
  whether there is an argument supplied. Data set with this can subsequently
  be chained with other methods.

```javascript
var x = d8ta.data([1,2,3,4]);
x.data() // -> [1,2,3,4]
```

__`d8ta.generate(n, name, func)`__: generates a sample of size `n` using the
supplied function, and saves the data in the object under the variable name
supplied, which can be chained with other methods or returned with `.data()`.

```javascript
var x = d8ta.generate(4, 'count', function() { return 28; });
x.data() // -> [{'count': 28}, {'count': 28}, ...]
```

__`d8ta.bin(data, by, name)`__: takes a separate data set, the name of a variable
in the current data to bin using, and the name of the variable to save the counts
as. NOTE: the binning data must be numeric, sorting in ascending or descending
order, and equally spaced. The bins are defined such that the supplied numbers
represent the beginning of the interval, and the separation between values
defines the width. So, supplying `[1920, 1922, 1924]` would create the bins
`[1920, 1922), [1922, 1924), [1924, 1926)`.

```javascript
var observedYears = [1921, 2010, 1918, 1922, 1925, 1926, 1924.5];
d8ta.data([{'year': 1920},
           {'year': 1922},
		   {'year': 1924}])
    .bin(observedYears, 'year', 'count')
	.data();
// -> [{'year': 1920, 'count': 1},
//     {'year': 1922, 'count': 1},
//	   {'year': 1924, 'count': 2}]
```

__`d8ta.fill(name, defaults, [start, end])`__: takes the name of a variable and fills in
the missing integer values. (Hopefully later values will do that same with
dates.) There are optional start and end values if you want to fill in below
and/or above the min and max values. If only supplied two arguments, it will
figure out whether you meant start or end based on data.

```javascript
d8ta.data([{'year': 1999, 'count': 1},
           {'year': 2001, 'count': 23},
		   {'year': 2002, 'count': 4}])
    .fill(year, {'count': 0})
	.data();
// -> [{'year': 1999, 'count': 1},
//     {'year': 2000, 'count': 0},
//     {'year': 2001, 'count': 23},
//     {'year': 2002, 'count': 4}]
```

__`d8ta.cumulative(input, output, baseline=0)`__: adds a variable called `output`
to data set that gives a cumulative count of the variable `input`. The optional
variable baseline gives the number to be added to the first observation.

```javascript
d8ta.data({'count': 20},
          {'count': 2},
		  {'count': 22}])
    .cumulative('count', 'totalCount')
	.data();
// -> [{'count': 20, 'totalCount': 20},
//     {'count': 2, 'totalCount': 22},
//     {'count': 22, 'totalCount': 44}]
```


__`d8ta.percentGrowth(input, output, trim=true)`__: given an input variable to
look at this function will output a variable giving percent growth since last
observation. By default this will remove the first observation, because there is
no way to calculate growth for that observation. If `trim` is set to `false`, it
will output `0` as the growth for the first observation.

```javascript
d8ta.data([{'count': 20},
           {'count': 22},
		   {'count': 44}])
    .percentGrowth('count', 'growth')
	.data();
// -> [{'count': 22, 'growth': 10},
//     {'count': 44, 'growth': 100}]
```


__`d8ta.select(name)`__: Outputs an array, giving the data from the variable
called `name`.

```javascript
d8ta.data([{'x': 1, 'y': 2},
           {'x': 4, 'y': 3},
		   {'x': 2, 'y': 5}])
    .select('x');
// -> [1, 4, 2]
```

__`d8ta.collect`__: Converts an object of arrays into an array of objects. For
  example, given the template `{'x': [1,2,3], 'y': [4,5,6]}` it will output an
  array whose first element is `{'x': 1, 'y': 4}`.

```javascript
var x = [1, 2, 3];
var y = [4, 5, 6];
d8ta.collect({'low': x, 'high': y});
// -> [{'low': 1, 'high': 4}, {'low': 2, 'high': 5}, ...]
```

__`d8ta.thePast(n, time)`__: given either `'days'`, `'weeks'`, or '`years'`, this
  function will return an array of datetime strings for the past n days (or
  months or years).

```javascript
d8ta.thePast(12, 'months');
// -> ["2014-06-12T16:53:59-07:00", "2014-07-12T16:53:59-07:00", ... ]
```



##Examples
Say you had a data set of years and the number of users that joined your website
in that year, but you have missing observations from years that had zero users
joining. You want to fill in the missing dates and get the cumulative count and
percentage growth of users.

Here is what you could do with this library:
```javascript
var data = [{'year': 2010, 'count': 12},
            {'year': 2011, 'count': 2},
			{'year': 2013, 'count': 1},
			{'year': 2014, 'count': 6}];
data = d8ta.data(data) // Load the data
           .fill('year', {'count': 0}) // Fill in missing years
		   .cumulative('count', 'totalCount', 2000) // Get the cumulative growth
		   .percentGrowth('totalCount', 'percentGrowth', false) // Get % growth
		   .data() // Return the data set
```

First, it loads the data into the `d8ta` object we are working with, so we can
chain methods. Next, it fills in the missing years, giving the missing years a
default value of `count` of 0. Next it adds a new variable to the data set called
`totalCount`, which gives the total count of users. The `2000` gives the number
of users that were there before we started counting new users. Next the
percentage growth is calculated for each observation, and saved in the
`percentageGrowth` property. Finally, the data set is returned as a normal object
with the `.data()` method.
