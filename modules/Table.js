class Table {
    constructor(maxLength) {
        this.tableLength = maxLength;
        this.tableWidth = this.tableLength / 2;
        this.edgeWidth = this.tableLength * 0.025;

        this.ballDiameter = this.tableWidth / 36; // From PDF (p.1)
        this.pocketSize = this.ballDiameter * 1.5; // From PDF (p.1): The pocket size should be 1.5 times the size of the ball’s diameter

        this.surfaceStartPoint = createVector(this.edgeWidth, this.edgeWidth);
        this.surfaceSize = createVector(this.tableLength - this.edgeWidth * 2, this.tableWidth - this.edgeWidth * 2);

        const baulkLineRatio = 74 / 370;
        const dRadiusRatio = 29 / 370;

        /* lines */
        this.baulkLinePoisition = this.tableLength * baulkLineRatio;
        this.dRadius = this.tableLength * dRadiusRatio;

    }


    drawPlaySurface(startVtx, endVtx) {
        push();
        fill('green');
        rect(startVtx.x, startVtx.y, endVtx.x, endVtx.y);
        pop();
    }
    drawDZone(baulkLinePoisition, dRadius, surfaceSize) {
        push();
        // Draw baulk line
        stroke(255); // White line
        strokeWeight(1);
        line(
            baulkLinePoisition,
            0,
            baulkLinePoisition,
            surfaceSize.y
        );

        // // Draw D zone (semicircle)
        noFill();
        arc(
            baulkLinePoisition,
            surfaceSize.y / 2,
            dRadius * 2,
            dRadius * 2,
            HALF_PI,
            -HALF_PI
        );
        pop();
    }

    draw() {
        this.drawPlaySurface(this.surfaceStartPoint, this.surfaceSize);
        translate(this.surfaceStartPoint, this.surfaceStartPoint)
        this.drawDZone(this.baulkLinePoisition, this.dRadius, this.surfaceSize);

    }
}

function drawVertices(vertices) {
    beginShape();
    for (var i = 0; i < vertices.length; i++) {
        vertex(vertices[i].x, vertices[i].y);
    }
    endShape(CLOSE);
}

