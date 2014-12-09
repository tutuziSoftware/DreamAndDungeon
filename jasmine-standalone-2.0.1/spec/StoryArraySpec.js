describe('ストーリーのフラグ的なものを管理する', function(){
    var storys;

    beforeEach(function(){
        delete localStorage['storys'];
        storys = new StoryArray;
    });

    it('現在遂行中のストーリーを取得する', function(){
        expect(storys.branches.length).toBe(0);
    });
    it('新しいストーリーを開始する', function(){
        storys.start('id');

        expect(storys.branches.length).toBe(1);
        expect(storys.getBranch('id')).not.toBeUndefined();
    });
    it('新しいストーリーを開始し、シーンごとにフラグを進めていきます', function(){
        //開始
        storys.start('id2-1-s');
        expect(storys.branches.length).toBe(1);

        //prevがあるので新しいストーリーとして追加出来ない
        storys.start('id2-2');
        expect(storys.branches.length).toBe(1);

        storys.next('id2-1-s');
        expect(storys.branches.length).toBe(1);
        //TODO 次のストーリーのIDを返す

        storys.next('id2-1-e');
        expect(storys.branches.length).toBe(1);
        //TODO 次のストーリーのIDを返す

        //最後のストーリーを進めたので、ストーリー消化となる
        storys.next('id2-2');
        expect(storys.branches.length).toBe(0);
    });
    it('特定のストーリーが完了したら発生するストーリーを立てる');
    it('特定のストーリーが完了したらストーリーを開始出来ないようにする');
});