//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//	A factory that creates, destroys, and keeps track of objects
//	~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

function factory() {
	this.list = [];
	this.zindex = {
		background: -1,
		objects: -2,
		lines: -4,
		cursor: -3,
		projectiles: -5
	};
	this.loader = new loader();
	
	this.create = function(newObject) {
		this.list.push(newObject);
	};
	
	this.create_map = function(x, y, object_id) {
		//	this should probably always match with the editor's IDs
		//	i need to make sure my objects also match these IDs
		switch(object_id) {
			case 1001:
				this.list.push(new grass(x, y, this.zindex.objects));
				break;
			case 1002:
				this.list.push(new rock(x, y, this.zindex.objects));
				break;
			case 1003:
				this.list.push(new tree(x, y, this.zindex.objects));
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
				THESTARTPORTAL = this.justAdded();
				break;
			case 2006:
				this.list.push(new endPortal(x, y, this.zindex.objects));
				break;
			case 2007:
				this.list.push(new shocker(x, y, this.zindex.objects));
				break;
			case 2008:
				this.list.push(new exploder(x, y, this.zindex.objects));
				break;
			case 2009:
				this.list.push(new hander(x, y, this.zindex.objects));
				break;
			case 2010:
				this.list.push(new fisher(x, y, this.zindex.objects));
				break;
			case 2011:
				this.list.push(new sicker(x, y, this.zindex.objects));
				break;
			case 2012:
				this.list.push(new jakward(x, y, this.zindex.objects));
				break;
			case 2013:
				this.list.push(new zombier(x, y, this.zindex.objects));
				break;
			case 2014:
				this.list.push(new eyeballer(x, y, this.zindex.objects));
				break;
			case 2015:
				this.list.push(new planter(x, y, this.zindex.objects));
				break;
			default:
		}
	};
	
	this.destroy = function(object_index) {
		scene.remove(this.list[object_index].sprite);
		this.list.splice(object_index, 1);
	};
	
	this.justAdded = function() {
		return this.list[this.list.length - 1];
	};
}

function loader() {
	//	TyNote: the way this is loaded may be flipped, or maybe the grid was already flipped?
	this.levels = [
		{"data": "levels/level0.txt"},
		{"data": "levels/level1.txt"},
		{"data": "levels/level2.txt"},
		{"data": "levels/level3.txt"},
		{"data": "levels/level4.txt"},
		{"data": "levels/level5.txt"},
		{"data": "levels/level6.txt"},
		{"data": "levels/level7.txt"},
		{"data": "levels/level8.txt"},
		{"data": "levels/level9.txt"},
		{"data": "levels/level10.txt"}
	];

	this.load = function(level) {
		var file = new XMLHttpRequest();
		file.open("GET", this.levels[level].data);
		file.onreadystatechange = function() {
			if (file.readyState === 4) {
				if (file.status === 200 || file.status === 0) {
					var jsonData = JSON.parse(file.responseText);
					for (i = 0; i < COLUMNS_TOTAL; i++) {
						for (j = 0; j < ROWS_TOTAL; j++) {
							if (jsonData[i][j] >= 1000 && jsonData[i][j] < 2000) {
								theTileFactory.create_map(i, j, jsonData[i][j]);
							}
							if (jsonData[i][j] >= 2000 && jsonData[i][j] < 3000) {
								theObjectFactory.create_map(i, j, jsonData[i][j]);
							}
						}
					}
				}
			}
		}
		file.send(null);
	};
}