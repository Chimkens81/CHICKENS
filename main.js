function showStartMenu() {
    document.getElementById('startMenu').style.display = 'flex';
    document.getElementById('gameContainer').classList.add('hidden');
    document.getElementById('mainMenu').classList.remove('hidden');
}
function backToMainMenu() {
    document.getElementById('mainMenu').classList.remove('hidden');
}

function openMainOptions() {
    document.getElementById('mainOptionsMenu').showModal();
}

function closeMainOptions() {
    document.getElementById('mainOptionsMenu').close();
}

function exitGame() {
    window.location.href = 'about:blank';
}

async function goneClosed() {
    console.log("clucked")
    document.getElementById('startupDialog').close()
    document.getElementById('gameContainer').classList.remove('hidden')
    initializeGame()
    gameLoop()
}

function startGame(levelIndex) {
    if (level < platforms.length) {
        platforms[level].forEach(platform => {
            if (platform.element && platform.element.parentNode) {
                gameContainer.removeChild(platform.element);
            }
        });
        enemy[level].forEach(currentEnemy => {
            if (currentEnemy.element && currentEnemy.element.parentNode) {
                gameContainer.removeChild(currentEnemy.element);
            }
        });
        if (flag.element && flag.element.parentNode) {
            gameContainer.removeChild(flag.element);
        }
    }

    level = levelIndex;
    document.getElementById('startMenu').style.display = 'none';
    document.getElementById('gameContainer').classList.remove('hidden');
    document.getElementById('levelNumber').textContent = levelIndex + 1;

    lives = 5;
    livesElement.textContent = lives;
    chickenX = 100;
    chickenY = 400;
    moveSpeedX = 0;
    moveSpeedY = 0;
    cameraX = 0;
    isInvisible = false;

    initializeGame();
    gameLoop();
}

const cursorImage = document.getElementById("cursorImage");
document.addEventListener("mousemove", (event) => {   
    cursorImage.style.left = `${event.clientX}px`;
    cursorImage.style.top = `${event.clientY}px`;
})

// Get elements
const gameContainer = document.getElementById("gameContainer");
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
const WORLD_WIDTH = 4000; // Total world size

// Platforms array
const platforms = [[
    { x: 0, y: 500, width: 400, height: 20, solid: true },      // Ground platform
    { x: 500, y: 450, width: 200, height: 20, solid: true },    // Platform 1
    { x: 800, y: 380, width: 200, height: 20, solid: true },    // Platform 2
    { x: 1100, y: 450, width: 200, height: 20, solid: true },   // Platform 3
    { x: 1400, y: 350, width: 200, height: 20, solid: true },   // Platform 4
    { x: 1700, y: 420, width: 250, height: 20, solid: true },   // Platform 5
    { x: 2050, y: 350, width: 200, height: 20, solid: true },   // Platform 6
    { x: 2350, y: 450, width: 300, height: 20, solid: true },   // Platform 7
    { x: 2750, y: 500, width: 1250, height: 20, solid: true }    // End platform
],
[
    { x: 0, y: 500, width: 200, height: 20, solid: true},
    { x: 50, y: 380, width: 250, height: 20, solid: true},
    { x: 450, y: 300, width: 300, height: 20, solid: true}
]
];

const enemy = [[
    { x: 800, y: 335, width: 40, height: 40, speed: 2, direction: 1, patrolStart: 800, patrolEnd: 965, element: null }
],
[
    { x: 800, y: 335, width: 40, height: 40, speed: 2, direction: 1, patrolStart: 800, patrolEnd: 965, element: null },
    { x: 1000, y: 335, width: 40, height: 40, speed: 2, direction: 1, patrolStart: 1000, patrolEnd: 1200, element: null }
]
];

const flag = {
    x: 2850,
    y: 410,
    width: 30,
    height: 60,
    element: null
};

// Keyboard state
const keys = {};

let level = 0;

// Initialize game
function initializeGame() {
    // Set player starting position
    chickenX = 100;
    chickenY = 400;
    
    // Get chicken dimensions
    chickenSizeX = chicken.offsetWidth;
    chickenSizeY = chicken.offsetHeight;
    
    // Create platform elements
    platforms[level].forEach(platform => {
        const platformElement = document.createElement('div');
        platformElement.className = 'platform';
        platformElement.style.width = platform.width + 'px';
        platformElement.style.height = platform.height + 'px';
        platformElement.style.left = platform.x + 'px';
        platformElement.style.bottom = (gameContainer.clientHeight - platform.y - platform.height) + 'px';
        gameContainer.appendChild(platformElement);
        platform.element = platformElement;

    });
    enemy[level].forEach(currentEnemy => {
    const enemyElement = document.createElement('div');
    enemyElement.className = 'enemy';
    enemyElement.style.width = currentEnemy.width + 'px';
    enemyElement.style.height = currentEnemy.height + 'px';
    gameContainer.appendChild(enemyElement);
    currentEnemy.element = enemyElement;
    })


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
    enemy[level].forEach(currentEnemy => {

    // Move enemy
    currentEnemy.x += currentEnemy.speed * currentEnemy.direction;

    if (currentEnemy.x >= currentEnemy.patrolEnd) {
        currentEnemy.direction = -1;
    } else if (currentEnemy.x <= currentEnemy.patrolStart) {
        currentEnemy.direction = 1;
    }

    currentEnemy.element.style.left = (currentEnemy.x - cameraX) + 'px';
    currentEnemy.element.style.bottom = (gameContainer.clientHeight - currentEnemy.y - currentEnemy.height) + 'px';

    });
    
}

function updateFlag() {
    if (!flag.element) return;
    flag.element.style.left = (flag.x - cameraX) + 'px';
    flag.element.style.bottom = (gameContainer.clientHeight - flag.y - flag.height) + 'px';
}

function checkEnemyCollision() {
    for (let currentEnemy of enemy[level]) {
        if (chickenX + chickenSizeX > currentEnemy.x &&
        chickenX < currentEnemy.x + currentEnemy.width &&
        chickenY + chickenSizeY > currentEnemy.y &&
        chickenY < currentEnemy.y + currentEnemy.height) 
        {
            console.log("Hello");
            return true;
        }
    };
    return false;
}

function loselife() {
    lives--;
    livesElement.textContent = lives;

    isInvincible = true;
    chicken.style.opacity = 0.5;

    console.log("loselife?");
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
    // cancelAnimationFrame(animationFrame);
    // setTimeout(() => {
        // alert('Level Complete!\nLives Left: ' + lives + '\nHit \'Okay\' to play again.');
        // location.reload();
    // }, 100);
    platforms[level].forEach(platform => {
    gameContainer.removeChild(platform.element);
    
    });
    enemy[level].forEach(currentEnemy => {
    gameContainer.removeChild(currentEnemy.element);
    });
    gameContainer.removeChild(flag.element);
    level++;
    initializeGame();
    resetPlayerPosition();
}

// Keyboard input
document.addEventListener('keydown', function(event) {
    keys[event.key.toLowerCase()] = true;
    
    // Jump with spacebar or W
    if ((event.key === ' ' || event.key.toLowerCase() === 'w') && isOnGround()) {
        moveSpeedY = -jumpPower;
    }

    if(event.key === 'o') {
        saveGame();
    }
    if(event.key === 'p') {
        loadGame();
    }
});

document.addEventListener('keyup', function(event) {
    keys[event.key.toLowerCase()] = false;
});

// Check if player is on ground/platform
function isOnGround() {
    // Check each platform
    for (let platform of platforms[level]) {
        if (chickenX + chickenSizeX > platform.x &&
            chickenX < platform.x + platform.width &&
            chickenY + chickenSizeY >= platform.y - 5 &&
            chickenY + chickenSizeY <= platform.y + 5 &&
            moveSpeedY >= 0) {
            if (!platform.solid) {
                if (chickenY + chickenSizeY - moveSpeedY <= platform.y) {
                    return true;
                }
            } else{
                return true;
            }
        }
        
    }
    return false;
}

function sideCollision() {
    for (let platform of platforms[level]) {
        if (chickenX + chickenSizeX > platform.x &&
            chickenX < platform.x + platform.width &&
            chickenY + chickenSizeY >= platform.y &&
            chickenY <= platform.y + platform.height
        ) {
            return true;
        }
    }
    return false;
}

// Get platform player is standing on
function getPlatformBelow() {
    for (let platform of platforms[level]) {
        if (chickenX + chickenSizeX > platform.x &&
            chickenX < platform.x + platform.width &&
            chickenY + chickenSizeY >= platform.y - 5 &&
            chickenY + chickenSizeY <= platform.y + 10 &&
            moveSpeedY >= 0) {
                if (!platform.solid) {
                    if (chickenY + chickenSizeY - moveSpeedY <= platform.y) {
                        return platform;
                    }
                } else {
                    return platform;
            }
        }
    }
    return null;
}

// Update player physics
function updatePlayer() {
    // Horizontal movement
    moveSpeedX = 0;
    if (keys['a'] || keys['arrowleft'] && sideCollision()) {
        moveSpeedX = -moveSpeed;
    }
    if (keys['d'] || keys['arrowright'] && sideCollision()) {
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
    for (let platform of platforms[level]) {
        if (platform.solid && chickenX + chickenSizeX > platform.x && chickenX < platform.x + platform.width && chickenY < platform.y + platform.height && chickenY > platform.y && moveSpeedY < 0){
            chickenY = platform.y + platform.height;
            moveSpeedY = 0
        }
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

    if (!isInvincible && checkEnemyCollision()) {
        loselife();
        resetPlayerPosition();
        console.log("if");
    }
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
    platforms[level].forEach(platform => {
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
    }
    
    let animationFrame = requestAnimationFrame(gameLoop);
}
function saveGame() {
    const gameState = {
        chickenX: chickenX,
        chickenY: chickenY,
        moveSpeedX: moveSpeedX,
        moveSpeedY: moveSpeedY,
        lives: lives,
        cameraX: cameraX,
        level: level
    };
    localStorage.setItem('chickenGameSave', JSON.stringify(gameState));
}

function loadGame(slotIndex = 0) {
    const saveData = localStorage.getItem('chickenGameSave_${slotIndex}');

    if (!saveData) {
        console.log('No save data' + slotIndex);
        return false;
    }

    const gameState = JSON.parse(saveData);
    const loadingDifferentLevel = gameState.level !== level;

    if (loadingDifferentLevel) {
        platforms[level].forEach(platform => {
            if(platform.element && platform.element.parentNode) {
                gameContainer.removeChild(platform.element);
            }
        });
        enemy[level].forEach(currentEnemy => {
            if(currentEnemy.element && currentEnemy.element.parentNode) {
                gameContainer.removeChild(currentEnemy.element);
            }
        });
        if (flag.element && flag.element.parentNode) {
            gameContainer.removeChild(flag.element);
        }
    }

    chickenX = gameState.chickenX;
    chickenY = gameState.chickenY;
    moveSpeedX = gameState.moveSpeedX;
    moveSpeedY = gameState.moveSpeedY;
    lives = gameState.lives;
    cameraX = gameState.cameraX;
    level = gameState.level;
    
    livesElement.textContent = lives;
    document.getElementById('levelNumber').textContent = level + 1;

    if (loadingDifferentLevel) {
        initializeGame();
    }

    console.log('Game loaded.' + slotIndex);
    return true;
}
