/**
 * 1つのユニットを表現するクラスです。
 * @param localStorageKey
 * @constructor
 */
function Unit(localStorageKey){
    this._unitKey = localStorageKey;
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
        var unit;

        ['characters', 'enemys'].forEach(function(groupKey){
            var units = JSON.parse(localStorage[groupKey]);

            if(this._unitKey in units){
                unit = units[this._unitKey];
                return;
            }
        }, this);

        return unit;
    }
};