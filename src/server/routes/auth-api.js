const express = require('express');
const passport = require('passport');
const Users = require("../db/users");

const router = express.Router();
// Adaptation of :https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/src/server/routes/auth-api.js
router.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(204).send();
});

router.post('/logout', function (req, res) {

    req.logout();
    res.status(204).send();
});

router.get('/user', function (req, res)  {

    if(!req.user){
        res.status(401).send();
        return;
    }
    console.log(req.body);
    res.status(200).json({
        id:req.user.id,
        players:req.body.players,
        lootBoxes:req.body.lootBoxes
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

module.exports = router;