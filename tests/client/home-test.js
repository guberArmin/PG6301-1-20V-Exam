import {asyncCheckCondition, overrideFetch} from "../mytest-utils";

const React = require('react');
const {mount} = require('enzyme');
const {MemoryRouter} = require('react-router-dom');
const {app} = require('../../src/server/app');

const {Home} = require('../../src/client/home');
const {deleteAllUsers} = require('../../src/server/db/users');
const {checkForDuplicates} = require("../../src/client/utils.js");

beforeEach(() => {
    deleteAllUsers();
});

async function signup(userId, password) {
    const response = await fetch("/api/signup", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userId, password: password }),
    });

    return response.status === 201;
}

async function waitForPlayersToDisplay(driver) {
    const displayed = await asyncCheckCondition(() => {
        driver.update();
        return driver.find(".userCollection").length > 0;
    }, 2000, 200);
    return displayed;
}

async function  getUsersCollection() {
    let response;
    let payload;

    try {
        response = await fetch("/api/user/players", {method: "get"});
    } catch (e) {
        this.setState({error: "Failed to connect to server:" + e});
        return;
    }
    payload = await response.json();
    //If we are here we have gotten response, lets set it
    return payload.players;
}

async function openLootBox () {
    const url = "/api/user/loot";
    let response;
    let payload;
    try {
        //As server state changes we have to use POST and not GET
        response = await fetch(url, {method: "post"});
    } catch (e) {
        this.setState({error: "Failed to connect to server:" + e});
        return;
    }
    return response.status === 201;
}

test("Test when not logged in, can you see collection of players", async () => {
    overrideFetch(app);
    let page = null;
    const history = {push: (h) => {page=h}};
    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());
    const updateLoggedInUser = () => new Promise(resolve => resolve());
    const driver = mount(
        <MemoryRouter>
            <Home history={history} updateLoggedInUser={updateLoggedInUser} fetchAndUpdateUserInfo={fetchAndUpdateUserInfo}/>
        </MemoryRouter>);

    const error = driver.find(".no-user").length > 0;
    expect(error).toBe(true)
});

test("Test are unique players displayed", async () => {
    overrideFetch(app);
    let id = "admin";

    //Lets register user
    await signup(id,"123");
    //Every new user gets 3 loot boxes lets open them
    await openLootBox();
    await openLootBox();
    await openLootBox();

    //Get all players that we own anc check how many of them are unique(e.g. not duplicates)
    let owned = await getUsersCollection();
    const numberOfUnique = Object.keys(checkForDuplicates(owned)).length;
    //Mount component
    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());
    const updateLoggedInUser = () => new Promise(resolve => resolve());
    const driver = mount(
        <MemoryRouter>
            <Home  user={"admin"} updateLoggedInUser={updateLoggedInUser}fetchAndUpdateUserInfo={fetchAndUpdateUserInfo}/>
        </MemoryRouter>);

    //Wait for players to be displayed and test values
    const playersDisplayed = await waitForPlayersToDisplay(driver);
    expect(playersDisplayed).toBe(true);
    const numberOfUniquePlayersDisplayed = driver.find(".playerInfo").length;
    expect(numberOfUniquePlayersDisplayed).toEqual(numberOfUnique);

});

