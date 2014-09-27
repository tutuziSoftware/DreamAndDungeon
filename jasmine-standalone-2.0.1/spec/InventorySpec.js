describe('Inventory', function(){
	var inventory;

	beforeEach(function(){
		inventory = new Inventory('id');
		inventory.clear();
	});

	it('インベントリの末尾への格納', function(){
		inventory.push({
			name:'やくそう',
			type:Inventory.ITEM_TYPES.DISPOSABLE
		});

		var items = inventory.get();
		expect(items.length).toBe(1);
		expect(items[0].name).toBe('やくそう');
		expect(items[0].type).toBe(Inventory.ITEM_TYPES.DISPOSABLE);
	});

	describe('インベントリを増やしたテスト', function(){
		beforeEach(function(){
			inventory.push({
				name:'盾',
				type:Inventory.ITEM_TYPES.ARMS
			});
		});

		it('一番上にある装備を返す', function(){
			var shield = inventory.getArms(Inventory.HAND);

			//装備は「なぐる」「いしをなげる」が存在するため、常に2を返す
			expect(shield.length).toBe(2);
			expect(shield[0].name).toBe('盾');
			expect(shield[0].type).toBe(Inventory.ITEM_TYPES.ARMS);
		});

		it('手装備は二つまで', function(){
			inventory.push({
				name:'剣',
				type:Inventory.ITEM_TYPES.ARMS
			});
			inventory.push({
				name:'すごい剣',
				type:Inventory.ITEM_TYPES.ARMS
			});

			var shields = inventory.getArms(Inventory.HAND);

			expect(shields.length).toBe(2);
			expect(shields[0].name).toBe('盾');
			expect(shields[0].type).toBe(Inventory.ITEM_TYPES.ARMS);
			expect(shields[1].name).toBe('剣');
			expect(shields[1].type).toBe(Inventory.ITEM_TYPES.ARMS);
		});

		it('インベントリの順番を変更出来るようにする', function(){
			inventory.push({
				name:'剣',
				type:Inventory.ITEM_TYPES.ARMS
			});
			inventory.push({
				name:'すごい剣',
				type:Inventory.ITEM_TYPES.ARMS
			});
			inventory.push({
				name:'やくそう',
				type:Inventory.ITEM_TYPES.DISPOSABLE
			});

			inventory.move(0, 3);

			var items = inventory.get();

			expect(items.length).toBe(4);
			expect(items[0].name).toBe('やくそう');
			expect(items[0].type).toBe(Inventory.ITEM_TYPES.DISPOSABLE);
			expect(items[1].name).toBe('剣');
			expect(items[1].type).toBe(Inventory.ITEM_TYPES.ARMS);
			expect(items[2].name).toBe('すごい剣');
			expect(items[2].type).toBe(Inventory.ITEM_TYPES.ARMS);
			expect(items[3].name).toBe('盾');
			expect(items[3].type).toBe(Inventory.ITEM_TYPES.ARMS);

			var arms = inventory.getArms(Inventory.HAND);
			expect(arms[0].name).toBe('剣');
			expect(arms[0].type).toBe(Inventory.ITEM_TYPES.ARMS);
			expect(arms[1].name).toBe('すごい剣');
			expect(arms[1].type).toBe(Inventory.ITEM_TYPES.ARMS);
		});
	});

	describe('複数キャラクターIDでのテスト', function(){
		var id;
		var id2;

		beforeEach(function(){
			id = new Inventory('id');
			id2 = new Inventory('id2');

			id.clear();
			id2.clear();
		});

		it('複数IDの同時運用', function(){
			id.push({
				name:'やくそう',
				type:Inventory.ITEM_TYPES.DISPOSABLE
			});

			expect(id.get().length).toBe(1);
			expect(id2.get().length).toBe(0);

			id2.push({
				name:'白銀の盾',
				type:Inventory.ITEM_TYPES.ARMS
			});

			expect(id.get().length).toBe(1);
			expect(id2.get().length).toBe(1);
		});
	});

	describe('実装：「なぐる」「いしをなげる」をデフォルト武器として持たせる', function(){
		var inventory;

		beforeEach(function(){
			inventory = new Inventory('id');
			inventory.clear();
		});

		it('武器0個の場合', function(){
			expect(inventory.get().length).toBe(0);
			expect(inventory.getArms().length).toBe(2);
			expect(inventory.getArms()[0].name).toBe('なぐる');
			expect(inventory.getArms()[1].name).toBe('いしをなげる');
		});

		it('武器1個の場合、いしをなげるが残る。いしをなげるは5-1攻撃とする', function(){
			inventory.push({
				name:'盾',
				type:Inventory.ITEM_TYPES.ARMS
			});

			expect(inventory.get().length).toBe(1);
			expect(inventory.getArms().length).toBe(2);
			expect(inventory.getArms()[0].name).toBe('盾');
			expect(inventory.getArms()[1].name).toBe('いしをなげる');
		});

		it('「なぐる」の攻撃範囲、威力設定', function(){
			var slap = Inventory.DEFAULT_ARMS['なぐる'];

			//アナグマを9回殴れば倒せる程度の攻撃力
			expect(slap.attack.power).toBe(3);
			expect(slap.attack.type).toBe(Attack.TYPE.SLAP);
			expect(slap.attack.range.min).toBe(1);
			expect(slap.attack.range.max).toBe(1);
			expect(slap.block.toughness).toBe(0);
			expect(slap.block.type).toBe(Block.TYPE.NONE);
			expect(slap.caption).toBe('探索者の基本攻撃。どんなに非力な探索者でもこれだけは使える');
		});

		it('「いしをなげる」の攻撃範囲、威力設定', function(){
			var throwAStone = Inventory.DEFAULT_ARMS['いしをなげる'];

			//アナグマを25回殴れば倒せる程度の攻撃力
			expect(throwAStone.attack.power).toBe(1);
			expect(throwAStone.attack.type).toBe(Attack.TYPE.THROW);
			expect(throwAStone.attack.range.min).toBe(1);
			expect(throwAStone.attack.range.max).toBe(5);
			expect(throwAStone.block.toughness).toBe(0);
			expect(throwAStone.block.type).toBe(Block.TYPE.NONE);
			expect(throwAStone.caption).toBe('探索者の基本攻撃。どんなに非力な探索者でもこれだけは使える');
		});
	});

	describe('攻撃範囲ごとに武器を返すメソッドを作る', function(){
		describe('実装', function(){
			var inventory;

			beforeEach(function(){
				inventory = new Inventory('id');
				inventory.clear();

				inventory.push({
					name:'剣',
					type:Inventory.ITEM_TYPES.ARMS,
					attack:new Attack({
						power:3,
						type:Attack.TYPE.SLAP,
						range:new Attack.Range(1, 2)
					})
				});
				inventory.push({
					name:'弓',
					type:Inventory.ITEM_TYPES.ARMS,
					attack:new Attack({
						power:4,
						type:Attack.TYPE.SLAP,
						range:new Attack.Range(2, 4)
					})
				});
			});

			it('攻撃範囲1', function(){
				var one = inventory.getArmRanges(1);

				expect(one.length).toBe(3);
				expect(one[0].name).toBe('剣');
				expect(one[1].name).toBe('なぐる');
				expect(one[2].name).toBe('いしをなげる');
			});

			it('攻撃範囲2', function(){
				var arms = inventory.getArmRanges(2);

				expect(arms.length).toBe(3);
				expect(arms[0].name).toBe('剣');
				expect(arms[1].name).toBe('弓');
				expect(arms[2].name).toBe('いしをなげる');
			});

			it('攻撃範囲3', function(){
				var arms = inventory.getArmRanges(3);

				expect(arms.length).toBe(2);
				expect(arms[0].name).toBe('弓');
				expect(arms[1].name).toBe('いしをなげる');
			});

			it('攻撃範囲5', function(){
				var arms = inventory.getArmRanges(5);

				expect(arms.length).toBe(1);
				expect(arms[0].name).toBe('いしをなげる');
			});
		});

		describe('不具合', function(){
			describe('装備が0の時、「なぐる」「いしをなげる」が二つ返る', function(){
				var inventory;

				beforeEach(function(){
					inventory = new Inventory('id');
					inventory.clear();
				});

				it('「なぐる」「いしをなげる」のみが返るはず', function(){
					var arms = inventory.getArmRanges(1);

					expect(arms.length).toBe(2);
					expect(arms[0].name).toBe('なぐる');
					expect(arms[1].name).toBe('いしをなげる');
				});
			});

			describe('2距離以降で「なぐる」が返ってきてしまう', function(){
				var inventory;

				beforeEach(function(){
					inventory = new Inventory('id');
					inventory.clear();
				});

				it('「いしをなげる」のみが返るはず', function(){
					var arms = inventory.getArmRanges(2);

					expect(arms.length).toBe(1);
					expect(arms[0].name).toBe('いしをなげる');
				});
			});
		});
	});
});