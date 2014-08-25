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
		var point = this.getPoint(unitId);

		remove.call(this, unitId);
		_move.call(this, unitId, point, move);

		function remove(unitId){
			var pointKey = this._units[unitId];
			delete this._units[unitId];
			delete this._point[pointKey];
		}

		function _move(unitId, oldPoint, move){
			var x = oldPoint.x + move.x;
			var y = oldPoint.y + move.y;

			this.add(x, y, unitId);
		}
	},
	getPoint:function(unitId){
		var point = this._units[unitId].split(',');

		return {
			x:+point[0],
			y:+point[1],
			toString:function(){
				return this.x + ',' + this.y;
			}
		};
	},
	getOutOfRangeUnits:function(unitIds){
		var self = this;
		var mapUnitIds = Object.keys(this._units);

		var outOfUnitIds = mapUnitIds.filter(function(outOfUnitId){
			var isTeamUnit = unitIds.some(function(unitId){
				return unitId == outOfUnitId;
			});

			if(isTeamUnit) return false;

			return unitIds.every(function(unitId){
				var unitPoint = self.getPoint(unitId);
				var outOfRangeUnit = self.getPoint(outOfUnitId);

				return Math.abs(unitPoint.x - outOfRangeUnit.x) < 6 &&
						Math.abs(unitPoint.y - outOfRangeUnit.y);
			});
		});

		return outOfUnitIds;
	},
	_isUnitExist:function(x, y){
		return !!this._point[this._getPointKey(x,y)];
	},
	_getPointKey:function(x, y){
		return x + ',' + y;
	}
};