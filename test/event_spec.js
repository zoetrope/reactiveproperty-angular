describe('event', function () {
    var currentPoint;
    var preArea;

    beforeEach(function () {
        browser.get('/sample/event/event.html');
        currentPoint = element(by.binding("currentPoint.value"));
        preArea = element(by.tagName("pre")).find();
    });

    it('should be display mouse position', function () {
        preArea.getLocation().then(function(loc){
            var targetPos = {x: 100-loc.x, y: 50-loc.y};
            browser.actions().mouseMove(preArea, targetPos).perform().then(function(){
                expect(currentPoint.getText()).toEqual("Position: {\n  \"x\": 100,\n  \"y\": 50\n}");
            });
        });
    });
});