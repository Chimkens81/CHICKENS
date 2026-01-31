async function goneClosed() {
    console.log("clucked")
    document.getElementById('startupDialog').close()
    document.getElementById('gameContainer').classList.remove('hidden')
    initializeGame()
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
let prevChickenY = 0;
const speed = 5;
const jumpPower = 15;
const gravity = 1;
const maxFallSpeed = 10;
let moveSpeedX = 0;
let moveSpeedY = 0;
let chickenSizeX = 0;
let chickenSizeY = 0;
const footOffset = 11; // pixels of transparent padding at sprite bottom to ignore when aligning feet
const keys = {};

const platforms = [
    { x: 100, y: 300, width: 200, height: 20 },
    { x: 400, y: 200, width: 150, height: 20 },
    { x: 700, y: 350, width: 250, height: 20 }
];

document.addEventListener("keydown", function(event) {
    keys[event.key.toLowerCase()] = true;
    if((event.key === ' ' || event.key.toLowerCase() === 'w' || event.key.toLowerCase() === 'arrowup') && isOnGround()) {
        moveSpeedY = -jumpPower;
    }
});

document.addEventListener("keyup", function(event) {
    keys[event.key.toLowerCase()] = false;
});

function initializeGame()
{
    chickenX = 100;
    chickenY = 100;
    chickenSizeX = chicken.offsetWidth;
    chickenSizeY = chicken.offsetHeight;

    platforms.forEach(platform => {
        const platformElement = document.createElement('div');
        platformElement.classList.add('platform');
        platformElement.style.left = platform.x + 'px';
        platformElement.style.top = platform.y + 'px';
        platformElement.style.width = platform.width + 'px';
        platformElement.style.height = platform.height + 'px';
        gameContainer.appendChild(platformElement);
    }); 
}

function isOnGround() {
    for(let platform of platforms) {
        if(chickenX + chickenSizeX > platform.x &&
            chickenX < platform.x + platform.width &&
            chickenY + chickenSizeY - footOffset >= platform.y - 8 &&
            chickenY + chickenSizeY - footOffset <= platform.y + 8 &&
            moveSpeedY >= 0)
            return true;
        }
    return false;
}
function gameLoop() {
    updatePlayer()

    animationFrame = requestAnimationFrame(gameLoop);
}

function getPlatformBelow() {
    for (let platform of platforms) {
        if (chickenX + chickenSizeX > platform.x &&
            chickenX < platform.x + platform.width &&
            chickenY + chickenSizeY - footOffset >= platform.y - 8 &&
            chickenY + chickenSizeY - footOffset <= platform.y + 8 &&
            moveSpeedY >= 0) {
            return platform;
        }
    }
    return null;
}
function updatePlayer() {
    moveSpeedX = 0;
    if (keys['a'] || keys['arrowleft']) {
        moveSpeedX = -speed;
    }
    if (keys['d'] || keys['arrowright']) {
        moveSpeedX = speed;
    }
    chickenX += moveSpeedX;
    
    moveSpeedY += gravity;
    if (moveSpeedY > maxFallSpeed) {
        moveSpeedY = maxFallSpeed;
    }
    
    // track previous Y to do a vertical sweep (prevents tunneling through platforms)
    prevChickenY = chickenY;

    chickenY += moveSpeedY;

    if (moveSpeedY > 0) { // only sweep when falling
        const prevBottom = prevChickenY + chickenSizeY - footOffset;
        const newBottom = chickenY + chickenSizeY - footOffset;
        let hitPlatform = null;
        let closestY = Infinity;

        for (let platform of platforms) {
            if (chickenX + chickenSizeX > platform.x &&
                chickenX < platform.x + platform.width) {
                if (platform.y >= prevBottom - 1 && platform.y <= newBottom + 1) {
                    if (platform.y < closestY) {
                        closestY = platform.y;
                        hitPlatform = platform;
                    }
                }
            }
        }

        if (hitPlatform) {
            chickenY = hitPlatform.y - chickenSizeY + footOffset;
            moveSpeedY = 0;
        } else {
            // fallback to original check (handles small movements)
            const platformBelow = getPlatformBelow();
            if (platformBelow) {
                chickenY = platformBelow.y - chickenSizeY + footOffset;
                moveSpeedY = 0;
            }
        }
    } else {
        // when not falling, keep normal detection
        const platformBelow = getPlatformBelow();
        if (platformBelow) {
            chickenY = platformBelow.y - chickenSizeY + footOffset;
            moveSpeedY = 0;
        }
    }
    if (chickenX < 0) chickenX = 0;
    if (chickenX > gameContainer.clientWidth - chickenSizeX) chickenX = gameContainer.clientWidth - chickenSizeX;

    if(chickenY > 600)
    {
        resetPlayerPosition();
    }

    chicken.style.left = chickenX + 'px';
    chicken.style.top = chickenY + 'px';
}

function resetPlayerPosition() {
    chickenX = 100;
    chickenY = 100;
    moveSpeedY = 0;
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
        const maxX = gameContainer.clientWidth - chickenSizeX;
        const maxY = gameContainer.clientHeight - chickenSizeY;
        chickenX = Math.min(chickenX, maxX);
        chickenY = Math.min(chickenY, maxY);
        chicken.style.left = chickenX + 'px';
        chicken.style.top = chickenY + 'px';
    }
});