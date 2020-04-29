//Simulating database as shown in class
//No part of this code is copy even  though it could be said it is adaptation of: https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/src/server/db/matches.js
const players = new Map();

let counter = 0;

function defaultCollectionInitializer(){
    players.clear();
    addPlayerToCollection("Paulo", "Dybala", "Argentina", "Juventus", "26","./player-pictures/dybala.jpg");
    addPlayerToCollection("Miralem", "Pjanic", "Bosnia and Herzegovina", "Juventus", "30","./player-pictures/pjanic.jpg");
    addPlayerToCollection("Jadon", "Sancho", "England", "BVB", "20","./player-pictures/jadon.jpg");
    addPlayerToCollection("Timo", "Werner", "Germany", "RB Leipzig", "24","./player-pictures/timo.jpg");
    addPlayerToCollection("Pierre-Emerick", "Aubameyang", "Gabon", "Arsenal", "30","./player-pictures/emerick.jpg");
    addPlayerToCollection("Sergio", "Aguero", "Argentina", "Manchester City", "31","./player-pictures/aguero.jpg");
    addPlayerToCollection("Kevin", "De Bruyne", "Netherlands", "Manchester City", "28","./player-pictures/kevin.jpg");
    addPlayerToCollection("Robert", "Lewandowski", "Poland", "Bayern Munich", "31","./player-pictures/lewa.jpg");
    addPlayerToCollection("Luis", "Suarez", "Uruguay", "Barcelona", "33","./player-pictures/luis.jpg");
    addPlayerToCollection("Virgil", "Van Dijk", "Netherlands", "Liverpool", "28","./player-pictures/virgil.jpg");
    addPlayerToCollection("Frankie", "De Jong", "Netherlands", "Barcelona", "22","./player-pictures/frankie.jpg");
    addPlayerToCollection("Eden", "Hazard", "Belgium", "Real Madrig", "29","./player-pictures/eden.jpg");
    addPlayerToCollection("Kylian", "Mbappe", "France", "PSG", "21","./player-pictures/mbape.jpg");
    addPlayerToCollection("Ronaldo", "Cristiano", "Portugal", "Juventsu", "35","./player-pictures/ronaldo.jpg");
    addPlayerToCollection("Lionel", "Messi", "Argentina", "Barcelon", "32","./player-pictures/messi.jpg");
}

defaultCollectionInitializer();
function addPlayerToCollection(name, lastName,nationality, team, age,picture){
    //Lets have id as string that is why +
    const id = "" + counter;
    counter ++;

    const player = {
        id:id,
        name:name,
        lastName:lastName,
        nationality:nationality,
        team:team,
        age:age,
        picture:picture
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