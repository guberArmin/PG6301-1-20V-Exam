const players = require("./players-collection");
const users = new Map();

//Some users for testing
createUser("foo","foo");
createUser("bar","bar");

function getUser(id) {
    return users.get(id);
}

function checkCredentials(id, password) {
    const currentUser = getUser(id);
    if (!currentUser) {
        return false;
    } else {
        return currentUser.password === password;

    }
}

//When we create new user we create 3 loot boxes for that user
//Each loot box is just two random players from database
//They could repeat
//There is no rarity included for players as database is small
function createUser(id, password) {
    if (getUser(id)) //If user with given id is registered we can register it again
        return false;

    const user = {
        id: id,
        password: password,
        players: [],
        lootBoxes: players.getLootBoxes(3)
    };

    users.set(id, user);

    return true;
}


function deleteAllUsers() {
    users.clear();
}

module.exports = {deleteAllUsers, getUser, checkCredentials, createUser};