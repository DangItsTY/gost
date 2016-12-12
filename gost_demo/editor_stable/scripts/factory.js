//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//	A factory that creates, destroys, and keeps track of objects
//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

function factory() {
	this.list = [];
	this.zindex = {
		objects: -1,
		lines: -3,
		cursor: -2
	};
	
	this.create = function(newObject) {
		this.list.push(newObject);
	};
	
	this.create_map = function(x, y, object_id) {
		switch(object_id) {
			case 1001:
				this.list.push(new grass(x, y, this.zindex.objects));
				break;
			case 1002:
				this.list.push(new rock(x, y, this.zindex.objects));
				break;
			case 2001:
				this.list.push(new imploder(x, y, this.zindex.objects));
				break;
			case 2002:
				this.list.push(new golem(x, y, this.zindex.objects));
				break;
			case 2003:
				this.list.push(new geolader(x, y, this.zindex.objects));
				break;
			case 2004:
				this.list.push(new stumper(x, y, this.zindex.objects));
				break;
			case 2005:
				this.list.push(new startPortal(x, y, this.zindex.objects));
				break;
			case 2006:
				this.list.push(new endPortal(x, y, this.zindex.objects));
				break;
			default:
				this.list.push(new wall(x, y, this.zindex.objects));			
		}
	};
	
	this.destroy = function(object_id) {
		scene.remove(this.list[object_id].sprite);
		this.list.splice(object_id, 1);
	};
	
	this.justAdded = function() {
		return this.list[this.list.length - 1];
	}
}