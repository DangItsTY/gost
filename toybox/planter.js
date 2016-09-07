function planter(x, y, z) {
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Properties
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Entity Info
	this.name = "planter";
	this.id = 2015;
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
	this.weight = 0;
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
	this.moveDirection = 1;
	
	//	Timers
	this.moveTimer = 0;
	this.moveTimerMax = 3.0;
	this.shootTimer = 0;
	this.shootTimerMax = 2.0;
	this.invincibleHitTimer = 0;
	this.invincibleHitTimerMax = 0.3;
	
	//	Sprite
	this.material = new THREE.SpriteMaterial({map: assets_planter, color: 0xFFFFFF, fog: true});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(1, 1, 1);
	this.sprite.material.map.repeat.y = 0.5;
	this.sprite.material.map.offset.y = 0.50;
	scene.add(this.sprite);
	
	
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Basic Behaviors
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	this.act = function() {
		this.move();
		this.strafe();
		if (this.moveTimer >= this.moveTimerMax) {
			this.moveTimer = theHelper.roll(20) / 10;
			this.moveDirection *= -1;
		} else {
			this.moveTimer += modifier;
		}
		if (this.shootTimer >= this.shootTimerMax) {
			this.shoot();
			this.shootTimer = theHelper.roll(10) / 10;
		} else {
			this.shootTimer += modifier;
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
	
	this.born = function() {
		theObjectFactory.create(new planter_body(this.x, this.y, theObjectFactory.zindex.projectiles));
		theObjectFactory.justAdded().attachment = this;
	};
	this.born();
	
	this.death = function() {
	};

	
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Other Behaviors
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	this.move = function() {
		this.vx = this.speed*this.moveDirection;
	};
	
	this.strafe = function() {
		if (this.x > THEPLAYER.x) {
			this.direction = -1;
		} else {
			this.direction = 1;
		}
		this.sprite.scale.set(this.direction, this.sprite.scale.y, this.sprite.scale.z);
	};
	
	this.shoot = function() {
		theObjectFactory.create(new spit(this.x + this.direction, this.y, theObjectFactory.zindex.projectiles));
		theObjectFactory.justAdded().sprite.scale.set(0.5, 0.5, 0.5);
		theObjectFactory.justAdded().direction = this.direction;
	};
	
	
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Collisions
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	this.collide_setup = function() {
	};
	
	this.collide_begin = function(target) {
		if (target.type === "player" && this.invincibleHitTimer === 0) {
			target.damage(this);
		}
	};
	
	this.collide_down = function(target) {
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
	};
	
	this.collide_end = function(target) {
	
	};
}

function planter_body(x, y, z) {
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Properties
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Entity Info
	this.name = "planter_body";
	this.id = 2015;
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
	this.weight = 0;
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
	this.attachment;
	
	//	Timers
	
	//	Sprite
	this.material = new THREE.SpriteMaterial({map: assets_planter_body, color: 0xFFFFFF, fog: true});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(1, 1, 1);
	this.sprite.material.map.repeat.y = 0.5;
	scene.add(this.sprite);
	
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Basic Behaviors
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	this.act = function() {
		this.followAttachment();
		
		if (!(this.attachment.alive)) {
			this.alive = false;
		}
	};
	
	this.damage = function(source) {
	};

	
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Other Behaviors
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	this.followAttachment = function() {
		this.x = this.attachment.x;
		this.y = this.attachment.y + 1;
		this.direction = this.attachment.direction;
		this.sprite.scale.set(this.direction, this.sprite.scale.y, this.sprite.scale.z);
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