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
Map.NullPoint = {
	x:NaN,
	y:NaN,
	toString:function(){
		return 'ここはどこ、わたしはだれ';
	}
};

Map.prototype = {
	add:function(x, y, unitId){
		if(this._isUnitExist(x, y)){
			this.add(x + 1, y, unitId);
			return;
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
		if(unitId in this._units) {
			var point = this._units[unitId].split(',');

			return {
				x:+point[0],
				y:+point[1],
				toString:function(){
					return this.x + ',' + this.y;
				}
			};
		}else{
			return Map.NullPoint;
		}
	},
	/**
	 * 6マス以上離れているユニットを返します。
	 * @param unitIds ユニットIDの配列。この配列に入っているユニットID全てから6マス以上離れているユニットを探索します。
	 * @return {Array} unitIds達から6マス以上離れているユニットのIDを返します。
	 *
	 * やった！　実装の仕方が思いつかなくて困ってたから、すんなり実装出来てよかった！
	 * でもこのメソッドを呼ぶたびに線形探索を行っているのはなんとも非効率的だ……。
	 */
	getOutOfRangeUnits:function(unitIds){
		var self = this;
		var mapUnitIds = Object.keys(this._units);

		//unitIdsから6マス離れているユニットを返します。
		var outOfUnitIds = mapUnitIds.filter(function(outOfUnitId){
			//自分自身を除外します。
			var isTeamUnit = unitIds.some(function(unitId){
				return unitId == outOfUnitId;
			});

			if(isTeamUnit) return false;

			//6マス以上離れている場合、trueを返します。
			var isOutOf = unitIds.every(function(unitId){
				var unitPoint = self.getPoint(unitId);
				var outOfRangeUnit = self.getPoint(outOfUnitId);

				return Math.abs(unitPoint.x - outOfRangeUnit.x) >= 6 ||
						Math.abs(unitPoint.y - outOfRangeUnit.y) >= 6;
			});

			return isOutOf;
		});

		return outOfUnitIds;
	},
	/**
	 * ユニット同士の相対距離を求めます。
	 * @param id1
	 * @param id2
	 * @return {Number}
	 */
	getRelativePosition:function(id1, id2){
		var id1Point = this.getPoint(id1);
		var id2Point = this.getPoint(id2);

		var id1X = id1Point.x;
		var id1Y = id1Point.y;
		var id2X = id2Point.x;
		var id2Y = id2Point.y;

		var id1Relative = Math.max(id1X, id2X) - Math.min(id1X, id2X);
		var id2Relative = Math.max(id1Y, id2Y) - Math.min(id1Y, id2Y);

		return Math.max(id1Relative, id2Relative) + Math.min(id1Relative, id2Relative);
	},
	_isUnitExist:function(x, y){
		return this._getPointKey(x,y) in this._point;
	},
	_getPointKey:function(x, y){
		return x + ',' + y;
	}
};