function Money(){
    if(localStorage['money'] === void 0 || localStorage['money'] === null){
        localStorage['money'] = '0';
    }
};


Money.prototype = {
    valueOf:function(){
        return +localStorage['money'];
    },
    get toNumber(){
        return +localStorage['money'];
    },
    add:function(add){
        localStorage['money'] += (+localStorage['money']) + add;
    }
};