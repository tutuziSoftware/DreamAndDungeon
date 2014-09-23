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
	var map = new Map;

	//必要なデータ構造
	$scope.actionQueue = new ActionQueue();

	//ユニット登録
	//データは{id:{ユニットの情報}}という感じで保存されている。
	['characters', 'enemys'].forEach(function(unitsKey){
		inout.get(function(units){
			roopUnits(units, [
				statusToStatusObject,
				addActionQueue,
				addCountAction,
				initMap]
			);
			$scope[unitsKey] = units;
		}, unitsKey);
	});

	/**
	 * ユニットの行動回数を記録します。
	 * この数値とアクションキューが分離されているのは、
	 * アクションキューはユニットの行動順のみを規定する為のもので、
	 * 行動回数とは分離されているべきだという考えのもので行っています。
	 * @type {Number}
	 */
	var myTurnUnitActionCount = 0;

	inout.get(function(unitId){
		//初期化処理
		if(unitId == InOut.KEY_NOT_EXIST){
			inout.set(unitId, 'myTurnUnit');
			inout.set(0, 'myTurnUnitActionCount');
			myTurnUnitActionCount = 0;
			return;
		}

		inout.get(function(count){
			myTurnUnitActionCount = +count;
		}, 'myTurnUnitActionCount');
		$scope.actionQueue.focus(unitId);
	}, 'myTurnUnit');

	$scope.turnUnit = $scope.actionQueue.toTurn();
	$scope.log = [];

	/**
	 * ターン終了時に呼ばれるメソッドです。
	 * @param unit
	 */
	$scope.nextTurn = function(){
		$scope.log.push($scope.actionQueue.toTurn().name + "　のターンを終了");

		$scope.actionQueue.next();
		$scope.turnUnit = $scope.actionQueue.toTurn();

		if($scope['enemys'][$scope.turnUnit.id]){
			$scope.log.push($scope.turnUnit.name + "のターン！")
			$scope.nextTurn($scope.turnUnit);
		}
	};


	['TOP','RIGHT','BOTTOM','LEFT'].forEach(function(key){
		/**
		 * ユニットがどこに移動するかを示す定数です。
		 * @type {*}
		 */
		$scope[key] = Map[key];
	});

	/**
	 * ユニットの位置を返すメソッドです。
	 * @type {*}
	 */
	$scope.getPoint = function(unitId){
		var point = map.getPoint(unitId);
		return point.toString();
	};

	var attackCharacterId;

	$scope.setAttacker = function(characterId){
		attackCharacterId = characterId;
		$scope.isAttackMode = true;
	};

	$scope.attack = function(blockCharacterId){
		var blocker = $scope.enemys[blockCharacterId];
		var inventory = new Inventory(attackCharacterId);

		//TODO アタッカーとブロッカーの相対距離を求める
		//TODO 装備がない場合、「いしをなげる」「なぐる」を入れる

		$scope.isAttackMode = false;
	}

	/**
	 * ユニットの移動を行う為のメソッドです。
	 * @type {*}
	 */
	$scope.moveTo = function(move){
		map.moveUnit($scope.actionQueue.toTurn().id, move);

		//↓行動「にげる」の判定です。
		var outOfEnemy = map.getOutOfRangeUnits(Object.keys($scope.characters));
		//不要なIDが存在した場合、無視する
		outOfEnemy = outOfEnemy.filter(function(enemyId){
			return enemyId in $scope.enemys;
		});
		//ログに記録
		outOfEnemy.forEach(function(enemyId){
			$scope.log.push($scope.enemys[enemyId].name + 'から逃げ切った！');
		});
		//削除
		outOfEnemy.forEach(function(enemyId){
			delete $scope.enemys[enemyId];
		});
		//↑行動「にげる」の判定です。

		myTurnUnitActionCount++;

		if(myTurnUnitActionCount == 2){
			myTurnUnitActionCount = 0;
			$scope.nextTurn();
		}
	};

	function roopUnits(units, functions){
		Object.keys(units).forEach(function(unitsKey){
			functions.forEach(function(f){
				f(units[unitsKey]);
			});
		});
	}

	/**
	 * 取得したデータのキー「status」をオブジェクトに置換します。
	 * @param unitsKey
	 */
	function statusToStatusObject(unit){
		unit.status = STATUS[unit.status];
	}

	/**
	 * ユニットを行動キューに登録します。
	 */
	function addActionQueue(unit){
		$scope.actionQueue.add(unit);
	}

	function addCountAction(unit){
		if(unit.countAction === void 0){
			unit.countAction = 0;
		}
	}

	function initMap(unit){
		var point = map.getPoint(unit.id);

		if(point === Map.NullPoint){
			map.add(5, 5, unit.id);
		}
	}
});

/**
 * ユニットに行動を命じる為のUI描写周りを担当するコントローラです。
 * このコントローラはUI操作以上の事をなるべく行わないようにしてください。
 */
DAD.controller('actionsManipulator', function($scope){
	$scope.selectAction = '';

	/**
	 * 行動の詳細へ移動します。
	 * @param actionName
	 */
	$scope.nextAction = function(actionName){
		$scope.selectAction = actionName;
	}

	$scope.clearSelectAction = function(){
		$scope.selectAction = '';
	}
});