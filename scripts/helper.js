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

function collision_box(obj1, obj2) {
	var x1 = obj1.prevX + (obj1.x - obj1.prevX)/2;
	var y1 = obj1.prevY + (obj1.y - obj1.prevY)/2;
	var x2 = obj2.x;
	var y2 = obj2.y;
	if (x1+(obj1.collisionSize/2) > x2-(obj2.collisionSize/2) && x1-(obj1.collisionSize/2) < x2+(obj2.collisionSize/2) &&
		y1+(obj1.collisionSize/2) > y2-(obj2.collisionSize/2) && y1-(obj1.collisionSize/2) < y2+(obj2.collisionSize/2)) {
		return true;
	} else {
		return false;
	}
}

function collision_up(obj1, obj2) {
	var y1 = obj1.prevY + (obj1.y - obj1.prevY)/2;
	var y2 = obj2.y;
	var threshold = 0.2 + Math.abs(obj1.vy/20);
	if (y1 > y2+(obj2.collisionSize-threshold)) {
		//console.log("up collision");
		return true;
	} else {
		return false;
	}
}

function collision_down(obj1, obj2) {
	var y1 = obj1.prevY + (obj1.y - obj1.prevY)/2;
	var y2 = obj2.y;
	var threshold = 0.2 + Math.abs(obj1.vy/20);
	if (y1 < y2-(obj2.collisionSize-threshold)) {
		//console.log("down collision");
		return true;
	} else {
		return false;
	}
}

function collision_left(obj1, obj2) {
	var x1 = obj1.prevX + (obj1.x - obj1.prevX)/2;
	var x2 = obj2.x;
	var threshold = 0.2 + Math.abs(obj1.vx/20);
	if (x1 > x2+(obj2.collisionSize-threshold)) {
		//console.log("left collision");
		return true;
	} else {
		return false;
	}
}
function collision_right(obj1, obj2) {
	var x1 = obj1.prevX + (obj1.x - obj1.prevX)/2;
	var x2 = obj2.x;
	var threshold = 0.2 + Math.abs(obj1.vx/20);
	if (x1 < x2-(obj2.collisionSize-threshold)) {
		//console.log("right collision");
		return true;
	} else {
		return false;
	}
}

function outOfBounds(obj) {
	if (obj.x < 0 - obj.collisionSize ||
		obj.y < 0 - obj.collisionSize ||
		obj.x > 31 + obj.collisionSize ||
		obj.y > 17 + obj.collisionSize) {
		
		return true;
	} else {
		return false;
	}
}