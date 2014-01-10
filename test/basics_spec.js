describe('hoge', function () {
    beforeEach(function () {
        browser.get('/sample/basics/basics.html');
    });

    it('fuga', function () {

        element(by.model("inputText.value")).sendKeys('test');

        browser.wait(function () {
            var display = element(by.binding("displayText.value"));
            return display.getText().then(function (text) {
                return text == "TEST";
            });
        }, 3000);
    });
});