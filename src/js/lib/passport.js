/*
 *  lib/passport.js
 */
"use strict";

const passport = require('passport');

passport.serializeUser((user, done)=>done(null, JSON.stringify(user)));
passport.deserializeUser((userstr, done)=>done(null, JSON.parse(userstr)));

const local = require('passport-local');
const users = require('../../../etc/users.json');

passport.use(new local.Strategy(
    { usernameField: 'login',
      passwordField: 'passwd' },
    (login, passwd, done)=>{
        let user = users.find(u=>u.id == login);
        done(null, user);
    }
));

const hatena = require('passport-hatena');

passport.use(new hatena.Strategy(
    require('../../../etc/hatena.json'),
    (token, tokenSecret, profile, done)=>{
        let user = {
            id:   profile.id + '@hatena',
            name: profile.displayName,
            icon: profile.photos[0].value
        };
        done(null, user);
    }
));

module.exports = passport;
