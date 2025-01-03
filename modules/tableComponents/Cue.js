class Cue {
    constructor() {
        this.gap = 30;
        this.length = 200;
        this.hide = true;
        this.isDragging = false;
        this.cueAngle = Math.PI;
        this.updateCuePosition();
    }

    updateCuePosition() {
        // Always calculate the cue's position relative to the cue ball
        this.cueStartX = ballPool.cueBall.body.position.x + this.gap * Math.cos(this.cueAngle);
        this.cueStartY = ballPool.cueBall.body.position.y + this.gap * Math.sin(this.cueAngle);

        this.cueEndX = this.cueStartX + this.length * Math.cos(this.cueAngle);
        this.cueEndY = this.cueStartY + this.length * Math.sin(this.cueAngle);

        this.halfCueEndX = this.cueStartX + this.length / 2 * Math.cos(this.cueAngle);
        this.halfCueEndY = this.cueStartY + this.length / 2 * Math.sin(this.cueAngle);

        this.rubberEndX = this.cueStartX + 2 * Math.cos(this.cueAngle);
        this.rubberEndY = this.cueStartY + 2 * Math.sin(this.cueAngle);


    }

    drawPredictiveLine() {
        const predictiveLineEndX = this.cueStartX + table.tableLength * -Math.cos(this.cueAngle);
        const predictiveLineEndY = this.cueStartY + table.tableLength * -Math.sin(this.cueAngle);

        stroke(0, 255, 0, 150); // Semi-transparent green for the line
        strokeWeight(2);
        line(this.cueStartX, this.cueStartY, predictiveLineEndX, predictiveLineEndY);
    }

    draw() {
        if (!ballPool.cueBall) return;
        if (!game.moving && !ballPool.cueBall.onHand) {
            cue.hide = false;
        }
        if (this.hide) return;

        // Update cue position dynamically
        this.updateCuePosition();
        const adjustedMouse = getAdjustMousePos();

        if (this.isDragging) {
            this.cueAngle = Math.atan2(adjustedMouse.y - ballPool.cueBall.body.position.y, adjustedMouse.x - ballPool.cueBall.body.position.x);
            console.log(this.cueAngle);
        }
        push();
        stroke(0);
        strokeWeight(5);
        line(this.cueStartX, this.cueStartY, this.cueEndX, this.cueEndY);
        stroke(219, 197, 146)
        line(this.cueStartX, this.cueStartY, this.halfCueEndX, this.halfCueEndY);
        stroke('lightblue')
        line(this.cueStartX, this.cueStartY, this.rubberEndX, this.rubberEndY);
        pop();
        this.drawPredictiveLine();
        cueKeyIsDownHandler();

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

        // tell controller shooted
        game.shooted();
    }

}
