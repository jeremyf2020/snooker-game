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

        /* define the balls */
        this.cueBall = new CueBall(this.baulkLinePoisition - this.dRadius, this.surfaceSize.y / 2, this.ballDiameter);

        this.colorBalls = [
            new Ball('lightgreen', this.baulkLinePoisition, this.surfaceSize.y / 2 - this.dRadius, this.ballDiameter),
            new Ball('brown', this.baulkLinePoisition, this.surfaceSize.y / 2, this.ballDiameter),
            new Ball('yellow', this.baulkLinePoisition, this.surfaceSize.y / 2 + this.dRadius, this.ballDiameter),
            new Ball('blue', this.surfaceSize.x / 2, this.surfaceSize.y / 2, this.ballDiameter),
            new Ball('pink', this.surfaceSize.x * 0.75, this.surfaceSize.y / 2, this.ballDiameter),
            new Ball('black', this.surfaceSize.x * ((370 - 32.5) / 370), this.surfaceSize.y / 2, this.ballDiameter),
        ];

        this.redBalls = [];
        let rowOffset = 0; // Offset for centering rows
        const startX = this.surfaceSize.x * 0.75 + this.ballDiameter + 5; // Assuming red balls start near the pink ball
        const startY = this.surfaceSize.y / 2;   // Center vertically around the table

        for (let row = 1; row <= 5; row++) {
            for (let col = 0; col < row; col++) {
                this.redBalls.push(
                    new Ball(
                        'red',
                        startX + rowOffset, // X position shifts for each row
                        startY + (col - (row - 1) / 2) * this.ballDiameter, // Center rows around the pink ball
                        this.ballDiameter
                    )
                );
            }
            rowOffset += this.ballDiameter; // Increment row offset for the next row
        }

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

        // this.pocketPositions = [
        //     { x: this.edgeWidth * 0.75, y: this.edgeWidth * 0.75 }, // Top-Left Corner
        //     { x: this.tableLength / 2, y: this.edgeWidth / 2 }, // Top-Mid Corner
        //     { x: this.tableLength - this.edgeWidth * 0.75, y: this.edgeWidth * 0.75 }, // Top-Right Corner
        //     { x: this.edgeWidth * 0.75, y: this.tableWidth - this.edgeWidth * 0.75 }, // Bottom-Left Corner
        //     { x: this.tableLength / 2, y: this.tableWidth - this.edgeWidth / 2 }, // Bottom-Mid Corner
        //     { x: this.tableLength - this.edgeWidth * 0.75, y: this.tableWidth - this.edgeWidth * 0.75 } // Bottom-Right Corner
        // ];

        this.pockets = [
            new Pocket(-this.edgeWidth * 0.25, -this.edgeWidth * 0.25, this.pocketSize), // Top-Left
            new Pocket(this.tableLength / 2 - this.edgeWidth, -this.edgeWidth * 0.5, this.pocketSize), // Top-Mid
            new Pocket(this.tableLength - this.edgeWidth * 1.75, -this.edgeWidth * 0.25, this.pocketSize), // Top-Right
            new Pocket(-this.edgeWidth * 0.25, this.tableWidth - this.edgeWidth * 1.75, this.pocketSize), // Bottom-Left
            new Pocket(this.tableLength / 2 - this.edgeWidth, this.tableWidth - this.edgeWidth * 1.5, this.pocketSize), // Bottom-Mid
            new Pocket(this.tableLength - this.edgeWidth * 1.75, this.tableWidth - this.edgeWidth * 1.75, this.pocketSize), // Bottom-Right
        ];


    }
    drawNonPhyObj() {
        push();
        // draw the wooden edge of the table
        fill('brown')
        /* Left and Right */
        rect(0, this.edgeWidth / 2, this.edgeWidth / 2, this.tableWidth - this.edgeWidth);
        rect(this.tableLength - this.edgeWidth / 2, this.edgeWidth, this.edgeWidth / 2, this.tableWidth - this.edgeWidth * 2);
        /* Top & Bottom */
        rect(this.edgeWidth, 0, this.tableLength - this.edgeWidth * 2, this.edgeWidth / 2);
        rect(this.edgeWidth, this.tableWidth - this.edgeWidth / 2, this.tableLength - this.edgeWidth * 2, this.edgeWidth / 2);

        // draw the protective edge (corner?) of the table
        fill('yellow')
        rect(0, 0, this.edgeWidth, this.edgeWidth, this.edgeWidth, 0, 0, 0); // Top-Left Corner
        rect(this.tableLength / 2 - this.pocketSize / 2, 0, this.pocketSize, this.edgeWidth / 2, 0, 0, 0, 0); // Top-Mid Corner
        rect(this.tableLength - this.edgeWidth, 0, this.edgeWidth, this.edgeWidth, 0, this.edgeWidth, 0, 0); // Top-Right Corner
        rect(0, this.tableWidth - this.edgeWidth, this.edgeWidth, this.edgeWidth, 0, 0, 0, this.edgeWidth) // Bottom-Left Corner
        rect(this.tableLength / 2 - this.pocketSize / 2, this.tableWidth - this.edgeWidth / 2, this.pocketSize, this.edgeWidth / 2, 0, 0, 0, 0); // Bottom-Mid Corner
        rect(this.tableLength - this.edgeWidth, this.tableWidth - this.edgeWidth, this.edgeWidth, this.edgeWidth, 0, 0, this.edgeWidth, 0) // Bottom-Right Corner
        pop();
    }
    drawCushions() {
        this.cushions.forEach(cushion => {
            cushion.draw();
        });
    }
    drawPockets() {
        this.pockets.forEach(pocket =>
            pocket.draw(this)
        );
    }


    drawPlaySurface() {
        push();
        fill('green');
        rect(this.edgeWidth / 2, this.edgeWidth / 2, this.tableLength - this.edgeWidth, this.tableWidth - this.edgeWidth);
        pop();
    }
    drawDZone(baulkLinePoisition, dRadius, surfaceSize) {
        push();
        // Draw baulk line
        stroke(255); // White line
        strokeWeight(1);
        line(baulkLinePoisition, 0, baulkLinePoisition, surfaceSize.y);

        // // Draw D zone (semicircle)
        noFill();
        arc(baulkLinePoisition, surfaceSize.y / 2, dRadius * 2, dRadius * 2, HALF_PI, -HALF_PI);
        pop();
    }

    draw() {
        this.drawNonPhyObj();
        this.drawPlaySurface(this.surfaceStartPoint, this.surfaceSize);
        translate(this.surfaceStartPoint, this.surfaceStartPoint);
        this.drawCushions();
        this.drawPockets();
        this.drawDZone(this.baulkLinePoisition, this.dRadius, this.surfaceSize);
        this.colorBalls.forEach(colorBall => {
            colorBall.draw();
        });
        this.redBalls.forEach(redBall => {
            redBall.draw();
        });
        this.cueBall.draw();
    }
}

