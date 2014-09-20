/**
 * Created with JetBrains WebStorm.
 * User: puruhime
 * Date: 2014/09/12
 * Time: 8:17
 * To change this template use File | Settings | File Templates.
 */
var Attack = function(args){
	this.power = args.power;
	this.type = args.type;
	this.range = args.range;
};

/**
 * この名前空間に含まれる定数は数値とします。
 * 複数の状態を持つ場合、ORで結合しANDで保持確認を行える為です。
 * @type {Object}
 */
Attack.TYPE = {};
/**
 * 無属性の攻撃です
 * @type {Number}
 */
Attack.TYPE.NONE = 1;
/**
 * 殴る攻撃です。
 * @type {Number}
 */
Attack.TYPE.SLAP = 2;
/**
 * 投げる攻撃です。
 * @type {Number}
 */
Attack.TYPE.THROW = 4;

/**
 * 攻撃の範囲を示す定数です。
 * @param min
 * @param max
 * @constructor
 */
Attack.Range = function(min, max){
	this.min = min;
	this.max = max;
};

Attack.Range.prototype = {
	isRange:function(range){
		return this.min <= range && this.max >= range;
	}
};