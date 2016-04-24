function spit(x, y, z) {
	//	Entity Info
	this.name = "spit";
	this.id = 7;
	this.type = "projectile";
	this.team = -1;
	
	//	Physics
	this.x = x;
	this.y = y;
	this.z = z;
	this.vx = 0;
	this.vy = 0;
	this.ax = 0;
	this.ay = 0;
	this.speed = 8;
	this.jumpSpeed = 4;
	this.direction = 1;
	this.weight = 0;
	this.strength = 1;
	this.health = 1;
	this.damageType = "evil";
	
	//	Collision Info
	this.prevX = 0;
	this.prevY = 0;
	this.collisionSize = 0.5;
	this.collisionType = "projectile";
	
	//	States
	this.actionState = 1;
	this.alive = true;
	this.isGrounded = true;
	
	//	Timers
	this.moveTimer = 0;
	this.moveTimerMax = 2.0;
	this.invincibleHitTimer = 0;
	this.invincibleHitTimerMax = 0.3;
	this.deathTimerMax = 2.0;
	this.deathTimer = this.deathTimerMax;
	
	//	Sprite
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