import {asyncCheckCondition, overrideFetch} from "../mytest-utils";

const React = require('react');
const {mount} = require('enzyme');
const {MemoryRouter} = require('react-router-dom');
const {app} = require('../../src/server/app');

const {Stats} = require('../../src/client/stats');
const {defaultUsersInitialization, getUser} = require('../../src/server/db/users');
const {checkForDuplicates} = require("../../src/client/utils.js");
const {getAllPlayers} = require('../../src/server/db/players-collection');

//Lets have some default users to make testing easier
//I have made user bar that has by default 16 (number of players in collection + 1) player cards
//This way it is guaranteed to have at least one duplicate
//Second user is foo that has 3 players and this user is used for testing missing cards, as it can happen that bar has all
beforeEach(() => {
    defaultUsersInitialization();
});

async function getAllPlayersServer() {
    let response;
    try {
        response = await fetch("/api/user/players", {
            method: "get",
        });
    } catch (e) {
        console.log(e);
    }

    return await response.json();
}

async function login(userId, password) {
    const response = await fetch("/api/login", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({userId: userId, password: password})
    });

    return response.status === 204;
}

async function waitForDuplicatesToDisplay(driver) {
    const displayed = await asyncCheckCondition(() => {
        driver.update();
        return driver.find("#duplicatesHeader").length > 0;
    }, 2000, 200);
    return displayed;
}

async function waitForDuplicateToSell(driver, oldHeader) {
    const displayed = await asyncCheckCondition(() => {
        driver.update();
        const currentHeader = driver.find("#duplicatesHeader").html();
        return currentHeader !== oldHeader;
    }, 2000, 200);
    return displayed;
}

async function waitForMissingToDisplay(driver) {
    const displayed = await asyncCheckCondition(() => {
        driver.update();
        return driver.find("#missingHeader").length > 0;
    }, 2000, 200);
    return displayed;
}

test("Test not logged inn", async () => {
    overrideFetch(app);
    //Default user id: bar password: bar
    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());
    const driver = mount(
        <MemoryRouter>
            <Stats fetchAndUpdateUserInfo={fetchAndUpdateUserInfo}/>
        </MemoryRouter>);
    let isNotLoggedIn = driver.find("#notLoggedInDiv").length > 0;
    expect(isNotLoggedIn).toEqual(true);
});

test("Test show duplicates", async () => {
    overrideFetch(app);
    //Default user id: bar password: bar
    const isLoggedIn = await login("bar", "bar");
    expect(isLoggedIn).toBe(true);
    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());
    const driver = mount(
        <MemoryRouter>
            <Stats user={getUser("bar")} fetchAndUpdateUserInfo={fetchAndUpdateUserInfo}/>
        </MemoryRouter>);

    const isShowingDuplicates = await waitForDuplicatesToDisplay(driver);
    expect(isShowingDuplicates).toBe(true);
    let allPlayers = await getAllPlayersServer();
    allPlayers = Object.values(allPlayers)[0];
    const numberOfDisplayedPlayers = driver.find(".player-card").length;
    let duplicates = Object.values(checkForDuplicates(allPlayers));
    let counter = 0;
    for (let i = 0; i < duplicates.length; i++) {
        if (duplicates[i].numberOfCopies > 1) counter++;
    }
    expect(numberOfDisplayedPlayers).toEqual(counter);
});

//This time we are using foo user as it has only 3 players so no chance of having all 15 unlike bar
test("Test show missing ones", async () => {
    overrideFetch(app);
    //Default user id: bar password: bar
    const isLoggedIn = await login("foo", "foo");
    expect(isLoggedIn).toBe(true);
    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());
    const driver = mount(
        <MemoryRouter>
            <Stats user={getUser("foo")} fetchAndUpdateUserInfo={fetchAndUpdateUserInfo}/>
        </MemoryRouter>);

    const isShowingDuplicates = await waitForDuplicatesToDisplay(driver);
    expect(isShowingDuplicates).toBe(true);
    const showMissingBtn = driver.find("#showMissingButton");
    showMissingBtn.simulate("click");
    const isShowingMissing = await waitForMissingToDisplay(driver);
    expect(isShowingMissing).toBe(true);
    let allPlayers = await getAllPlayersServer();
    allPlayers = Object.values(allPlayers)[0];
    const numberOfDisplayedPlayers = driver.find(".player-card").length;
    let duplicates = Object.values(checkForDuplicates(allPlayers));
    let counter = 0;
    for (let i = 0; i < duplicates.length; i++) {
        if (duplicates[i].numberOfCopies > 1) counter++;
    }
    //To get information about how many we are missing we need to how how many are in collection
    //how many do we own, and how many of those that we own are duplicates
    const missing = getAllPlayers().length - (allPlayers.length - counter);
    expect(numberOfDisplayedPlayers).toEqual(missing);
});

//Again user bar user as it has minimum of 1 duplicate
test("Test sell duplicate card", async () => {
    overrideFetch(app);
    //As we are asking user if they want to sell duplicate with confirm window
    //That is why we have to override confirm to always "say yes" by returning true
    global.confirm = () => {
        return true
    };
    //Default user id: bar password: bar
    const isLoggedIn = await login("bar", "bar");
    expect(isLoggedIn).toBe(true);
    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());
    const driver = mount(
        <MemoryRouter>
            <Stats user={getUser("bar")} fetchAndUpdateUserInfo={fetchAndUpdateUserInfo}/>
        </MemoryRouter>);

    const isShowingDuplicates = await waitForDuplicatesToDisplay(driver);
    expect(isShowingDuplicates).toBe(true);
    //Lets sell first duplicate displayed
    const duplicateBtn = driver.find(".duplicate-button").at(0);
    duplicateBtn.simulate("click");
    const oldHeader = driver.find("#duplicatesHeader").html();
    const isSold = await waitForDuplicateToSell(driver, oldHeader);
    expect(isSold).toBe(true);
});