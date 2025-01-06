const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body;

let game, table, ballPool, cue,
    ui, handIcon, defaultFrameRate,
    dragonBallFont, dragon, dragonBall,
    gokuSprite, guhanSprite, gokuPoster, guhanPoster;

function preload() {
    // preload the image files and fonts
    handIcon = loadImage('./assets/hand.png');
    dragonImage = loadImage('./assets/dragon.png');
    dragonBallsImage = loadImage('./assets/dragonBallsSheet.png');
    dragonBallFont = loadFont('./assets/Saiyan-Sans.ttf');
    gokuSprite = loadImage('./assets/gokuSpriteSheet.png');
    guhanSprite = loadImage('./assets/guhanSpriteSheet.png');
    gokuPoster = loadImage('./assets/gokuPoster.png');
    guhanPoster = loadImage('./assets/guhanPoster.png');
}


function setup() {
    // create a window size canvas
    createCanvas(window.innerWidth, window.innerHeight);
    defaultFrameRate = 60;
    // create an 2D engine with 0 gravity
    engine = Engine.create();
    engine.world.gravity.y = 0;
    // init all the class
    game = new Game();
    ui = new UI();
    table = new Table(ui.coreWidth);
    ballPool = new BallPool();
    cue = new Cue();
    dragon = new Dragon();
    dragonBall = new DragonBall();
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
    // put the dragon summoning at the end of the function 
    // to make sure it is the top layer
    if (dragon.isSummoned) {
        frameRate(15);
        dragon.summon();
    } else {
        frameRate(defaultFrameRate);
    }
    if (game.mode === 0) {
        game.characters.forEach(cg => {
            if (cg.currentPos) cg.draw();
        });
    }
}

//======================================================
//                  Commentary
//======================================================

//=======App Design=======

//Using classes and functions to minimise repetitive code.However,in p5.js,using modules for interaction is challenging.
//So,I initial the class globally. But,to reduce unexpected output,all interaction logic is kept in controller folder.

//For drawing,p5's`translate`separates position from the physics engine,although this doesn’t affect table interactions.
//To align positions between the two,adjustments are made(such as mousePosition).

//=======Human Interaction(UI)=======

//**CUEBALL**:
//placed by the user when start game or after a foul(including out of bounds).

//__mouse__:when available,the cursor changes to a hand.A "NO" sign appears when hovering outside
//the D-zone or colliding with balls."LEFT"-click to place it.

//__keyboard__:Use WASD to move,controlling the cue ball.However,this is difficult if the ball
//starts far from the D-zone.I considered moving the ball into the D-zone immediately when pressed
//outside,but this was annoying near the boundary.To fix this,"Z" moves the ball into the D-zone,and "X" places it.

//**CUE**

//__mouse__:Drag with LEFT-click to control the cue's position.

//__keyboard__:“LEFT/RIGHT” to control the cue angle continuously while holding the button.
//“UP/DOWN”for small angle adjustments,ideal for precise positioning.

//__Shoot__:[Mouse]Right-click OR [keyboard]press Space Bar to enable force control,then click again to shoot.

//Initially,I added sleeping and awake states in Matter.js,but found them unnecessary and causing more memory and chaos.
//I removed these and now display a virtual cue, calcuating the cue angle,then applying physics force(matter.js)
//only during shooting.This also avoids unintended interactions with other balls.

//=======Random algorithm=======

//**Algorithm**
//When isRandom is passed to the shared function randomPos,it returns a randomVector.Inside,X&Y values
//are generated using p5.js random()(ranging from ball's radius(becuase drawing from CENTER position) to the tableInnerSize).
//I chose this over Perlin noise as it is more separable and better matches the expectation of randomness.

//**Duplication**
//The vector is recursively checked by“isCollidingWithOtherBalls”to avoid duplication.
//However,checking one by one affects the next.So,all balls are removed and regenerated before execution.

//__Excldeing cueBall__:in all modes and placed back in the D-zone.

//=======Extension=======

//**Dragon Ball**:

//Every potted ball(including the cueBall for player strategy) is considered a dragon ball.
//Collecting 7 balls summons the dragon(the cloud and dragon will come up),
//allowing a wish that can change the game state.

//__Cloud__:Initially, I used Perlin noise for the cloud,but it caused lag.Changing the seed or
//noise detail didn’t help because Perlin noise modifies every pixel.Skipping pixels in the loop
//caused striped patterns,and skipping frames made the cloud flash.Eventually, I replaced
//pixel-level rendering with circles,significantly reducing rendering load and solving the problem.

//__Wishes__:There are 3 random wishes from the List,followed by different impactfuly level.
//Types inlcude Score+-, reborn balls, steal dragon balls, rights to place in D-zone.

//**Character Mode**:Press 0 to enter Dragon Ball Character mode.Each player controls 1 character (which is actually cue ball).

//__Animation__:After shooting,the character enters "attack" mode,showing attack motions from the sprite sheet in sequence
//until colliding with another physics object.Then, it starts rotating in p5.js.

//**Force Control**:Use a gradient background and oscillation to create the force indicator.

//**Uniqueness*/:The game combines billiards with fantasy elements,like Dragon Ball-inspired features,
//character animations,and special wishes,making it creative,fun, and different from traditional pool games.







