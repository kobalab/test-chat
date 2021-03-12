/*!
 * @kobalab/test-chat
 */
"use strict";

const $ = require('jquery');

let sock;

$(function(){
    sock = io();
    sock.on('hello', (user)=>{
        console.log('hello', user);
        if (! user) document.location = './auth/';
        else {
            $('#user span').text(user.name);
            $('#user img').attr('src', user.icon);
        }
    });
});
