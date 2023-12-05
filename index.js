const express = require('express')
const app = express()
const http = require('http').createServer(app)


app.use(express.static('client'))

http.listen(4000, () => {
    console.log('http://localhost:4000');
})

const socket = require('socket.io')
const io = require('socket.io')(http);

let sockets = 0

const players = {}

io.on('connection', (socket) => {
    sockets+=1
    const players = []
    const player = {
        ws: socket.id,
        x: 0,
        y: 0,
        speed: 0.01
    }
    players.push({ws: socket.id, x: player.x, y: player.y, speed: player.speed})
    console.log(players);
    io.emit('connectionRequest', player.ws)
    console.log(socket.id);
    socket.on('updatePlayerData', (data) => {
        player.x = data.x;
        player.y = data.y;
        dataToSend = {
            x: player.x,
            y: player.y,
            id: player.ws,
            speed: player.speed,
            hashDSDSH: sockets
        };
        io.sockets.emit('getData', dataToSend);
        console.log(players);
    });
    socket.on('disconnect', () => {
        sockets-=1
        console.log(sockets);
    })
})
