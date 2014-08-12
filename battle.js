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
	//必要なデータ構造
	$scope.actionQueue = new ActionQueue();

	['characters', 'enemys'].forEach(function(unitsKey){
		inout.get(function(units){
			statusToStatusObject(units);
			addActionQueue(units);
			$scope[unitsKey] = units;
		}, unitsKey);
	});

	/**
	 * 取得したデータのキー「status」をオブジェクトに置換します。
	 * @param unitsKey
	 */
	function statusToStatusObject(units){
		Object.keys(units).forEach(function(unitsKey){
			var unit = units[unitsKey];
			unit.status = STATUS[unit.status];
		});
	}

	/**
	 * ユニットを行動キューに登録します。
	 */
	function addActionQueue(units){
		Object.keys(units).forEach(function(unitsKey){
			$scope.actionQueue.add(units[unitsKey]);
		});
	}
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