
class Dragon {
    constructor() {
        this.isSummoned = true;
        this.imageWidth = 1150;
        this.imageHeight = 778;
        this.x = window.innerWidth / 2; // Initial x-coordinate (centered)
        this.y = window.innerHeight; // Start at the bottom of the screen
        this.scale = window.innerWidth / this.imageWidth * 0.6; // Scale based on window width
        this.scaledWidth = this.imageWidth * this.scale;
        this.scaledHeight = this.imageHeight * this.scale;

        this.isMoving = true; // Controls whether the dragon moves
        this.selectedWishes = []; // Store the selected wishes
        this.currentWish = null; // Store the currently hovered wish
        this.finishSummoning = false; // Flag to indicate summoning completion
        this.wishes = {
            "S+": [
                "Score +70",
                "opponent's score -60"
            ],
            "S": [
                "Score +50",
                "opponent's score -40"
            ],
            "A": [
                "Score +30",
                "opponent's score -25",
                // "free ball in every turn"
            ],
            "B": [
                "Score +25",
                "opponent's score -20",
                // "control the force manually"
            ],
            "C": [
                "Score +20",
                "opponent's score -15",
                // "free ball in every round"
            ],
            "D": [
                "Score +15",
                "opponent's score -10",
                // "random all balls",
                // "blind your opponent"
            ],
            "E": [
                "Score +10",
                "opponent's score -5",
                // "random color balls",
                // "random red balls"
            ],
        };
        this.generateWishes(); // Generate wishes during initialization
    }

    summon() {
        push();
        resetMatrix();

        this.drawCloud(); // Update and draw the cloud

        // Draw the image centered horizontally
        image(
            dragonImage,
            this.x - this.scaledWidth / 2, // Center horizontally
            this.y - this.scaledHeight / 2, // Current vertical position
            this.scaledWidth,
            this.scaledHeight
        );

        this.moveUp(6);
        if (!dragon.isMoving && !this.finishSummoning) {
            dragon.drawWishes();
        }

        pop();
    }

    moveUp(speed = 2) {
        if (this.isMoving) {
            this.y -= speed; // Move up by decreasing y-coordinate

            // Stop moving when the dragon reaches the top
            if (this.y - this.imageHeight * this.scale / 2 <= ui.topY) {
                this.isMoving = false; // Stop the movement
                this.y = this.imageHeight * this.scale / 2 + ui.topY; // Ensure it stops exactly at the top
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
        const rectWidth = 400;
        const rectHeight = 50;
        const startX = this.x - rectWidth / 2; // Center horizontally
        const startY = this.y; // Position on the middle of the dragon
        const glowSize = 15; // Glow size for aura

        push();
        textFont(dragonBallFont);
        textAlign(CENTER, CENTER);
        textSize(50);
        stroke(255);
        strokeWeight(10);
        fill('red');
        text("Speak your wish", startX + rectWidth / 2, startY - rectHeight);
        pop();

        push();
        textAlign(CENTER, CENTER);
        textSize(18);
        strokeWeight(2);

        // Draw the wishes in glowing boxes
        this.selectedWishes.forEach((wish, index) => {
            const x = startX;
            const y = startY + index * (rectHeight + 20);

            // Check for mouse hover
            const isHovered =
                mouseX > x &&
                mouseX < x + rectWidth &&
                mouseY > y &&
                mouseY < y + rectHeight;


            for (let i = glowSize; i > 0; i -= 5) {
                fill(255, 204, 0, 100 - i * 6); // Semi-transparent golden glow
                noStroke();
                rect(x - i / 2, y - i / 2, rectWidth + i, rectHeight + i, 10); // Rounded corners
            }
            stroke(255, 215, 0); // Gold stroke

            // Highlight the hovered wish
            if (isHovered) {
                this.currentWish = wish; // Set the hovered wish
                // fill(7, 148, 215);
                fill(201, 18, 39);
                cursor(HAND);
            } else {
                fill(255, 140, 0); // Bright orange
            }

            // Draw the rectangle
            rect(x, y, rectWidth, rectHeight, 10); // Rounded rectangle



            // Draw the text
            fill(255); // White text
            noStroke();
            text(wish, x + rectWidth / 2, y + rectHeight / 2);
        });

        pop();
    }

    handleWishSelection() {
        if (this.currentWish) {
            // console.log(`Executing wish: ${this.currentWish}`);
            this.finishSummoning = true; // Mark summoning as complete
            this.isSummoned = false; // Disable summoning

            // Handle "Score +" wishes
            const scoreIncreaseMatch = this.currentWish.match(/Score \+(\d+)/);
            if (scoreIncreaseMatch) {
                const increaseAmount = parseInt(scoreIncreaseMatch[1]);
                game.player.score += increaseAmount; // Increase the player's score
                game.addMessage(`Player's score increased by ${increaseAmount}`);
                return;
            }

            // Handle "opponent's score -" wishes
            const scoreDecreaseMatch = this.currentWish.match(/opponent's score -(\d+)/);
            if (scoreDecreaseMatch) {
                const decreaseAmount = parseInt(scoreDecreaseMatch[1]);
                const opponent = game.players.find(player => player !== game.player);

                opponent.score -= decreaseAmount; // Decrease the opponent's score
                game.addMessage(`Opponent's score decreased by ${decreaseAmount}`);
                return;
            }

            // Handle other wishes (to be implemented individually)
            // if (this.currentWish === "free ball in every turn") {
            //     game.addMessage("Free ball in every turn activated!");
            //     // Implement the logic here
            // } else if (this.currentWish === "control the force manually") {
            //     game.addMessage("Player can control the force manually!");
            //     // Implement the logic here
            // } else if (this.currentWish === "random all balls") {
            //     game.addMessage("Randomizing all balls!");
            //     // Implement the logic here
            // } else if (this.currentWish === "blind your opponent") {
            //     game.addMessage("Opponent is blinded!");
            //     // Implement the logic here
            // } else if (this.currentWish === "random color balls") {
            //     game.addMessage("Randomizing color balls!");
            //     // Implement the logic here
            // } else if (this.currentWish === "random red balls") {
            //     game.addMessage("Randomizing red balls!");
            //     // Implement the logic here
            // }
        }
    }

    drawCloud() {
        let noiseScale = 0.01; // Slightly coarser noise for faster calculations
        let stepSize = 14; // Larger step size for fewer iterations
        let maxBlobSize = 40; // Maximum size of the blobs
        let minBlobSize = 20; // Minimum size of the blobs
        let cloudDensity = 5; // Reduced density for better performance

        noStroke(); // No outline for smooth cloud blending

        // Iterate through the cloud area
        for (let x = 0; x < width; x += stepSize) {
            // Calculate dynamic cloud height based on x position
            let maxHeight = map(x, 0, width / 2, window.innerHeight / 2, ui.bottomStartY);
            if (x > width / 2) {
                maxHeight = map(x, width / 2, width, ui.bottomStartY, window.innerHeight / 2);
            }

            for (let y = Math.floor(maxHeight); y < window.innerHeight; y += stepSize) {
                // Scale the input coordinates for Perlin noise
                let nx = noiseScale * x;
                let ny = noiseScale * y;
                let nt = noiseScale * frameCount;

                // Compute the base noise value
                let noiseValue = noise(nx, ny, nt);

                // Map the noise value to color and blob size
                let r = map(noiseValue, 0, 1, 173, 255);
                let g = map(noiseValue, 0, 1, 216, 255);
                let b = map(noiseValue, 0, 1, 230, 255);
                let blobSize = map(noiseValue, 0, 1, minBlobSize, maxBlobSize);

                // Set the fill color with transparency
                fill(r, g, b, 180); // Slight transparency for blending

                // Draw fewer overlapping blobs for better performance
                for (let i = 0; i < cloudDensity; i++) {
                    let offsetX = random(-stepSize / 2, stepSize / 2); // Small random jitter
                    let offsetY = random(-stepSize / 2, stepSize / 2);
                    ellipse(x + offsetX, y + offsetY, blobSize, blobSize);
                }
            }
        }
    }

}
