const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body;

let startX;
let table;
let tableStartY;
let isDragging = false;
let ballPool;
let cue;

let handIcon;

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
    // engine.world.gravity.scale = 0;
    // drawer = new Drawer(createVector(0, 0));

    game = new Game();
    startX = window.innerWidth * 0.1;
    table = new Table(window.innerWidth * 0.8);
    tableStartY = window.innerHeight / 2 - table.tableWidth / 2;
    ballPool = new BallPool();
    cue = new Cue();
    // if (table.cueBall.isPotted) noCursor();

}

function draw() {
    Engine.update(engine);
    background(233, 227, 206);

    // Start drawing from the left side of the screen
    translate(startX, 0);
    strokeWeight(0)

    // Draw areas above the table
    drawAreas(0, window.innerWidth * 0.8);

    // Draw the table
    translate(0, tableStartY);
    table.draw();
    cue.draw();

    if (game.moving && game.checkAllBallsStopped()) {
        game.nextShot();
    }

}

