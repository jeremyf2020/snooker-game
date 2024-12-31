class UI {
    constructor() {
        this.coreWidth = window.innerWidth * 0.6;
        this.coreX = (window.innerWidth - this.coreWidth) / 2;
        this.tableStartY = window.innerHeight / 2 - this.coreWidth / 4;
        this.margin = 15;
        this.maxAreaHeight = window.innerHeight / 2 - this.coreWidth / 4 - this.margin * 2;
        this.areaHeight = this.maxAreaHeight > 90 ? 90 : this.maxAreaHeight;
        // this.topAreaHeight = 100;
        this.topY = this.tableStartY - this.areaHeight;

        this.bottomStartY = window.innerHeight / 2 + this.coreWidth / 4 + this.margin; // 20px margin from bottom
    }

    drawPlayer(player, areaWidth, areaHeight, posX) {

        if (game.player === player) {
            strokeWeight(5);
            stroke(255, 215, 0); // Gold stroke
        }
        fill(game.player === player ? 'orange' : 'grey');
        rect(posX, this.topY, areaWidth, areaHeight);
        noStroke();
        fill(255);
        // textFont(dragonBallFont);
        textSize(20);
        textAlign(CENTER, CENTER);

        // Draw "Player 1" text
        text(`Player ${player.name}`, posX + areaWidth / 2, this.topY + this.areaHeight / 3);

        // Draw "Score: "
        text(`Score: ${player.score}`, posX + areaWidth / 2, this.topY + this.areaHeight / 3 * 2);
        // push();
        // textFont(dragonBallFont);
        // text(`FORCE`, posX + areaWidth / 2, this.topY + 80);
        // pop();

        // Draw "Dragon Balls" as circles
        const ballRadius = 10; // Radius of each circle
        const balls = 3; // Number of dragon balls
        const ballsStartX = posX + areaWidth / 2 - (balls * ballRadius * 2) / 2; // Center balls
        const ballsY = this.topY + 80;

        for (let i = 0; i < player.pottedBalls.length; i++) {
            fill(255, 204, 0); // Yellow for dragon balls
            ellipse(ballsStartX + i * ballRadius * 2, this.margin, ballRadius * 2, ballRadius * 2);
        }
    }

    drawInstuctions() {
        const startingX = this.coreWidth + this.margin;
        push();
        textSize(14);
        textAlign(LEFT, TOP);
        fill(135, 101, 78)

        text('⌨️ Keyboard Control', startingX, this.tableStartY);
        // textFont(dragonBallFont);
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
        const botAreaHeight = this.maxAreaHeight > 90 ? 90 : this.maxAreaHeight;
        const maxMessages = Math.floor(botAreaHeight / 20) < game.board.length ? Math.floor(botAreaHeight / 20) : game.board.length;

        // Left area: Game board messages
        push();
        fill(0);
        stroke('grey');
        strokeWeight(4)
        rect(0, this.bottomStartY, areaWidth, botAreaHeight);
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
        // rect(areaWidth + this.margin, 0, 50, 50)
        fill(135, 101, 78)
        noStroke(0)
        textSize(16);
        textAlign(LEFT, TOP);

        // Texts:
        textFont(dragonBallFont);
        textAlign(CENTER, TOP);
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
        line(rightAreaStartX + columnWidth, this.bottomStartY, rightAreaStartX + columnWidth, this.bottomStartY + botAreaHeight); // vertical lines
        // thin lines
        strokeWeight(1);
        line(rightAreaStartX + columnWidth, this.bottomStartY + rowHeight * 2 + padding, this.coreWidth, this.bottomStartY + rowHeight * 2 + padding); // 2nd horizontal line 
        line(rightAreaStartX + columnWidth * 2, this.bottomStartY + rowHeight, rightAreaStartX + columnWidth * 2, this.bottomStartY + botAreaHeight); // vertical lines
        line(rightAreaStartX + columnWidth * 3, this.bottomStartY + rowHeight, rightAreaStartX + columnWidth * 3, this.bottomStartY + botAreaHeight); // vertical lines
        // balls
        noStroke();

        // target ball
        if (game.validBall) {
            fill(game.validBall)
            ellipse(rightAreaStartX + columnWidth * 0.5, this.bottomStartY + (botAreaHeight + rowHeight) / 2, 20, 20);
        }
        if (!this.cueBallCollision) {
            pop();
            return
        }
        fill(this.cueBallCollision)
        if (this.cueBallCollision == 'darkgreen') {
            rectMode(CENTER)
            rect(rightAreaStartX + columnWidth * 1.5, this.bottomStartY + (botAreaHeight + padding + rowHeight * 2) / 2, 20, 20);
        } else if (this.cueBallCollision == 'red') {
            ellipse(rightAreaStartX + columnWidth * 2.5, this.bottomStartY + (botAreaHeight + padding + rowHeight * 2) / 2, 20, 20);
        } else {
            ellipse(rightAreaStartX + columnWidth * 3.5, this.bottomStartY + (botAreaHeight + padding + rowHeight * 2) / 2, 20, 20);
        }
        pop();
    }

    draw() {
        // almond color bg
        background(233, 227, 206);
        noStroke();
        // change the starting position, leave left (and right) have enough spacing
        translate(this.coreX, 0);

        /* areas above the table */
        // draw player areas
        this.drawPlayer(game.players[0], (this.coreWidth - this.margin * 2) / 3, this.areaHeight, 0);
        this.drawPlayer(game.players[1], (this.coreWidth - this.margin * 2) / 3, this.areaHeight, this.coreWidth - (this.coreWidth - this.margin * 2) / 3);
        this.drawInstuctions();

        this.drawBottomAreas();

    }
}

