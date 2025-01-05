class BallPool {
    // ball pool class (including cueball, colorball, redball)
    constructor() {
        // default setting for the balls
        this.colorDefaultSetting = [
            { color: 'yellow', x: table.baulkLinePoisition, y: table.surfaceSize.y / 2 + table.dRadius, id: 2, score: 2 },
            { color: 'lightgreen', x: table.baulkLinePoisition, y: table.surfaceSize.y / 2 - table.dRadius, id: 3, score: 3 },
            { color: 'brown', x: table.baulkLinePoisition, y: table.surfaceSize.y / 2, id: 4, score: 4 },
            { color: 'blue', x: table.surfaceSize.x / 2, y: table.surfaceSize.y / 2, id: 5, score: 5 },
            { color: 'pink', x: table.surfaceSize.x * 0.75, y: table.surfaceSize.y / 2, id: 6, score: 6 },
            { color: 'black', x: table.surfaceSize.x * ((370 - 32.5) / 370), y: table.surfaceSize.y / 2, id: 7, score: 7 },
        ];
        this.redDefaultSetting = this.calDefaultRedSetting();
        //generate the balls
        this.cueBall = this.genCueBall();
        this.colorBalls = this.genColorBalls();
        this.redBalls = this.genRedBalls();
    }

    // calculate the default position of the red balls
    calDefaultRedSetting() {
        const redDefaultSetting = [];
        let rowOffset = 0; // Offset for centering rows
        const startX = table.surfaceSize.x * 0.75 + table.ballDiameter + 5; // Start near the pink ball
        const startY = table.surfaceSize.y / 2; // Center vertically

        let nextID = 8; // Start from 8 for red balls (1-7 are color balls)
        for (let row = 1; row <= 5; row++) {
            for (let col = 0; col < row; col++) {
                redDefaultSetting.push({
                    x: startX + rowOffset,
                    y: startY + (col - (row - 1) / 2) * table.ballDiameter,
                    id: nextID,
                });
                nextID++;
            }
            rowOffset += table.ballDiameter; // Increment row offset for the next row
        }

        return redDefaultSetting;
    }

    // generate the cue ball
    genCueBall() {
        // dragon ball mode: update the last position and status of the current character
        if (this.mode === 0 && game.currentCharacter.outBounded) {
            const opponent = this.currentCharacter.name === this.characters[0].name ? this.characters[1] : this.characters[0];
            if (opponent.lastPos) {
                this.cueBall = new CueBall(game.currentCharacter.lastPos.x, game.currentCharacter.lastPos.y, table.ballDiameter);
                this.cueBall.onHand = false;
                this.cueBall.isPotted = false;

                return this.cueBall;
            }
        }
        // normal mode: generate the cue ball, but not apply to the phycis engine
        // although the default position is in D zone, but the cue ball is not in the engine and not displaying
        // the cue ball is actually on the hand, position depends on the mouse position/keybooard input
        return this.cueBall = new CueBall(table.baulkLinePoisition - table.dRadius, table.surfaceSize.y / 2, table.ballDiameter);
    }

    // generate the color balls
    genColorBalls(isRandom = false) {
        return this.colorDefaultSetting.map(cBall => {
            let x = cBall.x;
            let y = cBall.y;
            // if the mode is random, generate the ball in random position
            if (isRandom) {
                const randomVector = this.randomPos();
                x = randomVector.x;
                y = randomVector.y;
            }
            // if not random, generate the ball in the default position
            return new Ball(cBall.color, x, y, table.ballDiameter, cBall.id, cBall.score);
        });
    }

    // generate the red balls
    genRedBalls(isRandom = false) {
        return this.redDefaultSetting.map(rBall => {
            let x = rBall.x;
            let y = rBall.y;
            // if the mode is random, generate the ball in random position
            if (isRandom) {
                const randomVector = this.randomPos();
                x = randomVector.x;
                y = randomVector.y;
            }
            // if not random, generate the ball in the default position
            return new Ball('red', x, y, table.ballDiameter, rBall.id, 1);
        });
    }

    // check if the ball is colliding with other balls
    isCollidingWithOtherBalls(vector) {
        // parameter vector could be the ball position or the mouse position or any other position
        for (const ball of [...ballPool.colorBalls, ...ballPool.redBalls]) {
            const ballPos = ball.body.position;
            const overlapDistance = dist(vector.x, vector.y, ballPos.x, ballPos.y);
            if (overlapDistance < table.ballDiameter) return true;
        }
        return false;
    }

    randomPos() {
        // radnom position generator
        const randomVector = createVector(
            // table.ballDiameter / 2 = Radius, preventing generated ball overlap the cushions
            random(table.ballDiameter / 2, table.surfaceSize.x - table.ballDiameter / 2),
            random(table.ballDiameter / 2, table.surfaceSize.y - table.ballDiameter / 2));
        // if the ball is colliding with other balls, generate a new random position
        if (this.isCollidingWithOtherBalls(randomVector)) {
            // recursive call to generate a new random position untill it is not colliding with other balls
            return this.randomPos();
        }
        // return the random position if it is not colliding with other balls
        return randomVector;
    }

    // generate all balls based on the mode number
    genAllballs(modeNum) {
        // reset the balls before generating new balls
        this.reset();
        // generate the balls based on the mode number
        // each mode random one more sets by sequence, 
        this.redBalls = this.genRedBalls(modeNum > 1);
        this.colorBalls = this.genColorBalls(modeNum === 2);
        this.cueBall = this.genCueBall();
    }

    reset() {
        // remove all balls from the engine
        const snookerBalls = engine.world.bodies.filter(body => body.label.match(/Ball$/));
        snookerBalls.forEach(ball => {
            Matter.World.remove(engine.world, ball);
        });
        // reset all the balls
        this.cueBall = null;
        this.colorBalls = [];
        this.redBalls = [];
    }

    rebornBalls(option) {
        // reborn the balls based on the option
        // (p.s. dragon ball mode using only, 04-Jan-2025)
        if (option === "color" || option === "all") {
            // remove all color balls from the engine
            this.colorBalls.forEach(cb => {
                Matter.World.remove(engine.world, cb.body);
            });
            this.colorBalls = [];
            // generate the color balls
            this.colorBalls = this.genColorBalls(true);
        }
        if (option === "red" || option === "all") {
            // remove all red balls from the engine
            this.redBalls.forEach(cb => {
                Matter.World.remove(engine.world, cb.body);
            });
            this.redBalls = [];
            // generate the red balls
            this.redBalls = this.genRedBalls(true);
        }
    }

    // remove the ball from the pool (external use)
    removeFromPool(ball) {
        // remove the ball from the engine
        Matter.World.remove(engine.world, ball.body);
        // cue ball
        if (ball.id === 1) {
            this.cueBall = null;
        }
        // color balls
        if (ball.id > 1 && ball.id < 8) {
            this.colorBalls = this.colorBalls.filter(cb => cb.id !== ball.id)
        }
        // red balls
        if (ball.id > 7) {
            this.redBalls = this.redBalls.filter(rb => rb.id !== ball.id)
        }
    }

    // add the color ball to the pool (external use)
    // (only colour balls can be re-spotted, cueball is genrated by other funC becuase the cueball is more complex)
    reSpot(id) {
        this.colorDefaultSetting.forEach(cb => {
            if (cb.id === id) this.colorBalls.push(new Ball(cb.color, cb.x, cb.y, table.ballDiameter, cb.id, cb.score));
        })
    }

    // stop the selection after the color ball is potted (external control)
    stopSelection() {
        this.colorBalls.forEach(cb => cb.availableToSel = false)
    }

    // draw the balls
    draw() {
        // draw the color balls if there are any
        if (this.colorBalls.length > 0) {
            this.colorBalls.forEach(colorBall => {
                colorBall.draw();
            });
        }
        // draw the red balls if there are any
        if (this.redBalls.length > 0) {
            this.redBalls.forEach(redBall => {
                redBall.draw();
            });
        }
        // check if the cue ball is not null (potted/out of bounds)
        if (this.cueBall != null) {
            this.cueBall.draw();
        }
    }
}

