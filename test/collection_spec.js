describe('collection', function () {
    var collection;

    beforeEach(function () {
        browser.get('/sample/collection/collection.html');
        collection = element.all(by.repeater("item in items.values"));
    });

    it('should be enabled button when all checked and enter text', function () {
        collection.then(function (rows) {
            expect(rows.length).toEqual(0);
        });

        browser.wait(function () {
            return collection.then(function (rows) {
                return rows.length == 4;
            });
        }, 7000);

        browser.wait(function () {
            return collection.then(function (rows) {
                return rows.length == 1;
            });
        }, 3000);
    });
});