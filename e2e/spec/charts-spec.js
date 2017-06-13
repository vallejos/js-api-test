describe('charts app', function() {

    browser.get('http://localhost:3000');

    it('charts dropdown should be populated', function() {
        var charts = element(by.model('selectedChart'));

        expect(charts.all(by.tagName('option')).count()).toBeGreaterThan(0);
    });

    it('select chart should load new data', function() {
        var charts = element(by.model('selectedChart'));

        charts.all(by.tagName('option')).then(function (options) {
            options[1].click();
        });

        expect(browser.getCurrentUrl()).toContain('/charts/2');
    });

    it('select date should load new data', function() {
        var dateSelector = element(by.model('chartDate'));

        dateSelector.sendKeys('2017-06-02');

        expect(browser.getCurrentUrl()).toContain('2017-06-02');
    });

    it('clear should clear date and load new data', function() {
        var clearDateButton = element(by.css('.clear-date'));

        clearDateButton.click();

        expect(browser.getCurrentUrl()).not.toContain('2017-06-02');
    });

});