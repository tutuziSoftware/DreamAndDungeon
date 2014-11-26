var DAD = angular.module('DAD',[]);

DAD.controller('charactersController', function($scope){
	var inout = new InOut();
	var map = new Map;

	//必要なデータ構造
	$scope.actionQueue = new ActionQueue();

	//ユニット登録
	//データは{id:{ユニットの情報}}という感じで保存されている。
	['characters', 'enemys'].forEach(entryUnits.bind(this, [
		addActionQueue,
		addCountAction,
		initMap
	]));

	entryUnits([
		initMap,
		lookTown
	], 'towns');



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
		}else if($scope.towns[$scope.turnUnit.id]){
			$scope.log.push($scope.turnUnit.name + "の街が見える");
			$scope.nextTurn();
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

	/**
	 * 敵を攻撃する為のメソッドです。
	 * このメソッドは敵側からは使えません。
	 * @param blockCharacterId
	 */
	$scope.attack = function(blockCharacterId){
		var blocker = $scope.enemys[blockCharacterId];
		var inventory = new Inventory(attackCharacterId);

		var relative = map.getRelativePosition(attackCharacterId, blockCharacterId);
		var arms = inventory.getArmRanges(relative);

		var selectArm = Math.floor(Math.random() * arms.length);
		var arm = arms[selectArm];
		blocker.hp -= arm.attack.power;

		$scope.log.push($scope.characters[attackCharacterId].name + 'の ' + arm.name +' こうげき!');
		$scope.log.push($scope.enemys[blockCharacterId].name + 'に' + arm.attack.power + 'のダメージ!');

		_deleteCreature(blockCharacterId);

		$scope.isAttackMode = false;
		$scope.nextTurn();

		/**
		 * HPが0になったクリーチャーを破壊します。
		 * @param blockCharacterId クリーチャーID
		 * @private
		 */
		function _deleteCreature(blockCharacterId){
			var blocker = $scope.enemys[blockCharacterId];

			if(blocker.hp <= 0){
				delete $scope.enemys[blockCharacterId];
				$scope.log.push(blocker.name + 'を たおした!');
			}
		}
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

	/**
	 * ユニットの初期化処理を行う関数です。
	 * @param boots 永続化ストレージから取得したデータを処理する関数群です
	 * @param unitsKey 永続化ストレージから取得するデータ名です。　(例)'characters' 'enemys'
	 */
	function entryUnits(boots, unitsKey){
		inout.get(function(units){
			if(units == InOut.KEY_NOT_EXIST){
				console.log(unitsKey + 'は存在しないデータです');
				return;
			}

			$scope[unitsKey] = roopUnits(units, boots);
		}, unitsKey);

		function roopUnits(units, functions){
			var unitIds = Object.keys(units);
			var _units = {};

			unitIds.forEach(function(unitKey){
				_units[unitKey] = new Unit(unitKey);
			});

			unitIds.forEach(function(unitsKey){
				functions.forEach(function(f){
					f(_units[unitsKey]);
				});
			});

			return _units;
		}
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

	/**
	 * 街の視認範囲に入った時の処理を追加します。
	 * @param town
	 */
	function lookTown(town){
		map.addEventListener(town.id, {
			name:'overlap',
			args:{
				range:20
			},
			listener:function(){
				$scope.actionQueue.add(town);
			}
		});

		map.addEventListener(town.id, {
			name:'unitIn',
			args:{
				range:0
			},
			listener:function(){
				console.log('test');
				location.href = './town.html';
			}
		});
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