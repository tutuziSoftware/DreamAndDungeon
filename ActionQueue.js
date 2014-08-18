function ActionQueue(){
	this.queue = [];
	this.index = 0;
}

ActionQueue.prototype = {
	/**
	 * ユニットを追加します
	 * @param unit
	 */
	add:function(unit){
		this.queue.push(unit);
		this._update();
	},
	/**
	 * 行動出来るユニットを返します
	 * @return {*}
	 */
	toTurn:function(){
		return this.queue[this.index];
	},
	/**
	 * 次に行動出来るユニットを求めます
	 */
	next:function(){
		this._update();

		this.index++;

		if(this.queue[this.index] === void 0) this.index = 0;
	},
	focus:function(unitId){
		for(var i = 0 ; i != this.queue.length ; i++){
			if(this.queue[i] == unitId){
				this.index = i;
			}
		}
	},
	/**
	 * 全てのユニットを探索し、speed順にソートを行います。
	 * また、システム上不要となったユニットをキューから排除する事も行います。
	 * @private
	 */
	_update:function(){
		this.queue = this.queue.filter(function(unit){
			return unit.hp >= 1;
		});

		this.queue.sort(function(unitA,unitB){
			return unitB.a - unitA.a;
		});
	}
};