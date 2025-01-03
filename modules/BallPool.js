class BallPool {
    constructor() {
        this.colorDefaultSetting = [
            { color: 'yellow', x: table.baulkLinePoisition, y: table.surfaceSize.y / 2 + table.dRadius, id: 2, score: 2 },
            { color: 'lightgreen', x: table.baulkLinePoisition, y: table.surfaceSize.y / 2 - table.dRadius, id: 3, score: 3 },
            { color: 'brown', x: table.baulkLinePoisition, y: table.surfaceSize.y / 2, id: 4, score: 4 },
            { color: 'blue', x: table.surfaceSize.x / 2, y: table.surfaceSize.y / 2, id: 5, score: 5 },
            { color: 'pink', x: table.surfaceSize.x * 0.75, y: table.surfaceSize.y / 2, id: 6, score: 6 },
            { color: 'black', x: table.surfaceSize.x * ((370 - 32.5) / 370), y: table.surfaceSize.y / 2, id: 7, score: 7 },
        ];
        this.redDefaultSetting = this.calDefaultRedSetting();
        this.cueBall = this.genCueBall();
        this.colorBalls = this.genColorBalls();
        this.redBalls = this.genRedBalls();
    }

    calDefaultRedSetting() {
        const redDefaultSetting = [];
        let rowOffset = 0; // Offset for centering rows
        const startX = table.surfaceSize.x * 0.75 + table.ballDiameter + 5; // Start near the pink ball
        const startY = table.surfaceSize.y / 2; // Center vertically

        let nextID = 8;
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

    genCueBall() {
        return this.cueBall = new CueBall(table.baulkLinePoisition - table.dRadius, table.surfaceSize.y / 2, table.ballDiameter);
    }

    genColorBalls(isRandom = false) {
        return this.colorDefaultSetting.map(cBall => {
            let x = cBall.x;
            let y = cBall.y;
            if (isRandom) {
                const randomVector = this.randomPos();
                x = randomVector.x;
                y = randomVector.y;
            }
            return new Ball(cBall.color, x, y, table.ballDiameter, cBall.id, cBall.score);
        });
    }

    genRedBalls(isRandom = false) {
        return this.redDefaultSetting.map(rBall => {
            let x = rBall.x;
            let y = rBall.y;
            if (isRandom) {
                const randomVector = this.randomPos();
                x = randomVector.x;
                y = randomVector.y;
            }
            return new Ball('red', x, y, table.ballDiameter, rBall.id, 1);
        });
    }

    isCollidingWithOtherBalls(vector) {
        for (const ball of [...ballPool.colorBalls, ...ballPool.redBalls]) {
            const ballPos = ball.body.position;
            const overlapDistance = dist(vector.x, vector.y, ballPos.x, ballPos.y);
            if (overlapDistance < table.ballDiameter) return true;
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
        const snookerBalls = engine.world.bodies.filter(body => body.label.match(/Ball$/));
        snookerBalls.forEach(ball => {
            Matter.World.remove(engine.world, ball);
        });
        this.cueBall = null;
        this.colorBalls = [];
        this.redBalls = [];
    }

    rebornBalls(option) {
        if (option === "color" || option === "all") {
            this.colorBalls.forEach(cb => {
                Matter.World.remove(engine.world, cb.body);
            });
            this.colorBalls = [];
            this.colorBalls = this.genColorBalls(true);
        }
        if (option === "red" || option === "all") {
            this.redBalls.forEach(cb => {
                Matter.World.remove(engine.world, cb.body);
            });
            this.redBalls = [];
            this.redBalls = this.genRedBalls(true);
        }
    }


    removeFromPool(ball) {
        Matter.World.remove(engine.world, ball.body);
        if (ball.id === 1) {
            this.cueBall = null;
        }
        if (ball.id > 1 && ball.id < 8) {
            this.colorBalls = this.colorBalls.filter(cb => cb.id !== ball.id)
        }
        if (ball.id > 7) {
            this.redBalls = this.redBalls.filter(rb => rb.id !== ball.id)
        }
    }

    reSpot(id) {
        this.colorDefaultSetting.forEach(cb => {
            if (cb.id === id) this.colorBalls.push(new Ball(cb.color, cb.x, cb.y, table.ballDiameter, cb.id, cb.score));
        })
    }

    stopSelection() {
        this.colorBalls.forEach(cb => cb.availableToSel = false)
    }



    draw() {
        if (this.cueBall != null)
            this.cueBall.draw();
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
    }


}

