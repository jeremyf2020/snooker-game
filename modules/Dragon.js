class Dragon {
    constructor() {
        this.imageWidth = 1150;
        this.imageHeight = 778;
        this.x = window.innerWidth / 2; // Initial x-coordinate (centered)
        this.y = ui.topY; // Start at the bottom of the screen
        this.scale = window.innerWidth / this.imageWidth * 0.6; // Scale based on window width
        this.isMoving = true; // Controls whether the dragon moves
        this.wishes = {
            "S+": ["Score +70", "opponent's score -60"],
            "S": ["Score +50", "opponent's score -40"],
            "A": ["Score +30", "opponent's score -25", "free ball in every turn"],
            "B": ["Score +25", "opponent's score -20", "control the force manually"],
            "C": ["Score +20", "opponent's score -15", "free ball in every round"],
            "D": ["Score +15", "opponent's score -10", "random all balls", "blind your opponent"],
            "E": ["Score +10", "opponent's score -5", "random color balls", "random red balls"],
        }
        this.selectedWishes = []; // Store the selected wishes
        this.generateWishes(); // Generate wishes during initialization
    }

    summon() {
        push();
        resetMatrix();

        const scaledWidth = this.imageWidth * this.scale;
        const scaledHeight = this.imageHeight * this.scale;

        // Draw the image centered horizontally
        image(
            dragonImage,
            this.x - scaledWidth / 2, // Center horizontally
            this.y - scaledHeight / 2, // Current vertical position
            scaledWidth,
            scaledHeight
        );

        pop();
        this.moveUp();
        if (!dragon.isMoving) {
            dragon.drawWishes();
        }

    }

    moveUp(speed = 2) {
        if (this.isMoving) {
            this.y -= speed; // Move up by decreasing y-coordinate

            // Stop moving when the dragon reaches the top
            if (this.y - this.imageHeight * this.scale / 2 <= 0) {
                this.isMoving = false; // Stop the movement
                this.y = this.imageHeight * this.scale / 2; // Ensure it stops exactly at the top
            }
        }
    }

    generateWishes() {
        const levels = Object.keys(this.wishes);
        const weights = [1, 2, 4, 8, 16, 32, 64]; // Weights for each level, higher is lower chance
        const weightedPool = [];

        // Create a weighted pool of wishes
        levels.forEach((level, index) => {
            const weight = weights[index];
            for (let i = 0; i < weight; i++) {
                weightedPool.push(level);
            }
        });

        // Randomly select 3 wishes
        this.selectedWishes = [];
        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * weightedPool.length);
            const selectedLevel = weightedPool[randomIndex];
            const wish = this.wishes[selectedLevel][Math.floor(Math.random() * this.wishes[selectedLevel].length)];
            this.selectedWishes.push(wish);
        }
    }

    drawWishes() {
        const rectWidth = 200;
        const rectHeight = 50;
        const startX = this.x - rectWidth / 2; // Center horizontally
        const startY = this.y + this.imageHeight * this.scale / 2 + 20; // Position below the dragon
        const glowSize = 15; // Glow size for aura

        push();
        textAlign(CENTER, CENTER);
        textSize(18);
        strokeWeight(2);

        // Draw the wishes in glowing boxes
        this.selectedWishes.forEach((wish, index) => {
            const x = startX;
            const y = startY + index * (rectHeight + 20);

            // Glowing aura
            for (let i = glowSize; i > 0; i -= 5) {
                fill(255, 204, 0, 100 - i * 6); // Semi-transparent golden glow
                noStroke();
                rect(x - i / 2, y - i / 2, rectWidth + i, rectHeight + i, 10); // Rounded corners
            }

            // Main rectangle
            fill(255, 140, 0); // Bright orange
            stroke(255, 215, 0); // Gold stroke
            rect(x, y, rectWidth, rectHeight, 10); // Rounded rectangle

            // Text and star
            fill(255); // White text
            noStroke();
            text(wish, x + rectWidth / 2, y + rectHeight / 2);

        });

        pop();
    }


}
