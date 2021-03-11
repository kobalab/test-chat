/*!
 * @kobalab/test-chat
 */
"use strict";

const $ = require('jquery');

let sock;

$(function(){
    $('#welcome').hide();
    sock = io();
    sock.on('hello', (msg)=>{
        console.log('hello', msg);
        if (msg) {
            $('title').text(msg.name);
            $('link[rel="icon"]').attr('href', msg.icon);
            $('#login').hide();
            $('#welcome').show();
        }
    });
});
