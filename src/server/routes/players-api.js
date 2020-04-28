const express = require("express");
const players = require("../db/players-collection");
const router = express.Router();

//Every user can get access to this end point as instructed in exam text
router.get("/players",(req,res) => {
    res.status(200).json(players.getAllPlayers());
});

module.exports = router;