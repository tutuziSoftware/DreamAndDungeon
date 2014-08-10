/**
 * データの入出力を管理します。
 * データの入出力先はサーバかもしれないし、ローカルストレージかもしれません。
 * @constructor
 */
function InOut(callback){
	callback(this);
}

InOut.prototype = {
	get:function(callback, key){
		key = this.__getKey(key);

		callback(JSON.parse(localStorage[key]));
	},
	set:function(data, key, callback){
		key = this.__getKey(key);

		localStorage[key] = data;
		if(callback) callback();
	},
	__getKey:function(key){
		if(key == void 0){
			key = '';
		}

		return key;
	}
};