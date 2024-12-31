// diable right click
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

function keyPressed() {
    // game controller
    if (key === '1' || key === '2' || key === '3') {
        game.start(parseInt(key));
    }
    // cue controller
    if (key === ' ') {
        cue.shoot();
    }
    if (key === 'ArrowUp') {
        cue.cueAngle += 0.01;
    }
    if (key === 'ArrowDown') {
        cue.cueAngle -= 0.01;
    }
    if (key === 'w' || key === 'W') {
        mouseY -= 5;
    }
    if (key === 's' || key === 'S') {
        mouseY += 5;
    }
    if (key === 'a' || key === 'A') {
        mouseX -= 5;
    }
    if (key === 'd' || key === 'D') {
        mouseX += 5;
    }
    if (key === 'x' || key === 'X') {
        if (ballPool.cueBall.onHand) {
            ballPool.cueBall.placeBall()
            return;
        }
    }
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
    if (!ballPool.cueBall.isInsideDZone(createVector(mouseX, mouseY))) {
        mouseX = table.baulkLinePoisition + ui.coreX + table.surfaceStartPoint.x - table.dRadius;
        mouseY = table.tableWidth / 2 + ui.tableStartY;
    }
}

function mousePressed() {
    if (dragon.isSummoned && !dragon.isMoving) {
        dragon.handleWishSelection();
        return
    }
    if (mouseButton === RIGHT) {
        cue.shoot();
        return;
    }

    if (mouseButton === LEFT) {
        if (ballPool.cueBall.onHand) {
            ballPool.cueBall.placeBall()
            return;
        }

        let ballSelected = false;
        // Check if the mouse is over any ball (selection)
        ballPool.colorBalls.forEach(ball => {
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
    cue.isDragging = false
}


