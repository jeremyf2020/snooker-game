class BallPool {
    constructor() {
        this.colorDefaultPos = [
            { color: 'lightgreen', x: table.baulkLinePoisition, y: table.surfaceSize.y / 2 - table.dRadius },
            { color: 'brown', x: table.baulkLinePoisition, y: table.surfaceSize.y / 2 },
            { color: 'yellow', x: table.baulkLinePoisition, y: table.surfaceSize.y / 2 + table.dRadius },
            { color: 'blue', x: table.surfaceSize.x / 2, y: table.surfaceSize.y / 2 },
            { color: 'pink', x: table.surfaceSize.x * 0.75, y: table.surfaceSize.y / 2 },
            { color: 'black', x: table.surfaceSize.x * ((370 - 32.5) / 370), y: table.surfaceSize.y / 2 },
        ];
        this.redDefaultPos = this.genDefaultRedPos();
        this.cueBall = this.genCueBall();
        this.colorBalls = this.genColorBalls();
        this.redBalls = this.genRedBalls();
    }

    genDefaultRedPos() {
        const redDefaultPos = [];
        let rowOffset = 0; // Offset for centering rows
        const startX = table.surfaceSize.x * 0.75 + table.ballDiameter + 5; // Start near the pink ball
        const startY = table.surfaceSize.y / 2; // Center vertically

        for (let row = 1; row <= 5; row++) {
            for (let col = 0; col < row; col++) {
                redDefaultPos.push({
                    x: startX + rowOffset,
                    y: startY + (col - (row - 1) / 2) * table.ballDiameter,
                });
            }
            rowOffset += table.ballDiameter; // Increment row offset for the next row
        }

        return redDefaultPos;
    }

    genCueBall() {
        return this.cueBall = new CueBall(table.baulkLinePoisition - table.dRadius, table.surfaceSize.y / 2, table.ballDiameter);
    }

    genColorBalls(isRandom = false) {
        return this.colorDefaultPos.map(cBall => {
            let x = cBall.x;
            let y = cBall.y;
            if (isRandom) {
                const randomVector = this.randomPos();
                x = randomVector.x;
                y = randomVector.y;
            }
            return new Ball(cBall.color, x, y, table.ballDiameter);
        });
    }

    genRedBalls(isRandom = false) {
        return this.redDefaultPos.map(rBall => {
            let x = rBall.x;
            let y = rBall.y;
            if (isRandom) {
                const randomVector = this.randomPos();
                x = randomVector.x;
                y = randomVector.y;
            }
            return new Ball('red', x, y, table.ballDiameter);
        });
    }

    isCollidingWithOtherBalls(vector) {
        for (const ball of [...ballPool.colorBalls, ...ballPool.redBalls]) {
            const ballPos = ball.body.position;
            const overlapDistance = dist(vector.x, vector.y, ballPos.x, ballPos.y);
            if (overlapDistance < ballPool.ballDiameter) return true;
        }
        return false;
    }

    randomPos() {
        const randomVector = createVector(random(0, table.surfaceSize.x), random(0, table.surfaceSize.y));
        if (this.isCollidingWithOtherBalls(randomVector)) {
            return this.randomPos();
        }
        return randomVector;
    }

    genAllballs(modeNum) {
        this.reset();
        this.redBalls = this.genRedBalls(modeNum > 1);
        this.colorBalls = this.genColorBalls(modeNum > 2);
        this.cueBall = this.genCueBall();
    }

    reset() {
        const snookerBalls = engine.world.bodies.filter(body => body.label === 'SnookerBall');
        snookerBalls.forEach(ball => {
            Matter.World.remove(engine.world, ball);
        });
        this.cueBall = null;
        this.colorBalls = [];
        this.redBalls = [];
    }

    draw() {
        if (this.colorBalls.length > 0) {
            this.colorBalls.forEach(colorBall => {
                colorBall.draw();
            });
        }
        if (this.redBalls.length > 0) {
            this.redBalls.forEach(redBall => {
                redBall.draw();
            });
        }
        if (this.cueBall != null)
            this.cueBall.draw();
    }
}

