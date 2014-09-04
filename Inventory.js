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
		var self = this;
		this.get(function(items){
			if(items == InOut.KEY_NOT_EXIST) return;

			items.push(item);
			self._setItems(items);
		});
	},
	//TODO callbackでの取得はやめる
	get:function(callback){
		//TODO 複数のcharacterIdを使用する考慮が足りていない

		var inout = new InOut();
		inout.init(function(){
			inout.set([], 'inventory');
		}, 'inventory');
		inout.get(function(items){
			var items = items.map(function(item){
				item.type = Inventory.ITEM_TYPES[item.type];
				return item;
			});

			callback(items);
		}, 'inventory');
	},
	getArms:function(){
		var arms;

		this.get(function(items){
			arms = items.filter(function(item){
				return item.type === Inventory.ITEM_TYPES.ARMS;
			});
		});

		return arms;
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