function controller() {
	//	Gives context and extra information to the object being controlled
	this.target;
	this.register = function(target) {
		this.target = target;
	};
}

function mouseDown() {
	//	This is improperly coded but trades off for better performance since each collision check is on a mouse down as opposed to each game frame
	var x = theCursor.x;
	var y = theCursor.y;
	var object_id = theCursor.object_id
	
	//	first remove the old object, if any
	var collided_index;
	if (theCursor.size === 1) {
		collided_index = runCollisions(x, y);
		if (collided_index >= 0) {
			theObjectFactory.destroy(collided_index);
			theGrid.cells[x][y] = 0;
		}
	} else {
		collided_index = runCollisions(x*2, y*2);
		if (collided_index >= 0) {
			theObjectFactory.destroy(collided_index);
			theGrid.cells[x*2][y*2] = 0;
		}
		collided_index = runCollisions(x*2+1, y*2);
		if (collided_index >= 0) {
			theObjectFactory.destroy(collided_index);
			theGrid.cells[x*2+1][y*2] = 0;
		}
		collided_index = runCollisions(x*2+1, y*2+1);
		if (collided_index >= 0) {
			theObjectFactory.destroy(collided_index);
			theGrid.cells[x*2+1][y*2+1] = 0;
		}
		collided_index = runCollisions(x*2, y*2+1);
		if (collided_index >= 0) {
			theObjectFactory.destroy(collided_index);
			theGrid.cells[x*2][y*2+1] = 0;
		}
	}
	
	//	then add the new object, if not deleting (3)
	if (object_id > 0) {
		if (theCursor.size === 1) {
			theGrid.set(x, y, object_id);
			theObjectFactory.create_map(x, y, object_id);
		} else {
			theGrid.set(x*2, y*2, object_id);
			theObjectFactory.create_map(x*2, y*2, object_id);
			theGrid.set(x*2+1, y*2, object_id);
			theObjectFactory.create_map(x*2+1, y*2, object_id);
			theGrid.set(x*2+1, y*2+1, object_id);
			theObjectFactory.create_map(x*2+1, y*2+1, object_id);
			theGrid.set(x*2, y*2+1, object_id);
			theObjectFactory.create_map(x*2, y*2+1, object_id);
		}
	}
	
	//	TyTest
	document.getElementById("object_count").innerHTML = theObjectFactory.list.length;
}

function mouseUp() {
}

function move(direction, target) {
	//	A simple move, wasd moves up down left or right
	switch (direction) {
		case 1:
			target.move(1);
			break;
		case -1:
			target.move(-1);
			break;
		default:
			target.move(1);
	}
}

function action(target) {
	target.action();
}

function move_vertical(direction, target) {
	//	A simple move, wasd moves up down left or right
	switch (direction) {
		case 1:
			target.move_vertical(1);
			break;
		case -1:
			target.move_vertical(-1);
			break;
		default:
			target.move_vertical(1);
	}
}

function stop(target) {
	target.stop();
}