"use strict";

const {By, Key} = require("selenium-webdriver");
module.exports = class HomePage {
    #driver;

    constructor(webdriver) {
        this.#driver = webdriver;
    }

    goToPage() {
        this.#driver.get('http://test.qa.rs/');
    }

    getPageTitle() {
        return this.#driver.findElement(By.tagName('h1')).getText();
    }

    isOrderNowDispalyed() {
        return this.#driver.findElement(By.xpath(
            '//div[@class = "row" and contains(., "ORDER NOW")]'
        )).isDisplayed();
    }

    getRegisterLinkClick() {
        this.#driver.findElement(By.linkText('Register')).click();
    }

    successfullRegistrationMessage() {
        return this.#driver.findElement(By.className('alert alert-success')).getText();
    }

    welcomeBackMessage() {
        return this.#driver.findElement(By.tagName('h2')).getText();
    }

    getPackageDiv(title) {
        const xpathPackage = `//h3[contains(text(), "${title}")]//ancestor::div[contains(@class, "panel")]`;
        return this.#driver.findElement(By.xpath(xpathPackage));
    }

    getSideDishDropdown(packageDiv) {
        return packageDiv.findElement(By.name('side'));
    }

    getDishOptions(dishDropdown) {
        return dishDropdown.findElements(By.tagName('option'));
    }

    getOrderButton(packageDiv) {
        return packageDiv.findElement(By.className('btn btn-success'));
    }

    getQuanitiyInput(packageDiv) {
        return packageDiv.findElement(By.name('quantity'));
    }

    async insertQuantityInput() {
        const quantityInput = await this.#driver.findElement(By.xpath('(//input[contains(@name, "quantity")])[2]'));
        await quantityInput.click();
        await quantityInput.sendKeys(Key.UP,);
    }
    async insertQuantityInputB() {
        const quantityInput = await this.#driver.findElement(By.xpath('(//input[contains(@name, "quantity")])[4]'));
        await quantityInput.click();
        await quantityInput.sendKeys(Key.UP,Key.UP,Key.UP);
    }

    async clickOnShoppingCartLink() {
        const linkShoppingCart = await this.#driver.findElement(By.partialLinkText('shopping cart'));
        await linkShoppingCart.click();
    }

    checkCutleryBox() {
        this.#driver.findElement(By.xpath('(//input[@name = "cutlery"])[4]')).click();
    }
}
