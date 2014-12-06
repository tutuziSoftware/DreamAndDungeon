function StoryArray(){
    this._storys = {
        'id':{
        }
    };

    if(localStorage['storys'] == void 0 || localStorage['storys'] == null){
        localStorage['storys'] = JSON.stringify({});
    }
    this._status = JSON.parse(localStorage['storys']);

    this._updateStatus();
}

StoryArray.prototype = {
    start:function(id){
        if(id in this._storys){
            this._status[id] = id;
            this._update();

            this._branches[id] = this._storys[id];
            this._updateStatus();
        }
    },
    get branches(){
        return this._branches;
    },
    getBranch:function(id){
        return this._branches[id];
    },
    _update:function(){
        if(localStorage['storys'] == void 0 || localStorage['storys'] == null){
            localStorage['storys'] = JSON.stringify({});
        }
        localStorage['storys'] = JSON.stringify(this._status);
    },
    _updateStatus:function(){
        var branchIds = Object.keys(this._status);
        this._branches = {};
        branchIds.forEach(function(branchId){
            this._branches[branchId] = this._storys[branchId];
        }, this);
        this._branches.length = branchIds.length;
    }
};