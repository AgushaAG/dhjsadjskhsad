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

let foods = []

io.on('connection', (socket) => {
    sockets+=1
    let players = []
    let player = {
        ws: socket.id,
        x: 0,
        y: 0,
        speed: 0.01
    }
    let redFood = {
        x: 0,
        y: 0
    }
    players.push(player)
    io.emit('connectionRequest', player.ws)
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
    });
    socket.on('disconnect', () => {
        sockets-=1
        io.sockets.emit('disconnection', player.ws);
    })
    function update() {
        if (foods.length < 10) {
            const newFood = {
                x: Math.floor(Math.random() * 900),
                y: Math.floor(Math.random() * 600)
            };
            foods.push(newFood);
        }
        io.sockets.emit('spawnRedFood', foods);
    }    
    setInterval(() => {
        update()
    }, 1000)
})

