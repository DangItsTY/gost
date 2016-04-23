function player(x, y, z) {
	this.name = "player";
	this.x = x;
	this.y = y;
	this.z = z;
	this.id = 3;	//	always +1 this for each new object
	this.speed = 4;
	this.vx = 0;
	this.vy = 0;
	this.ax = 0;
	this.ay = 0;
	this.jumpSpeed = 4.75;
	this.weight = 1;
	this.prevX = 0;
	this.prevY = 0;
	this.collisionSize = 1;
	this.collisionType = "solid";	
	this.direction = 1;
	this.actionState = 0;	//0 - jump, 1 - attack, 2 - defend
	this.wallClimb = false;
	this.dashLeftTimer = 0;
	this.dashLeftTimerMax = 0.25;
	this.dashRightTimer = 0;
	this.dashRightTimerMax = 0.25;
	this.dashAirTimer = 0;
	this.dashAirTimerMax = 0.25;
	this.invincibleHitTimer = 0;
	this.invincibleHitTimerMax = 1.0;
	this.reflectTimer = 0;
	this.reflectTimerMax = 0.25;
	this.defendTimer = 0;
	this.defendTimerMax = 1.0;
	this.jumpTimer = 0;
	this.jumpTimerMax = 0.25;
	this.moveDisable = false;
	this.isGrounded = true;
	this.alive = true;
	this.attackTimer = 0;
	this.attackTimerMax = 0.25;
	this.type = "player";
	this.strength = 1;
	this.health = 1;
	this.team = 1;
	this.isInvincible = false;
	
	this.material = new THREE.SpriteMaterial({map: assets_player, color: 0xFFFFFF, fog: false});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(1, 1, 1);
	scene.add(this.sprite);
	
	this.replay = function() {
		//	restarts the player
		this.x = 2;
		this.y = 15;
		this.vx = 0;
		this.vy = 0;
		this.ax = 0;
		this.ay = 0;
		this.health = 1;
	};
	
	this.move = function(direction) {
		if (!(this.moveDisable) && this.dashAirTimer === 0) {
			//	apply speed
			this.ax = this.speed*direction;
			if (Math.abs(this.vx) < 2) {
				this.vx = 2*direction;
			}
			if (Math.sign(this.vx) !== Math.sign(this.ax)) {
				this.ax = 4*this.speed*direction;
			}
			
			//	max run speed
			if (Math.abs(this.vx) > this.speed) {
				this.vx = (this.vx/Math.abs(this.vx)) * this.speed;
			}
			
			//	change direction, this allows for animation locking
			if (this.direction !== direction) {
				this.direction = direction;
				this.sprite.scale.set(this.direction, 1, 1);
			}			
		}
	};
	
	this.move_vertical = function(direction) {
		this.y += this.speed*direction*modifier*UP_DIRECTION;
		this.vy = 0;
		this.ay = 0;
	};
	
	this.action = function(keyType) {
		if (keyType === "tap") {
			switch(this.actionState) {
				case 0:
					this.jump();
					this.jumpTimer = this.jumpTimerMax;
					break;
				case 1:
					this.attackTimer = 0.001;
					break;
				case 2:
					this.reflect();
					break;
				default:
			}
		} else if (keyType === "hold") {
			switch(this.actionState) {
				case 0:
					if (this.jumpTimer > 0) {
						this.jump();
					}
					break;
				case 1:
					break;
				case 2:
					break;
				default:
			}
		}else if (keyType === "release") {
			switch(this.actionState) {
				case 0:
					this.jumpTimer = 0;
					break;
				case 1:
					this.attack();
					break;
				case 2:
					this.defend();
					break;
				default:
			}
		}
	}
	
	this.jump = function() {
		this.vy = this.jumpSpeed*UP_DIRECTION;
		
		//	Wall Jump, separate function?
		if (this.wallClimb) {
			this.vx = this.jumpSpeed*this.direction*-1;
		}
		
		this.resetWallClimb();
	}
	
	this.stop = function(direction) {
		if (this.dashAirTimer === 0) {
			this.ax = 0;
		}
	};
	
	this.wallClimbAct = function() {
		this.actionState = 0;
		this.moveDisable = true;
		if (this.vy > 1) {
			this.vy = 1;
		}
	}
	
	this.resetWallClimb = function() {
		this.wallClimb = false;
		this.moveDisable = false;
	}
	
	this.setCorrectState = function() {
		if (this.wallClimb && this.isGrounded) {
			this.resetWallClimb();
		}
	}
	
	this.attack = function() {
		if (this.attackTimer < this.attackTimerMax) {
			theObjectFactory.create(new player_attack(this.x + this.direction, this.y, theObjectFactory.zindex.projectiles));
			theObjectFactory.justAdded().direction = this.direction;
			theObjectFactory.justAdded().sprite.scale.set(this.direction, 1, 1);
		} else if (this.attackTimer >= this.attackTimerMax) {
			theObjectFactory.create(new player_attackBullet(this.x + this.direction, this.y, theObjectFactory.zindex.projectiles));
			theObjectFactory.justAdded().direction = this.direction;
			theObjectFactory.justAdded().sprite.scale.set(this.direction, 1, 1);
			theObjectFactory.justAdded().speed += Math.abs(this.vx);
		}
		this.attackTimer = 0;
	}
	
	this.reflect = function() {
		this.reflectTimer = this.reflectTimerMax;
		theObjectFactory.create(new player_reflect(this.x, this.y, theObjectFactory.zindex.projectiles));
		this.isInvincible = true;
	}
	
	this.defend = function() {
		this.defendTimer = this.defendTimerMax;
		theObjectFactory.create(new player_defend(this.x, this.y, theObjectFactory.zindex.projectiles));
		this.isInvincible = true;
	}
	
	this.act = function() {
		this.setCorrectState();
		if (this.wallClimb) {
			this.wallClimbAct();
		}
		
		//	update dash timer
		if (this.dashLeftTimer > 0) {
			this.dashLeftTimer -= modifier;
		} else {
			this.dashLeftTimer = 0;
		}
		if (this.dashRightTimer > 0) {
			this.dashRightTimer -= modifier;
		} else {
			this.dashRightTimer = 0;
		}
		if (this.dashAirTimer > 0) {
			this.dashAirTimer -= modifier;
		} else {
			this.dashAirTimer = 0;
		}
		if (this.attackTimer < this.attackTimerMax && this.attackTimer > 0) {
			this.attackTimer += modifier;
		} else {
			this.attackTimer = this.attackTimerMax;
		}
		if (this.invincibleHitTimer > 0) {
			this.invincibleHitTimer -= modifier;
			this.sprite.material.opacity = 0.5;
		} else {
			this.invincibleHitTimer = 0;
			this.sprite.material.opacity = 1;
		}
		if (this.jumpTimer > 0) {
			this.jumpTimer -= modifier;
		} else {
			this.jumpTimer = 0;
		}
		if (this.reflectTimer > 0) {
			this.isInvincible = true;
			this.reflectTimer -= modifier;
		} else {
			this.reflectTimer = 0;
			this.isInvincible = false;
		}
		if (this.defendTimer > 0) {
			this.isInvincible = true;
			this.defendTimer -= modifier;
		} else {
			this.defendTimer = 0;
			this.isInvincible = false;
		}
		
		// max dash speed
		if (this.dashAirTimer > 0 && Math.abs(this.vx) > 2*this.speed) {
			this.vx = (this.vx/Math.abs(this.vx)) * 2*this.speed;
		}
		
		if (outOfBounds(this)) {
			this.replay();
		}
	};
	
	this.damage = function(source) {
		if (this.invincibleHitTimer === 0 && this.reflectTimer === 0 && this.defendTimer === 0) {
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
			//this.alive = false;
			this.replay();
		}
	};
	
	this.dashLeft = function() {
		if (this.dashLeftTimer > 0) {
			this.vx = 2*this.speed*-1;
			this.ax = 2*this.speed*-1;
			this.dashLeftTimer = 0;
			this.dashAirTimer = this.dashAirTimerMax;
		}
		this.dashLeftTimer = this.dashLeftTimerMax;
		this.dashRightTimer = 0;
	};
	
	this.dashRight = function() {
		if (this.dashRightTimer > 0) {
			this.vx = 2*this.speed*1;
			this.ax = 2*this.speed*1;
			this.dashRightTimer = 0;
			this.dashAirTimer = this.dashAirTimerMax;
		}
		this.dashRightTimer = this.dashRightTimerMax;
		this.dashLeftTimer = 0;
	};
	
	//	Key Controls
	this.leftTap = function() {
		this.dashLeft();
	};
	
	this.rightTap = function() {
		this.dashRight();
	};
	
	this.leftHold = function(direction) {
		this.move(direction);
	};
	
	this.rightHold = function(direction) {
		this.move(direction);
	};
	
	this.actionTap = function() {
		this.action("tap");
	};
	
	this.actionHold = function() {
		this.action("hold");
	};
	
	this.actionRelease = function(direction) {
		this.action("release");
		
		if (this.actionState >= 0) {
			this.actionState += 1;
		}
		if (this.actionState > 3) {
			if (hack1) {
				this.actionState = 0;
			} else {
				this.actionState = -1;
			}
		}
	};
	
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Collisions
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	this.collide_setup = function() {
		this.wallClimb = false;
		this.isGrounded = false;
		this.moveDisable = false;
	};
	
	this.collide_begin = function(target) {
		
	};
	
	this.collide_down = function(target) {
		if(target.collisionType === "solid" && target.type === "tile") {
			if (this.vy / Math.abs(this.vy) === UP_DIRECTION*-1) {
				this.vy = 0;
				this.actionState = 0;
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
				if (key["left"] in keysDown && !(this.isGrounded)) {
					this.wallClimb = true;
				}
			}
		}
	};
	
	this.collide_right = function(target) {
		if(target.collisionType === "solid" && target.type === "tile") {
			if (!(collision_up(this, target))) {
				this.vx = 0;
				this.x = target.x-1;
				if (key["right"] in keysDown && !(this.isGrounded)) {
					this.wallClimb = true;
				}
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

function player_attack(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.id = 4;	//	always +1 this for each new object
	this.speed = 0;
	this.vx = 0;
	this.vy = 0;
	this.ax = 0;
	this.ay = 0;
	this.weight = 0;
	this.collisionSize = 1;
	this.collisionType = "projectile";
	this.direction = 1;
	this.deathTimerMax = 0.25;
	this.deathTimer = this.deathTimerMax;
	this.alive = true;
	this.isGrounded = true;
	this.strength = 1;
	this.health = 1;
	this.type = "projectile";
	this.team = 1;
	this.isInvincible = true;
	this.damageType = "melee";
	
	this.material = new THREE.SpriteMaterial({map: assets_attack, color: 0xFFFFFF, fog: false});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(1, 1, 1);
	scene.add(this.sprite);
	
	this.followPlayer = function() {
		this.vx = theObjectFactory.list[PLAYER_ID].vx;
		this.x = theObjectFactory.list[PLAYER_ID].x + this.direction;
		this.y = theObjectFactory.list[PLAYER_ID].y;
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

function player_attackBullet(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.id = 6;	//	always +1 this for each new object
	this.speed = 8;
	this.vx = 0;
	this.vy = 0;
	this.ax = 0;
	this.ay = 0;
	this.weight = 0;
	this.collisionSize = 1;
	this.collisionType = "projectile";
	this.direction = 1;
	this.deathTimerMax = 0.25;
	this.deathTimer = this.deathTimerMax;
	this.alive = true;
	this.isGrounded = true;
	this.strength = 2;
	this.health = 1;
	this.type = "projectile";
	this.team = 1;
	this.isInvincible = true;
	this.damageType = "range";
	
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

function player_defend(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.id = 5;	//	always +1 this for each new object
	this.speed = 0;
	this.vx = 0;
	this.vy = 0;
	this.ax = 0;
	this.ay = 0;
	this.weight = 0;
	this.collisionSize = 1;
	this.collisionType = "projectile";
	this.direction = 1;
	this.deathTimerMax = 1.0;
	this.deathTimer = this.deathTimerMax;
	this.alive = true;
	this.isGrounded = true;
	this.type = "projectile";
	this.team = 1;
	this.isInvincible = true;
	
	this.material = new THREE.SpriteMaterial({map: assets_defend, color: 0xFFFFFF, fog: false});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(1.5, 1.5, 1);
	scene.add(this.sprite);
	
	this.damage = function(source) {
		
	}
	
	this.followPlayer = function() {
		this.x = theObjectFactory.list[PLAYER_ID].x;
		this.y = theObjectFactory.list[PLAYER_ID].y;
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

	};
	
	this.collide_right = function(target) {

	};
	
	this.collide_up = function(target) {

	};
	
	this.collide_end = function(target) {
	
	};
}

function player_reflect(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.id = 5;	//	always +1 this for each new object
	this.speed = 0;
	this.vx = 0;
	this.vy = 0;
	this.ax = 0;
	this.ay = 0;
	this.weight = 0;
	this.collisionSize = 1.0;
	this.collisionType = "projectile";
	this.direction = 1;
	this.deathTimerMax = 0.25;
	this.deathTimer = this.deathTimerMax;
	this.alive = true;
	this.isGrounded = true;
	this.type = "projectile";
	this.team = 1;
	this.isInvincible = true;
	
	this.material = new THREE.SpriteMaterial({map: assets_reflect, color: 0xFFFFFF, fog: false});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(1.5, 1.5, 1);
	scene.add(this.sprite);
	
	this.followPlayer = function() {
		this.x = theObjectFactory.list[PLAYER_ID].x;
		this.y = theObjectFactory.list[PLAYER_ID].y;
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