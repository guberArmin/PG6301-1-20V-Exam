const express = require("express");
const players = require("../db/players-collection");
const router = express.Router();
const Users = require("../db/users");

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
    /**
     * rfc7231 definition: The 403 (Forbidden) status code indicates that the server understood
     * the request but refuses to authorize it.  A server that wishes to
     * make public why the request has been forbidden can describe that
     * reason in the response payload (if any).
     */
    if (req.user.geons < 200) {
        res.status(403).send();
        return;
    }
    Users.buyLootBox(req.user.id, players.getLootSet());
    res.status(201).send();
});

//This end point most likely wont be used. But it is here as it is required by exam to have it
//We could for example allow user to "re roll" loot box without seeing content (doesnt make much sense since there is no rarity concept...)
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
        res.status(403).send();
});
module.exports = router;