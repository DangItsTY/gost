function stumper(x, y, z) {
	this.name = "stumper";
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
	this.attackReady = false;
	
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
		if (this.x > theObjectFactory.list[PLAYER_ID].x) {
			this.direction = -1;
		} else {
			this.direction = 1;
		}
		this.sprite.scale.set(this.direction * 3, this.sprite.scale.y, this.sprite.scale.z);
	};
	
	this.spit = function() {
		theObjectFactory.create(new spit_artillery(this.x + this.direction, this.y + 1, theObjectFactory.zindex.projectiles));
		theObjectFactory.justAdded().jumpSpeed = 4;
		theObjectFactory.justAdded().direction = this.direction;
		theObjectFactory.justAdded().sprite.scale.set(this.direction * 0.5, 0.5, 0.5);
		theObjectFactory.create(new spit_artillery(this.x + this.direction, this.y + 1, theObjectFactory.zindex.projectiles));
		theObjectFactory.justAdded().jumpSpeed = 5;
		theObjectFactory.justAdded().direction = this.direction;
		theObjectFactory.justAdded().sprite.scale.set(this.direction * 0.5, 0.5, 0.5);
		theObjectFactory.create(new spit_artillery(this.x + this.direction, this.y + 1, theObjectFactory.zindex.projectiles));
		theObjectFactory.justAdded().jumpSpeed = 6;
		theObjectFactory.justAdded().direction = this.direction;
		theObjectFactory.justAdded().sprite.scale.set(this.direction * 0.5, 0.5, 0.5);
		theObjectFactory.create(new spit(this.x + this.direction, this.y + 1, theObjectFactory.zindex.projectiles));
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
		if (this.moveTimer >= this.moveTimerMax) {
			this.moveTimer = 0;
			this.chasePlayer();
			this.attackReady = true;
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
			if (this.attackReady) {
				this.spit();
				this.attackReady = false;
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