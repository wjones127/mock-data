var d8ta = require('./mock-data.js');

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

function testData() {
    var x = [1,2,3,4];
    var z = d8ta.data(x);
    if (!theSame(z.data(), x))
	return "fail: Data either not saved or retrieved correctly.";
    else
	return "d8ta.data works fine!";
}

function testGenerate() {
    var data = d8ta.generate(4, Math.random);
    if (data.data().length != 4)
	return "fail: incorrect number of datapoints made";
    else
	return "d8ta.generate works fine!";
}

function testBin(bins, data, answers) {
    var result = d8ta.data(data).bin(bins).data();
    if (!theSame(result,  answers))
	return "fail: binning " + data + " into " + bins + " failed." +
	" Got " + result + "\n";
    else
	return "Looks good!\n";
}

function testThePast() {

}


console.log(testCollect(),
	    testData(),
	    testGenerate(),
	    testThePast());

console.log(
    "Whole numbers go to selves: ",
    testBin([1, 2], [1, 2], [1, 1]),
    "Numbers between go to previous: ",
    testBin([2, 4], [3], [1, 0]),
    "Numbers before or after first element are ignored: ",
    testBin([2, 4], [-1], [0,0]),
    "Reverse order also works: ",
    testBin([4, 2], [5, 3, 2, 1], [1, 2])
)

function theSame(array1, array2) {
    if (array1.length !== array2.length) return false;
    for (var i = 0; i < array1.length; i++)
	if (array1[i] !== array2[i])
	    return false;
    return true;
}



dutils = require('./data-utils.js');

fake_data = [{'year': 2001, 'count': 2},
	     {'year': 2003, 'count': 3},
	     {'year': 2004, 'count': 1},
	     {'year': 2007, 'count': 0},
	     {'year': 2010, 'count': 10}]
