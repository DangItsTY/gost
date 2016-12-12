function fisher(x, y, z) {
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Properties
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Entity Info
	this.name = "fisher";
	this.id = 2010;
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
	this.jumpSpeed = 4;
	this.direction = 1;
	this.weight = 1;
	this.strength = 1;
	this.health = 3;
	this.damageType = "none";
	
	//	Collision Info
	this.prevX = 0;
	this.prevY = 0;
	this.collisionSize = 1;
	this.collisionType = "solid";
	
	//	States
	this.actionState = 1;
	this.alive = true;
	this.isGrounded = false;
	this.madRange = 4;
	
	//	Timers
	this.jumpTimerMax = 1.0;
	this.jumpTimer = this.jumpTimerMax;
	this.invincibleHitTimer = 0;
	this.invincibleHitTimerMax = 0.3;
	
	//	Sprite
	this.material = new THREE.SpriteMaterial({map: assets_fisher, color: 0xFFFFFF, fog: true});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(1, 1, 1);
	scene.add(this.sprite);
	
	
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Basic Behaviors
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	this.act = function() {
		this.chasePlayer();
		
		var val = theHelper.isInRange(this, THEPLAYER, this.madRange);
		if (val) {
			this.sprite.material.color.set(0xFF0000);
			this.actionState = 2;
			this.speed = 8;
			
			this.jumpTimer += modifier;
			if (this.jumpTimer >= this.jumpTimerMax && this.isGrounded) {
				this.jump();
				this.jumpTimer = 0;
			}
		} else {
			this.sprite.material.color.set(0xFFFFFF);
			this.actionState = 1;
			this.jumpTimer = this.jumpTimerMax;
		}
		if (this.actionState === 1) {
			this.speed = 2;
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
	
	this.jump = function() {
		this.vy = this.jumpSpeed*UP_DIRECTION;
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