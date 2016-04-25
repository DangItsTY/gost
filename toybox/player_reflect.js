function player_reflect(x, y, z) {
	//	Entity Info
	this.name = "player_reflect";
	this.id = 5;
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
	this.speed = 0;
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
	this.collisionType = "projectile";
	
	//	States
	this.alive = true;
	this.isGrounded = true;
	this.isInvincible = true;
	
	//	Timers
	this.deathTimerMax = 0.25;
	this.deathTimer = this.deathTimerMax;
	
	//	Sprite
	this.material = new THREE.SpriteMaterial({map: assets_reflect, color: 0xFFFFFF, fog: false});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(1.5, 1.5, 1);
	scene.add(this.sprite);
	
	this.followPlayer = function() {
		this.x = THEPLAYER.x;
		this.y = THEPLAYER.y;
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
		this.followPlayer();
		this.deathTimerTick();
	}
	
	
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
		if (target.team === this.team*-1 && target.type === "projectile") {
			target.direction *= -1;
			target.x = this.x-1;
			target.team *= -1;
			target.sprite.scale.set(target.direction * target.sprite.scale.x, target.sprite.scale.y, target.sprite.scale.z);
		}
	};
	
	this.collide_right = function(target) {
		if (target.team === this.team*-1 && target.type === "projectile") {
			target.direction *= -1;
			target.x = this.x+1;
			target.team *= -1;
			target.sprite.scale.set(target.direction * target.sprite.scale.x, target.sprite.scale.y, target.sprite.scale.z);
		}
	};
	
	this.collide_up = function(target) {

	};
	
	this.collide_end = function(target) {
	
	};
}