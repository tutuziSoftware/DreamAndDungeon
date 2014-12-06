describe('ストーリーのフラグ的なものを管理する', function(){
    var storys;

    beforeEach(function(){
        delete localStorage['storys'];
        storys = new StoryArray;
    });

    it('現在遂行中のストーリーを取得する', function(){
        expect(storys.branches.length).toBe(0);
    });
    it('新しいストーリー(分岐なし)を実装する', function(){
        storys.start('id');

        expect(storys.branches.length).toBe(1);
        expect(storys.getBranch('id')).not.toBeUndefined();
    });
    it('新しいストーリー(分岐あり)を実装する');
    it('特定のストーリーが完了したら発生するストーリーを立てる');
    it('特定のストーリーが完了したらストーリーを開始出来ないようにする');
});