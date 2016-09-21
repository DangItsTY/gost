function exploder(x, y, z) {
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Properties
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Entity Info
	this.name = "exploder";0
	this.id = 2008;
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
	this.isGrounded = false;
	this.isExploding = false;
	
	//	Timers
	this.explodeTimer = 0;
	this.explodeTimerMax = 0.5;
	this.invincibleHitTimer = 0;
	this.invincibleHitTimerMax = 0.3;
	
	//	Sprite
	this.material = new THREE.SpriteMaterial({map: assets_exploder, color: 0xFFFFFF, fog: true});
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
		}
		if (this.invincibleHitTimer > 0) {
			this.invincibleHitTimer -= modifier;
			this.sprite.material.opacity = 0.5;
			this.actionState = 1;
		} else {
			this.invincibleHitTimer = 0;
			this.sprite.material.opacity = 1;
		}
		if (this.isExploding) {
			this.invincibleHitTimer = this.invincibleHitTimerMax;
			this.explodeTimer -= modifier;
			if (this.explodeTimer <= 0) {
				theObjectFactory.create(new spit(this.x, this.y, theObjectFactory.zindex.projectiles));
				theObjectFactory.justAdded().speed = 0;
				theObjectFactory.justAdded().sprite.scale.set(this.direction * 2, 2, 2);
				theObjectFactory.justAdded().collisionSize = 2.0;
				this.alive = false;
			}
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
			this.isExploding = true;
			this.explodeTimer = this.explodeTimerMax;
			this.weight = 0.5;
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
				//this.vx = this.speed;
				this.vx *= -1;
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
				//this.vx = this.speed * -1;
				this.vx *= -1;
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