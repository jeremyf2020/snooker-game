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
    if (mouseButton === RIGHT) {
        cue.shoot();
        return;
    }

    if (mouseButton === LEFT) {
        if (ballPool.cueBall.onHand) {
            ballPool.cueBall.placeBall()
            return;
        }
        // check if the cue ball is being dragged
        const draggingCueBall = ballPool.cueBall.checkMouseHovering();

        // control the cue ball
        if (draggingCueBall) {
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


