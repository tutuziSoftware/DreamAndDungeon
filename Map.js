function Map(callback){
	this._units = {};
	this._point = {};
	/**
	 *
	 * @type {
	 * 			unitId:[
	 * 				Map.Overlap,
	 * 				...
	 * 			],
	 * 			...
	 * 		}
	 * @private
	 */
	this._overlapEventListeners = {};
	this._unitInEventListeners = {};

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

		this._setUnit(x, y, unitId);
	},
	addEventListener:function(unitId, eventArgs){
		var eventName = eventArgs.name.charAt(0).toUpperCase() + eventArgs.name.slice(1);

		if(unitId in this['_'+eventArgs['name']+'EventListeners'] === false){
			this['_'+eventArgs['name']+'EventListeners'][unitId] = [];
		}

		this['_'+eventArgs['name']+'EventListeners'][unitId].push(new Map[eventName](eventArgs));
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

			this._executeOverlapEventListener(x, y);
			this._executeUnitInEventListener(x, y);
			this.add(x, y, unitId);
		}
	},
	_executeUnitInEventListener:function(x, y){
		var unitIds = Object.keys(this._unitInEventListeners);
		unitIds.forEach(function(checkUnitId){
			this._unitInEventListeners[checkUnitId].forEach(function(unitIn){
				var _unitIdPoint = this.getPoint(checkUnitId);
				var relative = this._getRelativePosition({x:x,y:y}, _unitIdPoint);
				unitIn.execute(relative);
			}, this);
		}, this);
	},
	/**
	 * とあるユニットの移動地点を元に、イベントを発火させます。
	 * このイベントが本当に発火するかどうかは引数によって決定します。
	 * @param x ユニットのX軸
	 * @param y ユニットのY軸
	 * @private
	 */
	_executeOverlapEventListener:function(x, y){
		var unitIds = Object.keys(this._overlapEventListeners);
		unitIds.forEach(function(checkUnitId){
			this._overlapEventListeners[checkUnitId].forEach(function(overlap){
				var _unitIdPoint = this.getPoint(checkUnitId);
				var relative = this._getRelativePosition({x:x,y:y}, _unitIdPoint);
				overlap.execute(relative);
			}, this);
		}, this);
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

		return this._getRelativePosition(id1Point, id2Point);
	},
	/**
	 * ユニット同士の相対距離を座標オブジェクトから求めます。
	 * @param id1Point
	 * @param id2Point
	 * @return {Number}
	 * @private
	 */
	_getRelativePosition:function(id1Point, id2Point){
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
	},
	/**
	 * ユニットを指定した座標に配置します。
	 * ユニットがすでにその座標に配置済みの場合、このメソッドは上書きを行います。
	 * @param x
	 * @param y
	 * @param unitId
	 * @private
	 */
	_setUnit:function(x, y, unitId){
		var point = this._getPointKey(x, y);

		this._point[point] = unitId;
		this._units[unitId] = point;

		this._inout.set(this._point, 'maps');
	}
};


/**
 * overlapイベントを表現するクラスです。
 * このクラスはあるユニットの指定範囲内に別のユニットが侵入した時、イベントを発火させます。
 * @param args
 * @param listener
 * @constructor
 */
Map.Overlap = function(args){
	if('args' in args == false) {
		throw '正しい引数を指定してください';
	}

	this._range = 'range' in args.args ? args.args.range : 1;
	this._listener = 'listener' in args ? args['listener'] : function(){};
}

Map.Overlap.prototype = {
	execute:function(relativePosition){
		if(relativePosition <= this._range){
			this._listener();
		}
	}
};

Map.UnitIn = function(args){
	this._range = 'range' in args.args ? args.args.range : 1;
	this._listener = 'listener' in args ? args['listener'] : function(){};
};

Map.UnitIn.prototype = {
	execute:function(relativePosition){
		if(relativePosition == this._range){
			this._listener();
		}
	}
};