var DAD = angular.module('DAD',[]);

DAD.controller('menuController', function($scope){
    $scope.menuList = {
        'yadoya':{
            name:'やどや',
            id:'yadoya',
            next:{
                'yadoya_gohan':{
                    name:'ごはんをたべる',
                    id:'yadoya_gohan'
                }
            }
        },
        'douguya':{
            name:'どうぐや',
            id:'douguya'
        },
        'guild':{
            name:'ギルド',
            id:'guild'
        },
        'sansaku':{
            name:'さんさく',
            id:'sansaku'
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