const passport = require('passport');
const User = require('../model/user');

var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
},
    (accessToken, refreshToken, profile, next) => {
        // callback function
        console.log('my profile', profile.id);
        User.findOne({ email: profile._json.email }).then(user => {
            if (user) {
                console.log('already exists in db', user);
                next(null, user)
            } else {
                User.create({
                    email: profile._json.email,
                    name: profile.displayName,
                    googleId: profile.id
                }).then(user => {
                    console.log('new user');
                    next(null, user);
                }).catch(err => {
                    console.log(err);
                })
            }
        })
        // next();
    }
))