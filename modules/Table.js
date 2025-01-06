class Table {
    constructor(maxLength) {
        // calculate the dimensions of the table
        this.tableLength = maxLength;
        this.tableWidth = this.tableLength / 2;
        this.edgeWidth = this.tableLength * 0.025;

        // calculate the play surface, to maintain the ratio 12:6
        this.surfaceStartPoint = createVector(this.edgeWidth, this.edgeWidth);
        this.surfaceSize = createVector(this.tableLength - this.edgeWidth * 2, this.tableWidth - this.edgeWidth * 2);
        // calculate the dimensions of the balls and pockets
        this.ballDiameter = this.tableWidth / 36; // From PDF (p.1): ball diameter = table width / 36
        this.pocketSize = this.ballDiameter * 1.5; // From PDF (p.1): The pocket size should be 1.5 times the size of the ball’s diameter

        /* calculate position of the lines */
        const baulkLineRatio = 74 / 370;
        const dRadiusRatio = 29 / 370;
        this.baulkLinePoisition = this.tableLength * baulkLineRatio;
        this.dRadius = this.tableLength * dRadiusRatio;

        // cushion default positions
        this.cushions = [
            new Cushion(this.tableLength / 4 - this.edgeWidth * 0.75, -this.edgeWidth * 0.25, [
                { x: this.edgeWidth, y: this.edgeWidth / 2 },
                { x: (this.tableLength - this.pocketSize) / 2, y: this.edgeWidth / 2 },
                { x: (this.tableLength - this.pocketSize) / 2 - this.edgeWidth / 2, y: this.edgeWidth },
                { x: this.edgeWidth + this.edgeWidth / 2, y: this.edgeWidth }
            ]),
            new Cushion(this.tableLength / 4 * 3 - this.edgeWidth * 1.25, -this.edgeWidth * 0.25, [
                { x: this.edgeWidth, y: this.edgeWidth / 2 },
                { x: (this.tableLength - this.pocketSize) / 2, y: this.edgeWidth / 2 },
                { x: (this.tableLength - this.pocketSize) / 2 - this.edgeWidth / 2, y: this.edgeWidth },
                { x: this.edgeWidth + this.edgeWidth / 2, y: this.edgeWidth }
            ]),
            new Cushion(this.tableLength / 4 - this.edgeWidth * 0.75, this.tableWidth - this.edgeWidth * 1.75, [
                { x: this.edgeWidth, y: this.tableWidth - this.edgeWidth / 2 },
                { x: this.edgeWidth + this.edgeWidth / 2, y: this.tableWidth - this.edgeWidth / 2 - this.edgeWidth / 2 },
                { x: (this.tableLength - this.pocketSize) / 2 - this.edgeWidth / 2, y: this.tableWidth - this.edgeWidth },
                { x: (this.tableLength - this.pocketSize) / 2, y: this.tableWidth - this.edgeWidth / 2 }
            ]),
            new Cushion(this.tableLength / 4 * 3 - this.edgeWidth * 1.25, this.tableWidth - this.edgeWidth * 1.75, [
                { x: this.edgeWidth, y: this.tableWidth - this.edgeWidth / 2 },
                { x: this.edgeWidth + this.edgeWidth / 2, y: this.tableWidth - this.edgeWidth / 2 - this.edgeWidth / 2 },
                { x: (this.tableLength - this.pocketSize) / 2 - this.edgeWidth / 2, y: this.tableWidth - this.edgeWidth },
                { x: (this.tableLength - this.pocketSize) / 2, y: this.tableWidth - this.edgeWidth / 2 }
            ]),
            new Cushion(-this.edgeWidth * 0.25, this.tableWidth / 2 - this.edgeWidth, [
                { x: this.edgeWidth / 2, y: this.edgeWidth },
                { x: this.edgeWidth / 2 + this.edgeWidth / 2, y: this.edgeWidth + this.edgeWidth / 2 },
                { x: this.edgeWidth / 2 + this.edgeWidth / 2, y: this.tableWidth - this.edgeWidth - this.edgeWidth / 2 },
                { x: this.edgeWidth / 2, y: this.tableWidth - this.edgeWidth }
            ]),
            new Cushion(this.tableLength - this.edgeWidth * 1.75, this.tableWidth / 2 - this.edgeWidth, [
                { x: this.tableLength - this.edgeWidth / 2, y: this.edgeWidth },
                { x: this.tableLength - this.edgeWidth / 2 - this.edgeWidth / 2, y: this.edgeWidth + this.edgeWidth / 2 },
                { x: this.tableLength - this.edgeWidth / 2 - this.edgeWidth / 2, y: this.tableWidth - this.edgeWidth - this.edgeWidth / 2 },
                { x: this.tableLength - this.edgeWidth / 2, y: this.tableWidth - this.edgeWidth }
            ]),
        ];

        // pocket default positions
        this.pockets = [
            new Pocket(-this.edgeWidth * 0.25, -this.edgeWidth * 0.25, this.pocketSize), // Top-Left
            new Pocket(this.tableLength / 2 - this.edgeWidth, -this.edgeWidth * 0.5, this.pocketSize), // Top-Mid
            new Pocket(this.tableLength - this.edgeWidth * 1.75, -this.edgeWidth * 0.25, this.pocketSize), // Top-Right
            new Pocket(-this.edgeWidth * 0.25, this.tableWidth - this.edgeWidth * 1.75, this.pocketSize), // Bottom-Left
            new Pocket(this.tableLength / 2 - this.edgeWidth, this.tableWidth - this.edgeWidth * 1.5, this.pocketSize), // Bottom-Mid
            new Pocket(this.tableLength - this.edgeWidth * 1.75, this.tableWidth - this.edgeWidth * 1.75, this.pocketSize), // Bottom-Right
        ];

    }
    // Non-physical objects(wooden edge, pocket edge)
    drawNonPhyObj() {
        push();
        // draw the wooden edge of the table
        fill(155, 50, 50)
        /* Left and Right */
        rect(0, this.edgeWidth / 2, this.edgeWidth / 2, this.tableWidth - this.edgeWidth);
        rect(this.tableLength - this.edgeWidth / 2, this.edgeWidth, this.edgeWidth / 2, this.tableWidth - this.edgeWidth * 2);
        /* Top & Bottom */
        rect(this.edgeWidth, 0, this.tableLength - this.edgeWidth * 2, this.edgeWidth / 2);
        rect(this.edgeWidth, this.tableWidth - this.edgeWidth / 2, this.tableLength - this.edgeWidth * 2, this.edgeWidth / 2);

        // draw the pocket edge
        fill('yellow')
        rect(0, 0, this.edgeWidth, this.edgeWidth, this.edgeWidth, 0, 0, 0); // Top-Left Corner
        rect(this.tableLength / 2 - this.pocketSize / 2, 0, this.pocketSize, this.edgeWidth / 2, 0, 0, 0, 0); // Top-Mid Corner
        rect(this.tableLength - this.edgeWidth, 0, this.edgeWidth, this.edgeWidth, 0, this.edgeWidth, 0, 0); // Top-Right Corner
        rect(0, this.tableWidth - this.edgeWidth, this.edgeWidth, this.edgeWidth, 0, 0, 0, this.edgeWidth) // Bottom-Left Corner
        rect(this.tableLength / 2 - this.pocketSize / 2, this.tableWidth - this.edgeWidth / 2, this.pocketSize, this.edgeWidth / 2, 0, 0, 0, 0); // Bottom-Mid Corner
        rect(this.tableLength - this.edgeWidth, this.tableWidth - this.edgeWidth, this.edgeWidth, this.edgeWidth, 0, 0, this.edgeWidth, 0) // Bottom-Right Corner
        pop();
    }
    // Draw the D zone and baulk line (also non-physical objects, but differnt layer)
    drawDZone(baulkLinePoisition, dRadius, surfaceSize) {
        push();
        // Draw baulk line
        stroke(255); // White line
        strokeWeight(1);
        line(baulkLinePoisition, 0, baulkLinePoisition, surfaceSize.y);

        // Draw D zone
        noFill();
        arc(baulkLinePoisition, surfaceSize.y / 2, dRadius * 2, dRadius * 2, HALF_PI, -HALF_PI);
        pop();
    }

    // Draw the cushions
    drawCushions() {
        this.cushions.forEach(cushion => {
            cushion.draw();
        });
    }
    // Draw the pockets
    drawPockets() {
        this.pockets.forEach(pocket =>
            pocket.draw(this)
        );
    }
    // Draw the play surface
    drawPlaySurface() {
        push();
        fill('green');
        rect(this.edgeWidth / 2, this.edgeWidth / 2, this.tableLength - this.edgeWidth, this.tableWidth - this.edgeWidth);
        pop();
    }

    // Draw the table and initialize the ball pool
    draw() {
        this.drawPlaySurface(this.surfaceStartPoint, this.surfaceSize);
        this.drawNonPhyObj();
        // translate the matrix to the surface start point (excluding the edge)
        translate(this.surfaceStartPoint, this.surfaceStartPoint);
        this.drawCushions();
        this.drawPockets();
        this.drawDZone(this.baulkLinePoisition, this.dRadius, this.surfaceSize);
        // initialize the ball in the ball pool
        ballPool.draw();
    }
}

