function player_attackBullet(x, y, z) {
	//	Entity Info
	this.name = "player_attackBullet";
	this.id = 6;
	this.type = "projectile";
	this.team = 1;
	
	//	Physics
	this.x = x;
	this.y = y;
	this.z = z;
	this.vx = 0;
	this.vy = 0;
	this.ax = 0;
	this.ay = 0;
	this.speed = 8;
	this.jumpSpeed = 0;
	this.direction = 1;
	this.weight = 0;
	this.strength = 2;
	this.health = 1;
	this.damageType = "range";
	
	//	Collision Info
	this.prevX = 0;
	this.prevY = 0;
	this.collisionSize = 1;
	this.collisionType = "projectile";
	
	//	States
	this.alive = true;
	this.isGrounded = true;
	this.isInvincible = true;
	
	//	Timers
	this.deathTimerMax = 0.25;
	this.deathTimer = this.deathTimerMax;
	
	//	Sprite
	this.material = new THREE.SpriteMaterial({map: assets_attack, color: 0xFFFFFF, fog: false});
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
		if (target.type === "enemy") {
			target.damage(this);
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