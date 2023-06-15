"use strict";
require('chromedriver');
const webdriver = require('selenium-webdriver');
const {assert, expect} = require('chai');
const {By ,Key, until} = require('selenium-webdriver');

const HomePage = require('../pages/home.page');
const RegisterPage = require('../pages/register.page');
const LoginPage = require('../pages/login.page');
const CartPage = require('../pages/cart.page');

describe('shop.QaFastFood tests', function () {
    let driver;
    let pageHomePage;
    let pageRegisterPage;
    let pageLoginPage;
    let pageCartPage;

    const packToAdd = 'Double burger';
    const sideDishesName = 'Mozzarella sticks';
    const packageQuantity = '1';

    before(function () {
        driver = new webdriver.Builder().forBrowser('chrome').build();
        pageHomePage = new HomePage(driver);
        pageRegisterPage = new RegisterPage(driver);
        pageLoginPage = new LoginPage(driver);
        pageCartPage = new CartPage(driver);
    });

    after( async function () {
        // await driver.quit()
    });

    it('opens QaFastFood website', async function () {
        await pageHomePage.goToPage();
        const pageTitle = await pageHomePage.getPageTitle();

        expect(pageTitle).to.contain('QA FastFood');;
        assert.isTrue(await pageHomePage.isOrderNowDispalyed());
    });

    it('Goes to registration page', async function() {
        await pageHomePage.getRegisterLinkClick();

        expect(await driver.wait(until.elementLocated(By.name('registrationForm'))));
        expect(await pageRegisterPage.getCurrentUrl()).to.be.equal('http://test.qa.rs/register');
    });

    it('Preform an registration', async function () {
        await pageRegisterPage.fillFirstnameInput('Djordje3x1v1111121');
        await pageRegisterPage.fillLastnameInput('Djordjin1ox11v131121');
        await pageRegisterPage.fillEmailInput('djordje.djordev11icxv1131211@gmail.com')
        await pageRegisterPage.fillUsername('ludxx111113');
        await pageRegisterPage.fillPassword('password12');
        await pageRegisterPage.fillPasswordConfirm('password12');

        await pageRegisterPage.getRegisterButton().click();
        expect(await pageHomePage.successfullRegistrationMessage()).to.contain('Success!');
    });

    it('Login an registered user', async function() {
        await pageLoginPage.getPageUrl();
        expect(await pageLoginPage.isLoginHeaderDispalyed()).to.be.true;

        await pageLoginPage.fillUsernameLoginInput('ludxx111113');
        await pageLoginPage.fillPasswordLoginInput('password12');
        await pageLoginPage.clickOnLoginButton();

        expect(await pageHomePage.welcomeBackMessage()).to.contain('Welcome back');

    });

    it('Order Item(s) to cart', async function() {

        const packageDiv = await pageHomePage.getPackageDiv(packToAdd);
        const sideDishes = await pageHomePage.getSideDishDropdown(packageDiv);
        const options = await pageHomePage.getDishOptions(sideDishes);

        // const quantity = await pageHomePage.getQuanitiyInput();
        // quantity.click();
        // quantity.sendKeys(Key.BACK_SPACE, '2');


        await Promise.all(options.map(async function (option) {
            const text = await option.getText();

            if (text === sideDishesName) {
                await option.click();

                const selectedValue = await sideDishes.getText();
                expect(selectedValue).to.contain(sideDishesName);

                await pageHomePage.getOrderButton(packageDiv).click();
                expect(await driver.getCurrentUrl()).to.contain('http://test.qa.rs/order');
                }
        }))
    });
    it('Opens shopping cart', async function() {
        await pageHomePage.clickOnShoppingCartLink();

        expect(await pageCartPage.getCurrentUrl()).to.be.equal('http://test.qa.rs/cart')
        expect(await pageCartPage.getPageHeaderTitle()).to.contain('Order')
    });
    it('Verifies items are in cart',async function() {
        const orderRow = await pageCartPage.getOrderRow(packToAdd.toUpperCase());
        const orderQuantity = await pageCartPage.getOrderQuantity(orderRow);

        expect(await orderQuantity.getText()).to.eq(packageQuantity);
    })




})