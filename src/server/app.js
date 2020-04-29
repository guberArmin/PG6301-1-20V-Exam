const express = require("express");
const app = express();
const path = require('path');
const bodyParser = require("body-parser");

const passport = require('passport');
const session = require("express-session");
const LocalStrategy = require('passport-local').Strategy;

const users = require("./db/users");
const playersApi = require("./routes/players-api");
const authApi = require("./routes/users-api");
app.use(bodyParser.json());

const WsHandler = require('./ws/ws-handler');

//Login system
app.use(session({
    secret: 'a secret used to encrypt the session cookies',
    resave: false,
    saveUninitialized: false
}));

app.use(express.static('public'));

WsHandler.init(app);

passport.use(new LocalStrategy(
    {
        usernameField: 'userId',
        passwordField: 'password'
    },
    function (userId, password, done) {

        const ok = users.checkCredentials(userId, password);
        if (!ok) {
            return done(null, false, {message: 'Invalid username/password'});
        }

        const user = users.getUser(userId);
        return done(null, user);
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {


    const user = users.getUser(id);

    if (user) {
        done(null, user);
    } else {
        done(null, false);
    }
});

app.use(passport.initialize());
app.use(passport.session());
//End of login system

app.use("/api",playersApi );
app.use("/api",authApi);
//app.use("/api",wsApi.router);

app.use((req, res, next) => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'public', 'index.html'));
});

module.exports = {app};
