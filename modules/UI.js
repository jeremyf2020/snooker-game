class UI {
    constructor() {
        this.coreWidth = window.innerWidth * 0.6;
        this.coreX = (window.innerWidth - this.coreWidth) / 2;
        this.tableStartY = window.innerHeight / 2 - this.coreWidth / 4;
        this.gap = 20;
        this.topAreaHeight = 100;
        this.topY = this.tableStartY - this.topAreaHeight;
    }

    drawPlayer(player, areaWidth, areaHeight, posX) {

        fill(game.player === player ? 'lightblue' : 'lightgrey')
        // fill(200, 100, 100);
        rect(posX, this.topY, areaWidth, areaHeight);
        fill(0);
        // textFont(dragonBallFont);
        textSize(16);
        textAlign(CENTER, CENTER);

        // Draw "Player 1" text
        text(`Player ${player.name}`, posX + areaWidth / 2, this.topY + 20);

        // Draw "Score: "
        text(`Score: ${player.score}`, posX + areaWidth / 2, this.topY + 50);

        // Draw "Dragon Balls" as circles
        const ballRadius = 10; // Radius of each circle
        const balls = 3; // Number of dragon balls
        const ballsStartX = posX + areaWidth / 2 - (balls * ballRadius * 2) / 2; // Center balls
        const ballsY = this.topY + 80;

        for (let i = 0; i < player.pottedBalls.length; i++) {
            fill(255, 204, 0); // Yellow for dragon balls
            ellipse(ballsStartX + i * ballRadius * 2, this.gap, ballRadius * 2, ballRadius * 2);
        }
    }
    draw() {
        // almond color bg
        background(233, 227, 206);
        noStroke();
        // change the starting position, leave left (and right) have enough spacing
        translate(this.coreX, 0);

        /* areas above the table */
        // draw player areas
        this.drawPlayer(game.players[0], (this.coreWidth - this.gap * 2) / 3, 100, 0);
        this.drawPlayer(game.players[1], (this.coreWidth - this.gap * 2) / 3, 100, this.coreWidth - (this.coreWidth - this.gap * 2) / 3);
    }
}



function drawAreas(startX, totalWidth) {
    const margin = 20;
    const areaWidth = (totalWidth - margin * 2) / 3; // Divide totalWidth into 3 equal parts
    const areaHeight = 100; // Height of the areas
    const yPosition = margin; // Vertical position of the areas



    // Force Area
    fill(100, 200, 100);
    rect(startX + areaWidth + margin, yPosition, areaWidth, areaHeight);
    fill(0);
    textSize(20);
    textAlign(CENTER, CENTER);
    text('Force', startX + areaWidth + margin + areaWidth / 2, yPosition + areaHeight / 2);

    // Player 2 Area
    fill(100, 100, 200);
    rect(startX + (areaWidth + margin) * 2, yPosition, areaWidth, areaHeight);
    fill(0);
    textSize(20);
    textAlign(CENTER, CENTER);
    text('Player 2', startX + (areaWidth + margin) * 2 + areaWidth / 2, yPosition + areaHeight / 2);

    // Message Area
    const messageYPosition = yPosition + areaHeight + margin;
    const messageHeight = 50;
    fill(180, 180, 180); // Grey background for message area
    rect(startX, messageYPosition, totalWidth, messageHeight);
    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(`Game Status: Player ${game.player.name} Turn`, startX + totalWidth / 2, messageYPosition + messageHeight / 2);

    // Game Rules Area
    const rulesYPosition = messageYPosition + messageHeight + margin;
    textAlign(LEFT, LEFT);
    textSize(20);
    text('Game Rules:', startX, rulesYPosition + 20);
    text('Press 1️⃣ to start with tranditional positions.', startX, rulesYPosition + 50);
    text('Press 2️⃣ to start with random red posiitons.', startX, rulesYPosition + 80);
    text('Press 3️⃣ to start with random red and color posiitons.', startX, rulesYPosition + 110);
}

