import {asyncCheckCondition, overrideFetch} from "../mytest-utils";

const React = require('react');
const {mount} = require('enzyme');
const {MemoryRouter} = require('react-router-dom');
const {app} = require('../../src/server/app');

const {Navigation} = require('../../src/client/navigation');


async function waitForLogOut(driver) {
    const displayed = await asyncCheckCondition(() => {
        driver.update();
        return driver.html().includes("Logout");
    }, 2000, 200);
    return displayed;
}


test("Test not logged in", () => {
    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());
    let page = null;
    const history = {push: (h) => {page=h}};
    const driver = mount(
        <MemoryRouter >
            <Navigation page = {page} fetchAndUpdateUserInfo={fetchAndUpdateUserInfo}/>
        </MemoryRouter>);
    const logoutBtn = driver.find("#loginBtn").at(0);

    expect(logoutBtn.length).toBe(1);
});

test("Test login and logout", async () => {
    overrideFetch(app);
    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());
    let page = null;
    const history = {push: (h) => {page=h}};
    const user = {id:"admin"}
    const driver = mount(
        <MemoryRouter >
            <Navigation user={user} page = {page} fetchAndUpdateUserInfo={fetchAndUpdateUserInfo}/>
        </MemoryRouter>);
    const logoutBtn = driver.find("#logoutBtn").at(0);

    expect(logoutBtn.length).toBe(1);
    logoutBtn.simulate("click");
    const isLoggedOut = await waitForLogOut(driver);
    expect(isLoggedOut).toBe(true);
});