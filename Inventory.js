var Inventory = function(characterId){
	this._characterId = characterId;
};


Inventory.ITEM_TYPES = {
	/**
	 * 使い捨てアイテムを示す定数です。
	 * @type {Object}
	 */
	DISPOSABLE:{
		toString:function(){
			return 'DISPOSABLE';
		}
	},
	/**
	 * 手持ち装備を示す定数です。
	 * @type {Object}
	 */
	ARMS:{
		toString:function(){
			return 'ARMS';
		}
	}
};

/**
 * @type {Object} 手持ち装備を示す定数です。
 */
Inventory.HAND = {};

Inventory.prototype = {
	push:function(item){
		var items = this.get();
		items.push(item);
		this._setItems(items);
	},
	get:function(){
		//TODO 複数のcharacterIdを使用する考慮が足りていない
		var items = [];

		var inout = new InOut();
		inout.init(function(){
			inout.set([], 'inventory');
		}, 'inventory');
		inout.get(function(savedItems){
			items = savedItems.map(function(item){
				item.type = Inventory.ITEM_TYPES[item.type];
				return item;
			});
		}, 'inventory');

		return items;
	},
	getArms:function(){
		var items = this.get();
		var arms = items.filter(function(item){
			return item.type === Inventory.ITEM_TYPES.ARMS;
		}).slice(0,2);

		return arms;
	},
	move:function(nowPoint, newPoint){
		var items = this.get();
		var moveItem = items[nowPoint];
		var item = items[newPoint];
		items.splice(newPoint, 1, moveItem);
		items.splice(nowPoint, 1, item);

		this._setItems(items);
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