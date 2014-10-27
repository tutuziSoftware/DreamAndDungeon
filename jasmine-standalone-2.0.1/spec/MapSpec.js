describe('Map', function() {
	var map;

	beforeEach(function(){
		delete localStorage['maps'];

		map = new Map;
		map.add(3, 4, 'test');
	});

	describe('getPointの戻り値をstringからobjectに変更する', function(){
		it('getPoint', function(){
			var point = map.getPoint('test');

			expect(typeof point).toBe('object');
			expect(point.x).toBe(3);
			expect(point.y).toBe(4);
			expect(point.toString()).toBe('3,4');
		});

		it('add', function(){
			map.add(5, 6, 'test2');
			var test2 = map.getPoint('test2');

			expect(test2.x).toBe(5);
			expect(test2.y).toBe(6);
		});

		it('moveUnit', function(){
			map.moveUnit('test', Map.TOP);
			var test = map.getPoint('test');

			expect(test.x).toBe(3);
			expect(test.y).toBe(3);
		});
	});

	describe('バグ：getPointにMapに存在しない値を渡した場合', function(){
		it('nullオブジェクトを返す', function(){
			var point = map.getPoint('not_exist');
			expect(point.x).toBeNaN();
			expect(point.y).toBeNaN();
			expect(point.toString()).toBe('ここはどこ、わたしはだれ');
		});
	});

	describe('getOutOfRangeUnitsの実装', function(){
		//getOutOfRangeUnitsは他のユニットから6マス以上離れているユニットを返します。
		//そのユニットが敵か味方の判断はMapの範疇では「ありません」

		it('最初から6マス離れている場合', function(){
			map.add(3, 10, 'outofunit');
			var units = map.getOutOfRangeUnits(['test']);

			expect(units.length).toBe(1);
			expect(units[0]).toBe('outofunit');

			var testOnly = map.getOutOfRangeUnits(['outofunit']);

			expect(testOnly.length).toBe(1);
			expect(testOnly[0]).toBe('test');
		});

		it('バグ：5マス内でもレンジ外扱いになる', function(){
			map.add(3, 5, 'test2');
			var units = map.getOutOfRangeUnits(['test']);

			expect(units.length).toBe(0);
		});
	});

	describe('バグ：位置が存在しないユニットがgetOutOfRangeUnitsで問い合わせを行った場合', function(){
		var map;

		beforeEach(function(){
			delete localStorage['maps'];

			map = new Map;
		});

		it('空の配列を返す', function(){
			var ids = map.getOutOfRangeUnits(['test']);

			expect(ids.length).toBe(0);
		});
	});

	describe('バグ：add時に同じ位置に違うユニットが登録出来てしまう不具合', function(){
		it('検証', function(){
			map.add(3, 4, 'test2');

			var testPoint = map.getPoint('test');
			var test2Point = map.getPoint('test2');

			expect(testPoint.x).not.toBe(test2Point.x);
		});
	});

	describe('バグ：add時にlocalStorageに値が保存されない', function(){
		it('原因：add内部でaddを再帰呼び出しした時、unitIdが渡されていなかった', function(){
			map.add(3, 4, 'test2');

			var newMap = new Map;

			expect(newMap.getPoint('test')).not.toBeNull();
			expect(newMap.getPoint('test2')).not.toBeNull();

			expect('3,4' in JSON.parse(localStorage['maps'])).toBe(true);
			expect('4,4' in JSON.parse(localStorage['maps'])).toBe(true);
		});
	});

	describe('ユニット間の相対距離を求める', function(){
		it('ユニット間の相対距離を求める', function(){
			map.add(4, 5, 'test2');

			var distance = map.getRelativePosition('test', 'test2');
			expect(distance).toBe(2);
		});

		it('もう少しテスト', function(){
			map.add(4, 6, 'test3');

			var distance = map.getRelativePosition('test', 'test3');
			expect(distance).toBe(3);
		});

		it('座標がマイナスでも動く事を証明する', function(){
			map.add(-1, 4, 'test4');

			var distance = map.getRelativePosition('test', 'test4');
			expect(distance).toBe(4);
		});
	});

	it('バグ：移動時に相対距離がおかしくなる不具合', function(){
		//3, 4
		map.add(3, 5, 'test2');

		var distance = map.getRelativePosition('test', 'test2');
		expect(distance).toBe(1);
	});

	describe('街の位置の実装', function(){
		var map;

		beforeEach(function(){
			delete localStorage['maps'];
			map = new Map();
		});

		/**
		 * memo:
		 * 		街はユニット扱いです。
		 * 		街かどうかは街Queueで判断します。すなわち、Map.jsでは判断せず、位置のみを把握しているという事です。
		 * 		モンスター→街への変化もあり得る、という事です。
		 */
		it('街と同じ座標にユニットが入った場合、イベントを発火させる', function(done){
			map.add(2, 5, 'bootlo');
			map.add(2, 6, 'rika');

			map.addEventListener('bootlo', {
				name:'overlap',
				args:{
					range:0
				},
				listener:function(){
					expect(true).toBeTruthy();
					done();
				}
			});
			map.moveUnit('rika', Map.TOP);
		});
	});

	describe('実装：とあるユニットからX距離内に侵入したらイベントを発生させる', function(){
		beforeEach(function(){
			//3,4にid:testがいる

			map.add(24, 4, 'town');
		});

		it('圏内に入った時、イベントを発火させる', function(done){
			map.addEventListener('town', {
				name:'overlap',
				args:{
					range:20
				},
				listener:function(){
					expect(true).toBeTruthy();
					done();
				}
			});

			map.moveUnit('test', Map.RIGHT);

			expect(map.getPoint('test').x).toBe(4);
		});
	});

	describe('実装：unitInイベント', function(){
		beforeEach(function(){
			//3,4にid:testがいる

			map.add(24, 4, 'town');
		});

		it('圏内に入った時、イベントを発火させる', function(done){
			map.addEventListener('town', {
				name:'unitIn',
				args:{
					range:20
				},
				listener:function(){
					expect(true).toBeTruthy();
					done();
				}
			});

			//圏内に入ったのでイベントが発火する
			map.moveUnit('test', Map.RIGHT);
			expect(map.getPoint('test').x).toBe(4);

			//圏内だが、入った後なのでイベントは発火しない
			map.moveUnit('test', Map.RIGHT);
			expect(map.getPoint('test').x).toBe(5);
		});
	});
});
