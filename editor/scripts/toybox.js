//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//	A box full of objects to play with
//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

function grid(rows, cols) {
	this.rows = rows;
	this.cols = cols;
	this.cells = [];
	for (i = 0; i < rows; i++) {
		this.cells[i] = {};
		for (j = 0; j < cols; j++) {
			this.cells[i][j] = 0;
		}
	}
	
	this.set = function(xpos, ypos, object_id) {
		this.cells[xpos][ypos] = object_id;
	};
}

function dummy(x, y, z, type) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.rainbow = new THREE.Color("rgb("+type*10+"%, "+type*10+"%, "+type*10+"%)");		
	this.material = new THREE.SpriteMaterial({map: null, color: rainbow, fog: true});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(1, 1, 1);
	scene.add(this.sprite);
}

function grass(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.id = 1;
	this.material = new THREE.SpriteMaterial({map: assets_grass, color: 0xFFFFFF, fog: true});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(1, 1, 1);
	scene.add(this.sprite);
}

function imploder(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.id = 2;
	this.material = new THREE.SpriteMaterial({map: assets_imploder, color: 0xFFFFFF, fog: true});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(1, 1, 1);
	scene.add(this.sprite);
}

function golem(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.id = 2;
	this.material = new THREE.SpriteMaterial({map: assets_imploder, color: 0x9999FF, fog: true});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(1, 1, 1);
	scene.add(this.sprite);
}

function geolader(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.id = 2;
	this.material = new THREE.SpriteMaterial({map: assets_imploder, color: 0x999999, fog: true});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(1, 1, 1);
	scene.add(this.sprite);
}

function stumper(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.id = 2;
	this.material = new THREE.SpriteMaterial({map: assets_imploder, color: 0xFFFFFF, fog: true});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(3, 3, 3);
	scene.add(this.sprite);
}

function rock(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.id = 2;
	this.material = new THREE.SpriteMaterial({map: assets_rock, color: 0xFFFFFF, fog: true});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(1, 1, 1);
	scene.add(this.sprite);
}

function startPortal(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.id = 2;
	this.material = new THREE.SpriteMaterial({map: assets_candy, color: 0x9999FF, fog: true});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(1, 1, 1);
	scene.add(this.sprite);
}

function endPortal(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.id = 2;
	this.material = new THREE.SpriteMaterial({map: assets_candy, color: 0xFF9999, fog: true});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(1, 1, 1);
	scene.add(this.sprite);
}

function cursor(x, y, z) {
	this.x = Math.floor((x - ((window.innerWidth - 1600) / 2)) / 50);
	this.y = Math.floor((y - ((window.innerHeight - 900) / 2)) / 50);
	this.z = z;
	this.material = new THREE.SpriteMaterial({map: null, color: 0x0000ff, fog: true, opacity: 0.4});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(1, 1, 1);
	scene.add(this.sprite);
	this.object_id = 1001;
	this.size = 1;
	this.numOfTiles = 2;
	this.numOfObjects = 6;
	
	this.move = function(x, y) {
		switch(this.size) {
			case 1:
				this.x = Math.floor((x - ((window.innerWidth - 1600) / 2)) / 50);
				this.y = Math.floor((y - ((window.innerHeight - 900) / 2)) / 50);
				this.sprite.position.set(this.x, this.y, this.z);
				break;
			case 2:
				this.x = Math.floor((x - ((window.innerWidth - 1600) / 2)) / 100);
				this.y = Math.floor((y - ((window.innerHeight - 900) / 2)) / 100);
				this.sprite.position.set(this.x*2+0.5, this.y*2+0.5, this.z);
				break;
			default:
		}
	};
	
	this.switch = function() {
		if (this.size === 1) {
			this.size = 2;
			this.sprite.scale.set(2, 2, 2);
		} else {
			this.size = 1;
			this.sprite.scale.set(1, 1, 1);
		}
	};
	
	this.nextTile = function() {
		console.log(this.object_id);
		if (this.object_id < 1000 || this.object_id >= 2000) {
			this.object_id = 1001;
		} else {
			this.object_id += 1;
			if (this.object_id > (1000+this.numOfTiles)) {
				this.object_id = 1001;
			}
		}
	};
	
	this.previousTile = function() {
		if (this.object_id < 1000 || this.object_id >= 2000) {
			this.object_id = 1000 + this.numOfTiles;
		} else {
			this.object_id -= 1;
			if (this.object_id <= 1000) {
				this.object_id = 1000 + this.numOfTiles;
			}
		}
	};
	
	this.nextObject = function() {
		if (this.object_id < 2000 || this.object_id >= 3000) {
			this.object_id = 2001;
		} else {
			this.object_id += 1;
			if (this.object_id > (2000+this.numOfObjects)) {
				this.object_id = 2001;
			}
		}
	};
	
	this.previousObject = function() {
		if (this.object_id < 2000 || this.object_id >= 3000) {
			this.object_id = 2000 + this.numOfObjects;
		} else {
			this.object_id -= 1;
			if (this.object_id <= 2000) {
				this.object_id = 2000 + this.numOfObjects;
			}
		}
	};
}

function player(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.id = 3;	//	always +1 this for each new object
	this.speed = 8;
	this.material = new THREE.SpriteMaterial({map: null, color: 0x0000FF, fog: true});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(1, 1, 1);
	scene.add(this.sprite);
	
	this.move = function(direction) {
		this.x += this.speed*direction*modifier;
	};
}