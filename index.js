const express = require('express');
const cookieSession = require('cookie-session');
const app = express();
require('dotenv').config();
const passportConfig = require('./passport/passport');
const passport = require('passport');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/shopkartoauth', () => {
    console.log('Connected to MongoDB');
});

app.use(cookieSession({
    maxAge: 3 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY]
}));

app.use(passport.initialize());
app.use(passport.session());

const isLoggedIn = (req, res, next) => {
    if (!req.user) {
        res.redirect('/auth/login');
    } else {
        next();
    }
}

const auth = require('./routes/auth');
app.use("/auth", auth)

app.set('view engine', 'ejs');

app.get("/", isLoggedIn, (req, res) => {
    res.render("home");
})

app.listen(4000, () => {
    console.log(`Server is listening on port 4000`);
});