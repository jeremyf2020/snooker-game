/* All the engine objects will be produced by Drawer */
function drawVertices(vertices) {
    // draw all the physics objects by vertices
    beginShape();
    for (var i = 0; i < vertices.length; i++) {
        vertex(vertices[i].x, vertices[i].y);
    }
    endShape(CLOSE);
}

function getAdjustMousePos() {
    // common shared function to get the mouse position (becuase of the translated matrix)
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

// calculate next colour ball if all the red balls are potted
function nextColorBall() {
    const colorOrder = ['yellow', 'green', 'brown', 'blue', 'pink', 'black']; // Snooker color order
    const remainingColors = ballPool.colorBalls.map(ball => ball.color); // Get remaining colors on the table

    for (let color of colorOrder) {
        if (remainingColors.includes(color)) {
            return color; // Return the next available color
        }
    }

    return null; // No color balls remain
}

