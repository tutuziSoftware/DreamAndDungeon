function Map(callback){
	this._units = {};
	this._point = {};

	var self = this;
	this._inout = new InOut();
	this._inout.get(function(maps){
		for(var key in maps){
			var point = key.split(',');
			self.add(point[0], point[1], maps[key]);
		}

		if(callback) callback();
	}, 'maps');
}

Map.prototype = {
	add:function(x, y, unitId){
		if(this._isUnitExist(x, y)){
			this.add(x + 1, y);
		}

		var point = this._getPointKey(x, y);

		this._point[point] = unitId;
		this._units[unitId] = point;

		this._inout.set(this._point, 'maps');
	},
	getPoint:function(unitId){
		return this._units[unitId];
	},
	_isUnitExist:function(x, y){
		return !!this._point[this._getPointKey(x,y)];
	},
	_getPointKey:function(x, y){
		return x + ',' + y;
	}
};