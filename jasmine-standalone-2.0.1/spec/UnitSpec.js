describe('Unit', function(){
	describe('getter各種', function(){
		var unit;

		beforeEach(function(){
			localStorage['characters'] = JSON.stringify({
				'rika':{
					id:'rika',
					name:'リカ',
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
		it('nameのgetter',function(){
			expect(unit.name).toBe('リカ');
		});
		it('hpのgetter',function(){
			expect(unit.hp).toBe(10);
		});
		it('sanのgetter',function(){
			expect(unit.san).toBe(89);
		});
		it('statusのgetter',function(){
			expect(unit.status).toBe(Unit.STATUS.NONE);
		});
	});
});