describe('Unit', function(){
	describe('getter各種', function(){
		var unit;

		beforeEach(function(){
			localStorage['characters'] = JSON.stringify({
				'rika':{
					id:'rika',
						hp:10,
					san:89,
					status:'NONE'
				}
			});

			unit = new Unit('rika');
		});

		it('idのgetter',function(){
			expect(unit.id).toBe('rika');
		});
		it('hpのgetter');
		it('sanのgetter');
		it('statusのgetter');
	});
});