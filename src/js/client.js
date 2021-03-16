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
        if (! user) {
            document.location = './auth/';
            return;
        }
        $('#user span').text(user.name);
        $('#user img').attr('src', user.icon);
        $('#user').show();

        sock.on('disconnect', (reason)=>$('#error').text('接続が切れました'));
        sock.on('room', (users)=>{
            $('#member').empty();
            for (let user of users) {
                $('<span>').append($('<img>').attr('src', user.icon))
                           .append($('<span>').text(user.name))
                           .appendTo($('#member'));
            }
            $('#member').append($('<hr>'));
        });
        $('#error').empty();

        sock.emit('join');
    });
    sock.on('error', (msg)=>$('#error').text(msg));
});
