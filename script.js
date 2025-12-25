document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle icon between bars and times (X)
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            if(navLinks) navLinks.classList.remove('active'); // Close menu on click

            const target = document.querySelector(this.getAttribute('href'));
            if(target){
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Snake Game Logic ---
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const startBtn = document.getElementById('start-btn');

    // Game Variables
    const gridSize = 20; // Size of one square
    const tileCount = canvas.width / gridSize;
    let score = 0;
    let gameInterval;
    let isGameRunning = false;

    // Snake & Food
    let snake = [];
    let food = { x: 15, y: 15 };

    // Velocity (Direction)
    let dx = 0;
    let dy = 0;

    // Initialize Game State
    function initGame() {
        snake = [{ x: 10, y: 10 }]; // Start in middle
        food = { x: 5, y: 5 };
        score = 0;
        dx = 0;
        dy = 0;
        scoreEl.innerText = score;
        isGameRunning = true;
        startBtn.innerText = "Restart";
        placeFood(); // Ensure food isn't on start position
    }

    // Game Loop
    function gameLoop() {
        if (!isGameRunning) return;
        update();
        draw();
    }

    function start() {
        if (gameInterval) clearInterval(gameInterval);
        initGame();
        // Run game loop every 100ms
        gameInterval = setInterval(gameLoop, 100);
    }

    // Update Game State
    function update() {
        if (dx === 0 && dy === 0) return; // Don't move until key press

        // Move Head
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };

        // Wall Collision (Wrap around)
        if (head.x < 0) head.x = tileCount - 1;
        if (head.x >= tileCount) head.x = 0;
        if (head.y < 0) head.y = tileCount - 1;
        if (head.y >= tileCount) head.y = 0;

        // Check Self Collision
        for (let i = 0; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver();
                return;
            }
        }

        snake.unshift(head); // Add new head

        // Check Food Collision
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreEl.innerText = score;
            placeFood();
        } else {
            snake.pop(); // Remove tail if not eating
        }
    }

    // Draw Everything
    function draw() {
        // Clear Canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Food
        ctx.fillStyle = '#ff0055'; // Red/Pink Food
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#ff0055";
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
        ctx.shadowBlur = 0; // Reset shadow

        // Draw Snake
        snake.forEach((part, index) => {
            // Head is white, body is cyan
            if (index === 0) {
                ctx.fillStyle = '#ffffff';
            } else {
                ctx.fillStyle = '#00d4ff';
            }
            
            ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
        });
    }

    function placeFood() {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);
        
        // Don't place food on snake body
        snake.forEach(part => {
            if (part.x === food.x && part.y === food.y) placeFood();
        });
    }

    function gameOver() {
        isGameRunning = false;
        clearInterval(gameInterval);
        alert(`Game Over! Score: ${score}`);
        startBtn.innerText = "Play Again";
    }

    // Input Handling (Keyboard)
    document.addEventListener('keydown', changeDirection);
    if(startBtn) startBtn.addEventListener('click', start);

    // Button Listeners for Mobile (Touch)
    const upBtn = document.getElementById('up-btn');
    const downBtn = document.getElementById('down-btn');
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');

    if(upBtn) upBtn.addEventListener('click', () => changeDirection({key: 'ArrowUp'}));
    if(downBtn) downBtn.addEventListener('click', () => changeDirection({key: 'ArrowDown'}));
    if(leftBtn) leftBtn.addEventListener('click', () => changeDirection({key: 'ArrowLeft'}));
    if(rightBtn) rightBtn.addEventListener('click', () => changeDirection({key: 'ArrowRight'}));

    function changeDirection(event) {
        if (!isGameRunning) return;

        const LEFT_KEY = 'ArrowLeft';
        const RIGHT_KEY = 'ArrowRight';
        const UP_KEY = 'ArrowUp';
        const DOWN_KEY = 'ArrowDown';

        // Prevent reversing
        const goingUp = dy === -1;
        const goingDown = dy === 1;
        const goingRight = dx === 1;
        const goingLeft = dx === -1;

        if (event.key === LEFT_KEY && !goingRight) { dx = -1; dy = 0; }
        if (event.key === UP_KEY && !goingDown) { dx = 0; dy = -1; }
        if (event.key === RIGHT_KEY && !goingLeft) { dx = 1; dy = 0; }
        if (event.key === DOWN_KEY && !goingUp) { dx = 0; dy = 1; }
    }
});

// --- FAQ Accordion Logic ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other items (Optional - remove this block if you want multiple open at once)
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            // Toggle current item
            item.classList.toggle('active');
            
            const answer = item.querySelector('.faq-answer');
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = null;
            }
        });
    });