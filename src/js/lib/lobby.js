/*
 *  lib/lobby.js
 */
"use strict";

class Lobby {

    constructor(io) {
        this._io    = io;
        this._user  = {};
        this._stage = [];
        this._room  = {};
        io.on('connection', (client)=>this.connect(client));
    }

    connect(client) {
        client.onAny((...args)=>console.log(`** ${client.id}:`, args));
        let user = client.request.user;
        if (! user) return client.emit('hello', null);
        if (this._user[user.id]) {
            client.emit('error', 'すでに接続済です');
            client.disconnect(true);
        }
        else {
            console.log('CONNECT:', client.id, user);
            client.on('disconnect', (reason)=>this.disconnect(client));
            client.on('join', (msg)=>this.join(client));
            this._user[user.id] = client;
            client.emit('hello', user);
        }
        console.log('USER:', Object.keys(this._user)
                                .map(id=>this._user[id].request.user.name));
    }

    disconnect(client) {
        let user = client.request.user;
        console.log('DISCONNECT:', client.id, user);
        delete this._user[user.id];
        this._stage = this._stage.filter(c=>c.id != client.id);
        this._io.emit('USER:', Object.keys(this._user)
                                .map(id=>this._user[id].request.user.name));
    }

    join(client) {
        console.log('JOIN:', client.id, client.request.user);
        if (! this._stage.find(c=>c.id == client.id)) this._stage.push(client);
        console.log('STAGE:', this._stage.map(c=>c.request.user.name));
        this.createRoom();
    }

    createRoom() {

        const roomId = ()=>{
            for (;;) {
                let id = ('0000000' +
                            Math.trunc(Math.random()*16**8).toString(16)
                         ).substr(-8);
                if (! this._room[id]) return id;
            }
        }

        if (this._stage.length < 4) return;

        let room  = [];
        let id    = roomId();
        let stage = this._stage;
        while (room.length < 4) {
            let client = stage.splice(Math.random()*stage.length, 1)[0]
            room.push(client);
            let user = client.request.user;
            this._user[user.id].room = id;
            client.join(id);
        }
        this._room[id] = room;
        this._io.to(id).emit('room', id);
        console.log('ROOM:', Object.keys(this._room)
                            .map(id=>({ id: id, member: this._room[id]
                                .map(c=>c.request.user.name)})));
    }
}

module.exports = (io)=> new Lobby(io);
