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
var header = document.getElementById("header");
var ctx = c.getContext("2d");
function resizeCanvas() {
    const headerHeight = header.offsetHeight;

    c.width = window.innerWidth * 0.95;
    c.height = (window.innerHeight - headerHeight) * 0.95;

    c.style.width = window.innerWidth + "px";
    c.style.height = (window.innerHeight - headerHeight) + "px";

}
resizeCanvas();
window.addEventListener("resize", resizeCanvas)


let player = {
    x: c.width / 2,
    y: c.height / 2,
    sizex: 200,
    sizey: 120,
    speed: 15,
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
    if(e.code === "ArrowDown" || e.code === "KeyS")
    {
        player.movingDown = true
    }
    if(e.code === "ArrowLeft" || e.code === "KeyA")
    {
        player.movingLeft = true
    }
    if(e.code === "ArrowRight" || e.code === "KeyD")
    {
        player.movingRight = true
    }
});

document.addEventListener("keyup", (e) => {
    if(e.code === "ArrowUp" || e.code === "KeyW")
    {
        player.movingUp = false
    }
    if(e.code === "ArrowDown" || e.code === "KeyS")
    {
        player.movingDown = false
    }
    if(e.code === "ArrowLeft" || e.code === "KeyA")
    {
        player.movingLeft = false
    }
    if(e.code === "ArrowRight" || e.code === "KeyD")
    {
        player.movingRight = false
    }
});

function getColorAtCharacter(charX, charY, ctx) {
    const pixelData = ctx.getImageData(charX, charY, 1, 1).data;
    return {
        r: pixelData[0],
        g: pixelData[1],
        b: pixelData[2],
        a: pixelData[3] / 255 // Normalize alpha to 0-1 range
    };
}

// Example usage in your game loop
const touchedColor = getColorAtCharacter(player.x, player.y, ctx);
if (touchedColor.r > 254 && touchedColor.g < 1 && touchedColor.b < 1 && touchedColor.a > 254) {
    console.log("Character is touching a shade of red.");
}




const playerImg = new Image();
playerImg.src = "assets/Chimken-remove.bg_250x120.png";

function gameLoop()
{
    ctx.clearRect(0,0,c.width, c.height);
    console.log("player x:" + player.x, "player y:" + player.y)
    console.log(c.width, c.height)
    if(player.movingUp)
    {
        player.y -= player.speed;
        if(player.y >= c.height)
        {
            player.y -= player.speed;
        }
    }
    if(player.movingDown)
    {
        player.y += player.speed;
    }
    if(player.movingLeft)
    {
        player.x -= player.speed;
    }
    if(player.movingRight)
    {
        player.x += player.speed;
    }
    ctx.drawImage(playerImg, player.x, player.y, player.sizex, player.sizey);
    requestAnimationFrame(gameLoop)
}

requestAnimationFrame(gameLoop)