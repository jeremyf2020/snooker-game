const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body;

let game, table, ballPool, cue,
    ui, dragonBallFont, handIcon;

function preload() {
    // Load the png file
    handIcon = loadImage('./assets/hand.png');
    dragonBallFont = loadFont('./assets/Saiyan-Sans.ttf');
}


function setup() {
    // create a window size canvas
    createCanvas(window.innerWidth, window.innerHeight);

    // create an 2D engine with 0 gravity
    engine = Engine.create();
    engine.world.gravity.y = 0;

    // init all the class
    game = new Game();
    ui = new UI();
    table = new Table(ui.coreWidth);
    ballPool = new BallPool();
    cue = new Cue();
}

function draw() {
    Engine.update(engine);
    // drawing the user interface
    ui.draw();

    // Draw the table & cue
    translate(0, ui.tableStartY);
    table.draw();
    cue.draw();

    // check if the ball is moving in every scence
    if (game.moving && game.checkAllBallsStopped()) {
        game.nextShot();
    }
}

