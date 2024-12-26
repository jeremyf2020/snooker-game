class BallPool {
    constructor() {
        this.cueBall;
        this.colorBalls = [];
        this.redBalls = [];
    }
    genCueBall() {
        this.cueBall = new CueBall(table.baulkLinePoisition - table.dRadius, table.surfaceSize.y / 2, table.ballDiameter);
    }

    draw() {
        this.colorBalls.forEach(colorBall => {
            colorBall.draw();
        });
        this.redBalls.forEach(redBall => {
            redBall.draw();
        });
        this.cueBall.draw();

    }



}