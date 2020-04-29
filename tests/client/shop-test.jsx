import {asyncCheckCondition, overrideFetch} from "../mytest-utils";
import {overrideWebSocket} from "../mytest-utils-ws"

const React = require('react');
const {mount} = require('enzyme');
const {MemoryRouter} = require('react-router-dom');
const {app} = require('../../src/server/app');

const {Shop} = require('../../src/client/shop');
const {deleteAllUsers} = require('../../src/server/db/users');

beforeEach(() => {
    deleteAllUsers();
});

async function signup(userId, password) {
    const response = await fetch("/api/signup", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({userId: userId, password: password})
    });

    return response.status === 201;
}


async function waitForFailureMessage(driver) {
    const displayed = await asyncCheckCondition(() => {
        driver.update();
        return driver.find(".alert-danger").length > 0;
    }, 2000, 200);
    return displayed;
}

async function waitForSuccessMessage(driver) {
    const displayed = await asyncCheckCondition(() => {
        driver.update();
        return driver.find("#successParagraph").length > 0;
    }, 2000, 200);
    return displayed;
}

async function waitForLootBoxToBeDisplayed(driver) {
    const displayed = await asyncCheckCondition(() => {
        driver.update();
        return driver.find(".lootBoxShop").length > 0;
    }, 4000, 200);
    return displayed;
}

test("Test not logged in", async () => {
    overrideFetch(app);
    overrideWebSocket(app);
    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());
    const driver = mount(
        <MemoryRouter>
            <Shop fetchAndUpdateUserInfo={fetchAndUpdateUserInfo}/>
        </MemoryRouter>);

    const error = driver.find(".alert-warning").length > 0;
    expect(error).toBe(true)
});

test("Test buy loot box", async () => {
    overrideFetch(app);
    overrideWebSocket(app);
    let id = "admin";
    //Lets register user
    await signup(id, "123");

    //Mount component
    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());
    const driver = mount(
        <MemoryRouter>
            <Shop user={{userId: "admin", geons:300}} fetchAndUpdateUserInfo={fetchAndUpdateUserInfo}/>
        </MemoryRouter>);

    const isDisplayed = await waitForLootBoxToBeDisplayed(driver);
    expect(isDisplayed).toBe(true);
    //Every new user gets 3 loot boxes lets open them one by one
    const buyButton = driver.find("#buyButton");
    buyButton.simulate("click");
    //Wait for players to be displayed
    const isBought = await waitForSuccessMessage(driver);
    expect(isBought).toBe(true);
});

test("Test fail buying loot box, insufficient funds", async () => {
    overrideFetch(app);
    overrideWebSocket(app);
    let id = "admin";
    //Lets register user
    await signup(id, "123");

    //Mount component
    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());
    const driver = mount(
        <MemoryRouter>
            <Shop user={{userId: "admin", geons:245}} fetchAndUpdateUserInfo={fetchAndUpdateUserInfo}/>
        </MemoryRouter>);

    const isDisplayed = await waitForLootBoxToBeDisplayed(driver);
    expect(isDisplayed).toBe(true);
    //Every new user gets 3 loot boxes lets open them one by one
    const buyButton = driver.find("#buyButton");
    buyButton.simulate("click");
    //Wait for players to be displayed and test values
    let isBought = await waitForSuccessMessage(driver);
    expect(isBought).toBe(true);
    //Lets try to buy again, now we have 0 on our account
    buyButton.simulate("click");
    let hasFailed = await waitForFailureMessage(driver);
    expect(hasFailed).toBe(true);
});

