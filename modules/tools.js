/* All the engine objects will be produced by Drawer */

function drawVertices(vertices) {
    beginShape();
    for (var i = 0; i < vertices.length; i++) {
        vertex(vertices[i].x, vertices[i].y);
    }
    endShape(CLOSE);
}

function getAdjustMousePos() {
    return createVector(mouseX - startX - table.surfaceStartPoint.x, mouseY - tableStartY - table.surfaceStartPoint.y);
}

function checkBallsStopped() {
    const velocity = table.cueBall.body.velocity;
    const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);

    // Threshold to determine if the ball has stopped moving
    const stopThreshold = 0.1; // Adjust as needed
    return speed < stopThreshold;
}

function drawNoSign(x, y, size) {
    // Draw the outer circle (red)
    noFill();
    stroke(255, 0, 0);
    strokeWeight(size * 0.15); // Thickness of the red border
    ellipse(x, y, size);

    // Draw the diagonal line (red)
    noStroke();
    fill(255, 0, 0);
    push();
    translate(x, y);
    rotate(radians(-45)); // Rotate to make the line diagonal
    rectMode(CENTER);
    rect(0, 0, size * 0.8, size * 0.15); // Draw a red rectangle as the diagonal line
    pop();
}
