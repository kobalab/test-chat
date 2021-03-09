#!/usr/bin/env node

"use strict";

const path = require('path');

const express = require('express');
const session = require('express-session')({
                            name:   'CHAT',
                            secret: 'keyboard cat',
                            resave: false,
                            saveUninitialized: false });
const passport = require('./lib/passport');

const app = express();
app.disable('x-powered-by');
app.use(session);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.post('/', passport.authenticate('local', { successRedirect: '/',
                                               failureRedirect: '/' }));
app.use(express.static(path.join(__dirname, '../../www')));

const http = require('http').createServer(app);
const io   = require('socket.io')(http);

http.listen(3000, ()=>{
    console.log('Server start on http://127.0.0.1:3000');
}).on('error', (e)=>{
    console.error(''+e);
    process.exit(-1);
});
