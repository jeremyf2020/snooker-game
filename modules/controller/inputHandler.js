// diable right click
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

function keyPressed() {
    // game controller
    if (key === '0' || key === '1' || key === '2' || key === '3') {
        game.start(parseInt(key));
        cue.hide = true;
    }
    // cue controller
    if (key === ' ' && !ballPool.cueBall.onHand) {
        shootController();
        return;
    }
    // perfect for cue angle control becuase it can be adjusted by a small amount
    if (key === 'ArrowUp') {
        cue.cueAngle += 0.01;
    }
    if (key === 'ArrowDown') {
        cue.cueAngle -= 0.01;
    }
    // cue ball move controller
    if (key === 'w' || key === 'W') { // keyIsDown will also invoke, +4 -> +5
        mouseY -= 4;
    }
    if (key === 's' || key === 'S') {
        mouseY += 4;
    }
    if (key === 'a' || key === 'A') {
        mouseX -= 4;
    }
    if (key === 'd' || key === 'D') {
        mouseX += 4;
    }
    // place the cue ball
    if (key === 'x' || key === 'X') {
        if (ballPool.cueBall.onHand) {
            ballPool.cueBall.placeBall()
            return;
        }
    }
    // teleport the cue ball to the D zone
    if (key === 'z' || key === 'Z') {
        moveMousePosinDZone();
        return;
    }
}

// keyIsDown handler (cue angle control)
function cueKeyIsDownHandler() {
    if (keyIsDown(LEFT_ARROW)) {
        cue.cueAngle += 0.02;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        cue.cueAngle -= 0.02;
    }
}
function cueBallKeyIsDownHandler() {
    // press down and not release can constansly adjust the cue angle
    if (keyIsDown(87)) {
        mouseY -= 1;
    }
    if (keyIsDown(83)) {
        mouseY += 1;
    }
    if (keyIsDown(65)) {
        mouseX -= 1;
    }
    if (keyIsDown(68)) {
        mouseX += 1;
    }
}

function moveMousePosinDZone() {
    // Move the mouse to the D zone (with adjust position because of translated matrix)
    if (!ballPool.cueBall.isInsideDZone(createVector(mouseX, mouseY))) {
        mouseX = table.baulkLinePoisition + ui.coreX + table.surfaceStartPoint.x - table.dRadius;
        mouseY = table.tableWidth / 2 + ui.tableStartY;
    }
}

function shootController() {
    // shoot the cue ball
    if (ui.forceIsSelected) {
        ui.forceIsRunning = false;
        ui.forceIsSelected = false;
        cue.shoot();
        return;
    }
    // enter the force control mode
    ui.forceIsRunning = true;
    ui.forceIsSelected = true;
    game.addMessage('Select the force of the shot');
    return;
}

function mousePressed() {
    // dragon summoning controller, player can then wish to dragon
    if (dragon.isSummoned && !dragon.isMoving) {
        dragon.handleWishSelection();
        return
    }
    // right click to force Control/shoot
    if (mouseButton === RIGHT) {
        shootController();
        return;
    }
    // left click to control the cue/cue ball; select the colour ball
    if (mouseButton === LEFT) {
        // place the cue ball
        if (ballPool.cueBall && ballPool.cueBall.onHand) {
            ballPool.cueBall.placeBall()
            return;
        }
        // select the colour ball after a red ball is potted
        let ballSelected = false;
        ballPool.colorBalls.forEach(ball => {
            // Check if the mouse is over any ball (selection)
            if (ball.checkMouseHovering()) {
                game.validBall = ball.color
                ballSelected = true;
                return;
            }
        });
        if (ballSelected) return; // If a ball is selected, stop further actions

        // check if the cue ball is being dragged
        const draggingCueBall = ballPool.cueBall.checkMouseHovering();

        // control the cue ball
        if (draggingCueBall && game.freeBall) {
            ballPool.cueBall.onHand = true;
            cue.hide = true;
        }
        // control the cue
        if (!draggingCueBall) {
            cue.isDragging = true;
        }
    }
}

function mouseReleased() {
    // release the cue
    cue.isDragging = false
}


