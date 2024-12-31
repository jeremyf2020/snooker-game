class Cue {
    constructor() {
        this.gap = 30;
        this.length = 200;
        this.hide = false;
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
    }

    drawPredictiveLine() {
        const predictiveLineEndX = this.cueStartX + table.tableLength * -Math.cos(this.cueAngle);
        const predictiveLineEndY = this.cueStartY + table.tableLength * -Math.sin(this.cueAngle);

        stroke(0, 255, 0, 150); // Semi-transparent green for the line
        strokeWeight(2);
        line(this.cueStartX, this.cueStartY, predictiveLineEndX, predictiveLineEndY);
    }

    draw() {
        if (this.hide) return;
        if (!ballPool.cueBall) return;
        // if (game.moving && checkBallsStopped()) {
        //     cue.hide = false;
        // }

        // Update cue position dynamically
        this.updateCuePosition();
        const adjustedMouse = getAdjustMousePos();

        if (this.isDragging) {
            this.cueAngle = Math.atan2(adjustedMouse.y - ballPool.cueBall.body.position.y, adjustedMouse.x - ballPool.cueBall.body.position.x);
        }
        push();
        stroke(126);
        strokeWeight(5);
        line(this.cueStartX, this.cueStartY, this.cueEndX, this.cueEndY);
        pop();
        this.drawPredictiveLine();
        cueKeyIsDownHandler();

    }

    shoot() {
        // Define the base force
        const baseForce = (ballPool.cueBall.body.bounds.max.x - ballPool.cueBall.body.bounds.min.x) * 5;
        // Calculate the "actual" force based on mass and gravity scale
        const mass = ballPool.cueBall.body.mass;
        const gravityScale = engine.world.gravity.scale;
        const forceMagnitude = baseForce * mass * gravityScale;

        // Create the force vector
        const force = {
            x: -forceMagnitude * Math.cos(this.cueAngle),
            y: -forceMagnitude * Math.sin(this.cueAngle),
        };

        // Apply the force to the cue ball
        Body.applyForce(ballPool.cueBall.body, ballPool.cueBall.body.position, force);

        // tell controller shooted
        game.shooted();
    }

}
