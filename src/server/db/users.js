const users = new Map();
users.set("admin", {id:"admin",password:"admin"});
users.set("foo", {id:"foo",password:"foo"});
users.set("bar", {id:"bar",password:"bar"});

function getUser(id) {
    return users.get(id);
}

function checkCredentials(id, password) {
    const currentUser = getUser(id);
    if (!currentUser){
        return false;
    }
    else{
        return currentUser.password === password;

    }
}

function createUser(id, password) {
    if (getUser(id)) //If user with given id is registered we can register it again
        return false;

    const user = {
        id: id,
        password: password
    };

    users.set(id, user);

    return true;
}

function deleteAllUsers() {
    users.clear();
}

module.exports = {deleteAllUsers,getUser, checkCredentials, createUser};