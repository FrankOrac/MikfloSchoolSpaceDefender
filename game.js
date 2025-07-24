// ========================================
// MIKFLO SCHOOLS SPACE DEFENDER GAME
// Educational Character Building Game
// Developed by MIKFLO SCHOOLS TECHNOLOGY DIVISION - STEAM HUB
// ========================================

// Game Canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Educational Game Data
const badHabits = [
    'FAILURE', 'LATE COMING', 'BULLYING', 'LAZINESS', 'BAD LANGUAGE', 
    'NOISE MAKING', 'FIGHTING', 'LYING', 'CHEATING', 'EXAM MALPRACTICE', 
    'DISRESPECT', 'STEALING', 'GOSSIPING', 'RUDENESS', 'PROCRASTINATION', 
    'DISOBEDIENCE', 'JEALOUSY', 'ANGER', 'HATRED', 'GREED', 'PRIDE', 
    'IMPATIENCE', 'SELFISHNESS', 'BACKBITING', 'TRUANCY', 'VANDALISM', 
    'SUBSTANCE ABUSE', 'CYBERBULLYING', 'NEGATIVITY', 'BAD ATTITUDE'
];

const educationalLevels = [
    'Montessori', 'Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5',
    'Basic 6', 'Basic 7', 'Basic 8', 'Basic 9', 'SS1', 'SS2', 'SS3'
];

const motivationalMessages = [
    'Excellent character building!', 'Great job fighting bad habits!', 
    'You are becoming a better student!', 'Keep up the good work!',
    'Outstanding behavior improvement!', 'You are setting a great example!',
    'Your character is shining bright!', 'Wonderful progress, keep going!'
];

// Positive school values for bullets
const schoolValues = [
    'EXCELLENCE', 'INTEGRITY', 'DISCIPLINE', 'RESPECT', 'HARD WORK',
    'HONESTY', 'TEAMWORK', 'LEADERSHIP', 'CREATIVITY', 'PUNCTUALITY',
    'GOOD MANNERS', 'STUDY HABITS', 'RESPONSIBILITY', 'KINDNESS', 'FOCUS',
    'DEDICATION', 'PERSEVERANCE', 'INNOVATION', 'WISDOM', 'CHARACTER',
    'ACHIEVEMENT', 'PROGRESS', 'SUCCESS', 'GROWTH', 'LEARNING'
];

// School details for sharing
const schoolDetails = {
    name: 'MIKFLO SCHOOL',
    division: 'TECHNOLOGY DIVISION - STEAM HUB',
    address: 'Off Kingdom Hall Road, Urora After Aduwawa Benin Alche Road, Benin City, Nigeria',
    phone: '0704 530 3778, 07041748346',
    email: 'mikfoschools2004@gmail.com',
    founded: 'Founded 2004',
    services: 'Hybrid Learning, Coding Classes, Power Class, Foundation Class, Adult Literacy Class',
    classes: 'Reception, Montessori, Pre-Basic 1-3, Basic 1-9, SS1-3',
    motto: 'Quality Education Since 2004'
};

// Player and Game State
let playerName = 'Student';
let currentPlayerName = 'Student';
let gameRunning = false;
let gamePaused = false;
let score = 0;
let lives = 4;
let level = 1;
let highScores = [];

// Sound Effects (Simple beep sounds using Web Audio API)
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const sounds = {
    shoot: () => playTone(800, 0.1),
    explosion: () => playTone(200, 0.3),
    powerup: () => playTone(400, 0.2),
    hit: () => playTone(150, 0.2),
    levelup: () => playTone(600, 0.5)
};

// Game objects
let player = {};
let bullets = [];
let asteroids = [];
let powerUps = [];
let particles = [];
let stars = [];

// Preload logo image for watermark
let logoImage = new Image();
logoImage.src = 'assets/images/mikflo-logo.png';

// Power-up states
let rapidFire = false;
let shield = false;
let multiShot = false;
let powerUpTimer = 0;

// Input handling
const keys = {};
let mouseX = 0;
let mouseY = 0;
let touchX = 0;
let touchY = 0;

// Mobile controls state
const mobileControls = {
    up: false,
    down: false,
    left: false,
    right: false,
    shoot: false,
    pause: false
};

// Game timing
let lastTime = 0;
let asteroidSpawnTimer = 0;
let powerUpSpawnTimer = 0;
let shootTimer = 0;

// Developer slide timing
let developerSlideTimer = 0;
let developerSlideInterval = 30000; // Show every 30 seconds
let developerSlideShowing = false;

// Bullet value counter
let bulletValueIndex = 0;

// Sound Effect Functions
function playTone(frequency, duration) {
    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
        // Fallback for browsers that don't support Web Audio API
        console.log('Sound effect played: ' + frequency + 'Hz');
    }
}

// Background Music System
let backgroundMusic = null;
let musicEnabled = true;

function initBackgroundMusic() {
    // Create a simple ambient background sound using Web Audio API
    try {
        if (backgroundMusic) return;
        
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        oscillator1.connect(filter);
        oscillator2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator1.frequency.value = 110; // Low ambient tone
        oscillator2.frequency.value = 220; // Higher ambient tone
        oscillator1.type = 'sawtooth';
        oscillator2.type = 'sine';
        
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        
        gainNode.gain.value = 0.02; // Very quiet background
        
        oscillator1.start();
        oscillator2.start();
        
        backgroundMusic = { oscillator1, oscillator2, gainNode };
        
        // Fade in/out effects during gameplay
        setInterval(() => {
            if (gameRunning && musicEnabled && backgroundMusic) {
                const variation = Math.sin(Date.now() * 0.001) * 0.01;
                backgroundMusic.gainNode.gain.value = 0.02 + variation;
            }
        }, 1000);
        
    } catch (e) {
        console.log('Background music not supported in this browser');
    }
}

// Welcome Audio System
function createWelcomeAudio() {
    // Create a placeholder welcome message using speech synthesis
    if ('speechSynthesis' in window) {
        const welcomeMessage = `Welcome to Space Defender! Destroy bad habits and build good character. Enter your name and start your mission, student of Mikflo Schools!`;
        const utterance = new SpeechSynthesisUtterance(welcomeMessage);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;
        
        // Try to use a child-friendly voice
        const voices = speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => voice.name.includes('Female') || voice.name.includes('Woman'));
        if (femaleVoice) utterance.voice = femaleVoice;
        
        return utterance;
    }
    return null;
}

let welcomeAudio = null;

function playWelcomeAudio() {
    // Auto-play welcome audio, skip silently if unavailable
    if (welcomeAudio && 'speechSynthesis' in window) {
        try {
            speechSynthesis.cancel();
            speechSynthesis.speak(welcomeAudio);
        } catch (e) {
            // Silently skip if audio fails
            console.log('Welcome audio skipped - not available');
        }
    }
}

function showUsernameInput() {
    hideAllScreens();
    document.getElementById('usernameScreen').style.display = 'flex';
    // Focus on the input field
    setTimeout(() => {
        document.getElementById('playerName').focus();
    }, 100);
}

function startGameWithName() {
    const nameInput = document.getElementById('playerName').value.trim();
    if (nameInput === '') {
        alert('Please enter your name to continue!');
        return;
    }
    
    currentPlayerName = nameInput;
    playerName = nameInput;
    startGame();
}

// Auto-play welcome audio when page loads (skip if unavailable)
function playWelcomeAudio() {
    if ('speechSynthesis' in window) {
        try {
            const welcomeMessage = 'Welcome to Space Defender! Destroy bad habits and build good character. Enter your name and start your mission, student of Mikflo Schools!';
            const utterance = new SpeechSynthesisUtterance(welcomeMessage);
            utterance.rate = 0.9;
            utterance.pitch = 1.1;
            utterance.volume = 0.8;
            speechSynthesis.speak(utterance);
        } catch (e) {
            console.log('Welcome audio skipped - not available');
        }
    }
}

// Username input functions
function showUsernameInput() {
    hideAllScreens();
    document.getElementById('usernameScreen').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('playerName').focus();
    }, 100);
}

function startGameWithName() {
    const nameInput = document.getElementById('playerName').value.trim();
    if (nameInput === '') {
        alert('Please enter your name to continue!');
        return;
    }
    currentPlayerName = nameInput;
    playerName = nameInput;
    
    // Now actually start the game
    startGame();
}

function showMenu() {
    hideAllScreens();
    document.getElementById('startScreen').style.display = 'flex';
}

// Initialize game
function init() {
    // Auto-play welcome audio after 1 second
    setTimeout(playWelcomeAudio, 1000);
    
    // Initialize background music
    initBackgroundMusic();
    
    // Create starfield background with school colors
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speed: Math.random() * 2 + 1,
            color: Math.random() > 0.7 ? '#00ff88' : '#ffffff'
        });
    }
    
    // Initialize player
    resetPlayer();
    
    // Setup mobile controls
    setupMobileControls();
    
    // Setup keyboard controls
    setupKeyboardControls();
    
    // Setup canvas resize for mobile
    setupCanvasResize();
    
    // Start game loop
    gameLoop();
}

function setupCanvasResize() {
    function resizeCanvas() {
        const container = document.querySelector('.game-container');
        const rect = container.getBoundingClientRect();
        
        if (window.innerWidth <= 768) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.style.width = '100vw';
            canvas.style.height = '100vh';
        } else {
            canvas.width = 800;
            canvas.height = 600;
            canvas.style.width = '800px';
            canvas.style.height = '600px';
        }
    }
    
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', () => {
        setTimeout(resizeCanvas, 100);
    });
    
    resizeCanvas();
}

function setupMobileControls() {
    // Movement controls
    const moveUp = document.getElementById('moveUp');
    const moveDown = document.getElementById('moveDown');
    const moveLeft = document.getElementById('moveLeft');
    const moveRight = document.getElementById('moveRight');
    const shootBtn = document.getElementById('shootBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    
    // Touch event handlers for movement
    function addTouchControl(element, direction) {
        if (!element) return;
        
        element.addEventListener('touchstart', (e) => {
            e.preventDefault();
            mobileControls[direction] = true;
            element.classList.add('active');
            element.classList.add('touch-feedback');
        });
        
        element.addEventListener('touchend', (e) => {
            e.preventDefault();
            mobileControls[direction] = false;
            element.classList.remove('active');
            setTimeout(() => element.classList.remove('touch-feedback'), 100);
        });
        
        element.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            mobileControls[direction] = false;
            element.classList.remove('active');
            element.classList.remove('touch-feedback');
        });
        
        // Mouse events for desktop testing
        element.addEventListener('mousedown', (e) => {
            e.preventDefault();
            mobileControls[direction] = true;
            element.classList.add('active');
        });
        
        element.addEventListener('mouseup', (e) => {
            e.preventDefault();
            mobileControls[direction] = false;
            element.classList.remove('active');
        });
        
        element.addEventListener('mouseleave', (e) => {
            mobileControls[direction] = false;
            element.classList.remove('active');
        });
    }
    
    // Setup movement controls
    addTouchControl(moveUp, 'up');
    addTouchControl(moveDown, 'down');
    addTouchControl(moveLeft, 'left');
    addTouchControl(moveRight, 'right');
    
    // Shooting button
    if (shootBtn) {
        shootBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            mobileControls.shoot = true;
            shootBtn.classList.add('active');
            shootBtn.classList.add('touch-feedback');
        });
        
        shootBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            mobileControls.shoot = false;
            shootBtn.classList.remove('active');
            setTimeout(() => shootBtn.classList.remove('touch-feedback'), 100);
        });
        
        shootBtn.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            mobileControls.shoot = false;
            shootBtn.classList.remove('active');
            shootBtn.classList.remove('touch-feedback');
        });
        
        // Mouse events for desktop
        shootBtn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            mobileControls.shoot = true;
            shootBtn.classList.add('active');
        });
        
        shootBtn.addEventListener('mouseup', (e) => {
            e.preventDefault();
            mobileControls.shoot = false;
            shootBtn.classList.remove('active');
        });
        
        shootBtn.addEventListener('mouseleave', (e) => {
            mobileControls.shoot = false;
            shootBtn.classList.remove('active');
        });
    }
    
    // Pause button
    if (pauseBtn) {
        pauseBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            pauseBtn.classList.add('active');
            pauseBtn.classList.add('touch-feedback');
        });
        
        pauseBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            togglePause();
            pauseBtn.classList.remove('active');
            setTimeout(() => pauseBtn.classList.remove('touch-feedback'), 100);
        });
        
        pauseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            togglePause();
        });
    }
}

function setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        
        // Prevent arrow keys from scrolling
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }
        
        // Shooting
        if (e.key === ' ') {
            e.preventDefault();
            if (gameRunning && !gamePaused) {
                shoot();
            }
        }
        
        // Pause
        if (e.key === 'p' || e.key === 'P') {
            e.preventDefault();
            togglePause();
        }
    });
    
    document.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });
}

function togglePause() {
    if (gameRunning) {
        gamePaused = !gamePaused;
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            pauseBtn.innerHTML = gamePaused ? 
                '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>' :
                '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
        }
    }
}

function resetPlayer() {
    player = {
        x: canvas.width / 2,
        y: canvas.height - 50,
        width: 30,
        height: 30,
        speed: 5,
        health: 100
    };
}

function startGame() {
    // Initialize game state - this actually starts the gameplay
    gameRunning = true;
    gamePaused = false;
    score = 0;
    lives = 3;
    level = 1;
    bullets = [];
    asteroids = [];
    powerUps = [];
    particles = [];
    rapidFire = false;
    shield = false;
    multiShot = false;
    powerUpTimer = 0;
    
    resetPlayer();
    hideAllScreens();
    updateUI();
    updatePlayerDisplay();
    
    // Play start sound
    sounds.levelup();
}

function gameLoop(currentTime) {
    if (!currentTime) currentTime = 0;
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    if (gameRunning && !gamePaused) {
        update(deltaTime);
    }
    
    draw();
    requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
    // Update player
    updatePlayer();
    
    // Handle shooting
    if (mobileControls.shoot || keys[' ']) {
        shoot();
    }
    
    // Update bullets
    updateBullets();
    
    // Update asteroids
    updateAsteroids(deltaTime);
    
    // Update power-ups
    updatePowerUps(deltaTime);
    
    // Update particles
    updateParticles();
    
    // Update stars
    updateStars();
    
    // Spawn objects
    spawnAsteroids(deltaTime);
    spawnPowerUps(deltaTime);
    
    // Check collisions
    checkCollisions();
    
    // Update power-up effects
    updatePowerUpEffects(deltaTime);
    
    // Update developer slide
    updateDeveloperSlide(deltaTime);
    
    // Update level
    updateLevel();
    
    // Check game over
    if (lives <= 0) {
        gameOver();
    }
}

function updatePlayer() {
    // Keyboard movement
    if (keys['ArrowLeft'] || keys['a'] || keys['A'] || mobileControls.left) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight'] || keys['d'] || keys['D'] || mobileControls.right) {
        player.x += player.speed;
    }
    if (keys['ArrowUp'] || keys['w'] || keys['W'] || mobileControls.up) {
        player.y -= player.speed;
    }
    if (keys['ArrowDown'] || keys['s'] || keys['S'] || mobileControls.down) {
        player.y += player.speed;
    }
    
    // Keep player in bounds
    player.x = Math.max(player.width / 2, Math.min(canvas.width - player.width / 2, player.x));
    player.y = Math.max(player.height / 2, Math.min(canvas.height - player.height / 2, player.y));
}

function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.y -= bullet.speed;
        
        // Remove bullets that are off screen
        if (bullet.y < 0) {
            bullets.splice(i, 1);
        }
    }
}

function updateAsteroids(deltaTime) {
    for (let i = asteroids.length - 1; i >= 0; i--) {
        const asteroid = asteroids[i];
        asteroid.y += asteroid.speed;
        asteroid.rotation += asteroid.rotationSpeed;
        
        // Remove asteroids that are off screen
        if (asteroid.y > canvas.height + asteroid.size) {
            asteroids.splice(i, 1);
        }
    }
}

function updatePowerUps(deltaTime) {
    for (let i = powerUps.length - 1; i >= 0; i--) {
        const powerUp = powerUps[i];
        powerUp.y += powerUp.speed;
        powerUp.rotation += 0.1;
        
        // Remove power-ups that are off screen
        if (powerUp.y > canvas.height + powerUp.size) {
            powerUps.splice(i, 1);
        }
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 2;
        particle.size *= 0.98;
        
        if (particle.life <= 0 || particle.size < 0.5) {
            particles.splice(i, 1);
        }
    }
}

function updateStars() {
    for (let star of stars) {
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    }
}

function spawnAsteroids(deltaTime) {
    asteroidSpawnTimer += deltaTime;
    const spawnRate = Math.max(500 - level * 50, 200); // Faster spawning each level
    
    if (asteroidSpawnTimer > spawnRate) {
        asteroidSpawnTimer = 0;
        
        const size = Math.random() * 40 + 30; // Larger asteroids for text
        const badHabit = badHabits[Math.floor(Math.random() * badHabits.length)];
        
        const asteroid = {
            x: Math.random() * (canvas.width - size),
            y: -size,
            size: size,
            speed: Math.random() * 3 + 2 + level * 0.5,
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 0.2,
            health: Math.floor(size / 25),
            badHabit: badHabit,
            color: getHabitColor(badHabit)
        };
        
        asteroids.push(asteroid);
    }
}

function getHabitColor(habit) {
    // Different colors for different types of bad habits
    const colors = ['#ff4444', '#ff6600', '#cc0066', '#9900cc', '#6600ff', '#0066ff'];
    let hash = 0;
    for (let i = 0; i < habit.length; i++) {
        hash = habit.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

function updatePlayerDisplay() {
    // Update player name in UI
    const gamePlayerName = document.getElementById('gamePlayerName');
    if (gamePlayerName) {
        gamePlayerName.textContent = currentPlayerName || 'Student';
    }
    
    // Update level name
    const gameLevelName = document.getElementById('gameLevelName');
    if (gameLevelName) {
        const levelIndex = Math.min(level - 1, educationalLevels.length - 1);
        gameLevelName.textContent = educationalLevels[levelIndex] || 'Montessori';
    }
}

function updateLevel() {
    const newLevel = Math.floor(score / 1000) + 1;
    if (newLevel > level) {
        level = newLevel;
        sounds.levelup();
        updateUI();
        updatePlayerDisplay();
        
        // Show level up message
        showLevelUpMessage();
    }
}

function showLevelUpMessage() {
    // Create floating level up text
    const levelIndex = Math.min(level - 1, educationalLevels.length - 1);
    const levelName = educationalLevels[levelIndex];
    
    particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: 0,
        vy: -2,
        size: 1,
        color: '#ffff00',
        life: 180,
        text: `Level Up! ${levelName}`,
        isText: true
    });
}

function showMotivationalMessage(x, y) {
    const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 2,
        vy: -3,
        size: 1,
        color: '#00ff88',
        life: 120,
        text: message,
        isText: true
    });
}

function showNegativeMessage(x, y, badHabit) {
    particles.push({
        x: x,
        y: y,
        vx: 0,
        vy: -2,
        size: 1,
        color: '#ff4444',
        life: 100,
        text: `Avoid ${badHabit}!`,
        isText: true
    });
}

function spawnPowerUps(deltaTime) {
    powerUpSpawnTimer += deltaTime;
    
    if (powerUpSpawnTimer > 8000) { // Spawn every 8 seconds
        powerUpSpawnTimer = 0;
        
        const types = ['rapidfire', 'shield', 'multishot'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        const powerUp = {
            x: Math.random() * (canvas.width - 30),
            y: -30,
            size: 25,
            speed: 2,
            type: type,
            rotation: 0
        };
        
        powerUps.push(powerUp);
    }
}

function checkCollisions() {
    // Bullet-asteroid collisions
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        
        for (let j = asteroids.length - 1; j >= 0; j--) {
            const asteroid = asteroids[j];
            
            if (isColliding(bullet, asteroid)) {
                // Create explosion particles
                createExplosion(asteroid.x, asteroid.y, asteroid.color || '#ff6600');
                sounds.explosion(); // Play explosion sound
                
                // Remove bullet
                bullets.splice(i, 1);
                
                // Damage asteroid
                asteroid.health--;
                if (asteroid.health <= 0) {
                    // Award points based on destroying bad habits
                    const points = Math.floor(asteroid.size / 10) * 15;
                    score += points;
                    asteroids.splice(j, 1);
                    sounds.hit(); // Play hit sound
                    
                    // Show motivational message occasionally
                    if (Math.random() < 0.3) {
                        showMotivationalMessage(asteroid.x, asteroid.y);
                    }
                }
                
                updateUI();
                break;
            }
        }
    }
    
    // Player-asteroid collisions
    if (!shield) {
        for (let i = asteroids.length - 1; i >= 0; i--) {
            const asteroid = asteroids[i];
            
            if (isColliding(player, asteroid)) {
                // Create explosion particles
                createExplosion(player.x, player.y, '#ff0000');
                sounds.hit(); // Play hit sound
                
                // Remove asteroid
                asteroids.splice(i, 1);
                
                // Lose a life
                lives--;
                updateUI();
                
                // Reset player position
                resetPlayer();
                
                // Show negative message
                showNegativeMessage(player.x, player.y, asteroid.badHabit);
                
                break;
            }
        }
    }
    
    // Player-power-up collisions
    for (let i = powerUps.length - 1; i >= 0; i--) {
        const powerUp = powerUps[i];
        
        if (isColliding(player, powerUp)) {
            // Activate power-up
            activatePowerUp(powerUp.type);
            
            // Create pickup particles
            createExplosion(powerUp.x, powerUp.y, '#00ff88');
            sounds.powerup(); // Play power-up sound
            
            // Remove power-up
            powerUps.splice(i, 1);
            
            break;
        }
    }
}

function isColliding(obj1, obj2) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = (obj1.width || obj1.size || 10) / 2 + (obj2.width || obj2.size || 10) / 2;
    return distance < minDistance;
}

function createExplosion(x, y, color) {
    for (let i = 0; i < 10; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            size: Math.random() * 5 + 2,
            color: color,
            life: 100
        });
    }
}

function activatePowerUp(type) {
    powerUpTimer = 5000; // 5 seconds
    
    switch (type) {
        case 'rapidfire':
            rapidFire = true;
            break;
        case 'shield':
            shield = true;
            break;
        case 'multishot':
            multiShot = true;
            break;
    }
    
    updatePowerUpStatus();
}

function updatePowerUpEffects(deltaTime) {
    if (powerUpTimer > 0) {
        powerUpTimer -= deltaTime;
        if (powerUpTimer <= 0) {
            rapidFire = false;
            shield = false;
            multiShot = false;
            updatePowerUpStatus();
        }
    }
}

function updatePowerUpStatus() {
    const status = document.getElementById('powerUpStatus');
    let statusText = '';
    
    if (rapidFire) statusText += '🔥 Rapid Fire ';
    if (shield) statusText += '🛡️ Shield ';
    if (multiShot) statusText += '💥 Multi-shot ';
    
    status.textContent = statusText;
}

function updateLevel() {
    const newLevel = Math.floor(score / 1000) + 1;
    if (newLevel > level) {
        level = newLevel;
        updateUI();
    }
}

function shoot() {
    const currentTime = Date.now();
    const shootDelay = rapidFire ? 100 : 200;
    
    if (currentTime - shootTimer > shootDelay) {
        shootTimer = currentTime;
        sounds.shoot(); // Play shooting sound
        
        if (multiShot) {
            // Triple shot with school values
            for (let i = 0; i < 3; i++) {
                const schoolValue = schoolValues[bulletValueIndex % schoolValues.length];
                bulletValueIndex++;
                
                bullets.push({
                    x: player.x + (i - 1) * 10,
                    y: player.y,
                    width: 8,
                    height: 15,
                    speed: 10,
                    schoolBranded: true,
                    schoolValue: schoolValue
                });
            }
        } else {
            // Single shot with school value
            const schoolValue = schoolValues[bulletValueIndex % schoolValues.length];
            bulletValueIndex++;
            
            bullets.push({
                x: player.x,
                y: player.y,
                width: 8,
                height: 15,
                speed: 10,
                schoolBranded: true,
                schoolValue: schoolValue
            });
        }
    }
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background gradient with school colors
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#000428');
    gradient.addColorStop(0.5, '#004e92');
    gradient.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw stars
    for (let star of stars) {
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw Mikflo Schools watermark with logo
    ctx.save();
    ctx.globalAlpha = 0.15;
    
    // Draw big logo image as watermark
    if (logoImage.complete) {
        const logoSize = 150; // Much bigger logo
        ctx.drawImage(logoImage, canvas.width / 2 - logoSize / 2, canvas.height / 2 - 80, logoSize, logoSize);
    }
    
    // Draw text watermark below logo
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('MIKFLO SCHOOL', canvas.width / 2, canvas.height / 2 + 90);
    ctx.font = 'bold 16px Arial';
    ctx.fillText('TECHNOLOGY DIVISION - STEAM HUB', canvas.width / 2, canvas.height / 2 + 115);
    ctx.restore();
    
    if (gameRunning) {
        // Draw player with school colors
        drawPlayer();
        
        // Draw bullets with school branding
        drawBullets();
        
        // Draw asteroids
        drawAsteroids();
        
        // Draw power-ups
        drawPowerUps();
        
        // Draw particles
        drawParticles();
        
        // Draw pause overlay
        if (gamePaused) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#00ff88';
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
            ctx.font = '24px Arial';
            ctx.fillText('Press P or Pause button to resume', canvas.width / 2, canvas.height / 2 + 50);
        }
    }
}

function drawPlayer() {
    ctx.save();
    ctx.translate(player.x, player.y);
    
    // Ship body with school colors
    ctx.fillStyle = shield ? '#00ffaa' : '#00ff88';
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(-15, 15);
    ctx.lineTo(0, 10);
    ctx.lineTo(15, 15);
    ctx.closePath();
    ctx.fill();
    
    // School logo on ship
    ctx.fillStyle = '#0099ff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('M', 0, 5);
    
    // Shield effect
    if (shield) {
        ctx.strokeStyle = '#00ffaa';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 25, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    ctx.restore();
}

function drawBullets() {
    for (let bullet of bullets) {
        ctx.save();
        ctx.translate(bullet.x, bullet.y);
        
        if (bullet.schoolBranded) {
            // School-branded bullet design
            ctx.fillStyle = '#00ff88';
            ctx.fillRect(-4, -7, 8, 15);
            
            // School value on bullet
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 6px Arial';
            ctx.textAlign = 'center';
            if (bullet.schoolValue) {
                // Split long values to fit on bullet
                const words = bullet.schoolValue.split(' ');
                if (words.length === 1) {
                    ctx.fillText(words[0].substring(0, 8), 0, 2);
                } else {
                    ctx.fillText(words[0].substring(0, 4), 0, -2);
                    ctx.fillText(words[1] ? words[1].substring(0, 4) : '', 0, 6);
                }
            } else {
                ctx.fillText('MIKFLO', 0, 2);
            }
            
            // Glow effect
            ctx.shadowColor = '#00ff88';
            ctx.shadowBlur = 10;
            ctx.strokeStyle = '#00ff88';
            ctx.lineWidth = 2;
            ctx.strokeRect(-4, -7, 8, 15);
        } else {
            // Regular bullet
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(-2, -5, 4, 10);
        }
        
        ctx.restore();
    }
}

function drawAsteroids() {
    for (let asteroid of asteroids) {
        ctx.save();
        ctx.translate(asteroid.x, asteroid.y);
        ctx.rotate(asteroid.rotation);
        
        // Draw asteroid with bad habit color
        ctx.fillStyle = asteroid.color || '#666';
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const points = 8;
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const radius = asteroid.size * (0.8 + Math.sin(Date.now() * 0.01 + i) * 0.1);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Draw bad habit name on asteroid
        ctx.rotate(-asteroid.rotation); // Reset rotation for text
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.font = `bold ${Math.max(8, asteroid.size / 5)}px Arial`;
        ctx.textAlign = 'center';
        
        // Display bad habit name clearly
        if (asteroid.badHabit) {
            ctx.textBaseline = 'middle';
            const text = asteroid.badHabit;
            const words = text.split(' ');
            
            if (words.length === 1) {
                // Single word - display in center
                ctx.strokeText(text, 0, 0);
                ctx.fillText(text, 0, 0);
            } else if (words.length === 2) {
                // Two words - display on two lines
                ctx.strokeText(words[0], 0, -6);
                ctx.fillText(words[0], 0, -6);
                ctx.strokeText(words[1], 0, 6);
                ctx.fillText(words[1], 0, 6);
            } else {
                // Multiple words - show first word only for clarity
                ctx.strokeText(words[0], 0, 0);
                ctx.fillText(words[0], 0, 0);
            }
        }
        
        ctx.restore();
    }
}

function drawPowerUps() {
    for (let powerUp of powerUps) {
        ctx.save();
        ctx.translate(powerUp.x, powerUp.y);
        ctx.rotate(powerUp.rotation);
        
        // Draw power-up with school colors
        let color = '#00ff88';
        let symbol = '⚡';
        
        switch (powerUp.type) {
            case 'rapidfire':
                color = '#ff6600';
                symbol = '🔥';
                break;
            case 'shield':
                color = '#0099ff';
                symbol = '🛡️';
                break;
            case 'multishot':
                color = '#ffff00';
                symbol = '💥';
                break;
        }
        
        ctx.fillStyle = color;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, powerUp.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Draw symbol
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.fillText(symbol, 0, 6);
        
        ctx.restore();
    }
}

function drawParticles() {
    for (let particle of particles) {
        ctx.save();
        ctx.globalAlpha = particle.life / 100;
        
        if (particle.isText && particle.text) {
            // Draw text particle
            ctx.fillStyle = particle.color;
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeText(particle.text, particle.x, particle.y);
            ctx.fillText(particle.text, particle.x, particle.y);
        } else {
            // Draw regular particle
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}

function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('lives').textContent = lives;
    document.getElementById('level').textContent = level;
    updatePlayerDisplay();
}

function gameOver() {
    gameRunning = false;
    
    // Simple session-based high score (no database storage)
    const sessionHighScore = Math.max(score, sessionStorage.getItem('sessionHighScore') || 0);
    sessionStorage.setItem('sessionHighScore', sessionHighScore);
    
    const levelIndex = Math.min(level - 1, educationalLevels.length - 1);
    const currentLevelName = educationalLevels[levelIndex];
    
    // Check if it's a new session high score
    if (score >= sessionHighScore) {
        document.getElementById('highScoreMessage').style.display = 'block';
    } else {
        document.getElementById('highScoreMessage').style.display = 'none';
    }
    
    // Show share score option for high scores (above 1000)
    const shareSection = document.getElementById('shareScoreSection');
    if (shareSection) {
        shareSection.style.display = score >= 1000 ? 'block' : 'none';
    }
    
    // Update display
    document.getElementById('finalScore').textContent = score;
    document.getElementById('playerNameDisplay').textContent = currentPlayerName;
    document.getElementById('levelNameDisplay').textContent = currentLevelName;
    
    // Show motivational message
    const motivationalMsg = document.getElementById('motivationalMessage');
    if (motivationalMsg) {
        const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
        motivationalMsg.textContent = `${currentPlayerName}, ${message}`;
    }
    
    document.getElementById('gameOverScreen').style.display = 'flex';
}

function restartGame() {
    startGame();
}

function showMenu() {
    gameRunning = false;
    hideAllScreens();
    document.getElementById('startScreen').style.display = 'flex';
}

function showInstructions() {
    hideAllScreens();
    document.getElementById('instructionsScreen').style.display = 'flex';
}

function showHighScores() {
    hideAllScreens();
    updateHighScoresDisplay();
    document.getElementById('highScoresScreen').style.display = 'flex';
}

function updateHighScoresDisplay() {
    const highScoresList = document.getElementById('highScoresList');
    if (!highScoresList) return;
    
    const sessionHighScore = sessionStorage.getItem('sessionHighScore') || 0;
    
    let html = '<div style="text-align: center; margin-bottom: 20px; color: #00ff88; font-weight: bold;">🏆 SESSION BEST 🏆</div>';
    
    if (sessionHighScore > 0) {
        html += `
            <div style="margin: 10px 0; padding: 20px; background: rgba(0,255,136,0.1); border-radius: 10px; border: 2px solid #00ff88;">
                <div style="color: #ffff00; font-size: 1.5em; font-weight: bold; text-align: center;">
                    🥇 Best Score: ${sessionHighScore}
                </div>
                <div style="color: #00ff88; text-align: center; margin-top: 10px;">
                    Keep playing to beat your record!
                </div>
            </div>
        `;
    } else {
        html += '<div style="color: #888; text-align: center;">Play the game to set your first score!</div>';
    }
    
    highScoresList.innerHTML = html;
}

function hideAllScreens() {
    const screens = ['startScreen', 'usernameScreen', 'gameOverScreen', 'instructionsScreen', 'highScoresScreen'];
    screens.forEach(screen => {
        const element = document.getElementById(screen);
        if (element) {
            element.style.display = 'none';
        }
    });
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', init);

// Prevent context menu on touch devices
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Prevent zoom on double tap
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Prevent scrolling on touch devices
document.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });

// Handle audio context activation for mobile
document.addEventListener('touchstart', function() {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}, { once: true });

document.addEventListener('click', function() {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}, { once: true });

// Developer slide functions
function updateDeveloperSlide(deltaTime) {
    developerSlideTimer += deltaTime;
    
    // Show developer slide every 30 seconds during gameplay
    if (developerSlideTimer >= developerSlideInterval && !developerSlideShowing) {
        showDeveloperSlide();
        developerSlideTimer = 0;
    }
}

function showDeveloperSlide() {
    if (developerSlideShowing) return;
    
    developerSlideShowing = true;
    const slideElement = document.getElementById('developerSlide');
    if (slideElement) {
        slideElement.style.display = 'block';
        
        // Hide the slide after 5 seconds
        setTimeout(() => {
            slideElement.style.display = 'none';
            developerSlideShowing = false;
        }, 5000);
    }
}

function updateDeveloperSlide(deltaTime) {
    developerSlideTimer += deltaTime;
    
    // Show developer slide every 30 seconds during gameplay
    if (developerSlideTimer >= developerSlideInterval && !developerSlideShowing) {
        showDeveloperSlide();
        developerSlideTimer = 0;
    }
}

function showDeveloperSlide() {
    if (developerSlideShowing) return;
    
    developerSlideShowing = true;
    const slideElement = document.getElementById('developerSlide');
    if (slideElement) {
        slideElement.style.display = 'block';
        
        // Hide the slide after 5 seconds
        setTimeout(() => {
            slideElement.style.display = 'none';
            developerSlideShowing = false;
        }, 5000);
    }
}

function generateScoreImage() {
    // Create canvas for score card
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = 800;
    canvas.height = 1000;
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Border
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // Title
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🚀 SPACE DEFENDER', canvas.width / 2, 80);
    
    // Load and draw the actual school logo
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.onload = function() {
        // Draw the actual logo
        const logoSize = 120;
        ctx.save();
        ctx.drawImage(logoImg, canvas.width / 2 - logoSize / 2, 100, logoSize, logoSize);
        ctx.restore();
        
        // Add logo border
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 3;
        ctx.strokeRect(canvas.width / 2 - logoSize / 2, 100, logoSize, logoSize);
        
        // Continue with the rest of the image generation
        finishScoreImage(canvas, ctx);
    };
    
    logoImg.onerror = function() {
        // Fallback to text logo if image fails to load
        ctx.fillStyle = '#00ff88';
        ctx.fillRect(canvas.width / 2 - 60, 100, 120, 120);
        ctx.fillStyle = '#000';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('MIKFLO', canvas.width / 2, 150);
        ctx.font = 'bold 16px Arial';
        ctx.fillText('SCHOOL', canvas.width / 2, 180);
        
        // Continue with the rest of the image generation
        finishScoreImage(canvas, ctx);
    };
    
    // Try to load the logo
    logoImg.src = 'assets/images/mikflo-logo.png';
}

function finishScoreImage(canvas, ctx) {
    // Score section
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`SCORE: ${score}`, canvas.width / 2, 280);
    
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#00ff88';
    ctx.fillText(`Player: ${currentPlayerName}`, canvas.width / 2, 320);
    
    const levelIndex = Math.min(level - 1, educationalLevels.length - 1);
    const currentLevelName = educationalLevels[levelIndex];
    ctx.fillText(`Level: ${currentLevelName}`, canvas.width / 2, 360);
    
    // School information
    ctx.fillStyle = '#ffff00';
    ctx.font = 'bold 32px Arial';
    ctx.fillText(schoolDetails.name, canvas.width / 2, 420);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(schoolDetails.founded, canvas.width / 2, 450);
    
    // Contact info
    ctx.font = '18px Arial';
    ctx.fillStyle = '#00ff88';
    const lines = [
        schoolDetails.address,
        `📞 ${schoolDetails.phone}`,
        `📧 ${schoolDetails.email}`,
        '',
        '🎓 SERVICES OFFERED:',
        schoolDetails.services,
        '',
        '📚 CLASSES AVAILABLE:',
        schoolDetails.classes,
        '',
        '💯 Building Excellence through Character Development!',
        '🎯 Join our school for quality education!'
    ];
    
    let y = 490;
    ctx.textAlign = 'center';
    lines.forEach(line => {
        if (line.includes('SERVICES') || line.includes('CLASSES')) {
            ctx.fillStyle = '#ffff00';
            ctx.font = 'bold 20px Arial';
        } else if (line === '') {
            y += 10;
            return;
        } else {
            ctx.fillStyle = '#ffffff';
            ctx.font = '16px Arial';
        }
        
        // Split long lines
        if (line.length > 50) {
            const words = line.split(' ');
            let currentLine = '';
            words.forEach(word => {
                const testLine = currentLine + word + ' ';
                const metrics = ctx.measureText(testLine);
                if (metrics.width > canvas.width - 40 && currentLine !== '') {
                    ctx.fillText(currentLine.trim(), canvas.width / 2, y);
                    y += 25;
                    currentLine = word + ' ';
                } else {
                    currentLine = testLine;
                }
            });
            if (currentLine.trim() !== '') {
                ctx.fillText(currentLine.trim(), canvas.width / 2, y);
            }
        } else {
            ctx.fillText(line, canvas.width / 2, y);
        }
        y += 25;
    });
    
    // Hashtags
    ctx.fillStyle = '#0099ff';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('#MikfloSchool #QualityEducation #SpaceDefender #BeninCity', canvas.width / 2, y + 20);
    
    // Show the generated image
    showScoreImage(canvas);
}

function showScoreImage(canvas) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.95); z-index: 5000; display: flex;
        flex-direction: column; justify-content: center; align-items: center;
        padding: 20px; overflow: auto;
    `;
    
    const img = document.createElement('img');
    img.src = canvas.toDataURL();
    img.style.cssText = `
        max-width: 90%; max-height: 70%; border: 2px solid #00ff88;
        border-radius: 10px; background: white;
    `;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex; gap: 15px; margin-top: 20px; flex-wrap: wrap;
        justify-content: center;
    `;
    
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'DOWNLOAD IMAGE';
    downloadBtn.style.cssText = `
        background: #00ff88; color: #000; border: none; padding: 12px 20px;
        border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px;
    `;
    downloadBtn.onclick = () => {
        const link = document.createElement('a');
        link.download = `mikflo-space-defender-score-${score}.png`;
        link.href = canvas.toDataURL();
        link.click();
    };
    
    const shareBtn = document.createElement('button');
    shareBtn.textContent = 'SHARE IMAGE';
    shareBtn.style.cssText = `
        background: #0099ff; color: #000; border: none; padding: 12px 20px;
        border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px;
    `;
    shareBtn.onclick = () => {
        canvas.toBlob(blob => {
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'score.png', { type: 'image/png' })] })) {
                navigator.share({
                    title: 'My Space Defender Score - Mikflo School',
                    text: `I scored ${score} points! Join Mikflo School for quality education.`,
                    files: [new File([blob], 'mikflo-score.png', { type: 'image/png' })]
                }).catch(console.error);
            } else {
                alert('Image ready! Use the download button to save and share manually.');
            }
        });
    };
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'CLOSE';
    closeBtn.style.cssText = `
        background: #ff4444; color: #fff; border: none; padding: 12px 20px;
        border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px;
    `;
    closeBtn.onclick = () => modal.remove();
    
    buttonContainer.appendChild(downloadBtn);
    buttonContainer.appendChild(shareBtn);
    buttonContainer.appendChild(closeBtn);
    
    modal.appendChild(img);
    modal.appendChild(buttonContainer);
    document.body.appendChild(modal);
}



// Start the game when the page loads
document.addEventListener('DOMContentLoaded', init);
