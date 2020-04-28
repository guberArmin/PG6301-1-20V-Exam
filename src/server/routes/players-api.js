const express = require("express");
const players = require("../db/players-collection");
const router = express.Router();
const Users = require("../db/users");
const WS = require('ws');
let ews;

//Every user can get access to this end point as instructed in exam text
router.get("/players", (req, res) => {
    res.status(200).json(players.getAllPlayers());
});

//Lets try to buy one loot box
router.post("/players/loot", (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }
    //If we have no money we can not buy loot box
    if (req.user.geons < 200) {
        res.status(400).send();
        return;
    }
    Users.buyLootBox(req.user.id, players.getLootSet());
    res.status(201).send();
});

//This end point most likely wont be used but it is here as it is required by exam to have it
//We could for example allow user to "re roll" loot box without seeing content
//In this case we would use put to change one loot box for another

router.put("/players/loot", (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }
    const newLootSet = players.getLootSet();
    const isRerolled = Users.reRollLootSet(req.user.id, newLootSet);
    if (isRerolled)
        res.status(201).send();
    else //You have no loot boxes to re roll
        res.status(400).send();
});
module.exports = router;