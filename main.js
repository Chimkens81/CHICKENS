async function goneClosed() {
    console.log("clucked")
    document.getElementById('startupDialog').close()
    document.getElementById('gameContainer').classList.remove('hidden')
    initializeChickenPosition()
}
const cursorImage=document.getElementById("cursorImage");
document.addEventListener("mousemove",(event)=> {   
    cursorImage.style.left=`${event.clientX}px`;
    cursorImage.style.top=`${event.clientY}px`;
})

const gameContainer = document.getElementById("gameContainer");
const chicken = document.getElementById("chicken");

let chickenX = 0;
let chickenY = 0;
const moveSpeed = 7;
const chickenSize = 50;
const keys = {};

function gameLoop() {
    const maxX = gameContainer.clientWidth - chickenSize;
    const maxY = gameContainer.clientHeight - chickenSize;
    
    if (keys['w'] || keys['arrowup']) {
        chickenY = Math.max(0, chickenY - moveSpeed);
    }
    if (keys['s'] || keys['arrowdown']) {
        chickenY = Math.min(maxY, chickenY + moveSpeed);
    }
    if (keys['a'] || keys['arrowleft']) {
        chickenX = Math.max(0, chickenX - moveSpeed);
    }
    if (keys['d'] || keys['arrowright']) {
        chickenX = Math.min(maxX, chickenX + moveSpeed);
    }
    
    chicken.style.left = chickenX + 'px';
    chicken.style.top = chickenY + 'px';
    
    animationFrame = requestAnimationFrame(gameLoop);
}

function initializeChickenPosition()
{
    const containerWidth = gameContainer.clientWidth;
    const containerHeight = gameContainer.clientHeight;
    chickenX = (containerWidth - chickenSize) / 2;
    chickenY = (containerHeight - chickenSize) / 2;
    chicken.style.left = chickenX + 'px';
    chicken.style.top = chickenY + 'px';
}

document.addEventListener("keydown", function(event) {
    const key = event.key.toLowerCase();
    keys[key] = true;
});

document.addEventListener("keyup", function(event) {
    const key = event.key.toLowerCase();
    keys[key] = false;
});

gameLoop();

window.addEventListener('resize', () => {
    if(!gameContainer.classList.contains('hidden')) {
        const maxX = gameContainer.clientWidth - chickenSize;
        const maxY = gameContainer.clientHeight - chickenSize;
        chickenX = Math.min(chickenX, maxX);
        chickenY = Math.min(chickenY, maxY);
        chicken.style.left = chickenX + 'px';
        chicken.style.top = chickenY + 'px';
    }
});