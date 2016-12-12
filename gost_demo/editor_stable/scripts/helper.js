//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//	General helper methods that can be used for a variety of things
//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

function helper() {
	this.roll = function(max, fixedPercent) {
		if (fixedPercent <= 1.0) {
			return Math.floor(fixedPercent*max) + 1;
		} else {
			return Math.floor(Math.random()*max) + 1;
		}
	};
	
	this.assert = function(expect, actual) {
		return (expect === actual) ? true : false;
	};
}

function test_helper() {
	this.roll = function() {
		var value;
		value = theHelper.roll(10, 0.1);
		if(!(theHelper.assert(value, 2))) console.log("Test Failed. Actual " + value);
		value = theHelper.roll(4, 0.5);
		if(!(theHelper.assert(value, 3))) console.log("Test Failed. Actual " + value);
		value = theHelper.roll(2, 0.5);
		if(!(theHelper.assert(value, 2))) console.log("Test Failed. Actual " + value);
		value = theHelper.roll(1, 0.99);
		if(!(theHelper.assert(value, 1))) console.log("Test Failed. Actual " + value);
		value = theHelper.roll(8, 0.75);
		if(!(theHelper.assert(value, 7))) console.log("Test Failed. Actual " + value);
		value = theHelper.roll(4, 0.25);
		if(!(theHelper.assert(value, 2))) console.log("Test Failed. Actual " + value);
		value = theHelper.roll(12, 0.1);
		if(!(theHelper.assert(value, 2))) console.log("Test Failed. Actual " + value);
		value = theHelper.roll(20, 0.25);
		if(!(theHelper.assert(value, 6))) console.log("Test Failed. Actual " + value);
		value = theHelper.roll(25, 0.80);
		if(!(theHelper.assert(value, 21))) console.log("Test Failed. Actual " + value);
		value = theHelper.roll(25, 0.90);
		if(!(theHelper.assert(value, 23))) console.log("Test Failed. Actual " + value);
	}
	
	this.all = function() {
		this.roll();
	}
}

function collision_point(x1, y1, x2, y2) {
	if (x1 === x2 && y1 === y2) {
		return true;
	} else {
		return false;
	}
}