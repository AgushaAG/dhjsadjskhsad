const socket = io();


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
canvas.width = window.screen.width;
canvas.height = window.screen.height;


function drawPlayer(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 50, 0, 2 * Math.PI);
    ctx.fillStyle = 'red'
    ctx.fill();
    ctx.stroke();
}

socket.emit('connection', 1)

const player = {
    x: canvas.width/2,
    y: canvas.height/2,
    id: 0,
    speed: 0
}


let targetX = 0;
let targetY = 0;


function movePlayer() {
    let dx = targetX - player.x;
    let dy = targetY - player.y;
    player.x += dx * player.speed;
    player.y += dy * player.speed;

}

onmousemove = ((e) => {
    targetX = e.clientX
    targetY = e.clientY
    let dx = targetX - player.x;
    let dy = targetY - player.y;
    player.x += dx * player.speed;
    player.y += dy * player.speed;
    socket.emit('updatePlayerData', player)
})

// function playerOnMove() {
//     onmousemove = ((e) => {
//         targetX = e.clientX
//         targetY = e.clientY
//     })
//     let dx = targetX - player.x;
//     let dy = targetY - player.y;
//     player.x += dx * player.speed;
//     player.y += dy * player.speed;
//     socket.emit('updatePlayerData', player)
// }

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer(player.x, player.y);
}

socket.on('connectionRequest', (data) => {
    player.id = data
})

function drawPlayers(data) {
    for (let dar = 0; dar < hashDSDSH; dar++) {
        drawPlayer(data.x, data.y)
    }
}
let listData = []

socket.on('getData', (data) => {
    console.log(data);
    listData.push(data)
})

const gameLoop = setInterval(()=> {
    update()
}, 1000 / 60)