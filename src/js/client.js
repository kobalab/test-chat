/*!
 * @kobalab/test-chat
 */
"use strict";

const $ = require('jquery');

$(function(){

    let sock;

    sock = io("/", { path: location.pathname + 'socket.io/' });
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
            $('#chat').show();
        });
        sock.on('say', (user, msg)=>{
            $('<div>').append($('<img>').attr('src', user.icon))
                      .append($('<div>').addClass('say').text(msg))
                      .prependTo('#chat > div');
        });

        $('#chat form').on('submit', ()=>{
            let msg = $('#chat form input[name="msg"]').val();
            if (! msg) return false;
            sock.emit('say', msg);
            $('<div>').addClass('self')
                      .append($('<img>').attr('src', user.icon))
                      .append($('<div>').addClass('say').text(msg))
                      .prependTo('#chat > div');
            $('#chat form input[name="msg"]').val('');
            return false;
        });

        $('#error').empty();

        sock.emit('join');
    });
    sock.on('error', (msg)=>$('#error').text(msg));
});
