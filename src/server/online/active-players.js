/*
    Adaptation of: https://github.com/arcuri82/web_development_and_api_design/blob/master/les10/connect4-v2/src/server/online/active-players.js
 */
const socketToUser = new Map();
const userToSocket = new Map();
function registerSocket(socket, userId) {
    socketToUser.set(socket.id, userId);
    userToSocket.set(userId, socket);
}
function removeSocket(socketId) {
    const userId = socketToUser.get(socketId);
    socketToUser.delete(socketId);
    userToSocket.delete(userId);
}
function getUser(socketId) {
    return socketToUser.get(socketId);
}
module.exports = {userToSocket, registerSocket, removeSocket, getUser};