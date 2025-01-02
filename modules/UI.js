class UI {
    constructor() {
        /* define all the variable of pos and size etc., calcuting in constuctor will only cal once */

        // core (table)
        this.coreWidth = window.innerWidth * 0.6;
        this.coreX = (window.innerWidth - this.coreWidth) / 2;
        this.tableStartY = window.innerHeight / 2 - this.coreWidth / 4;
        // margin
        this.margin = 15;
        // other areas
        this.maxAreaHeight = window.innerHeight / 2 - this.coreWidth / 4 - this.margin * 2; // cal potential max height
        this.areaHeight = this.maxAreaHeight > 90 ? 90 : this.maxAreaHeight; // scale the area if screen have no enough space
        /* top area pos Y */
        this.topY = this.tableStartY - this.areaHeight - this.margin;
        /* bot area pos Y */
        this.bottomStartY = window.innerHeight / 2 + this.coreWidth / 4 + this.margin;

        // force area
        this.force = 0.5; // Half the width of the table
        this.forceIsRunning = false;
    }
    draw() {
        // almond color bg
        background(233, 227, 206);
        noStroke();
        // change the starting position, leave left (and right) have enough spacing
        translate(this.coreX, 0);

        /* areas above the table */
        // draw player areas (player, areaWidth, areaHeight, posX)
        this.drawPlayer(game.players[0], (this.coreWidth - this.margin * 2) / 3, this.areaHeight, 0);
        this.drawPlayer(game.players[1], (this.coreWidth - this.margin * 2) / 3, this.areaHeight, this.coreWidth - (this.coreWidth - this.margin * 2) / 3);
        // Draw the force area 
        this.drawForceArea();

        // draw instuction on the right side
        this.drawInstuctions();
        // draw message board and reaction board (target & collision) on the bottom
        this.drawBottomAreas();
    }

    drawForceArea() {
        push();
        // create a linear gradient for the force area
        let gradientBg = drawingContext.createLinearGradient(this.coreX, this.topY, this.coreX + this.coreWidth / 3, this.topY);
        // Add gradient color stops: yellow, orangered, red (from p5js turtorial)
        gradientBg.addColorStop(0, 'yellow');
        gradientBg.addColorStop(0.8, 'orangered');
        gradientBg.addColorStop(1, 'red');
        // Apply the gradient as the fill style
        drawingContext.fillStyle = gradientBg;
        noStroke();
        // Draw the rectangle using the gradient
        const width = this.coreWidth / 3 * 0.8;
        const margin = this.coreWidth / 3 * 0.1;
        const oscillationHeight = this.areaHeight * 0.1;
        rect(this.coreX + margin, this.topY + this.areaHeight * 0.8, width, oscillationHeight);

        push();
        textSize(25);
        textFont(dragonBallFont);
        text('FORCE', this.coreX + margin + width / 2, this.topY + this.areaHeight * 0.6);
        pop();

        if (this.forceIsRunning) {
            // Draw the force indicator
            let oscillationSpeed = 0.08; // Speed of oscillation 
            this.force = 0.5 + cos(frameCount * oscillationSpeed) * 0.5;
        }
        // Calculate dX based on force
        this.dX = this.force * width; // Translate force to x-coordinate
        // Draw the force indicator
        fill(255);
        ellipse(
            this.coreX + margin + this.dX,
            this.topY + this.areaHeight * 0.8 + oscillationHeight / 2,
            15, 15
        );


        pop();



    }
    resetForce() {
        ui.forceIsSelected = false;
        ui.forceIsRunning = false;
    }

    drawPlayer(player, areaWidth, areaHeight, posX) {
        /* draw player areas */
        // show sharper color to tell user which player is in ctrl
        if (game.currentPlayer === player) {
            const glowSize = 15; // Glow size for the aura
            // Draw glowing aura around the player area
            push();
            for (let i = glowSize; i > 0; i -= 3) {
                noStroke();
                fill(255, 215, 0, 50 - i * 3); // Semi-transparent golden glow
                rect(
                    posX - i / 2,
                    this.topY - i / 2,
                    areaWidth + i,
                    areaHeight + i,
                    10 // Rounded corners
                );
            }
            pop();

            // Draw gold stroke around the player area
            strokeWeight(1);
            stroke(255, 215, 0); // Gold stroke
        }
        fill(game.currentPlayer === player ? "orange" : '#A8A6A7');
        rect(posX, this.topY, areaWidth, areaHeight, 10);
        noStroke();
        fill('#1c4595');
        textSize(20);
        textAlign(CENTER, CENTER);
        // Draw "Player 1" text
        push();
        textFont(dragonBallFont);
        // Draw "Player" text
        text(`Player ${player.name}`, posX + areaWidth / 2, this.topY + this.areaHeight / 4);

        // Draw "Score: "
        let scoreText = `Score: `;
        let scoreTextWidth = textWidth(scoreText); // Calculate width of "Score: "
        textFont(dragonBallFont);
        text(scoreText, posX + areaWidth / 2, this.topY + this.areaHeight / 4 * 2);

        // Switch to a font that supports numbers for the score
        textFont('Roboto');
        textStyle(BOLD);

        fill(255)
        text(player.score, posX + areaWidth / 2 + scoreTextWidth / 2, this.topY + this.areaHeight / 4 * 2 + this.margin / 5);
        pop();

        // Draw collected dragon balls
        const ballSize = 20; // Size of each dragon ball icon
        const startX = posX - 5; // Starting x-position for the balls
        const startY = this.topY + this.areaHeight - ballSize - 10; // y-position for the balls
        const spacing = ballSize + 5; // Spacing between balls

        for (let i = 1; i < player.pottedBalls + 1; i++) {
            const star = i; // Assume this array contains star numbers (1-7)
            const posX = startX + i * spacing;
            const posY = startY;

            // Draw the dragon ball using the DragonBall class
            dragonBall.getStarBallImage(star, ballSize, posX, posY);
        }
    }

    drawInstuctions() {
        const startingX = this.coreWidth + this.margin;
        push();
        textSize(14);
        textAlign(LEFT, TOP);
        fill(135, 101, 78)

        text('⌨️ Keyboard Control', startingX, this.tableStartY);
        text('1️⃣ Tranditional Positions', startingX + 20, this.tableStartY + 20);
        text('2️⃣ Random red 🔴', startingX + 20, this.tableStartY + 40);
        text('3️⃣ Random all 🟡🟢🔵', startingX + 20, this.tableStartY + 60);
        text('4️⃣', startingX + 20, this.tableStartY + 80);

        push();
        textFont(dragonBallFont);
        fill('red')
        text('Dragon Ball Mode', startingX + 45, this.tableStartY + 80);
        pop();

        text('⬆️⬇️ Control cue 🦯', startingX + 20, this.tableStartY + 100);
        text('⬅️➡️ Adjust cue Position', startingX + 20, this.tableStartY + 120);
        text('WASD: Move cue ball ⚪', startingX + 20, this.tableStartY + 140);
        text('Z: Move ⚪ to D-zone', startingX + 20, this.tableStartY + 160);
        text('X: Place cue ball ⚪', startingX + 20, this.tableStartY + 180);

        text('🖱️ Mouse Control', startingX, this.tableStartY + 220);
        text('Move: Move cue ball ⚪', startingX + 20, this.tableStartY + 240);
        text('Left: Control cue 🦯', startingX + 20, this.tableStartY + 260);
        text('Right: Shoot 💥', startingX + 20, this.tableStartY + 280);

        pop();

    }

    get cueBallCollision() {
        return ballPool.cueBall ? ballPool.cueBall.collision : null;
    }

    drawBottomAreas() {
        const areaWidth = (this.coreWidth - this.margin) / 2;
        // const this.areaHeight = this.maxAreaHeight > 90 ? 90 : this.maxAreaHeight;
        const maxMessages = Math.floor(this.areaHeight / 20) < game.board.length ? Math.floor(this.areaHeight / 20) : game.board.length;

        // Left area: Game board messages
        push();
        fill(0);
        stroke('grey');
        strokeWeight(4)
        rect(0, this.bottomStartY, areaWidth, this.areaHeight);
        noStroke()
        fill('palegreen'); // Green text
        textSize(16);
        textAlign(LEFT, TOP);
        textFont('Courier New', 12);

        for (let i = maxMessages - 1; i >= 0; i--) {
            text(`${game.board[i]}`, 10, this.bottomStartY + 10 + i * 18);
        }
        pop();

        // Right area: Cue Collision
        push();
        stroke(135, 101, 78);
        strokeWeight(2);
        noFill();
        line();
        fill(135, 101, 78)
        noStroke(0)
        textSize(16);
        textAlign(LEFT, TOP);

        // Texts:
        textFont(dragonBallFont);
        textAlign(CENTER, TOP);

        // Right area: Reaction board
        const rightAreaStartX = areaWidth + this.margin;
        const columnWidth = (this.coreWidth - rightAreaStartX) / 4;
        const rowHeight = 20;
        const padding = 2;
        text('Target', rightAreaStartX + columnWidth * 0.5, this.bottomStartY);// columnWidth *0.5 because of center align
        text('Cue ball Collision', rightAreaStartX + columnWidth * 2.5, this.bottomStartY);
        text('Cushion', rightAreaStartX + columnWidth * 1.5, this.bottomStartY + rowHeight + 5);
        text('Red', rightAreaStartX + columnWidth * 2.5, this.bottomStartY + rowHeight + 5);
        text('Color', rightAreaStartX + columnWidth * 3.5, this.bottomStartY + rowHeight + 5);
        // Lines:
        stroke(135, 101, 78);
        strokeWeight(3);
        line(rightAreaStartX, this.bottomStartY + rowHeight, this.coreWidth, this.bottomStartY + rowHeight); // horizontal line
        line(rightAreaStartX + columnWidth, this.bottomStartY, rightAreaStartX + columnWidth, this.bottomStartY + this.areaHeight); // vertical lines
        // thin lines
        strokeWeight(1);
        line(rightAreaStartX + columnWidth, this.bottomStartY + rowHeight * 2 + padding, this.coreWidth, this.bottomStartY + rowHeight * 2 + padding); // 2nd horizontal line 
        line(rightAreaStartX + columnWidth * 2, this.bottomStartY + rowHeight, rightAreaStartX + columnWidth * 2, this.bottomStartY + this.areaHeight); // vertical lines
        line(rightAreaStartX + columnWidth * 3, this.bottomStartY + rowHeight, rightAreaStartX + columnWidth * 3, this.bottomStartY + this.areaHeight); // vertical lines
        // balls
        noStroke();

        // target ball
        if (game.validBall) {
            fill(game.validBall)
            ellipse(rightAreaStartX + columnWidth * 0.5, this.bottomStartY + (this.areaHeight + rowHeight) / 2, 20, 20);
        }
        if (!this.cueBallCollision) {
            pop();
            return
        }
        fill(this.cueBallCollision)
        if (this.cueBallCollision == 'darkgreen') {
            rectMode(CENTER)
            rect(rightAreaStartX + columnWidth * 1.5, this.bottomStartY + (this.areaHeight + padding + rowHeight * 2) / 2, 20, 20);
        } else if (this.cueBallCollision == 'red') {
            ellipse(rightAreaStartX + columnWidth * 2.5, this.bottomStartY + (this.areaHeight + padding + rowHeight * 2) / 2, 20, 20);
        } else {
            ellipse(rightAreaStartX + columnWidth * 3.5, this.bottomStartY + (this.areaHeight + padding + rowHeight * 2) / 2, 20, 20);
        }
        pop();
    }

}

