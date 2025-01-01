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

function createBaizeTexture(w, h) {
    let graphics = createGraphics(w, h);

    // Base green color for the baize
    graphics.background(0, 125, 1);

    // Add subtle noise texture to each line
    graphics.loadPixels();
    for (let y = 0; y < h; y++) {
        // Generate a single noise value for the entire line
        let noiseValue = random(-3, 4);

        for (let x = 0; x < w; x++) {
            // Base color
            let baseColor = color(0, 128, 1); // Base green

            // Adjust brightness with the line's noise and constrain values to valid range
            let brightenedColor = color(
                constrain(red(baseColor) + noiseValue, 0, 255),
                constrain(green(baseColor) + noiseValue, 0, 255),
                constrain(blue(baseColor) + noiseValue, 0, 255)
            );

            // Set the pixel with the adjusted brightness
            let index = (x + y * w) * 4;
            graphics.pixels[index] = red(brightenedColor);
            graphics.pixels[index + 1] = green(brightenedColor);
            graphics.pixels[index + 2] = blue(brightenedColor);
            graphics.pixels[index + 3] = 255; // Full opacity
        }
    }
    graphics.updatePixels();

    return graphics;
}


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

