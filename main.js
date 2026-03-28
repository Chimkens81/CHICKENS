async function goneClosed() {
    console.log("clucked")
    document.getElementById('startupDialog').close()
    document.getElementById('gameContainer').classList.remove('hidden')
    initializeGame()
    gameLoop()
}

const cursorImage = document.getElementById("cursorImage");
document.addEventListener("mousemove", (event) => {   
    cursorImage.style.left = `${event.clientX}px`;
    cursorImage.style.top = `${event.clientY}px`;
})

// Get elements
const gameContainer = document.getElementById("gameContainer");
const chicken = document.getElementById("chicken");
const livesElement = document.getElementById('lives')

let lives = 5;
let animationFrame;
let isInvincible = false;

// Player physics
let chickenX = 100;
let chickenY = 400;
let moveSpeedX = 0;
let moveSpeedY = 0;
let chickenSizeX = 0;
let chickenSizeY = 0;

const moveSpeed = 5;
const jumpPower = 13;
const gravity = 0.6;
const maxFallSpeed = 15;

// Camera/scroll
let cameraX = 0;
const WORLD_WIDTH = 3000; // Total world size

// Platforms array
const platforms = [
    { x: 0, y: 500, width: 400, height: 20 },      // Ground platform
    { x: 500, y: 450, width: 200, height: 20 },    // Platform 1
    { x: 800, y: 380, width: 200, height: 20 },    // Platform 2
    { x: 1100, y: 450, width: 200, height: 20 },   // Platform 3
    { x: 1400, y: 350, width: 200, height: 20 },   // Platform 4
    { x: 1700, y: 420, width: 250, height: 20 },   // Platform 5
    { x: 2050, y: 350, width: 200, height: 20 },   // Platform 6
    { x: 2350, y: 450, width: 300, height: 20 },   // Platform 7
    { x: 2750, y: 500, width: 250, height: 20 }    // End platform
];

const enemy = {
    x: 800,
    y: 270,
    width: 40,
    height: 40,
    speed: 2, 
    direction: 1,
    patrolStart: 800,
    patrolEnd: 965,
    element: null
};
const flag = {
    x: 2850,
    y: 410,
    width: 30,
    height: 60,
    element: null
};

// Keyboard state
const keys = {};

// Initialize game
function initializeGame() {
    // Set player starting position
    chickenX = 100;
    chickenY = 400;
    
    // Get chicken dimensions
    chickenSizeX = chicken.offsetWidth;
    chickenSizeY = chicken.offsetHeight;
    
    // Create platform elements
    platforms.forEach(platform => {
        const platformElement = document.createElement('div');
        platformElement.className = 'platform';
        platformElement.style.width = platform.width + 'px';
        platformElement.style.height = platform.height + 'px';
        platformElement.style.left = platform.x + 'px';
        platformElement.style.bottom = (gameContainer.clientHeight - platform.y - platform.height) + 'px';
        gameContainer.appendChild(platformElement);
        platform.element = platformElement;
    });

    const enemyElement = document.createElement('div');
    enemyElement.className = 'enemy';
    enemyElement.style.width = enemy.width + 'px';
    enemyElement.style.height = enemy.height + 'px';
    gameContainer.appendChild(enemyElement);
    enemy.element = enemyElement;

    const flagElement = document.createElement('div');
    flagElement.className = 'flag';
    flagElement.style.width = flag.width + 'px';
    flagElement.style.height = flag.height + 'px';
    flagElement.style.position = 'absolute';
    flagElement.style.left = (flag.x - cameraX) + 'px';
    flagElement.style.bottom = (gameContainer.clientHeight - flag.y - flag.height) + 'px';
    gameContainer.appendChild(flagElement);
    flag.element = flagElement;
}

function updateEnemy() {
    // Move enemy
    enemy.x += enemy.speed * enemy.direction;

    if (enemy.x >= enemy.patrolEnd) {
        enemy.direction = -1;
    } else if (enemy.x <= enemy.patrolStart) {
        enemy.direction = 1;
    }

    enemy.element.style.left = (enemy.x - cameraX) + 'px';
    enemy.element.style.bottom = (600 - enemy.y - enemy.height) + 'px';

    if (!isInvincible && checkEnemyCollision()) {
        loselife();
        resetPlayerPosition();
    }
}

function updateFlag() {
    if (!flag.element) return;
    flag.element.style.left = (flag.x - cameraX) + 'px';
    flag.element.style.bottom = (gameContainer.clientHeight - flag.y - flag.height) + 'px';
}

function checkEnemyCollision() {
    return chickenX + chickenSizeX > enemy.x &&
    chickenX < enemy.x + enemy.width &&
    chickenY + chickenSizeY > enemy.y &&
    chickenY < enemy.y + enemy.height;
}

function loselife() {
    lives--;
    livesElement.textContent = lives;

    isInvincible = true;
    chicken.style.opacity = 0.5;

    setTimeout(() => {
        isInvincible = false;
        chicken.style.opacity = "1";
    }, 2000);
    if (lives <= 0) {
        gameOver();}
}
function gameOver() {
    cancelAnimationFrame(animationFrame);
    alert("Game Over! Hit 'Okay' to play again.");
    location.reload();
}

function checkFlagCollision() {
    return chickenX + chickenSizeX > flag.x &&
    chickenX < flag.x + flag.width &&
    chickenY + chickenSizeY > flag.y &&
    chickenY < flag.y + flag.height;
}

function levelComplete() {
    cancelAnimationFrame(animationFrame);
    setTimeout(() => {
        alert('Level Complete!\nLives Left: ' + lives + '\nHit \'Okay\' to play again.');
        location.reload();
    }, 100);
}

// Keyboard input
document.addEventListener('keydown', function(event) {
    keys[event.key.toLowerCase()] = true;
    
    // Jump with spacebar or W
    if ((event.key === ' ' || event.key.toLowerCase() === 'w') && isOnGround()) {
        moveSpeedY = -jumpPower;
    }
});

document.addEventListener('keyup', function(event) {
    keys[event.key.toLowerCase()] = false;
});

// Check if player is on ground/platform
function isOnGround() {
    // Check each platform
    for (let platform of platforms) {
        if (chickenX + chickenSizeX > platform.x &&
            chickenX < platform.x + platform.width &&
            chickenY + chickenSizeY >= platform.y - 5 &&
            chickenY + chickenSizeY <= platform.y + 5 &&
            moveSpeedY >= 0) {
            return true;
        }
    }
    return false;
}

// Get platform player is standing on
function getPlatformBelow() {
    for (let platform of platforms) {
        if (chickenX + chickenSizeX > platform.x &&
            chickenX < platform.x + platform.width &&
            chickenY + chickenSizeY >= platform.y - 5 &&
            chickenY + chickenSizeY <= platform.y + 10 &&
            moveSpeedY >= 0) {
            return platform;
        }
    }
    return null;
}

// Update player physics
function updatePlayer() {
    // Horizontal movement
    moveSpeedX = 0;
    if (keys['a'] || keys['arrowleft']) {
        moveSpeedX = -moveSpeed;
    }
    if (keys['d'] || keys['arrowright']) {
        moveSpeedX = moveSpeed;
    }
    
    // Apply horizontal movement
    chickenX += moveSpeedX;
    
    // Apply gravity
    moveSpeedY += gravity;
    if (moveSpeedY > maxFallSpeed) {
        moveSpeedY = maxFallSpeed;
    }
    
    // Apply vertical movement
    chickenY += moveSpeedY;
    
    // Platform collision
    const platformBelow = getPlatformBelow();
    if (platformBelow) {
        chickenY = platformBelow.y - chickenSizeY;
        moveSpeedY = 0;
    }
    
    // Keep player in world bounds
    if (chickenX < 0) chickenX = 0;
    if (chickenX > WORLD_WIDTH - chickenSizeX) chickenX = WORLD_WIDTH - chickenSizeX;
    
    // Fall death
    if (chickenY > gameContainer.clientHeight) {
        resetPlayerPosition();
    }
    
    // Update camera to follow player
    updateCamera();
    
    // Update player element position
    chicken.style.left = (chickenX - cameraX) + 'px';
    chicken.style.bottom = (gameContainer.clientHeight - chickenY - chickenSizeY) + 'px';
}

// Update camera to follow player
function updateCamera() {
    const containerWidth = gameContainer.clientWidth;
    
    // Keep player centered when possible
    cameraX = chickenX - containerWidth / 2 + chickenSizeX / 2;
    
    // Clamp camera to world bounds
    if (cameraX < 0) cameraX = 0;
    if (cameraX > WORLD_WIDTH - containerWidth) {
        cameraX = WORLD_WIDTH - containerWidth;
    }
    
    // Update all platforms relative to camera
    platforms.forEach(platform => {
        platform.element.style.left = (platform.x - cameraX) + 'px';
    });
}

// Reset player position
function resetPlayerPosition() {
    chickenX = 100;
    chickenY = 400;
    moveSpeedY = 0;
    moveSpeedX = 0;
}

// Game loop
function gameLoop() {
    updatePlayer();
    updateEnemy();
    updateFlag();
    if (checkFlagCollision()) {
        levelComplete();
        return;
    }
    
    let animationFrame = requestAnimationFrame(gameLoop);
}