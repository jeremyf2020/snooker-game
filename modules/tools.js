/* All the engine objects will be produced by Drawer */

function drawVertices(vertices) {
    beginShape();
    for (var i = 0; i < vertices.length; i++) {
        vertex(vertices[i].x, vertices[i].y);
    }
    endShape(CLOSE);
}

function getAdjustMousePos() {
    return createVector(mouseX - ui.coreX - table.surfaceStartPoint.x, mouseY - ui.tableStartY - table.surfaceStartPoint.y);
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
