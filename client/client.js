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

function drawRedFood(x, y) {
    ctx.fillStyle = 'red';
    ctx.fillRect(x, y, 50, 50);
}

socket.emit('connection', 1)

let player = {
    x: canvas.width/2,
    y: canvas.height/2,
    id: 0,
    speed: 0,
    targetX: 0,
    targetY: 0
}

let redFood = {
    x: 0,
    y: 0
}


function davod() {
    let dx = player.targetX - player.x;
    let dy = player.targetY - player.y;
    player.x += dx * player.speed;
    player.y += dy * player.speed;
    socket.emit('updatePlayerData', player)
}

// function davod() {
//     let dx = player.targetX - player.x;
//     let dy = player.targetY - player.y;
//     let dist = Math.sqrt(dx * dx + dy * dy);
//     if (dist > 1) {
//         player.x += dx * player.speed;
//         player.y += dy * player.speed;
//     } else {
//         player.x = player.targetX;
//         player.y = player.targetY;
//     }
//     socket.emit('updatePlayerData', player);
// }


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

// function update() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.save();
//     ctx.translate(canvas.width / 2 - player.x, canvas.height / 2 - player.y);
//     for (let d in listData) {
//         drawPlayer(listData[d].x, listData[d].y);
//     }
//     ctx.restore();
//     davod();
// }

let isAll = false


function update() {
    let targetX = player.x - canvas.width / 2;
    let targetY = player.y - canvas.height / 2;
    let dx = targetX - canvas.width / 2;
    let dy = targetY - canvas.height / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    // if (!isAll) {
    //     drawFood()
    // }
    onmousemove = ((e) => {
        player.targetX= e.clientX
        player.targetY = e.clientY
    })
    ctx.translate(canvas.width / 2 - player.x, canvas.height / 2 - player.y);
    for (let d in listData) {
        drawPlayer(listData[d].x, listData[d].y);
    }
    for (let d in listFoodData) {
        drawRedFood(listFoodData[d].x, listFoodData[d].y);
    }
    ctx.translate(-dx, -dy);
    ctx.restore();
    davod();
}



// function drawFood() {
//     for(redFood.amount < redFood.maxRedFood; redFood.amount++;){
//         var x = Math.floor(Math.random() * canvas.width);
//         var y = Math.floor(Math.random() * canvas.height);
//         const cords = {
//             x: x,
//             y: y
//         }
//         drawRedFood(x, y)
//         socket.emit('sendCords', cords)
//     }
// }

socket.on('connectionRequest', (data) => {
    player.id = data
})


let listFoodData = []

socket.on('spawnRedFood', (data) => {
    for (let d in data) {
        listFoodData[d] = data[d]
    }
})

socket.on('disconnection', (data)=>{
    delete listData[data];
})

// function drawPlayers(data) {
//     for (let dar = 0; dar < hashDSDSH; dar++) {
//         drawPlayer(data.x, data.y)
//     }
// }
let listData = {}

socket.on('getData', (data) => {
    // console.log(data);
    player.speed = data.speed
    listData[data.id] = data
})

const gameLoop = setInterval(()=> {
    update()
}, 1000 / 60)
