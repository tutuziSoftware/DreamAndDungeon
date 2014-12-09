/**
 * ストーリーを円状に展開する為のクラスです。
 * このクラスは基本的にただのフラグの集合体です。
 *
 * このクラスが通常のフラグと違うのは、
 * ID「''」から始まりID「''」に終わる円状のフラグリストであるという事です。
 * @constructor
 */
function StoryArray(){
    this._storys = {
        'id':{
        },
        'id2-1-s':{
            next:'id2-1-e'
        },
        'id2-1-e':{
            prev:'id2-1-s',
            next:'id2-2'
        },
        'id2-2':{
            prev:'id2-1-e'
        }
    };

    if(localStorage['storys'] == void 0 || localStorage['storys'] == null){
        localStorage['storys'] = JSON.stringify({});
    }
    this._status = JSON.parse(localStorage['storys']);
    this._status[''] = {};
}

StoryArray.prototype = {
    /**
     * ストーリーを開始します。
     * @param id
     */
    start:function(id){
        if(id in this._storys === false) return false;
        if(this._storys[id].prev === void 0){
            this._storys[id].prev = '';
        }

        if(this._storys[id].prev in this._status === false) return false;

        this._status[id] = this._storys[id];
        this._update();
        return true;
    },
    /**
     * ストーリーを進めます。
     * @param id
     */
    next:function(id){
        if(this._storys[id].next === void 0 || this._storys[id].next === '') {
            delete this._status[id];
            this._update();
            return true;
        }

        this.start(this._status[id].next);
        delete this._status[id];
        this._update();
        return true;
    },
    get branches(){
        return {
            length:Object.keys(this._status).length - 1
        };
    },
    getBranch:function(id){
        return this._status[id];
    },
    _update:function(){
        if(localStorage['storys'] == void 0 || localStorage['storys'] == null){
            localStorage['storys'] = JSON.stringify({});
        }
        localStorage['storys'] = JSON.stringify(this._status);
    }
};