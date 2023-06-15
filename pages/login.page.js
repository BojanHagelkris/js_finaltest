"use strict";
const {By} = require('selenium-webdriver');
module.exports = class LoginPage {
    #driver;

    constructor(webdriver) {
        this.#driver = webdriver;
    }

    getPageUrl() {
       this.#driver.get('http://test.qa.rs/login');
    }
    isLoginHeaderDispalyed() {
        return this.#driver.findElement(By.tagName('h2')).isDisplayed();
    }

    fillUsernameLoginInput(username) {
        this.#driver.findElement(By.name('username')).sendKeys(username);
    }
    fillPasswordLoginInput(password) {
        this.#driver.findElement(By.name('password')).sendKeys(password);
    }
   async clickOnLoginButton() {
        await this.#driver.findElement(By.name('login')).click();
    }
}