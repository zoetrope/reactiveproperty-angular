describe('basics', function () {
    var input;
    var display;
    var button;

    beforeEach(function () {
        browser.get('/sample/basics/basics.html');
        input = element(by.model("inputText.value"));
        display = element(by.binding("displayText.value"));
        button = element(by.tagName("button"));
    });

    it('should be reflect value by delay of 1 second', function () {
        input.sendKeys('test');
        browser.wait(function () {
            return display.getText().then(function (text) {
                return text == "TEST";
            });
        }, 3000);
    });

    it('should be replace value', function () {
        expect(button.getAttribute("disabled")).toEqual("true");
        input.sendKeys('test');
        expect(button.getAttribute("disabled")).toEqual(null);

        button.click();
        expect(input.getAttribute('value')).toEqual("Hello, ReactiveProperty for AngularJS!")
        browser.wait(function () {
            return display.getText().then(function (text) {
                return text == "HELLO, REACTIVEPROPERTY FOR ANGULARJS!";
            });
        }, 3000);
    });
});