var Inventory = function(characterId){
	this._characterId = characterId;
};

/**
 * 使い捨てアイテムを示す定数です。
 * @type {Object}
 */
Inventory.DISPOSABLE = {
	toString:function(){
		return 'DISPOSABLE';
	}
};

Inventory.prototype = {
	push:function(item){
		var self = this;
		this.get(function(items){
			if(items == InOut.KEY_NOT_EXIST) return;

			items.push(item);
			self._setItems(items);
		});
	},
	get:function(callback){
		//TODO 複数のcharacterIdを使用する考慮が足りていない

		var inout = new InOut();
		inout.init(function(){
			inout.set([], 'inventory');
		}, 'inventory');
		inout.get(function(items){
			var types = {'DISPOSABLE':Inventory.DISPOSABLE};

			var items = items.map(function(item){
				item.type = types[item.type];
				return item;
			});

			callback(items);
		}, 'inventory');
	},
	_setItems:function(items){
		var inout = new InOut();
		inout.init(function(){
			inout.set([], 'inventory');
		}, 'inventory');

		items = items.map(function(item){
			item.type = item.type.toString();
			return item;
		});

		inout.set(items, 'inventory');
	}
};