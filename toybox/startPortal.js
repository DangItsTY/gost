function startPortal(x, y, z) {
	//	Entity Info
	this.name = "startPortal";
	this.id = 2;
	this.type = "portal";
	this.team = 0;
	
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
	this.strength = 0;
	this.health = 0;
	this.damageType = "none";
	
	//	Collision Info
	this.prevX = 0;
	this.prevY = 0;
	this.collisionSize = 0;
	this.collisionType = "transparent";
	
	//	States
	this.actionState = 1;
	this.alive = true;
	this.isGrounded = true;
	
	//	Timers
	this.moveTimer = 0;
	this.moveTimerMax = 2.0;
	this.invincibleHitTimer = 0;
	this.invincibleHitTimerMax = 0.3;
	
	//	Sprite
	this.material = new THREE.SpriteMaterial({map: assets_candy, color: 0x9999FF, fog: true});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(0.5, 0.5, 0.5);
	scene.add(this.sprite);
	
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Basic Behaviors
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	this.act = function() {
		
	};
	
	
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	//	Other Behaviors
	//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	
	
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