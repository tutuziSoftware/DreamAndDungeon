/**
 * データの入出力を管理します。
 * データの入出力先はサーバかもしれないし、ローカルストレージかもしれません。
 * @constructor
 */
function InOut(callback){
	if(callback) callback(this);
}

InOut.KEY_NOT_EXIST = {};

InOut.prototype = {
	get:function(callback, key){
		key = this.__getKey(key);

		if(key in localStorage){
			callback(JSON.parse(localStorage[key]));
		}else{
			callback(InOut.KEY_NOT_EXIST);
		}
	},
	set:function(data, key, callback){
		key = this.__getKey(key);

		localStorage[key] = JSON.stringify(data);
		if(callback) callback();
	},
	__getKey:function(key){
		if(key == void 0){
			key = '';
		}

		return key;
	}
};

Object.freeze(InOut);