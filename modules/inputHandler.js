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
        console.log(key)
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
}

// keyIsDown handler (cue angle control)
function keyIsDownHandler() {
    if (keyIsDown(LEFT_ARROW)) {
        cue.cueAngle += 0.02;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        cue.cueAngle -= 0.02;
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


