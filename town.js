var DAD = angular.module('DAD',[]);

DAD.controller('menuController', function($scope){
    $scope.menuList = [
        {
            name:'やどや',
            id:'yadoya'
        },
        {
            name:'どうぐや',
            id:'douguya'
        },
        {
            name:'ギルド',
            id:'guild'
        },
        {
            name:'さんさく',
            id:'sansaku'
        }
    ];
});