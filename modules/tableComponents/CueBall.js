class CueBall extends Ball {
    // The cue ball is a special type of ball, but more functionality
    constructor(x, y, diameter) {
        super('white', x, y, diameter, 1, 4);
        this.onHand = true;
        this.isPotted = true;
        this.readyToPlace = false;
        this.collision = null;
        this.lastPos = null;
    }

    // Check if the cue ball is in the D zone/isCollidingWithOtherBalls (for playing the cue ball)
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
    // Check if the cue ball is in the D zone
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
        // get the mouse position (adjusted for the translated matrix)
        const adjustedMousePos = getAdjustMousePos();

        // dragon ball mode: update the current character's position
        if (game.mode === 0) {
            game.currentCharacter.currentPos = createVector(adjustedMousePos.x, adjustedMousePos.y)
        }

        // Draw the hand icon
        const imgSize = table.ballDiameter * 4;
        image(handIcon, adjustedMousePos.x, adjustedMousePos.y - imgSize, imgSize, imgSize);

        // Update the cue ball's position
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
            game.addMessage("control cue by keyboard/dragging mouse");
        }
    }

    monitorCueBallCollisions() {
        // Monitor collisions with the cue ball in the engine
        Matter.Events.on(engine, 'collisionStart', event => {
            const pairs = event.pairs;
            pairs.forEach(pair => {
                const { bodyA, bodyB } = pair;
                // Check if the cue ball is involved
                if (bodyA.label === this.body.label || bodyB.label === this.body.label) {
                    const otherBody = bodyA.label === this.body.label ? bodyB : bodyA;
                    this.collision = otherBody.label.replace(/(.+?)Ball$/, '$1');
                    // dragon ball mode: update the current character's motion
                    if (game.mode === 0) {
                        game.currentCharacter.updateMotion('roll');
                    }
                }
            });
        });
    }

    // Draw the cue ball
    draw() {
        // if it's on hand, mouse/keyboard to move it before placing
        if (this.onHand) {
            this.updatePos();
        }
        // if it's not on hand, check if it's out of bounds
        if (!this.onHand && !this.isInsideTable(createVector(this.body.position.x, this.body.position.y))) {
            if (!this.isOutOfBounds) {
                game.outBound(this);
                this.isOutOfBounds = true;
            }
            return; // Skip drawing if the ball is out of bounds
        }
        // =====dragon ball mode: draw the current character
        push();
        if (game.mode === 0) {
            game.currentCharacter.currentPos = createVector(this.body.position.x, this.body.position.y);
            game.currentCharacter.lastPos = createVector(this.body.position.x, this.body.position.y);
            game.currentCharacter.speed = this.body.speed;
        }
        else {
            fill(this.color)
            drawVertices(this.body.vertices);
        }
        pop();
        // dragon ball mode ended==========================

        // monitoring the cue ball in every frame
        cueBallKeyIsDownHandler();
        this.monitorCueBallCollisions();
    }
}
