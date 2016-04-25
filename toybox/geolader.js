function geolader(x, y, z) {
	//	Entity Info
	this.name = "geolader";
	this.id = 2;
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
	this.speed = 4;
	this.jumpSpeed = 4;
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
	this.moveTimerMax = 4.0;
	this.invincibleHitTimer = 0;
	this.invincibleHitTimerMax = 0.3;
	
	//	Sprite
	this.material = new THREE.SpriteMaterial({map: assets_imploder, color: 0x999999, fog: true});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(1, 1, 1);
	scene.add(this.sprite);
	
	this.facePlayer = function() {
		if (this.x > THEPLAYER.x) {
			this.direction = -1;
		} else {
			this.direction = 1;
		}
		this.sprite.scale.set(this.direction, this.sprite.scale.y, this.sprite.scale.z);
	};
	
	this.spit = function() {
		theObjectFactory.create(new spit(this.x + this.direction, this.y, theObjectFactory.zindex.projectiles));
		theObjectFactory.justAdded().direction = this.direction;
		theObjectFactory.justAdded().sprite.scale.set(this.direction * 0.5, 0.5, 0.5);
		
	};
	
	this.act = function() {
		this.facePlayer();	
		if (this.moveTimer >= 2.0) {
			this.moveTimer = 0;
			this.spit();
		}
		if (this.invincibleHitTimer > 0) {
			this.invincibleHitTimer -= modifier;
			this.sprite.material.opacity = 0.5;
			this.moveTimer = 1;
		} else {
			this.invincibleHitTimer = 0;
			this.sprite.material.opacity = 1;
		}
		this.moveTimer += modifier;
	};
	
	this.damage = function(source) {
		if (this.invincibleHitTimer === 0 && source.damageType === "evil") {
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
				this.vx = 0;
				this.x = target.x+1;
			}
		}
	};
	
	this.collide_right = function(target) {
		if(target.collisionType === "solid" && target.type === "tile") {
			if (!(collision_up(this, target))) {
				this.vx = 0;
				this.x = target.x-1;
			}
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