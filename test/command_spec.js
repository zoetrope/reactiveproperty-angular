describe('command', function () {
    var checkbox1;
    var checkbox2;
    var checkbox3;
    var checkbox4;
    var currentText;
    var button;

    beforeEach(function () {
        browser.get('/sample/command/command.html');
        checkbox1 = element(by.model("isChecked1.value"));
        checkbox2 = element(by.model("isChecked2.value"));
        checkbox3 = element(by.model("isChecked3.value"));
        checkbox4 = element(by.model("isChecked4.value"));
        currentText = element(by.model("currentText.value"));
        button = element(by.tagName("button"));
    });

    it('should be enabled button when all checked and enter text', function () {
        expect(button.getAttribute("disabled")).toEqual("true");
        checkbox1.click();
        checkbox2.click();
        checkbox3.click();
        checkbox4.click();
        currentText.sendKeys('test');
        expect(button.getAttribute("disabled")).toEqual(null);
    });
});