//Simulating database as shown in class
//No part of this code is copy even  though it could be said it is adaptation of: https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/src/server/db/matches.js
const players = new Map();

let counter = 0;

function defaultCollectionInitializer(){
    players.clear();
    addPlayerToList("Paulo", "Dybala", "Argentina", "Juventus", "26");
    addPlayerToList("Miralem", "Pjanic", "Bosnia and Herzegovina", "Juventus", "30");
    addPlayerToList("Jadon", "Sancho", "England", "BVB", "20");
    addPlayerToList("Timo", "Werner", "Germany", "RB Leipzig", "24");
    addPlayerToList("Pierre-Emerick", "Aubameyang", "Gabon", "Arsenal", "30");
    addPlayerToList("Sergio", "Aguero", "Argentina", "Manchester City", "31");
    addPlayerToList("Kevin", "De Bruyne", "Netherlands", "Manchester City", "28");
    addPlayerToList("Robert", "Lewandowski", "Poland", "Bayern Munich", "31");
    addPlayerToList("Luis", "Suarez", "Uruguay", "Barcelona", "33");
    addPlayerToList("Virgil", "Van Dijk", "Netherlands", "Liverpool", "28");
    addPlayerToList("Frankie", "De Jong", "Netherlands", "Barcelona", "22");
    addPlayerToList("Eden", "Hazard", "Belgium", "Real Madrig", "29");
    addPlayerToList("Kylian", "Mbappe", "France", "PSG", "21");
    addPlayerToList("Ronaldo", "Cristiano", "Portugal", "Juventsu", "35");
    addPlayerToList("Lionel", "Messi", "Argentina", "Barcelon", "32");
}

function addPlayerToList(name, lastName,nationality, team, age){
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

function getLootBoxes(numberOfBoxes) {
    let lootBoxes = [];
    for(let i = 0; i < numberOfBoxes; i++){
        lootBoxes.push(players.get(Math.random()*players.size));
        lootBoxes.push(players.get(Math.random()*players.size));
    }
    return lootBoxes;
}

module.exports = {
    getLootBoxes,defaultCollectionInitializer, getAllPlayers
};