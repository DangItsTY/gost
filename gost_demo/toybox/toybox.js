//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//	A box full of objects to play with
//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//	create a toybox folder


//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//	Tiles
//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function planter(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.id = 2;
	this.speed = 1;
	this.vx = 0;
	this.vy = 0;
	this.ax = 0;
	this.ay = 0;
	this.jumpSpeed = 0;
	this.weight = 0;
	this.collisionSize = 1;
	this.alive = true;
	this.isGrounded = true;
	this.actionState = 1;
	this.moveTimer = 0;
	this.moveTimerMax = 2.0;
	
	this.material = new THREE.SpriteMaterial({map: assets_planter, color: 0xFFFFFF, fog: true});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(1, 2, 1);
	scene.add(this.sprite);
	
	this.chasePlayer = function() {
		if (this.actionState === 1) {
			if (this.x > THEPLAYER.x) {
				this.direction = -1;
			} else {
				this.direction = 1;
			}
			this.vx = this.speed*this.direction;
		} else if (this.actionState === 2) {
			this.vx = 0;
		}
	};
	
	this.act = function() {
		this.chasePlayer();
		
		if (this.moveTimer <= 1) {
			this.actionState = 1;
		}
		if (this.moveTimer > 1) {
			this.actionState = 2;
		}		
		if (this.moveTimer >= 2.0) {
			this.moveTimer = 0;
		}
		this.moveTimer += modifier;
	};
}


//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//	Miscellaneous
//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function candy(x, y, z) {
	this.name = "candy";
	this.x = x;
	this.y = y;
	this.z = z;
	this.id = 8;
	this.speed = 0;
	this.vx = 0;
	this.vy = 0;
	this.ax = 0;
	this.ay = 0;
	this.jumpSpeed = 0;
	this.weight = 0;
	this.prevX = 0;
	this.prevY = 0;
	this.collisionSize = 0.5;
	this.alive = true;
	this.isGrounded = true;
	this.type = "candy";
	this.team = 0;
	this.direction = 1;
	
	this.material = new THREE.SpriteMaterial({map: assets_candy, color: 0xFFFFFF, fog: true});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(0.5, 0.5, 0.5);
	scene.add(this.sprite);
	
	this.act = function() {		

	};
	
	this.damage = function(source) {

	};
	
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Collisions
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	this.collide_setup = function() {

	};
	
	this.collide_begin = function(target) {
		
	};
	
	this.collide_down = function(target) {

	};
	
	this.collide_left = function(target) {

	};
	
	this.collide_right = function(target) {

	};
	
	this.collide_up = function(target) {

	};
	
	this.collide_end = function(target) {
	
	};
}