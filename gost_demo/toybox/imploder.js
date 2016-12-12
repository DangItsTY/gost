function imploder(x, y, z) {
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Properties
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Entity Info
	this.name = "imploder";
	this.id = 2001;
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
	this.jumpSpeed = 6;
	this.direction = 1;
	this.weight = 1;
	this.strength = 1;
	this.health = 3;
	this.damageType = "none";
	
	//	Collision Info
	this.prevX = 0;
	this.prevY = 0;
	this.collisionSize = 1.0;
	this.collisionType = "solid";
	
	//	States
	this.actionState = 1;
	this.alive = true;
	this.isGrounded = false;
	
	//	Timers
	this.moveTimer = 0;
	this.moveTimerMax = 2.0;
	this.invincibleHitTimer = 0;
	this.invincibleHitTimerMax = 0.3;
	
	//	Sprite
	this.material = new THREE.SpriteMaterial({map: assets_imploder, color: 0xFFFFFF, fog: true});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(1, 1, 1);
	scene.add(this.sprite);
	
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Basic Behaviors
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	this.act = function() {
		if (this.moveTimer <= 1) {
			this.move();
			this.actionState = 1;
		}
		if (this.moveTimer > 1) {
			this.actionState = 2;
		}		
		if (this.moveTimer >= 2.0) {
			this.moveTimer = 0;
			this.chasePlayer();
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
		this.vy = this.jumpSpeed*UP_DIRECTION;
		if (this.x > THEPLAYER.x) {
			this.direction = -1;
		} else {
			this.direction = 1;
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

/* can delete this */
function spit_artillery(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.id = 7;	//	always +1 this for each new object
	this.speed = 8;
	this.jumpSpeed = 4;
	this.vx = 0;
	this.vy = 0;
	this.ax = 0;
	this.ay = 0;
	this.weight = 0.5;
	this.collisionSize = 0.5;
	this.collisionType = "projectile";
	this.direction = 1;
	this.deathTimerMax = 2.0;
	this.deathTimer = this.deathTimerMax;
	this.alive = true;
	this.isGrounded = false;
	this.strength = 1;
	this.health = 1;
	this.type = "projectile";
	this.team = -1;
	
	this.material = new THREE.SpriteMaterial({map: assets_spit, color: 0xFFFFFF, fog: false});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(1, 1, 1);
	scene.add(this.sprite);
	
	this.move = function() {
		this.vx = this.speed*this.direction;
	}
	
	this.damage = function(source) {
		
	}
	
	this.deathTimerTick = function() {
		//	make this into a helper function for simple timer?
		if (this.deathTimer > 0) {
			this.deathTimer -= modifier;
		} else {
			this.deathTimer = 0;
			this.alive = false;
		}
	}
	this.act = function() {
		if (this.deathTimer === this.deathTimerMax) {
			this.vy = this.jumpSpeed*UP_DIRECTION;
		}
		this.move();
		this.deathTimerTick();
	}
	
	
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Collisions
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	this.collide_setup = function() {
		
	};
	
	this.collide_begin = function(target) {
		if (target.team === this.team*-1) {
			target.damage(this);
		}
		if (target.team !== this.team && target.type !== "projectile" && !(target.isInvincible)) {
			this.alive = false;
		}
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
























function imploder2(x, y, z) {
	this.name = "imploder";
	this.x = x;
	this.y = y;
	this.z = z;
	this.id = 2;
	this.speed = 4;
	this.vx = 0;
	this.vy = 0;
	this.ax = 0;
	this.ay = 0;
	this.jumpSpeed = 4;
	this.weight = 1;
	this.prevX = 0;
	this.prevY = 0;
	this.collisionSize = 1;
	this.alive = true;
	this.isGrounded = true;
	this.actionState = 1;
	this.moveTimer = 0;
	this.moveTimerMax = 2.0;
	this.type = "enemy";
	this.isGrounded = true;
	this.strength = 1;
	this.health = 3;
	this.invincibleHitTimer = 0;
	this.invincibleHitTimerMax = 0.3;
	this.team = -1;
	this.direction = 1;
	
	this.material = new THREE.SpriteMaterial({map: assets_imploder, color: 0x99FF99, fog: true});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(1, 1, 1);
	scene.add(this.sprite);
	
	this.move = function() {
		if (!(this.isGrounded) && this.invincibleHitTimer === 0) {
			if (Math.abs(this.vy) > 1) {
				this.vx = this.speed*this.direction;
			}
		}
	};
	
	this.chasePlayer = function() {
		this.vy = this.jumpSpeed*UP_DIRECTION;
		if (this.x > THEPLAYER.x) {
			this.direction = -1;
		} else {
			this.direction = 1;
		}
		this.sprite.scale.set(this.direction, this.sprite.scale.y, this.sprite.scale.z);
	};
	
	this.spit = function() {
		theObjectFactory.create(new spit_artillery(this.x + this.direction, this.y, theObjectFactory.zindex.projectiles));
		theObjectFactory.justAdded().direction = this.direction;
		theObjectFactory.justAdded().sprite.scale.set(this.direction * 0.5, 0.5, 0.5);
		
	};
	
	this.act = function() {		
		if (this.moveTimer <= 1) {
			this.move();
			this.actionState = 1;
		}
		if (this.moveTimer > 1) {
			this.actionState = 2;
		}		
		if (this.moveTimer >= 2.0) {
			this.moveTimer = 0;
			this.chasePlayer();
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
		if (this.invincibleHitTimer === 0) {
			this.health -= source.strength;
			var magnitude = Math.abs(source.vx);
			if (magnitude < 2) {
				magnitude = 2
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

function imploder3(x, y, z) {
	this.name = "imploder";
	this.x = x;
	this.y = y;
	this.z = z;
	this.id = 2;
	this.speed = 4;
	this.vx = 0;
	this.vy = 0;
	this.ax = 0;
	this.ay = 0;
	this.jumpSpeed = 4;
	this.weight = 1;
	this.prevX = 0;
	this.prevY = 0;
	this.collisionSize = 3;
	this.alive = true;
	this.isGrounded = true;
	this.actionState = 1;
	this.moveTimer = 0;
	this.moveTimerMax = 2.0;
	this.type = "enemy";
	this.isGrounded = true;
	this.strength = 1;
	this.health = 10;
	this.invincibleHitTimer = 0;
	this.invincibleHitTimerMax = 0.3;
	this.team = -1;
	this.direction = 1;
	
	this.material = new THREE.SpriteMaterial({map: assets_imploder, color: 0xFFFFFF, fog: true});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(3, 3, 3);
	scene.add(this.sprite);
	
	this.move = function() {
		if (!(this.isGrounded) && this.invincibleHitTimer === 0) {
			if (Math.abs(this.vy) > 1) {
				this.vx = this.speed*this.direction;
			}
		}
	};
	
	this.chasePlayer = function() {
		this.vy = this.jumpSpeed*UP_DIRECTION;
		if (this.x > THEPLAYER.x) {
			this.direction = -1;
		} else {
			this.direction = 1;
		}
		this.sprite.scale.set(this.direction * 3, this.sprite.scale.y, this.sprite.scale.z);
	};
	
	this.spit = function() {
		theObjectFactory.create(new spit_artillery(this.x + this.direction, this.y, theObjectFactory.zindex.projectiles));
		theObjectFactory.justAdded().jumpSpeed = 4;
		theObjectFactory.justAdded().direction = this.direction;
		theObjectFactory.justAdded().sprite.scale.set(this.direction * 0.5, 0.5, 0.5);
		theObjectFactory.create(new spit_artillery(this.x + this.direction, this.y, theObjectFactory.zindex.projectiles));
		theObjectFactory.justAdded().jumpSpeed = 5;
		theObjectFactory.justAdded().direction = this.direction;
		theObjectFactory.justAdded().sprite.scale.set(this.direction * 0.5, 0.5, 0.5);
		theObjectFactory.create(new spit_artillery(this.x + this.direction, this.y, theObjectFactory.zindex.projectiles));
		theObjectFactory.justAdded().jumpSpeed = 6;
		theObjectFactory.justAdded().direction = this.direction;
		theObjectFactory.justAdded().sprite.scale.set(this.direction * 0.5, 0.5, 0.5);
		
	};
	
	this.act = function() {		
		if (this.moveTimer <= 1) {
			this.move();
			this.actionState = 1;
		}
		if (this.moveTimer > 1) {
			this.actionState = 2;
		}		
		if (this.moveTimer >= 2.0) {
			this.moveTimer = 0;
			this.chasePlayer();
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
		if (this.invincibleHitTimer === 0) {
			this.health -= source.strength;
			var magnitude = Math.abs(source.vx);
			if (magnitude < 2) {
				magnitude = 2
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
				this.y = target.y-(this.collisionSize - target.collisionSize);
				this.isGrounded = true;
			}
		}
	};
	
	this.collide_left = function(target) {
		if(target.collisionType === "solid" && target.type === "tile") {
			if (!(collision_up(this, target))) {
				this.vx = 0;
				this.x = target.x+(this.collisionSize - target.collisionSize);
			}
		}
	};
	
	this.collide_right = function(target) {
		if(target.collisionType === "solid" && target.type === "tile") {
			if (!(collision_up(this, target))) {
				this.vx = 0;
				this.x = target.x-(this.collisionSize - target.collisionSize);
			}
		}
	};
	
	this.collide_up = function(target) {
		if(target.collisionType === "solid" && target.type === "tile") {
			if (this.vy / Math.abs(this.vy) === UP_DIRECTION) {
				this.vy = 0;
			}
			this.y = target.y+(this.collisionSize - target.collisionSize);
		}
	};
	
	this.collide_end = function(target) {
	
	};
}

function imploder4(x, y, z) {
	this.name = "imploder";
	this.x = x;
	this.y = y;
	this.z = z;
	this.id = 2;
	this.speed = 4;
	this.vx = 0;
	this.vy = 0;
	this.ax = 0;
	this.ay = 0;
	this.jumpSpeed = 4;
	this.weight = 1;
	this.prevX = 0;
	this.prevY = 0;
	this.collisionSize = 1;
	this.alive = true;
	this.isGrounded = true;
	this.actionState = 1;
	this.moveTimer = 0;
	this.moveTimerMax = 2.0;
	this.type = "enemy";
	this.isGrounded = true;
	this.strength = 1;
	this.health = 3;
	this.invincibleHitTimer = 0;
	this.invincibleHitTimerMax = 0.3;
	this.team = -1;
	this.direction = 1;
	
	this.material = new THREE.SpriteMaterial({map: assets_imploder, color: 0x9999FF, fog: true});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(1, 1, 1);
	scene.add(this.sprite);
	
	this.move = function() {
		if (!(this.isGrounded) && this.invincibleHitTimer === 0) {
			if (Math.abs(this.vy) > 1) {
				this.vx = this.speed*this.direction;
			}
		}
	};
	
	this.chasePlayer = function() {
		this.vy = this.jumpSpeed*UP_DIRECTION;
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
		if (this.moveTimer <= 1) {
			this.move();
			this.actionState = 1;
		}
		if (this.moveTimer > 1) {
			this.actionState = 2;
		}		
		if (this.moveTimer >= 2.0) {
			this.moveTimer = 0;
			this.chasePlayer();
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
		if (this.invincibleHitTimer === 0) {
			this.health -= source.strength;
			var magnitude = Math.abs(source.vx);
			if (magnitude < 2) {
				magnitude = 2
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