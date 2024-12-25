
class Ball {
    constructor(color, x, y, diameter) {
        this.color = color;
        this.body = Bodies.circle(x, y, diameter / 2, { restitution: .8, friction: 0.001 });
        this.addToWorld();
    }

    addToWorld() {
        World.add(engine.world, this.body);
    }

    draw() {
        push();
        fill(this.color)
        drawVertices(this.body.vertices);
        pop();
    }
}

class CueBall extends Ball {
    constructor(x, y, diameter) {
        super('white', x, y, diameter);
        this.onHand = true;
        this.isPotted = true;
        this.readyToPlace = false;
    }

    // Start dragging the cue ball
    checkMouseHovering() {
        const adjustedMouse = getAdjustMousePos();
        if (adjustedMouse.x <= this.body.bounds.max.x && adjustedMouse.x >= this.body.bounds.min.x
            && adjustedMouse.y <= this.body.bounds.max.y && adjustedMouse.y >= this.body.bounds.min.y) {
            return true;
        }
        return false;
    }

    isValidMove(mouseVector) {
        if (!this.isInsideDZone(mouseVector)) {
            this.readyToPlace = false;
            return false;
        }
        if (this.isCollidingWithOtherBalls(mouseVector)) {
            this.readyToPlace = false;
            return false;
        }
        this.readyToPlace = true;
        return true;
    }
    isCollidingWithOtherBalls(mouseVector) {
        for (const ball of [...table.colorBalls, ...table.redBalls]) {
            const ballPos = ball.body.position;
            const overlapDistance = dist(mouseVector.x, mouseVector.y, ballPos.x, ballPos.y);
            if (overlapDistance < table.ballDiameter) return true;
        }
        return false;
    }
    isInsideDZone(mouseVector) {
        // Define the D zone (e.g., rectangle or semicircle at the top)
        const dZone = {
            x: table.baulkLinePoisition,
            y: table.surfaceSize.y / 2,
            radius: table.dRadius,
        };
        // Ensure the ball is within the D zone's circle
        const distance = dist(mouseVector.x, mouseVector.y, dZone.x, dZone.y);
        return distance <= dZone.radius && mouseVector.x < dZone.x;
    }

    // Update the cue ball's position while dragging
    updatePos() {
        const adjustedMousePos = getAdjustMousePos();
        // Hide the cue while moving the cue ball
        cue.hide = true;

        // Draw the hand icon
        const imgSize = table.ballDiameter * 4;
        image(handIcon, adjustedMousePos.x, adjustedMousePos.y - imgSize, imgSize, imgSize);

        Matter.Body.setPosition(this.body, { x: adjustedMousePos.x, y: adjustedMousePos.y });

        // tempoary disable the cue ball from the engine
        World.remove(engine.world, this.body);
        // Check if the cue ball is in the D zone

        if (!this.isValidMove(adjustedMousePos)) {
            // this.isValidMove = true;
            drawNoSign(adjustedMousePos.x + imgSize / 2, adjustedMousePos.y - imgSize / 2, imgSize / 2);
        }

    }

    placeBall() {
        // Add the cue ball back to the engine
        if (this.readyToPlace) {
            World.add(engine.world, this.body);
            this.onHand = false;
            this.isPotted = false;
            cue.hide = false;
        }
    }

    // Draw the cue ball
    draw() {

        if (this.onHand) {
            this.updatePos();
        }
        // else {
        //     cursor(HAND);
        //     World.add(engine.world, this.body);
        // }
        if (game.moving && checkBallsStopped()) {
            game.moving = false;
            cue.hide = false; // Show the cue after all balls have stopped moving
        }
        push();
        fill(this.color)
        drawVertices(this.body.vertices);
        pop();
    }
}
