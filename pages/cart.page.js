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
    getItemPrice(orderRow) {
        return orderRow.findElement(By.xpath('td[3]'));
    }
    getTotaliPrice(orderRow) {
        return orderRow.findElement(By.xpath('td[4]'));
    }

    getOrderRowB(packageName) {
        const xpathOrderRow = `//td[contains(., "${packageName}")]/parent::tr`;
        return this.#driver.findElement(By.xpath(xpathOrderRow));
    }
    getOrderQuantityB(orderRow) {
        return orderRow.findElement(By.xpath('td[2]'));
    }

    emptyCartAction() {
        this.#driver.get('http://test.qa.rs/cart/clear/358');
    }

    clickOnContinueShoppingBtn() {
        return this.#driver.findElement(By.className('btn btn-default')).click();
    }

    random(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    totalPrice() {
        return this.#driver.findElement(By.xpath('//tr[contains(., "Total:")]//td'));
    }
    getCheckoutBtn() {
        return this.#driver.findElement(By.name('checkout'));
    }

    async clickOnCheckoutBtn() {
        await (await this.getCheckoutBtn()).click();
    }

}