/**
 * 1つのユニットを表現するクラスです。
 * @param localStorageKey
 * @constructor
 */
function Unit(localStorageKey){
    this._unitKey = localStorageKey;

    ['characters', 'enemys'].forEach(function(groupKey){
        var units = JSON.parse(localStorage[groupKey]);

        if(this._unitKey in units){
            this._unitGroupId = groupKey;
            return;
        }
    }, this);
}

Unit.STATUS = {};
Unit.STATUS.NONE = {
    toString:function(){
        return 'ふつう';
    }
};

Unit.prototype = {
    get id(){
        return this._toObject['id'];
    },

    get name(){
        return this._toObject['name'];
    },

    set hp(hp){

    },

    get hp(){
        return this._toObject['hp'];
    },

    get san(){
        return this._toObject['san'];
    },

    get status(){
        return Unit.STATUS[this._toObject['status']];
    },

    /**
     * localStorageから必要な値をオブジェクトに変換します。
     * @private
     */
    get _toObject(){
        return JSON.parse(localStorage[this._unitGroupId])[this._unitKey];
    }
};