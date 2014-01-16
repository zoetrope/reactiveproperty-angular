describe('messaging', function () {
    var input;
    var parentReceived;
    var ownReceived;
    var childReceived;
    var emitButton;
    var broadcastButton;

    beforeEach(function () {
        browser.get('/sample/messaging/messaging.html');
        input = element(by.model("inputText.value"));
        parentReceived = element(by.binding("parentReceived.value"));
        ownReceived = element(by.binding("ownReceived.value"));
        childReceived = element(by.binding("childReceived.value"));
        emitButton = element(by.id("emitButton"));
        broadcastButton = element(by.id("broadcastButton"));
    });

    it('should send a message to parent and own', function () {
        input.sendKeys('test');

        emitButton.click();
        expect(parentReceived.getText()).toEqual("Parent = test");
        expect(ownReceived.getText()).toEqual("Own = test");
        expect(childReceived.getText()).toEqual("Child =");
    });

    it('should send a message to child and own', function () {
        input.sendKeys('sample');

        broadcastButton.click();
        expect(parentReceived.getText()).toEqual("Parent =");
        expect(ownReceived.getText()).toEqual("Own = sample");
        expect(childReceived.getText()).toEqual("Child = sample");
    });
});