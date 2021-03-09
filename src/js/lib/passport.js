/*
 *  lib/passport.js
 */
"use strict";

const passport = require('passport');

passport.serializeUser((user, done)=>done(null, JSON.stringify(user)));
passport.deserializeUser((userstr, done)=>done(null, JSON.parse(userstr)));

const local = require('passport-local');

passport.use(new local.Strategy(
    { usernameField: 'login',
      passwordField: 'passwd' },
    (login, passwd, done)=>{
        done(null, {
            id:   'koba',
            name: '小林 聡',
            icon: 'https://kobalab.net/koba.jpg'
        });
    }
));

module.exports = passport;
