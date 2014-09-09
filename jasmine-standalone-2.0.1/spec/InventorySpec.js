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

			expect(shield.length).toBe(1);
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
});