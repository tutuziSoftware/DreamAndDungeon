var DAD = angular.module('DAD',[]);

DAD.controller('menuController', function($scope){
    $scope.money = new Money();

    //TODO データ構造については要検討。各街で違うので、データはここにベタ書きしない方が良さそう
    $scope.menuList = [
        'やどや',
        'どうぐや',
        'ギルド',
        'さんさく'
    ];
});


DAD.controller('storyController', function($scope, $http){
    $scope.spot = 'ヨグは全ての場所を知っている。時系列的な意味でも、空間的な意味でもだ';
    $scope.talk = "神話性物に近づいてはならぬ";

    $http({
        method:'get',
        url:'/DreamAndDungeon/story/1_1.xml'
    }).success(function(xml){
        var talks = $(xml).find('block:eq(0) talk');
        var talkIndex = 0;

        $scope.spot = '';
        $scope.talk = $(xml).find('block:eq(0) title').text();

        $scope.next = function(){
            var echo = $(talks[talkIndex++]);

            if(echo.attr('spot')){
                $scope.spot = echo.attr('spot');
            }

            $scope.talk = echo.text();
        };
    });
});