"use strict";
const { By } = require('selenium-webdriver');
module.exports = class CheckoutPage {
    #driver;
    constructor(webdriver) {
        this.#driver = webdriver
    }
    getCheckoutPageTitle() {
        return this.#driver.findElement(By.tagName('h2')).getText();
    }
    getCheckoutPageSubtitle() {
        return  this.#driver.findElement(By.tagName('h3')).getText();
    }
}