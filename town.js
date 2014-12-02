var DAD = angular.module('DAD',[]);

DAD.controller('menuController', function($scope){
    //TODO データ構造については要検討。各街で違うので、データはここにベタ書きしない方が良さそう
    $scope.menuList = {
        'yadoya':{
            name:'やどや',
            id:'yadoya',
            next:{
                'yadoya_gohan':{
                    name:'ごはんをたべる(100G)',
                    id:'yadoya_gohan',
                    listener:function(){
                        console.log('ここに処理置いていいの？');
                    }
                }
            }
        },
        'douguya':{
            name:'どうぐや',
            id:'douguya',
            next:{/*動的に切り替える*/}
        },
        'guild':{
            name:'ギルド',
            id:'guild',
            listener:function(){
                //イベント発生とか
            }
        },
        'sansaku':{
            name:'さんさく',
            id:'sansaku',
            listener:function(){
                //イベント発生とか
            }
        }
    };

    var DEFAULT_MENU = {
        name:'',
        id:''
    };

    $scope.selectedMenu = DEFAULT_MENU;

    $scope.selectMenu = function(id){
        $scope.selectedMenu = $scope.menuList[id];
    };

    $scope.showMenu = function(){
        return $scope.selectedMenu != DEFAULT_MENU;
    };
});