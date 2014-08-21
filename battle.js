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

	//ユニット登録
	['characters', 'enemys'].forEach(function(unitsKey){
		inout.get(function(units){
			roopUnits(units, [
				statusToStatusObject,
				addActionQueue,
				addCountAction]
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
	}

	var map = new Map;
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
	$scope.getPoint = map.getPoint.bind(map);

	/**
	 * ユニットの移動を行う為のメソッドです。
	 * @type {*}
	 */
	$scope.moveTo = function(move){
		map.moveUnit($scope.actionQueue.toTurn().id, move);

		//TODO ここににげる判定を入れる

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
});

/**
 * ユニットに行動を命じる為のUI描写周りを担当するコントローラです。
 * このコントローラはUI操作以上の事をなるべく行わないようにしてください。
 */
DAD.controller('actionsManipulator', function($scope){
	$scope.selectAction = '';
	$scope.actions = [
		{
			name:'slap',
			japanese:'なぐる'
		},
		{
			name:'attack',
			japanese:'こうげき'
		},
		{
			name:'block',
			japanese:'ぼうぎょ'
		},
		{
			name:'move',
			japanese:'いどう'
		},
		{
			name:'turnEnd',
			japanese:'こうどうしゅうりょう'
		}
	];

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