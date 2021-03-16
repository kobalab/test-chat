/*!
 * @kobalab/test-chat
 */
"use strict";

const $ = require('jquery');

let sock;

$(function(){
    sock = io();
    sock.onAny(console.log);
    sock.on('hello', (user)=>{
        if (! user) document.location = './auth/';
        else {
            $('#user span').text(user.name);
            $('#user img').attr('src', user.icon);
            $('#user').show();
            sock.emit('join');
        }
        sock.on('disconnect', (reason)=>$('#error').text('接続が切れました'));
    });
    sock.on('error', (msg)=>$('#error').text(msg));
});
