class Ball {
    constructor(color, x, y, diameter, id, score) {
        this.id = id;
        this.color = color;
        this.score = score;
        this.diameter = diameter;
        this.availableToSel = false;
        this.isOutOfBounds = false;
        this.body = Bodies.circle(x, y, diameter / 2, { restitution: .8, friction: 0.001, label: `${color}Ball` });
        this.addToWorld();
    }

    checkMouseHovering() {
        const adjustedMouse = getAdjustMousePos();
        if (adjustedMouse.x <= this.body.bounds.max.x && adjustedMouse.x >= this.body.bounds.min.x
            && adjustedMouse.y <= this.body.bounds.max.y && adjustedMouse.y >= this.body.bounds.min.y) {
            return true;
        }
        return false;
    }

    addToWorld() {
        World.add(engine.world, this.body);
    }

    isInsideTable(ballVector) {
        const leftBound = 0;
        const rightBound = table.tableLength;
        const topBound = 0;
        const bottomBound = table.tableWidth;

        return (
            ballVector.x > leftBound &&
            ballVector.x < rightBound &&
            ballVector.y > topBound &&
            ballVector.y < bottomBound
        );
    }

    draw() {
        // if (!this.isInsideTable(createVector(this.body.position.x, this.body.position.y))) {
        //     game.outBound(this);
        //     return;
        // }

        // Check if the ball is out of bounds
        // if (!this.isInsideTable(createVector(this.body.position.x, this.body.position.y))) {
        //     if (!this.isOutOfBounds) {
        //         game.outBound(this);
        //         this.isOutOfBounds = true;
        //     }
        //     return; // Skip drawing if the ball is out of bounds
        // }


        push();
        if (this.availableToSel) {
            fill(this.color === game.validBall ? 'purple' : 'orange');
            // Draw an triangle to tell user to sel
            triangle(
                this.body.position.x, this.body.position.y - this.diameter + (sin(TWO_PI * millis() / 1000) * 2),        // Bottom point of the triangle
                this.body.position.x - this.diameter / 2, this.body.position.y - this.diameter * 2 + (sin(TWO_PI * millis() / 1000) * 2),      // Top-left point
                this.body.position.x + this.diameter / 2, this.body.position.y - this.diameter * 2 + (sin(TWO_PI * millis() / 1000) * 2)       // Top-right point
            );
            const isHovering = this.checkMouseHovering();

            // Change the cursor to HAND if hovering
            if (isHovering) {
                cursor(HAND);
            }

        }

        fill(this.color)
        drawVertices(this.body.vertices);
        pop();
    }

}

