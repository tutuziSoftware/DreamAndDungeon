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
            this._groupId = groupKey;
            this._unit = units[this._unitKey];

            ['id', 'name'].forEach(function(property){
                this[property] = this._unit[property];
            }, this);

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
    set hp(newHp){
        this._unit.hp = newHp;
        this._save();
    },

    get hp(){
        return this._unit.hp;
    },

    get san(){
        return this._unit.san;
    },

    get status(){
        return Unit.STATUS[this._unit.status];
    },

    _save:function(){
        var group = JSON.parse(localStorage[this._groupId]);
        if(this._isDead() == false){
            group[this._unitKey] =  this._unit;
        }else{
            delete group[this._unitKey];
        }
        localStorage[this._groupId] = JSON.stringify(group);
    },

    _isDead:function(){
        return this._unit.hp <= 0;
    }
};