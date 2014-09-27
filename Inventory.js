/**
 * このクラスはAttack.jsとBlock.jsに依存します。
 * @param characterId
 * @constructor
 */
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

Inventory.DEFAULT_ARMS = {
	'なぐる':{
		name:'なぐる',
		type:Inventory.ITEM_TYPES.ARMS,
		attack:new Attack({
			power:3,
			type:Attack.TYPE.SLAP,
			range:new Attack.Range(1, 1)
		}),
		block:new Block({
			toughness:0,
			type:Block.TYPE.NONE
		}),
		caption:'探索者の基本攻撃。どんなに非力な探索者でもこれだけは使える'
	},
	'いしをなげる':{
		name:'いしをなげる',
		type:Inventory.ITEM_TYPES.ARMS,
		attack:new Attack({
			power:1,
			type:Attack.TYPE.THROW,
			range:new Attack.Range(1, 5)
		}),
		block:new Block({
			toughness:0,
			type:Block.TYPE.NONE
		}),
		caption:'探索者の基本攻撃。どんなに非力な探索者でもこれだけは使える'
	}
};

/**
 * @type {Object} 手持ち装備を示す定数です。
 */
Inventory.HAND = {};

Inventory.prototype = {
	/**
	 * アイテムを追加します。
	 * @param item
	 */
	push:function(item){
		var items = this.get();
		items.push(item);
		this._setItems(items);
	},
	/**
	 * アイテムを全て返します。
	 * @return {Array}
	 */
	get:function(){
		var self = this;
		var items = [];

		var inout = new InOut();
		inout.init(function(){
			inout.set([], self._getKey());
		}, this._getKey());
		inout.get(function(savedItems){
			items = savedItems.map(function(item){
				item.type = Inventory.ITEM_TYPES[item.type];
				if(item.attack) {
					item.attack = new Attack({
						power:item.power,
						type:item.type,
						range:new Attack.Range(
							item.attack.range.max,
							item.attack.range.min)
					});
				}
				return item;
			});
		}, this._getKey());

		return items;
	},
	/**
	 * 武器を返します。
	 * 武器を持っていない場合、「なぐる」「いしをなげる」が武器として返ります。
	 * @return {Array}
	 */
	getArms:function(){
		var items = this.get();
		var arms = items.filter(function(item){
			return item.type === Inventory.ITEM_TYPES.ARMS;
		}).slice(0,2);

		if(arms.length === 0){
			arms.push(Inventory.DEFAULT_ARMS['なぐる']);
			arms.push(Inventory.DEFAULT_ARMS['いしをなげる']);
		}else if(arms.length === 1){
			arms.push(Inventory.DEFAULT_ARMS['いしをなげる']);
		}

		return arms;
	},
	/**
	 * 攻撃可能な武器を返します。
	 * @param range 攻撃対象の距離です
	 * @return {Array} 攻撃可能な武器を返します。
	 */
	getArmRanges:function(range){
		//攻撃可能な武器を割り出す
		var arms = this.getArms().filter(function(arm){
			return arm.attack.range.isRange(range);
		});

		//デフォルト武器で攻撃可能なものを割り出す
		//memo:
		//		この部分の処理は「なぐる」「いしをなげる」に特化しても良いのですが、
		//		デフォルト武器が変更になった時、ここも変更しなければならない為、
		//		どんな武器が来てもOKなようにしています。

		//デフォルト武器のキーを連想配列に変換
		var keys = Object.keys(Inventory.DEFAULT_ARMS);
		var defaultArms = keys.reduce(function(obj, key){
			obj[key] = key;
			return obj;
		}, {});

		//デフォルト武器を武器として装備している場合は除外する。
		arms.forEach(function(arm){
			if(arm.name in Inventory.DEFAULT_ARMS){
				delete defaultArms[arm.name];
			}
		});

		//装備していないデフォルト武器の中で、攻撃可能な場合は攻撃可能な武器として追加する
		Object.keys(defaultArms).forEach(function(key){
			if(Inventory.DEFAULT_ARMS[key].attack.range.isRange(range)){
				arms.push(Inventory.DEFAULT_ARMS[key]);
			}
		});

		return arms;
	},
	/**
	 * デフォルト武器を一つも装備していない場合、trueが返ります。
	 * @private
	 */
	_isNotDefaultArms:function(){
		return this.getArms().every(function(arm){
			return Inventory.DEFAULT_ARMS[arm.name];
		});
	},
	/**
	 * アイテムを移動させます。
	 * アイテムの移動はお互いの位置を交換する形式になっています。
	 * @param nowPoint 移動させたいアイテムの現在位置
	 * @param newPoint 移動させたい位置
	 */
	move:function(nowPoint, newPoint){
		var items = this.get();
		var moveItem = items[nowPoint];
		var item = items[newPoint];
		items.splice(newPoint, 1, moveItem);
		items.splice(nowPoint, 1, item);

		this._setItems(items);
	},
	/**
	 * 現在指定しているIDの装備を全て破棄します。
	 */
	clear:function(){
		var inout = new InOut();
		inout.set([], this._getKey());
	},
	/**
	 * アイテムを保存します。
	 * @param items
	 * @private
	 */
	_setItems:function(items){
		var inout = new InOut();
		inout.init(function(){
			inout.set([], this._getKey());
		}, this._getKey());

		items = items.map(function(item){
			item.type = item.type.toString();
			return item;
		});

		inout.set(items, this._getKey());
	},
	/**
	 * localStorageのキーを返します。
	 * @return {String}
	 * @private
	 */
	_getKey:function(){
		return 'inventory_' + this._characterId;
	}
};