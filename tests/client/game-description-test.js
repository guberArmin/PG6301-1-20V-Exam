import {asyncCheckCondition, overrideFetch} from "../mytest-utils";

const React = require('react');
const {mount} = require('enzyme');
const {MemoryRouter} = require('react-router-dom');
const {app} = require('../../src/server/app');

const {GameDescription} = require('../../src/client/game-description');
const players = require('../../src/server/db/players-collection');

async function waitForPlayersToDisplay(driver) {
    const displayed = await asyncCheckCondition(() => {
        driver.update();
        return driver.html().includes("All collectibles");
    }, 2000, 200);
    return displayed;
}

test("Test not logged in, if all players displayed", async () => {
    overrideFetch(app);
    const driver = mount(<GameDescription/>);
    await waitForPlayersToDisplay(driver);

    const numberOfPlayersOnServer = players.getAllPlayers().length;
    const numberOfPlayersDisplayed = driver.find(".player-card").length;
    expect(numberOfPlayersDisplayed).toEqual(numberOfPlayersOnServer);
});

