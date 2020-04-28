const express = require('express');
const passport = require('passport');
const Users = require("../db/users");
const Tokens = require('../ws/tokens');

const router = express.Router();
// Adaptation of :https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/src/server/routes/auth-api.js
router.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(204).send();
});

router.post('/logout', function (req, res) {

    req.logout();
    res.status(204).send();
});

router.get('/user', function (req, res) {

    if (!req.user) {
        res.status(401).send();
        return;
    }

    res.status(200).json({
        id: req.user.id,
        lootBoxes: req.user.lootBoxes.length,
        geons: req.user.geons
    })
});

//Get all players owned by currently logged in user
router.get('/user/players', function (req, res) {

    if (!req.user) {
        res.status(401).send();
        return;
    }

    const filter = req.query["filter"];

    //Get just missing players from collection
    if (filter === "missing") {
        res.status(200).json({
            missing: Users.getMissingPlayers(req.user.id)
        });
    } else {
        res.status(200).json({
            players: req.user.players,
        })
    }

});

//Delete player from list and add some  geons (money) to user
//
router.delete('/user/players/:id', function (req, res) {
    //You have to be logged in to delete player from users list
    if (!req.user) {
        res.status(401).send();
        return;
    }

    const isDeleted = Users.sellDuplicate(req.user.id, req.params.id)

    if (isDeleted) {
        res.status(204);
    } else {
        res.status(404);
    }

    res.send();
});

//Get all loot boxes owned by user
router.get('/user/loot', function (req, res) {

    if (!req.user) {
        res.status(401).send();
        return;
    }
    res.status(200).json({
        lootBoxesNr: req.user.lootBoxes.length
    })
});
/**
 * Based on this discussion I went for : 404 https://stackoverflow.com/questions/11746894/what-is-the-proper-rest-response-code-for-a-valid-request-but-an-empty-data
 * for situation where someone tries to open loot box but they do not have any loot boxes
 * I consider that we created 2 players in list of colletion if we opened loot box
 * That is why 201. One could argument for 200 or 204 too
 * This had to be http post method as we are changing server state by removing loot box and adding players
 *
 * One could argue that this end point should have been under players/loot
 * But I feel it is more natural to put it here since each loot is connected to single user and not to whole collection of players
 */
router.post('/user/loot', function (req, res) {

    if (!req.user) {
        res.status(401).send();
        return;
    }
    //If there is no loot boxes
    if (req.user.lootBoxes.length === 0) {
        res.status(404).send();
        return;
    }
    let boxToReturn = Users.openLootBox(req.user.id);

    res.status(201).json({
        lootedPlayers: boxToReturn
    })
});

router.post('/signup', function (req, res) {

    const created = Users.createUser(req.body.userId, req.body.password);

    if (!created) {
        res.status(400).send();
        return;
    }

    passport.authenticate('local')(req, res, () => {
        req.session.save((err) => {
            if (err) {
                //shouldn't really happen
                res.status(500).send();
            } else {
                res.status(201).send();
            }
        });
    });
});

/*
   Adaptation of https://github.com/arcuri82/web_development_and_api_design/blob/master/les10/connect4-v2/src/server/routes/auth-api.js
 */
router.post('/wstoken', function (req, res) {
    if(! req.user){
        res.status(401).send();
        return;
    }

    const t = Tokens.createToken(req.user.id);
    res.status(201).json({wstoken: t});
});


module.exports = router;