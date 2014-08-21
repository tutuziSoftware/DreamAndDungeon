describe('Map', function() {
	describe('getPointの戻り値をstringからobjectに変更する', function(){
		var map;

		beforeEach(function(){
			delete localStorage['maps'];

			map = new Map;
			map.add(3, 4, 'test');
		});

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
});
