function hander(x, y, z) {
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Properties
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Entity Info
	this.name = "hander";
	this.id = 2009;
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
	this.speed = 0;
	this.jumpSpeed = 0;
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
	this.isGrounded = true;
	
	//	Timers
	this.shootTimer = 0;
	this.shootTimerMax = 2.0;
	this.invincibleHitTimer = 0;
	this.invincibleHitTimerMax = 0.3;
	
	//	Sprite
	this.material = new THREE.SpriteMaterial({map: assets_hander, color: 0xFFFFFF, fog: true});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(1, 1, 1);
	scene.add(this.sprite);
	
	
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Basic Behaviors
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	this.act = function() {
		if (this.shootTimer <= 0) {
			this.actionState = 2;
			this.shoot();
			this.shootTimer = this.shootTimerMax;
		}
		if (this.invincibleHitTimer > 0) {
			this.invincibleHitTimer -= modifier;
			this.sprite.material.opacity = 0.5;
			this.actionState = 1;
		} else {
			this.invincibleHitTimer = 0;
			this.sprite.material.opacity = 1;
		}
		this.shootTimer -= modifier;
	};
	
	this.damage = function(source) {
		if (this.invincibleHitTimer === 0) {
			this.health -= source.strength;
			this.invincibleHitTimer = this.invincibleHitTimerMax;
		}
		if (this.health <= 0) {
			this.alive = false;
		}
	};

	
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Other Behaviors
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	this.shoot = function(source) {
		//	right
		theObjectFactory.create(new spit(this.x, this.y, theObjectFactory.zindex.projectiles));
		theObjectFactory.justAdded().direction = this.direction;
		theObjectFactory.justAdded().sprite.scale.set(this.direction * 0.5, 0.5, 0.5);
		
		//	up right
		theObjectFactory.create(new spit(this.x, this.y, theObjectFactory.zindex.projectiles));
		theObjectFactory.justAdded().direction = this.direction;
		theObjectFactory.justAdded().jumpSpeed = 5.66;
		theObjectFactory.justAdded().sprite.scale.set(this.direction * 0.5, 0.5, 0.5);
		
		//	up
		theObjectFactory.create(new spit(this.x, this.y, theObjectFactory.zindex.projectiles));
		theObjectFactory.justAdded().direction = this.direction;
		theObjectFactory.justAdded().jumpSpeed = 5.66;
		theObjectFactory.justAdded().speed = 0;
		theObjectFactory.justAdded().sprite.scale.set(this.direction * 0.5, 0.5, 0.5);
		
		//	up left
		theObjectFactory.create(new spit(this.x, this.y, theObjectFactory.zindex.projectiles));
		theObjectFactory.justAdded().direction = -this.direction;
		theObjectFactory.justAdded().jumpSpeed = 5.66;
		theObjectFactory.justAdded().sprite.scale.set(this.direction * 0.5, 0.5, 0.5);
		
		//	left
		theObjectFactory.create(new spit(this.x, this.y, theObjectFactory.zindex.projectiles));
		theObjectFactory.justAdded().direction = -this.direction;
		theObjectFactory.justAdded().sprite.scale.set(this.direction * 0.5, 0.5, 0.5);
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