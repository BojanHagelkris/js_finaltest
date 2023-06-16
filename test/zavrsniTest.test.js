"use strict";
require('chromedriver');
const webdriver = require('selenium-webdriver');
const { assert, expect } = require('chai');
const { By , until } = require('selenium-webdriver');

const HomePage = require('../pages/home.page');
const RegisterPage = require('../pages/register.page');
const LoginPage = require('../pages/login.page');
const CartPage = require('../pages/cart.page')
const CheckoutPage = require('../pages/checkout.page')

describe('shop.QaFastFood tests', function () {
    let driver;
    let pageHomePage;
    let pageRegisterPage;
    let pageLoginPage;
    let pageCartPage;
    let pageCheckoutPage;

    const packToAdd = 'Double burger';
    const sideDishesName = 'Mozzarella sticks';
    const packageQuantity = '2';

    const packToAddB = 'Heart attack';
    const sideDishesNameB = 'Onion rings';
    const packageQuantityB = '4';


    before(function () {
        driver = new webdriver.Builder().forBrowser('chrome').build();
        pageHomePage = new HomePage(driver);
        pageRegisterPage = new RegisterPage(driver);
        pageLoginPage = new LoginPage(driver);
        pageCartPage = new CartPage(driver);
        pageCheckoutPage = new CheckoutPage(driver);
    });

    after( async function () {
        await driver.quit()
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
        const randomNumber = pageCartPage.random(10000, 100000000);

        await pageRegisterPage.fillFirstnameInput(`Bojan${randomNumber}`);
        await pageRegisterPage.fillLastnameInput(`Hagelkris${randomNumber}`);
        await pageRegisterPage.fillEmailInput(`siberdex${randomNumber}@hotmail.com`)
        await pageRegisterPage.fillUsername(`BojanHGK92.${randomNumber}`);
        await pageRegisterPage.fillPassword('password12');
        await pageRegisterPage.fillPasswordConfirm('password12');

        await pageRegisterPage.getRegisterButton().click();
        expect(await pageHomePage.successfullRegistrationMessage()).to.contain('Success!');
    });

    it('Login an registered user', async function() {
        await pageLoginPage.getPageUrl();
        expect(await pageLoginPage.isLoginHeaderDispalyed()).to.be.true;

        await pageLoginPage.fillUsernameLoginInput('BojanHGK92');
        await pageLoginPage.fillPasswordLoginInput('password12');
        await pageLoginPage.clickOnLoginButton();

        expect(await pageHomePage.welcomeBackMessage()).to.contain('Welcome back');
    });

    it('Empty Cart', async function() {
        await pageCartPage.emptyCartAction();
    });

    it('Order Double Burger to cart', async function() {
        // HardCoded!
        await pageHomePage.insertQuantityInput();

        const packageDiv = await pageHomePage.getPackageDiv(packToAdd);
        const sideDishes = await pageHomePage.getSideDishDropdown(packageDiv);
        const options = await pageHomePage.getDishOptions(sideDishes);

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

    it('Verifies Double Burger are in cart',async function() {
        const orderRow = await pageCartPage.getOrderRow(packToAdd.toUpperCase());
        const orderQuantity = await pageCartPage.getOrderQuantity(orderRow);

        expect(await orderQuantity.getText()).to.eq(packageQuantity);
    });

    it('Make another order to cart (Heart Attack)', async function() {
        await pageCartPage.clickOnContinueShoppingBtn();
        expect(await pageHomePage.getPageTitle()).to.contain('QA FastFood');

        // HardCoded!
        await pageHomePage.insertQuantityInputB();
        await pageHomePage.checkCutleryBox();

        const packageDivB = await pageHomePage.getPackageDiv(packToAddB);
        const sideDishesB = await pageHomePage.getSideDishDropdown(packageDivB);
        const optionsB = await pageHomePage.getDishOptions(sideDishesB);

        await Promise.all(optionsB.map(async function (optionB) {
                const text = await optionB.getText();

                if (text === sideDishesNameB) {
                    await optionB.click();

                    const selectedValue = await sideDishesB.getText();
                    expect(selectedValue).to.contain(sideDishesNameB);

                    await pageHomePage.getOrderButton(packageDivB).click();
                    expect(await driver.getCurrentUrl()).to.contain('http://test.qa.rs/order');
                }
            })
        )
    });
    it('Verifies Heart Attack is in cart',async function() {
        const orderRow = await pageCartPage.getOrderRowB(packToAddB.toUpperCase());
        const orderQuantity = await pageCartPage.getOrderQuantityB(orderRow);

        expect(await orderQuantity.getText()).to.eq(packageQuantityB);
    });
    it('Verifies item(s) price is correct' ,async function() {
        const orderRow = await pageCartPage.getOrderRow(packToAdd.toUpperCase());
        const orderQuantity = await pageCartPage.getOrderQuantity(orderRow);
        const itemPrice = await pageCartPage.getItemPrice(orderRow);
        const totalItemPrice = await pageCartPage.getTotaliPrice(orderRow);

        const quantity = Number(await orderQuantity.getText())
        const price = Number((await itemPrice.getText()).substring(1));
        const total = Number((await totalItemPrice.getText()).substring(1));

        const calculatedItemPriceTotal = quantity * price;
        expect(calculatedItemPriceTotal).to.be.equal(total);

        // 2nd item:
        const orderRowB = await pageCartPage.getOrderRowB(packToAddB.toUpperCase());
        const orderQuantityB = await pageCartPage.getOrderQuantityB(orderRowB);
        const itemPriceB = await pageCartPage.getItemPrice(orderRowB);
        const totalItemPriceB = await pageCartPage.getTotaliPrice(orderRowB);

        const quantityB = Number(await orderQuantityB.getText())
        const priceB = await itemPriceB.getText();
        // CHATGBT HELP :D
        const [basePriceStr , additionalFeeStr] = priceB.split(' + ');
        const basePrice = Number(basePriceStr.substring(1));
        const additionalFee = Number(additionalFeeStr.substring(1));
        const baseAndAdditional = basePrice + additionalFee;

        const totalB = Number((await totalItemPriceB.getText()).substring(1));

        const calculatedItemPriceTotalB = quantityB * baseAndAdditional;
        expect(calculatedItemPriceTotalB).to.be.equal(totalB);
    });
    it('Verifies that item prices match Total price to pay', async function() {
        const orderRow = await pageCartPage.getOrderRow(packToAdd.toUpperCase());
        const totalItemPrice = await pageCartPage.getTotaliPrice(orderRow);
        const total = Number((await totalItemPrice.getText()).substring(1));

        const orderRowB = await pageCartPage.getOrderRowB(packToAddB.toUpperCase());
        const totalItemPriceB = await pageCartPage.getTotaliPrice(orderRowB);
        const totalB = Number((await totalItemPriceB.getText()).substring(1));

        const totalPrice = await pageCartPage.totalPrice()
        const praviTotal = Number((await totalPrice.getText()).replace(/[^\d.-]/g, ""))

        const calculateAllPrices = total + totalB;
        expect(calculateAllPrices).to.be.equal(praviTotal);
    });
    it('Preforms checkout and Verifies items are ordered', async function() {
        await pageCartPage.clickOnCheckoutBtn();

        expect(await pageCheckoutPage.getCheckoutPageTitle()).to.contain('You have successfully placed your order.')
        expect(await pageCheckoutPage.getCheckoutPageSubtitle()).to.contain(`Your credit card has been charged with the amount of`);
    })


});