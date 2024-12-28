class UI {
    constructor() {
        this.coreWidth = window.innerWidth * 0.6;
        this.coreX = (window.innerWidth - this.coreWidth) / 2;
        this.tableStartY = window.innerHeight / 2 - this.coreWidth / 4;
        this.margin = 15;
        this.areaHeight = (window.innerHeight - this.coreWidth / 2) / 2 - this.margin * 2;
        this.topAreaHeight = 100;
        this.topY = this.tableStartY - this.topAreaHeight;

        this.bottomStartY = window.innerHeight / 2 + this.coreWidth / 4 + this.margin; // 20px margin from bottom
    }

    drawPlayer(player, areaWidth, areaHeight, posX) {

        fill(game.player === player ? 'lightblue' : 'lightgrey')
        rect(posX, this.topY, areaWidth, areaHeight);
        fill(0);
        // textFont(dragonBallFont);
        textSize(20);
        textAlign(CENTER, CENTER);

        // Draw "Player 1" text
        text(`Player ${player.name}`, posX + areaWidth / 2, this.topY + 20);

        // Draw "Score: "
        text(`Score: ${player.score}`, posX + areaWidth / 2, this.topY + 50);
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

    drawBottomAreas() {
        const areaWidth = (this.coreWidth - this.margin) / 2;
        const botAreaHeight = window.innerHeight - this.bottomStartY - this.margin * 4;
        const maxMessages = Math.floor(botAreaHeight / 20) < game.board.length - 1 ? Math.floor(botAreaHeight / 20) : game.board.length - 1;

        // Left area: Game board messages
        push();
        fill(0);
        stroke('grey');
        strokeWeight(4)
        rect(0, this.bottomStartY, areaWidth, window.innerHeight - this.bottomStartY - this.margin * 2);
        noStroke()
        fill('green'); // Green text
        textSize(16);
        textAlign(LEFT, TOP);
        for (let i = maxMessages; i >= 0; i--) {
            text(`- ${game.board[i]}`, 10, this.bottomStartY + 10 + i * 20);
        }
        pop();

        // Right area: Player controls
        push();
        textSize(14);
        textAlign(LEFT, TOP);
        text('⌨️', areaWidth + this.margin, this.bottomStartY);
        // textFont(dragonBallFont);
        text('1️⃣ Tranditional Positions', areaWidth + 20 + this.margin, this.bottomStartY);
        text('2️⃣ Random red', areaWidth + 20 + this.margin, this.bottomStartY + 20);
        text('3️⃣ Random all', areaWidth + 20 + this.margin, this.bottomStartY + 40);
        text('4️⃣ Dragon Ball Mode', areaWidth + 20 + this.margin, this.bottomStartY + 60);
        text('⬆️⬇️ Move cue constantly', areaWidth + 20 + this.margin, this.bottomStartY + 80);
        text('⬅️➡️ Adjust cue Position', areaWidth + 20 + this.margin, this.bottomStartY + 100);
        text('🖱️', areaWidth + this.margin, this.bottomStartY + 120);
        text('Move: Move cue ball', areaWidth + 20 + this.margin, this.bottomStartY + 120);
        text('Left: Control cue', areaWidth + 20 + this.margin, this.bottomStartY + 140);
        text('Right: Shoot', areaWidth + 20 + this.margin, this.bottomStartY + 160);
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
        this.drawPlayer(game.players[0], (this.coreWidth - this.margin * 2) / 3, 100, 0);
        this.drawPlayer(game.players[1], (this.coreWidth - this.margin * 2) / 3, 100, this.coreWidth - (this.coreWidth - this.margin * 2) / 3);

        this.drawBottomAreas()
    }
}

