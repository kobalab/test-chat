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
const socket_io_session
               = require('@kobalab/socket.io-session')(session, passport);

const app = express();
app.disable('x-powered-by');
app.use(session);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.post('/', passport.authenticate('local', { successRedirect: '/',
                                               failureRedirect: '/' }));
app.post('/auth/hatena', passport.authenticate('hatena',
                                                { scope: ['read_public'] }));
app.get('/auth/hatena', passport.authenticate('hatena',
                                                { successRedirect: '/',
                                                  failureRedirect: '/' }));
app.use(express.static(path.join(__dirname, '../../www')));

const http = require('http').createServer(app);
const io   = require('socket.io')(http);
io.use(socket_io_session.express_session);
io.use(socket_io_session.passport_initialize);
io.use(socket_io_session.passport_session);

io.on('connection', sock=>{
    console.log('CONNECT:', sock.id, sock.request.user);
    sock.emit('hello', sock.request.user);
});

http.listen(3000, ()=>{
    console.log('Server start on http://127.0.0.1:3000');
}).on('error', (e)=>{
    console.error(''+e);
    process.exit(-1);
});
