const express_ws = require('express-ws');
const Tokens = require('./tokens');
const ActivePlayers = require('../online/active-players');
const Users = require("../db/users");
const players = require("../db/players-collection");
let ews;
/**
 * Following code is adaptation of: https://github.com/arcuri82/web_development_and_api_design/tree/master/les10/connect4-v2/src/server/ws
 */
function init(app) {
    //Every 30 seconds send loot box to use
    //User can hold maximum of 99 loot boxes, so that they don't farm loot boxes by staying online
    setTimeout(() => sendLootBoxesToOnlineUsers(),30000);
    ews = express_ws(app);
    app.ws('/', function (socket, req) {
        console.log('Established a new WS connection');
        socket.messageHandlers = new Map();
        socket.addMessageHandler = (topic, handler) => {
            socket.messageHandlers.set(topic, handler)
        };
        socket.addMessageHandler("login", handleLogin);
        socket.on('message', (data) => {
            if (!data) {
                socket.send(JSON.stringify({topic: "update", error: "No payload provided"}));
                return;
            }
            const dto = JSON.parse(data);
            const topic = dto.topic;
            if (!topic) {
                socket.send(JSON.stringify({topic: "update", error: "No defined topic"}));
                return;
            }
            const handler = socket.messageHandlers.get(topic);
            if (!handler) {
                socket.send(JSON.stringify({topic: "update", error: "Unrecognized topic: " + topic}));
                return;
            }
            handler(dto, socket);
        });
        //close is treated specially
        socket.on('close', () => {
            const userId = ActivePlayers.getUser(socket.id);
            ActivePlayers.removeSocket(socket.id);
            console.log("User '" + userId + "' is disconnected.");
        });
    });
}
function sendLootBoxesToOnlineUsers() {
    ActivePlayers.userToSocket.forEach(
        s => {
            let randomBox = players.getLootSet();
            const userID = ActivePlayers.getUser(s.id);
            Users.addLootSetToUser(userID,randomBox);
            s.send(JSON.stringify("You have received loot box"));
        }
    )
}
/*
   WebSockets do not have a native concept of authentication.
   As first WS message is over HTTP, we could re-use the same session cookies,
   which will be sent together with the WS first request.
   But there are some limitations with such approach.
   You can see more details at:
   https://devcenter.heroku.com/articles/websocket-security
   Here, for simplicity, we use a general approach of token-based authentication.
   Once the user is authenticated via regular HTTP protocol, then
   it can query for a specific endpoint returning a token associated
   with the logged in user.
   Such token can then be sent as part of handshake when the first WS
   message is sent.
*/
function handleLogin(dto, socket) {
    const token = dto.wstoken;
    if (!token) {
        socket.send(JSON.stringify({topic: "update", error: "Missing token"}));
        return;
    }
    //token can be used only once to authenticate only a single socket
    const userId = Tokens.consumeToken(token);
    if (!userId) {
        socket.send(JSON.stringify({topic: "update", error: "Invalid token"}));
        return;
    }
    /*
        if token was valid, then we can create an authenticated
        association with the given user for that token and the
        current socket
     */
    ActivePlayers.registerSocket(socket, userId);
    console.log("User '" + userId + "' is now connected with a websocket.");
}
module.exports = {init};