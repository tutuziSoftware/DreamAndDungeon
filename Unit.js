/**
 * 1つのユニットを表現するクラスです。
 * @param localStorageKey
 * @constructor
 */
function Unit(localStorageKey){
    this._unitKey = localStorageKey;
}

Unit.prototype = {
    get id(){
        return this._toObject['id'];
    },

    get hp(){

    },

    /**
     * localStorageから必要な値をオブジェクトに変換します。
     * @private
     */
    get _toObject(){
        return JSON.parse(localStorage['characters'])[this._unitKey];
    }
};