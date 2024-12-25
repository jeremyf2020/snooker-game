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



