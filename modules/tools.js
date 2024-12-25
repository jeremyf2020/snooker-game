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
