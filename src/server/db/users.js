/**
 * This file is not copy but, when it comes to structure, it is inspired by: https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/src/server/db/users.js
 */

const players = require("./players-collection");
const users = new Map();

function defaultUsersInitialization() {
    deleteAllUsers();
//Some users for testing
    createUser("foo", "foo");
    createUser("bar", "bar");
//Add some dummy data to user
    addPlayerToUser("foo", players.getRandomPlayer());
    addPlayerToUser("foo", players.getRandomPlayer());
    addPlayerToUser("foo", players.getRandomPlayer());
    //This way we get at least one duplicate that is needed for testing
    for(let i = 0; i < players.getAllPlayers().length + 1;i++){
        addPlayerToUser("bar", players.getRandomPlayer());
    }
}

defaultUsersInitialization();

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
//I have added my own currency geons (this is tribute to first mmorpg I have ever played Kal Online)
//And added starting credits to user on registration
function createUser(id, password) {
    if (getUser(id)) //If user with given id is registered we can register it again
        return false;

    const user = {
        id: id,
        password: password,
        players: [],
        lootBoxes: players.getLootBoxes(3),
        geons: 200
    };

    users.set(id, user);

    return true;
}


function deleteAllUsers() {
    users.clear();
}

function addLootSetToUser(id, lootSet) {
    let user = getUser(id);
    if (user){
        user.lootBoxes.push(lootSet);
    }
}

function addPlayerToUser(id, player) {
    getUser(id).players.push(player);
}

/**
 * Open loot box
 * @param id open loot box for given user
 */
function openLootBox(id) {
    const user = getUser(id);
    const boxContent = user.lootBoxes.pop();
    boxContent.forEach(p => user.players.push(p));
    return boxContent;
}

function getMissingPlayers(id) {
    let owned = getUser(id).players;
    return players.getAllPlayers().filter(p => !owned.includes(p));
}

//Only allowed to sell duplicates
function sellDuplicate(userId, playerId) {
    let user = getUser(userId);
    let playersWithGivenId = user.players.filter(p => p.id === playerId);
    if (playersWithGivenId < 2) {
        return false;
    }
    //Get any of given players and remove them, as they are all same
    let index = user.players.indexOf(playersWithGivenId[0]);
    user.players.splice(index, 1);
    user.geons = user.geons + 50;
    return true;
}

function buyLootBox(id, lootSet) {
    let user = getUser(id);
    user.geons -= 200;
    addLootSetToUser(id, lootSet)
}

function reRollLootSet(id, lootSet){
    let user = getUser(id);
    if(user.lootBoxes.length === 0 || !user)
        return false;

    user.lootBoxes.splice(0,1);
    user.lootBoxes.unshift(lootSet);
    return true;
}


module.exports = {
    reRollLootSet,
    addLootSetToUser,
    buyLootBox,
    sellDuplicate,
    getMissingPlayers,
    openLootBox,
    deleteAllUsers,
    getUser,
    checkCredentials,
    defaultUsersInitialization,
    createUser
};