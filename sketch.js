const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body;

// let startX;
let table;
let ui;
// let tableStartY;
// let isDragging = false;
let ballPool;
let cue;

let handIcon;

// const width = window.innerWidth * 0.6;

function preload() {
    // Load the SVG file
    handIcon = loadImage('./assets/hand.png');
}


function setup() {
    // create a window size canvas
    createCanvas(window.innerWidth, window.innerHeight);

    // create an 2D engine with 0 gravity
    engine = Engine.create();
    engine.world.gravity.y = 0;

    game = new Game();
    ui = new UI();
    startX = (window.innerWidth - width) / 2;
    table = new Table(ui.coreWidth);
    // tableStartY = window.innerHeight / 2 - table.tableWidth / 2;
    ballPool = new BallPool();
    cue = new Cue();
    // if (table.cueBall.isPotted) noCursor();

}

function draw() {
    Engine.update(engine);
    background(233, 227, 206);

    // Start drawing from the left side of the screen
    translate(ui.coreX, 0);
    strokeWeight(0)

    // Draw areas above the table
    drawAreas(0, ui.coreWidth);

    // Draw the table
    translate(0, ui.tableStartY);
    table.draw();
    cue.draw();

    if (game.moving && game.checkAllBallsStopped()) {
        game.nextShot();
    }

}

