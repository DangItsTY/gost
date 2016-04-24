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
			if (this.x > theObjectFactory.list[PLAYER_ID].x) {
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












//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//	Common functions (temporary living space)
//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function collide_down_basic(me, target) {
	if(target.collisionType === "solid" && target.type === "tile") {
		if (me.vy / Math.abs(me.vy) === UP_DIRECTION*-1) {
			me.vy = 0;
			me.actionState = 0;
			me.y = target.y-1;
			me.isGrounded = true;
		}
	}
}

function collide_left_basic(me, target) {
	if(target.collisionType === "solid" && target.type === "tile") {
		if (!(collision_up(me, target))) {
			me.vx = 0;
			me.x = target.x+1;
			if (key["left"] in keysDown && !(me.isGrounded)) {
				me.wallClimb = true;
			}
		}
	}
}

function collide_right_basic(me, target) {
	if(target.collisionType === "solid" && target.type === "tile") {
		if (!(collision_up(me, target))) {
			me.vx = 0;
			me.x = target.x-1;
			if (key["right"] in keysDown && !(me.isGrounded)) {
				me.wallClimb = true;
			}
		}
	}
}

function collide_up_basic(me, target) {
	if(target.collisionType === "solid" && target.type === "tile") {
		if (me.vy / Math.abs(me.vy) === UP_DIRECTION) {
			me.vy = 0;
		}
		me.y = target.y+1;
	}
}

function chasePlayer(me) {
	me.vy = me.jumpSpeed*UP_DIRECTION;
	if (me.x > theObjectFactory.list[PLAYER_ID].x) {
		me.direction = -1;
	} else {
		me.direction = 1;
	}
	me.sprite.scale.set(me.direction, me.sprite.scale.y, me.sprite.scale.z);
};

function move_enemy_basic(me) {
	if (!(me.isGrounded) && me.invincibleHitTimer === 0) {
		if (Math.abs(me.vy) > 1) {
			me.vx = me.speed*me.direction;
		}
	}
};

function damage_enemy_basic(me, source) {
	if (me.invincibleHitTimer === 0) {
		me.health -= source.strength;
		var magnitude = Math.abs(source.vx);
		if (magnitude < 2) {
			magnitude = 2;
		}
		me.vx = magnitude*source.direction;
		me.vy = 4*UP_DIRECTION;
		me.invincibleHitTimer = me.invincibleHitTimerMax;
	}
	if (me.health <= 0) {
		me.alive = false;
	}
};