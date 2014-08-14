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

Map.TOP = {x:0,y:-1};
Map.RIGHT = {x:1,y:0};
Map.BOTTOM = {x:0,y:1};
Map.LEFT = {x:-1,y:0};

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
	moveUnit:function(unitId, move){
		var pointKey = this._units[unitId];

		remove.call(this, unitId, pointKey);
		_move.call(this, unitId, pointKey, move);

		function remove(unitId, pointKey){
			delete this._units[unitId];
			delete this._point[pointKey];
		}

		function _move(unitId, pointKey, move){
			var point = pointKey.split(',');

			var oldX = +(point[0]);
			var oldY = +(point[1]);

			var x = oldX + move.x;
			var y = oldY + move.y;

			this.add(x, y, unitId);
		}
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