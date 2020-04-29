import {asyncCheckCondition, overrideFetch} from "../mytest-utils";
import {overrideWebSocket} from "../mytest-utils-ws"

const React = require('react');
const {mount} = require('enzyme');
const {MemoryRouter} = require('react-router-dom');
const {app} = require('../../src/server/app');
const {interval} = require('../../src/server/ws/ws-handler');
const {LootBoxes} = require('../../src/client/loot-boxes');
const {deleteAllUsers, getUser} = require('../../src/server/db/users');
jest.setTimeout(32000);
beforeEach(() => {
    deleteAllUsers();
});

afterAll(() => {
    clearInterval(interval)
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

//We should get 2 players from one loot box
async function waitForPlayersToDisplay(driver) {
    return await asyncCheckCondition(() => {
        driver.update();
        return driver.find(".player-card").length === 2;
    }, 2000, 200);
}

//When tip is displayed we know mounting is completed
async function waitForTipToDisplay(driver) {
    return await asyncCheckCondition(() => {
        driver.update();
        return driver.find("#tipParagraph").length > 0;
    }, 4000, 200);
}

test("Test accessing loot box page when not logged in", async () => {
    overrideFetch(app);
    overrideWebSocket(app);
    let page = null;
    const history = {
        push: (h) => {
            page = h
        }
    };
    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());
    const updateLoggedInUser = () => new Promise(resolve => resolve());
    const driver = mount(
        <MemoryRouter>
            <LootBoxes history={history} updateLoggedInUser={updateLoggedInUser}
                       fetchAndUpdateUserInfo={fetchAndUpdateUserInfo}/>
        </MemoryRouter>);

    const noUserError = driver.find(".alert-warning").length > 0;
    expect(noUserError).toBe(true)
});

test("Test if players are displayed on opening loot box", async () => {
    overrideFetch(app);
    overrideWebSocket(app);
    let id = "admin";

    //Lets register user
    await signup(id, "123");

    //Mount component
    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());
    const updateLoggedInUser = () => new Promise(resolve => resolve());
    let page = null;
    const history = {
        push: (h) => {
            page = h
        }
    };
    const driver = mount(
        <MemoryRouter>
            <LootBoxes user={getUser(id)} userId={id} history={history} updateLoggedInUser={updateLoggedInUser}
                       fetchAndUpdateUserInfo={fetchAndUpdateUserInfo}/>
        </MemoryRouter>);

    const isDisplayed = await waitForTipToDisplay(driver);
    expect(isDisplayed).toBe(true);
    //Every new user gets 3 loot boxes lets open one
    const openButton = driver.find("#openBoxBtn");
    openButton.simulate("click");
    //Wait for players to be displayed and test values
    const playersDisplayed = await waitForPlayersToDisplay(driver);
    expect(playersDisplayed).toBe(true);
});

