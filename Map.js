function Map(callback){
	this._units = {};
	this._point = {};

	this._inout = new InOut();
	this._inout.get(function(maps){
		if(callback) callback();
	}, 'maps');

	Object.defineProperty(Map, 'map', {
		get:function(){
			return this._point;
		}
	});
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
	findPoint:function(unitId, callback){
		callback(this._units[unitId]);
	},
	_isUnitExist:function(x, y){
		return !!this._point[this._getPointKey(x,y)];
	},
	_getPointKey:function(x, y){
		return x + ',' + y;
	}
};