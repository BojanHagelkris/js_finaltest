"use strict";
const {By} = require('selenium-webdriver');
module.exports = class RegisterPage {
    #driver;

    constructor(webdriver) {
        this.#driver = webdriver;
    }
    getRegisterButton() {
        return this.#driver.findElement(By.name('register'));
    }
    getCurrentUrl() {
        return this.#driver.getCurrentUrl();
    }

    fillFirstnameInput(name) {
         this.#driver.findElement(By.name('firstname')).sendKeys(name);
    }
    fillLastnameInput(lastName) {
         this.#driver.findElement(By.name('lastname')).sendKeys(lastName);
    }
    fillEmailInput(email) {
         this.#driver.findElement(By.name('email')).sendKeys(email);
    }
    fillUsername(username) {
         this.#driver.findElement(By.name('username')).sendKeys(username);
    }
    fillPassword(password) {
         this.#driver.findElement(By.name('password')).sendKeys(password);
    }
    fillPasswordConfirm(password) {
         this.#driver.findElement(By.name('passwordAgain')).sendKeys(password);
    }

}