class CueBall extends Ball {
    constructor(x, y, diameter) {
        super('white', x, y, diameter, 1, 4);
        this.onHand = true;
        this.isPotted = true;
        this.readyToPlace = false;
        this.collision = null;
        this.lastPos = null;
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
        // cue.hide = true;

        if (game.mode === 0) {
            game.currentCharacter.currentPos = createVector(adjustedMousePos.x, adjustedMousePos.y)
        }

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
            // cue.hide = false;
            game.addMessage("control cue by keyboard/dragging mouse");
        }
    }

    monitorCueBallCollisions() {
        Matter.Events.on(engine, 'collisionStart', event => {
            const pairs = event.pairs;
            pairs.forEach(pair => {
                const { bodyA, bodyB } = pair;
                // Check if the cue ball is involved
                if (bodyA.label === this.body.label || bodyB.label === this.body.label) {
                    const otherBody = bodyA.label === this.body.label ? bodyB : bodyA;
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
        if (!this.onHand && !this.isInsideTable(createVector(this.body.position.x, this.body.position.y))) {
            if (!this.isOutOfBounds) {
                game.outBound(this);
                this.isOutOfBounds = true;
            }
            return; // Skip drawing if the ball is out of bounds
        }
        push();
        if (game.mode === 0) {
            // if (game.currentCharacter.currentPos === null) {
            game.currentCharacter.currentPos = createVector(this.body.position.x, this.body.position.y);
            this.lastPos = createVector(this.body.position.x, this.body.position.y);
            // }
            game.currentCharacter.lastPos = createVector(this.body.position.x, this.body.position.y);
            // else {
            //     this.body.position = game.currentCharacter.last;
            // }
            // game.currentCharacter.draw();
        }
        else {
            fill(this.color)
            drawVertices(this.body.vertices);
        }
        pop();
        cueBallKeyIsDownHandler();
        this.monitorCueBallCollisions();


    }
}
