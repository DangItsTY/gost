function zombier(x, y, z) {
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Properties
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Entity Info
	this.name = "zombier";
	this.id = 2013;
	this.type = "enemy";
	this.team = -1;
	
	//	Physics
	this.x = x;
	this.y = y;
	this.z = z;
	this.vx = 0;
	this.vy = 0;
	this.ax = 0;
	this.ay = 0;
	this.speed = 2;
	this.jumpSpeed = 0;
	this.direction = 1;
	this.weight = 1;
	this.strength = 1;
	this.health = 1;
	this.damageType = "none";
	
	//	Collision Info
	this.prevX = 0;
	this.prevY = 0;
	this.collisionSize = 1;
	this.collisionType = "solid";
	
	//	States
	this.actionState = 1;
	this.alive = true;
	this.isGrounded = true;
	
	//	Timers
	this.moveTimer = 0;
	this.moveTimerMax = 1.0;
	this.stopTimer = 0;
	this.stopTimerMax = 1.0;
	this.invincibleHitTimer = 0;
	this.invincibleHitTimerMax = 0.3;
	
	//	Sprite
	this.material = new THREE.SpriteMaterial({map: assets_zombier, color: 0xFFFFFF, fog: true});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(1, 1, 1);
	scene.add(this.sprite);
	
	
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Basic Behaviors
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	this.act = function() {
		if (this.actionState === 1) {
			this.chasePlayer();
			this.actionState = 1;
			if (this.moveTimer >= this.moveTimerMax) {
				if (theHelper.roll(10) === 1) {
					this.stopTimer = 0;
					this.stopTimerMax = (theHelper.roll(10) / 10) * 1.0;
					this.moveTimer = this.moveTimerMax;
					this.actionState = 2;
				}
			}
			this.moveTimer += modifier;
		}
		if (this.actionState === 2) {
			this.stopTimer += modifier;
			if (this.stopTimer >= this.stopTimerMax) {
				this.stopTimer = this.stopTimerMax;
				this.moveTimer = 0;
				this.actionState = 1;
			}
		}
		if (this.invincibleHitTimer > 0) {
			this.invincibleHitTimer -= modifier;
			this.sprite.material.opacity = 0.5;
			this.moveTimer = 0;
			this.actionState = 1;
		} else {
			this.invincibleHitTimer = 0;
			this.sprite.material.opacity = 1;
		}
	};
	
	this.damage = function(source) {
		if (this.invincibleHitTimer === 0) {
			this.health -= source.strength;
			var magnitude = Math.abs(source.vx);
			if (magnitude < 2) {
				magnitude = 2;
			}
			this.vx = magnitude*source.direction;
			this.vy = 4*UP_DIRECTION;
			this.invincibleHitTimer = this.invincibleHitTimerMax;
		}
		if (this.health <= 0) {
			this.alive = false;
		}
	};

	
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Other Behaviors
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	this.move = function() {
		if (!(this.isGrounded) && this.invincibleHitTimer === 0) {
			if (Math.abs(this.vy) > 1) {
				this.vx = this.speed*this.direction;
			}
		}
	};
	
	this.chasePlayer = function() {
		if (this.x > THEPLAYER.x) {
			this.direction = -1;
		} else {
			this.direction = 1;
		}
		if (this.isGrounded && this.invincibleHitTimer === 0) {
			this.vx = this.speed*this.direction;
		}
		this.sprite.scale.set(this.direction, this.sprite.scale.y, this.sprite.scale.z);
	};
	
	
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Collisions
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	this.collide_setup = function() {
		this.isGrounded = false;
	};
	
	this.collide_begin = function(target) {
		if (target.type === "player" && this.invincibleHitTimer === 0) {
			target.damage(this);
		}
	};
	
	this.collide_down = function(target) {
		if(target.collisionType === "solid" && target.type === "tile") {
			if (this.vy / Math.abs(this.vy) === UP_DIRECTION*-1) {
				this.vy = 0;
				this.y = target.y-1;
				this.isGrounded = true;
			}
		}
	};
	
	this.collide_left = function(target) {
		if(target.collisionType === "solid" && target.type === "tile") {
			if (!(collision_up(this, target))) {
				this.vx = this.speed;
				this.x = target.x+1;
			}
		} else if (target.type === "enemy") {
			this.direction = 1;
			this.vx += this.speed * this.direction;
		}
	};
	
	this.collide_right = function(target) {
		if(target.collisionType === "solid" && target.type === "tile") {
			if (!(collision_up(this, target))) {
				this.vx = this.speed * -1;
				this.x = target.x-1;
			}
		} else if (target.type === "enemy") {
			this.direction = -1;
			this.vx += this.speed * this.direction;
		}
	};
	
	this.collide_up = function(target) {
		if(target.collisionType === "solid" && target.type === "tile") {
			if (this.vy / Math.abs(this.vy) === UP_DIRECTION) {
				this.vy = 0;
			}
			this.y = target.y+1;
		}
	};
	
	this.collide_end = function(target) {
	
	};
}