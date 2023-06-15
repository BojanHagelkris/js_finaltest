"use strict";
const { By } = require('selenium-webdriver');
module.exports = class CartPage {
    #driver;
    constructor(webdriver) {
        this.#driver = webdriver;
    }

    getCurrentUrl() {
        return this.#driver.getCurrentUrl();
    }

    getPageHeaderTitle() {
        return this.#driver.findElement(By.tagName('h1')).getText();
    }
    getOrderRow(packageName) {
        const xpathOrderRow = `//td[contains(., "${packageName}")]/parent::tr`;
        return this.#driver.findElement(By.xpath(xpathOrderRow));
    }
    getOrderQuantity(orderRow) {
        return orderRow.findElement(By.xpath('td[2]'));
    }

}