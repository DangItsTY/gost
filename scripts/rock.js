function rock(x, y, z) {
	this.name = "rock";
	this.x = x;
	this.y = y;
	this.z = z;
	this.id = 1;
	this.speed = 0;
	this.vx = 0;
	this.vy = 0;
	this.ax = 0;
	this.ay = 0;
	this.jumpSpeed = 0;
	this.weight = 0;
	this.prevX = 0;
	this.prevY = 0;
	this.collisionSize = 1;
	this.collisionType = "solid";
	this.alive = true;
	this.isGrounded = true;
	this.type = "tile";
	this.team = 0;
	
	this.material = new THREE.SpriteMaterial({map: assets_rock, color: 0xFFFFFF, fog: true});
	this.sprite = new THREE.Sprite(this.material);
	this.sprite.position.set(this.x, this.y, this.z);
	this.sprite.scale.set(1, 1, 1);
	scene.add(this.sprite);
	
	this.act = function() {
		
	};
}