//Simulating database as shown in class
//No part of this code is copy even  though it could be said it is adaptation of: https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/src/server/db/matches.js
const players = new Map();

let counter = 0;

function defaultCollectionInitializer(){
    players.clear();
    addPlayerToCollection("Paulo", "Dybala", "Argentina", "Juventus", "26");
    addPlayerToCollection("Miralem", "Pjanic", "Bosnia and Herzegovina", "Juventus", "30");
    addPlayerToCollection("Jadon", "Sancho", "England", "BVB", "20");
    addPlayerToCollection("Timo", "Werner", "Germany", "RB Leipzig", "24");
    addPlayerToCollection("Pierre-Emerick", "Aubameyang", "Gabon", "Arsenal", "30");
    addPlayerToCollection("Sergio", "Aguero", "Argentina", "Manchester City", "31");
    addPlayerToCollection("Kevin", "De Bruyne", "Netherlands", "Manchester City", "28");
    addPlayerToCollection("Robert", "Lewandowski", "Poland", "Bayern Munich", "31");
    addPlayerToCollection("Luis", "Suarez", "Uruguay", "Barcelona", "33");
    addPlayerToCollection("Virgil", "Van Dijk", "Netherlands", "Liverpool", "28");
    addPlayerToCollection("Frankie", "De Jong", "Netherlands", "Barcelona", "22");
    addPlayerToCollection("Eden", "Hazard", "Belgium", "Real Madrig", "29");
    addPlayerToCollection("Kylian", "Mbappe", "France", "PSG", "21");
    addPlayerToCollection("Ronaldo", "Cristiano", "Portugal", "Juventsu", "35");
    addPlayerToCollection("Lionel", "Messi", "Argentina", "Barcelon", "32");
}

defaultCollectionInitializer();
function addPlayerToCollection(name, lastName,nationality, team, age){
    //Lets have id as string that is why +
    const id = "" + counter;
    counter ++;

    const player = {
        id:id,
        name:name,
        lastName:lastName,
        nationality:nationality,
        team:team,
        age:age
    };
    players.set(id,player);
}

function getAllPlayers(){
    return Array.from(players.values());
}

function getRandomPlayer() {
    let index = Math.floor(Math.random()*players.size);
    return players.get(index + "");
}

//One loot box has loot set of two players
//It is just number I felt fit good considering small size of database
function getLootBoxes(numberOfBoxes) {
    let lootBoxes = [];
    for(let i = 0; i < numberOfBoxes; i++){

        lootBoxes.push(getLootSet());
    }
    return lootBoxes;
}

function getLootSet(){
    let lootSet = [];
    lootSet.push(getRandomPlayer());
    lootSet.push(getRandomPlayer());
    return lootSet;
}

module.exports = {
   getRandomPlayer,getLootBoxes, getAllPlayers, getLootSet
};