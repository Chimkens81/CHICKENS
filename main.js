async function goneClosed() {
    console.log("clucked")
    document.getElementById('startupDialog').close()
}
const cursorImage=document.getElementById("cursorImage");
document.addEventListener("mousemove",(event)=> {   
    cursorImage.style.left='${event.clientX}px';
    cursorImage.style.top='${event.clientY}px';
})

var c = document.getElementById("myGameCanvas");
var ctx = c.getContext("2d");
function resizeCanvas() {
    c.width=window.outerWidth;
    c.height=window.outerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas)

let player = {
    x: c.width / 2,
    y: c.height / 2,
    size: 200,
    speed: 50,
    movingUp: false,
    movingDown: false,
    movingLeft: false,
    movingRight: false,
};

document.addEventListener("keydown", (e) => {
    if(e.code === "ArrowUp" || e.code === "KeyW")
    {
        player.movingUp = true
    }
});

const playerImg = new Image();
playerImg.src = "assets/Chimken-removebg_128x76.png";

function gameLoop()
{
    ctx.clearRect(0,0,c.width, c.height);
    if(player.movingUp)
    {
        player.y -= player.speed;
    }
    ctx.drawImage(playerImg, player.x, player.y, player.size, player.size);
}

gameLoop();