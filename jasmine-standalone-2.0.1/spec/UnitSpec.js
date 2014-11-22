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

		it('Unit.STATUS.NONE.toString()',function(){
			expect(Unit.STATUS.NONE.toString()).toBe('ふつう');
		});

		it('hpの減少', function(){
			unit.hp -= 1;
			expect(unit.hp).toBe(9);
			expect(JSON.parse(localStorage['characters']).rika.hp).toBe(9);
		});
	});

	describe('敵の生成', function(){
		var unit;

		beforeEach(function(){
			localStorage['enemys'] = JSON.stringify({
				'anaguma1':{
					id:'anaguma1',
					name:'アナグマ',
					hp:10,
					san:89,
					status:'NONE'
				},
				'anaguma2':{
					id:'anaguma2',
					name:'アナグマ',
					hp:10,
					san:89,
					status:'NONE'
				}
			});

			unit = new Unit('anaguma1');
		});

		it('idのgetter',function(){
			expect(unit.id).toBe('anaguma1');
		});
		it('nameのgetter',function(){
			expect(unit.name).toBe('アナグマ');
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

	describe('HPが0になったらlocalStorageから破棄する', function(){
		var unit;

		beforeEach(function(){
			localStorage['enemys'] = JSON.stringify({
				'anaguma1':{
					id:'anaguma1',
					name:'アナグマ',
					hp:10,
					san:89,
					status:'NONE'
				},
				'anaguma2':{
					id:'anaguma2',
					name:'アナグマ',
					hp:10,
					san:89,
					status:'NONE'
				}
			});

			unit = new Unit('anaguma1');
		});

		it('hpを0にする', function(){
			unit.hp = 0;

			var units = JSON.parse(localStorage['enemys']);

			expect('anaguma1' in units).toBe(false);
		});
	});

	describe('街', function(){
		beforeEach(function(){
			localStorage['towns'] = JSON.stringify({
				'bootlo':{
					id:'bootlo',
					name:'ブートロ',
					hp:999,
					status:'TOWN'
				}
			});
		});

		it('ブートロ', function(){
			var unit = new Unit('bootlo');

			expect(unit.name).toBe('ブートロ');
		});
	});
});