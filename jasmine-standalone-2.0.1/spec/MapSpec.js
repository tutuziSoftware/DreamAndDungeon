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

	describe('getOutOfRangeUnitsを実装する', function(){
		//getOutOfRangeUnitsは他のユニットから6マス以上離れているユニットを返します。
		//そのユニットが敵か味方の判断はMapの範疇では「ありません」

		it('最初から6マス離れている場合', function(){
			map.add(3, 10, 'outofunit');
			var units = map.getOutOfRangeUnits(['test']);

			expect(units.length).toBe(1);
			expect(units[0]).toBe('outofunit');
		});
	});
});
