// diable right click
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

function keyPressed() {
    if (key === ' ') {
        cue.shoot();
    }
}

function mousePressed() {
    if (mouseButton === RIGHT) {
        cue.shoot();
        return;
    }

    if (mouseButton === LEFT) {
        // check if the cue ball is being dragged
        const draggingCueBall = table.cueBall.checkMouseHovering();
        // control the cue ball
        if (draggingCueBall) {
            table.cueBall.isDragging = true;
            cue.hide = true;
        }
        // control the cue
        if (!draggingCueBall) {
            cue.isDragging = true;
        }
    }
}

function mouseReleased() {
    if (table.cueBall.isDragging) {
        table.cueBall.isDragging = false; // Stop dragging the cue ball
        cue.hide = false;
    }
    if (cue.isDragging) {
        cue.isDragging = false; // Stop dragging the cue
    }
}



