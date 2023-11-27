import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from 'chai';

import LoginPage from '../pageobjects/login.page.js';
import SecurePage from '../pageobjects/secure.page.js';

const pages = {
    login: LoginPage
}

Given(/^I am on the (\w+) page$/, async (page) => {
    await pages[page].open()

    // accept cookies and switch to the iframe (remove one element to simplify the reproducible example)
    await browser.pause(8000)
    await $('#onetrust-accept-btn-handler').click()
    browser.scroll(0, 500)
    await browser.pause(8000)
    const iframe = await $("[src = '/kendo-angular-ui/components/dropdowns/examples/multiselect/basic_usage/?theme=default-ocean-blue&themeVersion=7.0.2']")
    await browser.switchToFrame(iframe);
    await browser.execute(() => {
        let toRemove = document.querySelector('kendo-taglist')
        toRemove.remove();
    });

    // change style to repro the error
    const el1 = await $(".k-input-values")
    await browser.execute(
        // assign style to elem in the browser
        (el) => {
            el.style.overflow = 'hidden'
        },
        el1);

    const el2 = await $("kendo-searchbar")
    await browser.execute(
        // assign style to elem in the browser
        (el) => {
            // it is crucial, if el.style.display = 'none' is not provided - it will pass as expected
            el.style.display = 'none'
            el.style.overflow = 'hidden'
        },
        el2);

    const el3 = await $(".k-input-inner")
    await browser.execute(
        // assign style to elem in the browser
        (el) => {
            el.style.overflow = 'hidden'
        },
        el3);

    const el4 = await $(".k-clear-value")
    await browser.execute(
        // assign style to elem in the browser
        (el) => {
            el.style.overflow = 'hidden'
        },
        el4);

    const el5 = await $(".k-icon-wrapper-host")
    await browser.execute(
        // assign style to elem in the browser
        (el) => {
            el.style.overflow = 'hidden'
        },
        el5);


    // try to find element as displayed element, with previous approach (before using the script) this action is working and returns true
    // moreover, click option works fine
    await $("kendo-multiselect").waitForDisplayed()
});

When(/^I login with (\w+) and (.+)$/, async (username, password) => {
    await LoginPage.login(username, password)
});

When(/^I wait 20 seconds$/, async () => {
    await browser.pause(20000)
});

Then(/^I should see a flash message saying (.*)$/, async (message) => {
    await expect(SecurePage.flashAlert).toBeExisting();
    await expect(SecurePage.flashAlert).toHaveTextContaining(message);
});

