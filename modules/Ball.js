class Ball {
    constructor(color, x, y, diameter, id, score) {
        this.id = id;
        this.color = color;
        this.score = score;
        this.diameter = diameter;
        this.availableToSel = false;
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
    draw() {
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

class CueBall extends Ball {
    constructor(x, y, diameter) {
        super('white', x, y, diameter, 1, 4);
        this.onHand = true;
        this.isPotted = true;
        this.readyToPlace = false;
        this.collision = null;
    }

    isValidMove(mouseVector) {
        if (!this.isInsideDZone(mouseVector)) {
            this.readyToPlace = false;
            return false;
        }
        if (ballPool.isCollidingWithOtherBalls(mouseVector)) {
            this.readyToPlace = false;
            return false;
        }
        this.readyToPlace = true;
        return true;
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
            game.addMessage("Control Cue by keyboard/dragging mouse");
        }
    }

    monitorCueBallCollisions() {
        Matter.Events.on(engine, 'collisionStart', event => {
            const pairs = event.pairs;

            pairs.forEach(pair => {
                const { bodyA, bodyB } = pair;

                // Check if the cue ball is involved
                if (bodyA.label === 'whiteBall' || bodyB.label === 'whiteBall') {
                    const otherBody = bodyA.label === 'whiteBall' ? bodyB : bodyA;
                    this.collision = otherBody.label.replace(/(.+?)Ball$/, '$1');
                }
            });
        });
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
        // if (game.moving && game.checkBallsStopped()) {
        //     game.moving = false;
        //     cue.hide = false; // Show the cue after all balls have stopped moving
        // }
        push();
        fill(this.color)
        drawVertices(this.body.vertices);
        pop();
    }
}
