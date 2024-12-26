// diable right click
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

function keyPressed() {
    if (key === ' ') {
        cue.shoot();
    }
    console.log(key);
    if (key === 'ArrowUp') {
        cue.cueAngle += 0.01;
    }
    if (key === 'ArrowDown') {
        cue.cueAngle -= 0.01;
    }
}

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
        if (table.cueBall.onHand) {
            table.cueBall.placeBall()
            return;
        }
        // check if the cue ball is being dragged
        const draggingCueBall = table.cueBall.checkMouseHovering();


        // control the cue ball
        if (draggingCueBall) {
            table.cueBall.onHand = true;
            cue.hide = true;
        }
        // control the cue
        if (!draggingCueBall) {
            cue.isDragging = true;
        }
    }
}

function mouseReleased() {
    if (cue.isDragging) {
        cue.isDragging = false; // Stop dragging the cue
    }
}





