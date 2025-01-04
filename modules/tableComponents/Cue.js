class Cue {
    // init the cue    
    constructor() {
        this.gap = 30;
        this.length = 200;
        this.hide = true;
        this.isDragging = false;
        this.cueAngle = Math.PI;
        this.updateCuePosition();
    }

    updateCuePosition() {
        // calculate the cue's position relative to the cue ball
        this.cueStartX = ballPool.cueBall.body.position.x + this.gap * Math.cos(this.cueAngle);
        this.cueStartY = ballPool.cueBall.body.position.y + this.gap * Math.sin(this.cueAngle);

        // calculate the cue's end position
        this.cueEndX = this.cueStartX + this.length * Math.cos(this.cueAngle);
        this.cueEndY = this.cueStartY + this.length * Math.sin(this.cueAngle);

        // calculate half the cue position for the color
        this.halfCueEndX = this.cueStartX + this.length / 2 * Math.cos(this.cueAngle);
        this.halfCueEndY = this.cueStartY + this.length / 2 * Math.sin(this.cueAngle);

        // calculate the cue rubber position
        this.rubberEndX = this.cueStartX + 2 * Math.cos(this.cueAngle);
        this.rubberEndY = this.cueStartY + 2 * Math.sin(this.cueAngle);
    }

    drawPredictiveLine() {
        // Draw a predictive line for the cue ball
        const predictiveLineEndX = this.cueStartX + table.tableLength * -Math.cos(this.cueAngle);
        const predictiveLineEndY = this.cueStartY + table.tableLength * -Math.sin(this.cueAngle);
        stroke(0, 255, 0, 150); // Semi-transparent green for the line
        strokeWeight(2);
        line((game.mode === 0 ? ballPool.cueBall.body.position.x : this.cueStartX),
            (game.mode === 0 ? ballPool.cueBall.body.position.y : this.cueStartY),
            predictiveLineEndX, predictiveLineEndY);
    }

    draw() {
        // ensure the cue ball is available to shoot, othewise cue should be hidden
        if (!ballPool.cueBall) return;
        if (!game.moving && !ballPool.cueBall.onHand) {
            cue.hide = false;
        }
        if (this.hide) return;

        // Update cue position dynamically
        this.updateCuePosition();
        const adjustedMouse = getAdjustMousePos();

        // change the cue angle if dragging
        if (this.isDragging) {
            this.cueAngle = Math.atan2(adjustedMouse.y - ballPool.cueBall.body.position.y, adjustedMouse.x - ballPool.cueBall.body.position.x);
        }
        // for dragon ball mode, the cue becomes a triangle
        push();
        if (game.mode === 0) {
            // dragon ball mode, draw a triangle
            const triangleBase = table.ballDiameter * 2; // Width of the triangle's base
            const rubberTipLength = table.ballDiameter * 2; // Length of the triangle's base center offset from cue ball

            // Tip of the triangle (points to the cue ball)
            const tipX = this.cueStartX;
            const tipY = this.cueStartY;

            // Base center (behind the cue ball, opposite to cueAngle)
            const baseCenterX = this.cueStartX + rubberTipLength * Math.cos(this.cueAngle);
            const baseCenterY = this.cueStartY + rubberTipLength * Math.sin(this.cueAngle);

            // Base points (perpendicular to the cue direction, behind the cue ball)
            const baseX1 = baseCenterX - (triangleBase / 2) * Math.sin(this.cueAngle);
            const baseY1 = baseCenterY + (triangleBase / 2) * Math.cos(this.cueAngle);

            const baseX2 = baseCenterX + (triangleBase / 2) * Math.sin(this.cueAngle);
            const baseY2 = baseCenterY - (triangleBase / 2) * Math.cos(this.cueAngle);

            // Draw the triangle
            fill(0, 255, 0, 150); // Cue color
            noStroke();
            triangle(
                tipX, tipY,      // Tip of the triangle (cue ball)
                baseX1, baseY1,  // First base point
                baseX2, baseY2   // Second base point
            );
        }
        else {
            // draw normal cue
            stroke(0);
            strokeWeight(5);
            line(this.cueStartX, this.cueStartY, this.cueEndX, this.cueEndY);
            stroke(219, 197, 146)
            line(this.cueStartX, this.cueStartY, this.halfCueEndX, this.halfCueEndY);
            stroke('lightblue')
            line(this.cueStartX, this.cueStartY, this.rubberEndX, this.rubberEndY);
        }
        pop();
        this.drawPredictiveLine();
        cueKeyIsDownHandler();
        // end of dragon ball mode cue
    }

    shoot() {
        ui.resetForce();
        // Define the base force
        const baseForce = (ballPool.cueBall.body.bounds.max.x - ballPool.cueBall.body.bounds.min.x) * 5 * ui.force;
        // Calculate the "actual" force based on mass and gravity scale
        const mass = ballPool.cueBall.body.mass;
        const gravityScale = engine.world.gravity.scale;
        const forceMagnitude = baseForce * mass * gravityScale;

        // Create the force vector
        const force = {
            x: -forceMagnitude * Math.cos(this.cueAngle),
            y: -forceMagnitude * Math.sin(this.cueAngle),
        };

        // **matterjs implement**: Apply the force to the cue ball
        Body.applyForce(ballPool.cueBall.body, ballPool.cueBall.body.position, force);

        // const direction = force.x < 0 ? 'left' : 'right'; [TODO: add direction to the game]

        // tell controller shooted
        game.shooted();
    }

}
