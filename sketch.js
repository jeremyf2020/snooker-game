const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body;


let table;

function setup() {
    // create a window size canvas with background color
    createCanvas(window.innerWidth, window.innerHeight);
    background(233, 227, 206);

    // create an 2D engine with 0 gravity
    engine = Engine.create();
    engine.world.gravity.y = 0;

    table = new Table(window.innerWidth * 0.8);

}

function draw() {
    Engine.update(engine);

    // Start drawing from the left side of the screen
    const startX = window.innerWidth * 0.1;
    translate(startX, 0);

    // Draw areas above the table
    drawAreas(0, window.innerWidth * 0.8);

    // Draw the table
    translate(0, 400);
    table.draw();
}

function drawAreas(startX, totalWidth) {
    const margin = 20;
    const areaWidth = (totalWidth - margin * 2) / 3; // Divide totalWidth into 3 equal parts
    const areaHeight = 100; // Height of the areas
    const yPosition = margin; // Vertical position of the areas

    // Player 1 Area
    fill(200, 100, 100);
    rect(startX, yPosition, areaWidth, areaHeight);
    fill(0);
    textSize(20);
    textAlign(CENTER, CENTER);

    // Draw "Player 1" text
    text('Player 1', startX + areaWidth / 2, yPosition + 20);

    // Draw "Score: "
    text('Score: 0', startX + areaWidth / 2, yPosition + 50);

    // Draw "Dragon Balls" as circles
    const ballRadius = 10; // Radius of each circle
    const balls = 3; // Number of dragon balls
    const ballsStartX = startX + areaWidth / 2 - (balls * ballRadius * 2) / 2; // Center balls
    const ballsY = yPosition + 80;

    for (let i = 0; i < balls; i++) {
        fill(255, 204, 0); // Yellow for dragon balls
        ellipse(ballsStartX + i * ballRadius * 2, ballsY, ballRadius * 2, ballRadius * 2);
    }

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
    text('Game Status: Player 1 Turn', startX + totalWidth / 2, messageYPosition + messageHeight / 2);

}
