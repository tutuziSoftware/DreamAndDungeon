var Block = function(args){
	this.toughness = args.toughness;
	this.type = args.type;
};

//TODO 多分ここらへんにダメージを受けた時の軽減関係の処理が入る
Block.prototype = {};

/**
 * この名前空間に含まれる定数は数値とします。
 * 複数の状態を持つ場合、ORで結合しANDで保持確認を行える為です。
 * @type {Object}
 */
Block.TYPE = {};
Block.TYPE.NONE = 1;