var DAD = angular.module('DAD',[]);

DAD.controller('charactersController', function($scope){
	var STATUS = {
		NONE:{
			toString:function(){
				return 'ふつう';
			}
		}
	}

	var inout = new InOut();

	inout.get(function(characters){
		Object.keys(characters).forEach(function(characterKey){
			var character = characters[characterKey];
			character.status = STATUS[character.status];
		});

		$scope.characters = characters;
	}, 'characters');
});

DAD.directive('dadCharacterAction', function() {
	return {
		scope:true
	}
});

/**
 * dad-character-actionを基点にdad-actionを持つDOMに対して表示・非表示を制御する為のdirectiveです。
 */
DAD.directive('dadAction', function() {
	return function(scope, element, attr) {
		$(element).click(function(){
			scope.isAction = attr.dadAction;

			$(element)
				.parent()
				.filter('[dad-character-action]')
				.find('[dad-action!='+attr.dadAction+']')
				.hide();
			$('[dad-action-cancel]').show();

			scope.$apply();
		});
	};
});

/**
 * dad-character-actionを基点に全てのdad-actionを表示します。
 */
DAD.directive('dadActionCancel', function() {
	return function(scope, element, attr) {
		$(element).click(function(){
			scope.isAction = '';

			$(element)
				.parent()
				.filter('[dad-character-action]')
				.find('[dad-action!='+attr.dadAction+']')
				.show();

			scope.$apply();
		}).hide();
	};
});